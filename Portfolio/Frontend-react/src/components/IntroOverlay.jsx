import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useIntro } from "../context/IntroContext.jsx";

/**
 * Porta de assets/js/intro.js: uma janela estilo VS Code "digita" um
 * script Python, roda e mostra a saída no terminal — depois some,
 * revelando o hero por trás (ver IntroContext/Hero).
 *
 * Na versão vanilla, só index.html carregava intro.js — Project.html e
 * Aboutme.html não tinham a intro. Aqui o componente é montado uma vez em
 * App.jsx (fora das rotas, trocar de página não reinicia a intro), mas só
 * TOCA se a rota inicial da sessão for a home ("/"), pra manter o mesmo
 * comportamento: abrir direto em /projetos ou /sobre não mostra a intro.
 */

const CODIGO_PYTHON = `def iniciar_portfolio():
    print("Carregando portfolio de Mateus Lima...")

    modulos = ["infraestrutura", "backend", "frontend"]
    for modulo in modulos:
        print(f"  [OK] modulo {modulo} pronto")

    print("Tudo certo. Bem-vindo!")

iniciar_portfolio()`;

const SAIDA_TERMINAL = [
  "Carregando portfolio de Mateus Lima...",
  "  [OK] modulo infraestrutura pronto",
  "  [OK] modulo backend pronto",
  "  [OK] modulo frontend pronto",
  "Tudo certo. Bem-vindo!",
];

const VELOCIDADE_DIGITACAO_MS = 22;
const PAUSA_ANTES_DE_RODAR_MS = 500;
const VELOCIDADE_SAIDA_MS = 220; // por linha de output
const PAUSA_ANTES_DE_SUMIR_MS = 900;
const DURACAO_FADE_OVERLAY_MS = 700;

const PALAVRAS_CHAVE = ["def", "for", "in", "import"];

function escaparHtml(texto) {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Colore palavras-chave, strings e chamadas de print — só o suficiente pra parecer um editor de verdade. */
function destacarSintaxe(codigoParcial) {
  let html = escaparHtml(codigoParcial);

  html = html.replace(/(&quot;|")([^"]*)(")/g, '<span class="tok-string">$1$2$3</span>');
  html = html.replace(/(f?)"([^"]*)$/, '<span class="tok-string">$1"$2</span>'); // string ainda sendo digitada
  html = html.replace(/\bprint\b/g, '<span class="tok-funcao">print</span>');

  PALAVRAS_CHAVE.forEach((palavra) => {
    html = html.replace(new RegExp(`\\b${palavra}\\b`, "g"), `<span class="tok-chave">${palavra}</span>`);
  });

  return html;
}

function numerarLinhas(texto) {
  const totalLinhas = texto.split("\n").length;
  return Array.from({ length: totalLinhas }, (_, i) => i + 1).join("\n");
}

function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function IntroOverlay() {
  const { setIntroTerminou } = useIntro();
  const location = useLocation();

  // Só a rota em que o app "carregou" importa (useRef pra não reagir a
  // navegações depois) — replica index.html ser a única página com intro.
  const rotaInicialRef = useRef(location.pathname);

  const [removida, setRemovida] = useState(false);
  const [janelaVisivel, setJanelaVisivel] = useState(false);
  const [escondendo, setEscondendo] = useState(false);
  const [codigoHtml, setCodigoHtml] = useState("");
  const [linhas, setLinhas] = useState("1");
  const [saidaTerminal, setSaidaTerminal] = useState("");

  // Guarda se a intro já começou a tocar. Necessário por dois motivos:
  // 1) o StrictMode do React roda efeitos 2x em dev — sem isso a intro
  //    tocaria (ou tentaria recomeçar) duas vezes.
  // 2) de propósito, o efeito abaixo NÃO cancela a sequência no cleanup:
  //    esse componente só existe uma vez, fora das rotas, então o
  //    "unmount" que o StrictMode simula é sintético — cancelar aqui só
  //    cortaria a intro pela metade no primeiro mount real.
  const jaTocou = useRef(false);

  useEffect(() => {
    if (jaTocou.current) return;
    jaTocou.current = true;

    if (rotaInicialRef.current !== "/") {
      setIntroTerminou(true); // sem intro pra tocar, o hero (se existir) já pode revelar direto
      setRemovida(true);
      return;
    }

    async function tocarIntro() {
      // Trava a página inteira enquanto a intro toca: nada de scroll nem
      // de clicar em botões/arrastar o globo por trás do overlay.
      document.documentElement.classList.add("intro-ativa");

      requestAnimationFrame(() => setJanelaVisivel(true));

      await aguardar(300);

      for (let i = 1; i <= CODIGO_PYTHON.length; i++) {
        const parcial = CODIGO_PYTHON.slice(0, i);
        setCodigoHtml(destacarSintaxe(parcial));
        setLinhas(numerarLinhas(parcial));
        await aguardar(VELOCIDADE_DIGITACAO_MS);
      }

      await aguardar(PAUSA_ANTES_DE_RODAR_MS);

      let saidaAcumulada = "";
      for (const linha of SAIDA_TERMINAL) {
        saidaAcumulada += (saidaAcumulada ? "\n" : "") + linha;
        setSaidaTerminal(saidaAcumulada);
        await aguardar(VELOCIDADE_SAIDA_MS);
      }

      await aguardar(PAUSA_ANTES_DE_SUMIR_MS);

      // Overlay começa a sumir e o hero começa a surgir ao mesmo tempo —
      // dá a sensação de um revelar o outro, não duas animações soltas.
      setEscondendo(true);
      setIntroTerminou(true);
      document.documentElement.classList.remove("intro-ativa");

      await aguardar(DURACAO_FADE_OVERLAY_MS);
      setRemovida(true);
    }

    tocarIntro();
  }, [setIntroTerminou]);

  if (removida) return null;

  return (
    <div className={`intro-overlay${escondendo ? " intro-overlay--escondida" : ""}`} id="introOverlay">
      <div className={`vscode-janela${janelaVisivel ? " vscode-janela--visivel" : ""}`}>
        <div className="vscode-barra">
          <span className="vscode-bolha vscode-bolha--vermelha"></span>
          <span className="vscode-bolha vscode-bolha--amarela"></span>
          <span className="vscode-bolha vscode-bolha--verde"></span>
          <span className="vscode-aba">script.py</span>
        </div>

        <div className="vscode-corpo">
          <pre className="vscode-linhas">{linhas}</pre>
          <pre className="vscode-codigo">
            <code dangerouslySetInnerHTML={{ __html: codigoHtml + '<span class="vscode-cursor"></span>' }} />
          </pre>
        </div>

        <div className="vscode-terminal">{saidaTerminal}</div>
      </div>
    </div>
  );
}
