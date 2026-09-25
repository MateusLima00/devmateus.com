import { useRef, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";

/**
 * Porta de assets/js/formulario-contato.js: valida no cliente e dispara o
 * e-mail via Web3Forms (web3forms.com) — serviço gratuito que entrega a
 * mensagem direto na caixa de entrada configurada na access key, sem
 * precisar de backend próprio.
 *
 * Camadas de proteção (tudo client-side, já que não tem backend próprio
 * pra impor isso de verdade — é a defesa possível nesse formato):
 *  - honeypot (campo invisível — bot de preenchimento automático cai nele)
 *  - 1 envio a cada 60s + 5 envios por dia (por navegador, via localStorage)
 *  - nome/e-mail/mensagem obrigatórios — não envia com campo faltando
 *  - bloqueia conteúdo com cara de script/HTML (<script>, onXXX=, javascript:)
 *    em vez de só limpar em silêncio, e tira qualquer tag HTML residual
 *    antes de montar o payload
 *  - limite de caracteres em todos os campos
 *
 * Sem a key configurada, o formulário fica desabilitado com um aviso, em
 * vez de deixar a pessoa preencher tudo e só descobrir na hora de enviar
 * que não tinha pra onde mandar.
 */

const ENDPOINT_FORMULARIO = "https://api.web3forms.com/submit";
// A access key do Web3Forms é feita pra viver no bundle do cliente (é assim
// que o serviço funciona sem backend) — ela só permite ENVIAR pro e-mail já
// cadastrado na conta, não dá acesso a nada, então não é um segredo "de
// verdade" tipo senha/API key de banco. Mesmo assim ela não fica hardcoded
// aqui: vem de VITE_WEB3FORMS_KEY (.env, fora do git) pra poder trocar sem
// mexer no código se um dia for preciso.
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "";
const EMAIL_DESTINO = "contatomateus00@gmail.com";

const LIMITE_MENSAGEM = 1000;
const INTERVALO_MINIMO_ENTRE_ENVIOS_MS = 60_000; // 1 envio por minuto — evita bot/flood
const LIMITE_ENVIOS_POR_DIA = 5; // trava o abuso mesmo de quem espera o minuto entre envios
const CHAVE_ULTIMO_ENVIO = "devmateus:contato:ultimo-envio";
const CHAVE_CONTAGEM_DIARIA = "devmateus:contato:contagem-diaria";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Bloqueia HTML/script óbvio em vez de só limpar em silêncio — se alguém
// tentar injetar algo, é melhor avisar e recusar do que mandar pro meu
// e-mail sem essa parte (o Web3Forms também filtra do lado dele, isso aqui
// é só a primeira camada, no cliente).
const REGEX_CONTEUDO_SUSPEITO = /<\s*(script|iframe|style|object|embed)\b|<[^>]+on\w+\s*=|javascript\s*:|data\s*:\s*text\/html/i;

function contemConteudoSuspeito(...valores) {
  return valores.some((valor) => REGEX_CONTEUDO_SUSPEITO.test(valor));
}

// Remove qualquer tag HTML residual (ex.: `<b>oi</b>`) que não bateu no
// filtro acima mas ainda assim não devia ir pro e-mail como HTML cru.
function removerTagsHtml(texto) {
  return texto.replace(/<[^>]*>/g, "");
}

function tempoRestanteParaProximoEnvio() {
  const ultimoEnvio = Number(localStorage.getItem(CHAVE_ULTIMO_ENVIO) || 0);
  const restante = INTERVALO_MINIMO_ENTRE_ENVIOS_MS - (Date.now() - ultimoEnvio);
  return Math.max(0, restante);
}

function enviosRestantesHoje() {
  const hoje = new Date().toISOString().slice(0, 10);
  const registro = JSON.parse(localStorage.getItem(CHAVE_CONTAGEM_DIARIA) || "null");
  if (!registro || registro.data !== hoje) return LIMITE_ENVIOS_POR_DIA;
  return Math.max(0, LIMITE_ENVIOS_POR_DIA - registro.contagem);
}

function registrarEnvioDeHoje() {
  const hoje = new Date().toISOString().slice(0, 10);
  const registro = JSON.parse(localStorage.getItem(CHAVE_CONTAGEM_DIARIA) || "null");
  const contagem = registro && registro.data === hoje ? registro.contagem + 1 : 1;
  localStorage.setItem(CHAVE_CONTAGEM_DIARIA, JSON.stringify({ data: hoje, contagem }));
}

export function FormularioContato() {
  const ref = useRef(null);
  const visivel = useScrollReveal(ref);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [site, setSite] = useState(""); // honeypot
  const [erros, setErros] = useState({});
  const [status, setStatus] = useState(null); // { texto, tipo: "sucesso" | "erro" | "aviso" }
  const [enviando, setEnviando] = useState(false);

  const desabilitado = !WEB3FORMS_ACCESS_KEY;

  function validarCampos() {
    const novosErros = {};

    if (nome.trim().length < 2) novosErros.nome = "Digite seu nome completo.";
    else if (contemConteudoSuspeito(nome)) novosErros.nome = "Tira código/HTML do nome, por favor.";

    if (!REGEX_EMAIL.test(email.trim())) novosErros.email = "Digite um e-mail válido.";

    const textoMensagem = mensagem.trim();
    if (textoMensagem.length < 10) novosErros.mensagem = "Conta um pouco mais — pelo menos 10 caracteres.";
    else if (textoMensagem.length > LIMITE_MENSAGEM) novosErros.mensagem = `Máximo de ${LIMITE_MENSAGEM} caracteres.`;
    else if (contemConteudoSuspeito(textoMensagem)) novosErros.mensagem = "Tira código/HTML da mensagem, por favor — é só texto mesmo.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function aoEnviar(evento) {
    evento.preventDefault();

    // Honeypot preenchido = bot. Finge que deu certo, sem chamar o backend.
    if (site) {
      setStatus({ texto: "Mensagem enviada!", tipo: "sucesso" });
      limparFormulario();
      return;
    }

    const restante = tempoRestanteParaProximoEnvio();
    if (restante > 0) {
      setStatus({ texto: `Você já mandou uma mensagem há pouco — tenta de novo em ${Math.ceil(restante / 1000)}s.`, tipo: "aviso" });
      return;
    }

    if (enviosRestantesHoje() <= 0) {
      setStatus({ texto: "Limite de mensagens por hoje atingido — tenta de novo amanhã ou manda um e-mail direto (link ao lado).", tipo: "aviso" });
      return;
    }

    setErros({});
    if (!validarCampos()) return;

    setEnviando(true);
    setStatus({ texto: "Enviando...", tipo: "aviso" });

    const nomeLimpo = removerTagsHtml(nome.trim());
    const mensagemLimpa = removerTagsHtml(mensagem.trim());

    try {
      const resposta = await fetch(ENDPOINT_FORMULARIO, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          to_email: EMAIL_DESTINO,
          subject: `Novo contato pelo site — ${nomeLimpo}`,
          from_name: nomeLimpo,
          name: nomeLimpo,
          email: email.trim(),
          message: mensagemLimpa,
        }),
      });

      const dados = await resposta.json().catch(() => null);
      if (!resposta.ok || !dados?.success) throw new Error("resposta não-ok do Web3Forms");

      localStorage.setItem(CHAVE_ULTIMO_ENVIO, String(Date.now()));
      registrarEnvioDeHoje();
      setStatus({ texto: "Mensagem enviada! Te respondo por e-mail em breve.", tipo: "sucesso" });
      limparFormulario();
    } catch {
      // Campo/serviço indisponível (backend fora do ar, sem internet, etc.) —
      // avisa sem travar a página nem perder o que a pessoa escreveu.
      setStatus({ texto: "Não consegui enviar agora. Tenta de novo em instantes ou manda um e-mail direto (link ao lado).", tipo: "erro" });
    } finally {
      setEnviando(false);
    }
  }

  function limparFormulario() {
    setNome("");
    setEmail("");
    setMensagem("");
    setSite("");
  }

  return (
    <article ref={ref} className={`formulario_contato-devmateus reveal${visivel ? " reveal-visivel" : ""}`}>
      <h2 className="formulario-contato__titulo">Vamos conversar?</h2>
      <p className="formulario-contato__subtitulo">Me manda uma mensagem — respondo por e-mail assim que ver.</p>

      <form className="formulario-contato" onSubmit={aoEnviar} noValidate>
        <div className="formulario-contato__campo">
          <label htmlFor="campoNome">Nome</label>
          <input
            type="text"
            id="campoNome"
            autoComplete="name"
            maxLength={80}
            required
            disabled={desabilitado}
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
          />
          <span className="formulario-contato__erro">{erros.nome}</span>
        </div>

        <div className="formulario-contato__campo">
          <label htmlFor="campoEmail">E-mail</label>
          <input
            type="email"
            id="campoEmail"
            autoComplete="email"
            maxLength={120}
            required
            disabled={desabilitado}
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
          <span className="formulario-contato__erro">{erros.email}</span>
        </div>

        <div className="formulario-contato__campo">
          <label htmlFor="campoMensagem">Mensagem</label>
          <textarea
            id="campoMensagem"
            rows={5}
            maxLength={LIMITE_MENSAGEM}
            required
            disabled={desabilitado}
            value={mensagem}
            onChange={(evento) => setMensagem(evento.target.value)}
          />
          <div className="formulario-contato__rodape-campo">
            <span className="formulario-contato__erro">{erros.mensagem}</span>
            <span className="formulario-contato__contador">{mensagem.length} / {LIMITE_MENSAGEM}</span>
          </div>
        </div>

        {/* Honeypot anti-spam: campo invisível pra gente, mas que bots de
            preenchimento automático costumam preencher. Some da tela via CSS
            (não display:none, pra não ser ignorado por alguns bots) e
            tabIndex={-1} tira ele da navegação por teclado. */}
        <div className="formulario-contato__campo formulario-contato__campo--honeypot" aria-hidden="true">
          <label htmlFor="campoSite">Site</label>
          <input type="text" id="campoSite" tabIndex={-1} autoComplete="off" value={site} onChange={(evento) => setSite(evento.target.value)} />
        </div>

        <p className={`formulario-contato__status${status ? ` formulario-contato__status--${status.tipo}` : ""}`} role="status" aria-live="polite">
          {desabilitado
            ? "Formulário ainda sem a chave de envio configurada — por enquanto, manda um e-mail direto (link ao lado) que eu respondo rapidinho."
            : status?.texto}
        </p>

        <button type="submit" className="formulario-contato__botao" disabled={desabilitado || enviando}>
          Enviar mensagem
        </button>
      </form>
    </article>
  );
}
