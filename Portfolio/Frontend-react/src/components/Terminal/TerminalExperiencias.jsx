import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";

/**
 * Porta de assets/js/terminal-experiencias.js. Fluxo:
 *
 *   1. "menu"        — clica em "Script – Experiências" ou "Script – Certificados"
 *   2. "completando"  — aparece só o script escolhido, com uma lacuna; a pessoa
 *                       digita e o texto entra DIRETO na lacuna — Enter roda
 *   3. "lista"        — o resultado aparece sendo "digitado" na tela, como se o
 *                       script estivesse rodando de verdade; Ctrl+C volta pro menu
 *
 * Dados em /data/experiencias.json e /data/certificados.json (pasta
 * public/ do Vite) — trocar o conteúdo desses arquivos não exige mexer
 * neste componente.
 */

const SCRIPTS = {
  experiencias: {
    arquivo: "/data/experiencias.json",
    tipo: "experiencia",
    titulo: "Experiências",
    rotulo: "Script – Experiências",
    nomeFuncao: "carregarExperiencias",
  },
  certificados: {
    arquivo: "/data/certificados.json",
    tipo: "certificado",
    titulo: "Certificados",
    rotulo: "Script – Certificados/Cursos",
    nomeFuncao: "carregarCertificados",
  },
};

const VELOCIDADE_DIGITACAO_ITEM_MS = 8; // por caractere, dentro de cada item da lista
const PAUSA_ANTES_DE_EXECUTAR_MS = 400;

function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Digita `texto` progressivamente, chamando `aoAtualizar` a cada caractere. Para se `idGeracao` ficar desatualizado. */
async function digitarTexto(texto, idGeracao, geracaoAtualRef, aoAtualizar) {
  for (let i = 1; i <= texto.length; i++) {
    if (idGeracao !== geracaoAtualRef.current) return;
    aoAtualizar(texto.slice(0, i));
    await aguardar(VELOCIDADE_DIGITACAO_ITEM_MS);
  }
}

export function TerminalExperiencias() {
  const [estado, setEstado] = useState("menu"); // "menu" | "completando" | "lista"
  const [scriptEscolhido, setScriptEscolhido] = useState(null);
  const [bufferDigitado, setBufferDigitado] = useState("");
  const [historicoErros, setHistoricoErros] = useState([]);
  const [itensLista, setItensLista] = useState([]); // itens já com o texto "digitado" até agora

  const terminalRef = useRef(null);
  const corpoRef = useRef(null);
  const cacheRef = useRef({}); // evita re-fetch do mesmo JSON toda vez que o script roda de novo
  const geracaoAtualRef = useRef(0); // invalida animações de digitação em andamento (Ctrl+C no meio, etc.)

  const visivel = useScrollReveal(terminalRef);

  // Mantém o scroll grudado embaixo conforme a lista vai "digitando".
  useEffect(() => {
    if (corpoRef.current) corpoRef.current.scrollTop = corpoRef.current.scrollHeight;
  }, [itensLista, bufferDigitado, historicoErros]);

  function escolherScript(chave) {
    setScriptEscolhido(chave);
    setEstado("completando");
    setBufferDigitado("");
    setHistoricoErros([]);
    terminalRef.current?.focus();
  }

  function voltarParaMenu() {
    geracaoAtualRef.current++; // invalida qualquer animação de digitação em andamento
    setEstado("menu");
    setScriptEscolhido(null);
    setBufferDigitado("");
  }

  async function rodarScript(chave) {
    const script = SCRIPTS[chave];
    const idGeracao = ++geracaoAtualRef.current;

    setEstado("lista");
    setBufferDigitado("");
    setItensLista([]);

    if (!cacheRef.current[script.arquivo]) {
      const resposta = await fetch(script.arquivo);
      cacheRef.current[script.arquivo] = await resposta.json();
    }

    await aguardar(PAUSA_ANTES_DE_EXECUTAR_MS);
    if (idGeracao !== geracaoAtualRef.current) return; // saiu (Ctrl+C) antes de "terminar de carregar"

    const dados = cacheRef.current[script.arquivo];
    const listaMontada = dados.map(() => ({ titulo: "", periodo: "", descricao: "" }));
    setItensLista([...listaMontada]);

    for (let indice = 0; indice < dados.length; indice++) {
      if (idGeracao !== geracaoAtualRef.current) return;
      const item = dados[indice];

      await digitarTexto(item.titulo, idGeracao, geracaoAtualRef, (parcial) =>
        atualizarItemLista(indice, "titulo", parcial)
      );
      if (idGeracao !== geracaoAtualRef.current) return;

      const textoPeriodo = script.tipo === "experiencia" ? item.periodo : `${item.instituicao} · ${item.ano}`;
      await digitarTexto(textoPeriodo, idGeracao, geracaoAtualRef, (parcial) =>
        atualizarItemLista(indice, "periodo", parcial)
      );
      if (idGeracao !== geracaoAtualRef.current || script.tipo !== "experiencia") continue;

      await digitarTexto(item.descricao, idGeracao, geracaoAtualRef, (parcial) =>
        atualizarItemLista(indice, "descricao", parcial)
      );
    }
  }

  function atualizarItemLista(indice, campo, valor) {
    setItensLista((atual) => {
      const copia = [...atual];
      copia[indice] = { ...copia[indice], [campo]: valor };
      return copia;
    });
  }

  function conferirResposta() {
    const chave = bufferDigitado.trim().toLowerCase();

    if (chave !== scriptEscolhido) {
      setHistoricoErros((atual) => [...atual, `comando não encontrado: ./${bufferDigitado}`]);
      setBufferDigitado("");
      return;
    }

    rodarScript(chave);
  }

  function aoTeclar(evento) {
    if (evento.ctrlKey && evento.key.toLowerCase() === "c") {
      evento.preventDefault();
      if (estado !== "menu") voltarParaMenu();
      return;
    }

    if (estado !== "completando") return;

    if (evento.key === "Enter") {
      evento.preventDefault();
      if (bufferDigitado.trim()) conferirResposta();
      return;
    }

    if (evento.key === "Backspace") {
      evento.preventDefault();
      setBufferDigitado((atual) => atual.slice(0, -1));
      return;
    }

    if (evento.key.length === 1 && !evento.ctrlKey && !evento.metaKey && !evento.altKey) {
      evento.preventDefault();
      setBufferDigitado((atual) => atual + evento.key);
    }
  }

  return (
    <article
      ref={terminalRef}
      className={`menu_exp_carti reveal${visivel ? " reveal-visivel" : ""}`}
      id="terminalExp"
      tabIndex={0}
      aria-label="Terminal interativo: digite um comando pra ver experiências ou certificados"
      onKeyDown={aoTeclar}
      onClick={() => terminalRef.current?.focus()}
    >
      <div className="terminal-exp__barra">
        <span className="vscode-bolha vscode-bolha--vermelha"></span>
        <span className="vscode-bolha vscode-bolha--amarela"></span>
        <span className="vscode-bolha vscode-bolha--verde"></span>
        <span className="vscode-aba">mateus@portfolio: ~</span>
      </div>

      <div className="terminal-exp__corpo" ref={corpoRef}>
        {estado === "menu" && (
          <MenuScripts onEscolher={escolherScript} />
        )}

        {estado === "completando" && (
          <Completando
            script={SCRIPTS[scriptEscolhido]}
            scriptEscolhido={scriptEscolhido}
            bufferDigitado={bufferDigitado}
            historicoErros={historicoErros}
            onDigitar={setBufferDigitado}
            onExecutar={conferirResposta}
            onVoltar={voltarParaMenu}
          />
        )}

        {estado === "lista" && (
          <Lista
            script={SCRIPTS[scriptEscolhido]}
            scriptEscolhido={scriptEscolhido}
            itens={itensLista}
            onVoltar={voltarParaMenu}
          />
        )}
      </div>
    </article>
  );
}

function MenuScripts({ onEscolher }) {
  return (
    <>
      <p className="terminal-exp__texto">Escolha um script pra rodar:</p>
      <ul className="terminal-exp__menu-scripts">
        {Object.entries(SCRIPTS).map(([chave, script]) => (
          <li key={chave}>
            <button type="button" className="terminal-exp__script-btn" onClick={() => onEscolher(chave)}>
              ./{script.rotulo}
            </button>
          </li>
        ))}
      </ul>

      <p className="terminal-exp__dica-leigo">
        <span className="terminal-exp__dica-leigo__icone" aria-hidden="true">💡</span>
        <span>Não precisa saber programar: é só <strong>clicar</strong> num dos botões acima pra abrir.</span>
      </p>
    </>
  );
}

function Completando({ script, scriptEscolhido, bufferDigitado, historicoErros, onDigitar, onExecutar, onVoltar }) {
  return (
    <>
      <p className="terminal-exp__texto">Complete a lacuna e aperte Enter — escreva certinho, sem espaço e sem acento:</p>

      <pre className="terminal-exp__lacuna">
        {`função ${script.nomeFuncao}() {\n  executar("./`}
        <span className="terminal-exp__lacuna-ativa">{bufferDigitado}</span>
        <span className="vscode-cursor"></span>
        {`");\n}`}
      </pre>

      <div className="terminal-exp__campo-digitacao">
        <span className="terminal-exp__campo-prefix">./</span>
        <input
          type="text"
          value={bufferDigitado}
          onChange={(evento) => onDigitar(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === "Enter") {
              evento.preventDefault();
              onExecutar();
            }
          }}
          aria-label={`Digite o comando ${scriptEscolhido}`}
          className="terminal-exp__input"
          autoFocus
          placeholder={scriptEscolhido}
        />
        <button type="button" className="terminal-exp__botao-executar" onClick={onExecutar}>
          Executar
        </button>
      </div>

      {historicoErros.map((linha, indice) => (
        <p className="terminal-exp__linha-erro" key={indice}>{linha}</p>
      ))}
      <div className="terminal-exp__acoes-auxiliares">
        <p className="terminal-exp__dica-enter">Enter para rodar · Ctrl+C ↩ voltar ao menu</p>
        <button type="button" className="terminal-exp__botao-voltar" onClick={onVoltar}>
          Voltar ao menu
        </button>
      </div>

      <p className="terminal-exp__dica-leigo">
        <span className="terminal-exp__dica-leigo__icone" aria-hidden="true">💡</span>
        <span>
          <strong>Escreva</strong> "{scriptEscolhido}" no espaço em branco do código e depois aperte <strong>Enter</strong> no
          teclado pra ver o resultado.
        </span>
      </p>
    </>
  );
}

function Lista({ script, scriptEscolhido, itens, onVoltar }) {
  return (
    <>
      <p className="terminal-exp__prompt">
        <span className="terminal-exp__prompt-simbolo">mateus@portfolio:~$ ./{scriptEscolhido}</span>
      </p>

      {itens.length === 0 ? (
        <p className="terminal-exp__texto">Executando...</p>
      ) : (
        <>
          <p className="terminal-exp__cabecalho-lista">
            <span className="terminal-exp__texto terminal-exp__texto--titulo">{script.titulo}</span>
            <span className="terminal-exp__dica">Ctrl+C ↩ voltar</span>
          </p>

          <ul className="terminal-exp__lista">
            {itens.map((item, indice) => (
              <li className="terminal-exp__item" key={indice}>
                <p className="terminal-exp__item-titulo">{item.titulo}</p>
                {item.periodo && <p className="terminal-exp__item-periodo">{item.periodo}</p>}
                {script.tipo === "experiencia" && item.descricao && (
                  <p className="terminal-exp__item-descricao">{item.descricao}</p>
                )}
              </li>
            ))}
          </ul>

          <div className="terminal-exp__acoes-auxiliares terminal-exp__acoes-auxiliares--lista">
            <button type="button" className="terminal-exp__botao-voltar" onClick={onVoltar}>
              Voltar ao menu
            </button>
          </div>
        </>
      )}
    </>
  );
}
