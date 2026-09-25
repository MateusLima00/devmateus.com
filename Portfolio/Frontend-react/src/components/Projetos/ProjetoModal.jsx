import { useEffect, useRef, useState } from "react";
import { REGISTRO_DEMOS } from "./demos/registroDemos.js";

/** Quebra o texto do README (markdown bem simples: #/##, listas com "-",
 * bloco de código com ```, `código inline` e resto vira parágrafo) em blocos
 * prontos pra renderizar, sem precisar de uma lib de markdown inteira. */
function blocosDoReadme(texto) {
  const linhas = texto.split("\n");
  const blocos = [];
  let listaAtual = null;
  let blocoCodigoAtual = null;

  for (const linhaBruta of linhas) {
    if (blocoCodigoAtual) {
      if (linhaBruta.trim() === "```") {
        blocoCodigoAtual = null;
      } else {
        blocoCodigoAtual.linhas.push(linhaBruta);
      }
      continue;
    }

    const linha = linhaBruta.trim();
    if (!linha) {
      listaAtual = null;
      continue;
    }

    if (linha.startsWith("```")) {
      listaAtual = null;
      blocoCodigoAtual = { tipo: "codigo", linhas: [] };
      blocos.push(blocoCodigoAtual);
    } else if (linha.startsWith("## ")) {
      listaAtual = null;
      blocos.push({ tipo: "h3", texto: linha.slice(3) });
    } else if (linha.startsWith("# ")) {
      listaAtual = null;
      blocos.push({ tipo: "h2", texto: linha.slice(2) });
    } else if (linha.startsWith("- ")) {
      if (!listaAtual) {
        listaAtual = { tipo: "lista", itens: [] };
        blocos.push(listaAtual);
      }
      listaAtual.itens.push(linha.slice(2));
    } else {
      listaAtual = null;
      blocos.push({ tipo: "p", texto: linha });
    }
  }

  return blocos;
}

/** Texto de parágrafo/item de lista pode ter `código inline` entre crases —
 * quebra em pedaços de texto normal e <code>, na ordem em que aparecem. */
function ComTrechosInline({ texto }) {
  const partes = texto.split(/(`[^`]+`)/g);
  return (
    <>
      {partes.map((parte, indice) =>
        parte.startsWith("`") && parte.endsWith("`") ? (
          <code key={indice}>{parte.slice(1, -1)}</code>
        ) : (
          <span key={indice}>{parte}</span>
        )
      )}
    </>
  );
}

function ReadmeRenderizado({ texto }) {
  return (
    <div className="projeto-modal__readme">
      {blocosDoReadme(texto).map((bloco, indice) => {
        if (bloco.tipo === "h2") return <h3 key={indice}>{bloco.texto}</h3>;
        if (bloco.tipo === "h3") return <h4 key={indice}>{bloco.texto}</h4>;
        if (bloco.tipo === "codigo")
          return (
            <pre key={indice} className="projeto-modal__readme-codigo">
              <code>{bloco.linhas.join("\n")}</code>
            </pre>
          );
        if (bloco.tipo === "lista")
          return (
            <ul key={indice}>
              {bloco.itens.map((item) => (
                <li key={item}>
                  <ComTrechosInline texto={item} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={indice}>
            <ComTrechosInline texto={bloco.texto} />
          </p>
        );
      })}
    </div>
  );
}

const ROTULO_CATEGORIA = {
  computador: "Computador",
  celular: "Celular",
  tablet: "Tablet",
};

/** Aceita tanto uma lista simples de URLs (ex.: codigoImagens) quanto uma
 * lista de { src, categoria } (ex.: capturas, separadas por dispositivo) —
 * padroniza pro mesmo formato interno pra galeria funcionar nos dois casos. */
function normalizarItensGaleria(itens) {
  return itens.map((item) => (typeof item === "string" ? { src: item, categoria: null } : item));
}

/** Galeria com filtro por categoria (Computador/Celular/Tablet) quando aplicável,
 * grade de miniaturas clicáveis e um visualizador ampliado (uma imagem por vez,
 * com anterior/próxima) — em vez de despejar todas as fotos empilhadas. */
function GaleriaImagens({ itens, alt, textoVazio }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [indiceAmpliado, setIndiceAmpliado] = useState(null);

  const todosOsItens = itens ? normalizarItensGaleria(itens) : [];
  const categorias = [...new Set(todosOsItens.map((item) => item.categoria).filter(Boolean))];
  const itensFiltrados = categoriaAtiva ? todosOsItens.filter((item) => item.categoria === categoriaAtiva) : todosOsItens;

  useEffect(() => {
    if (indiceAmpliado === null) return;

    function aoTeclar(evento) {
      if (evento.key === "Escape") {
        evento.stopPropagation();
        setIndiceAmpliado(null);
      } else if (evento.key === "ArrowRight") {
        setIndiceAmpliado((atual) => (atual + 1) % itensFiltrados.length);
      } else if (evento.key === "ArrowLeft") {
        setIndiceAmpliado((atual) => (atual - 1 + itensFiltrados.length) % itensFiltrados.length);
      }
    }
    // capture: intercepta o Esc antes dele chegar no listener do modal (que fecharia tudo).
    document.addEventListener("keydown", aoTeclar, true);
    return () => document.removeEventListener("keydown", aoTeclar, true);
  }, [indiceAmpliado, itensFiltrados.length]);

  if (todosOsItens.length === 0) {
    return <p className="projeto-modal__sem-imagem">{textoVazio}</p>;
  }

  return (
    <div className="projeto-modal__galeria">
      {categorias.length > 1 && (
        <div className="projeto-modal__galeria-filtros">
          <button
            type="button"
            className={`projeto-modal__galeria-filtro${!categoriaAtiva ? " projeto-modal__galeria-filtro--ativo" : ""}`}
            onClick={() => setCategoriaAtiva(null)}
          >
            Todas
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={`projeto-modal__galeria-filtro${categoriaAtiva === categoria ? " projeto-modal__galeria-filtro--ativo" : ""}`}
              onClick={() => setCategoriaAtiva(categoria)}
            >
              {ROTULO_CATEGORIA[categoria] ?? categoria}
            </button>
          ))}
        </div>
      )}

      <div className="projeto-modal__grade-imagens">
        {itensFiltrados.map((item, indice) => (
          <button
            key={item.src}
            type="button"
            className="projeto-modal__miniatura"
            onClick={() => setIndiceAmpliado(indice)}
            aria-label={`Ampliar imagem ${indice + 1} de ${itensFiltrados.length}`}
          >
            <img src={item.src} alt={alt} loading="lazy" />
          </button>
        ))}
      </div>

      {indiceAmpliado !== null && itensFiltrados[indiceAmpliado] && (
        <div className="projeto-modal__lightbox" onClick={() => setIndiceAmpliado(null)}>
          <button type="button" className="projeto-modal__lightbox-fechar" aria-label="Fechar imagem ampliada" onClick={() => setIndiceAmpliado(null)}>
            ×
          </button>

          {itensFiltrados.length > 1 && (
            <button
              type="button"
              className="projeto-modal__lightbox-nav projeto-modal__lightbox-nav--anterior"
              aria-label="Imagem anterior"
              onClick={(evento) => {
                evento.stopPropagation();
                setIndiceAmpliado((atual) => (atual - 1 + itensFiltrados.length) % itensFiltrados.length);
              }}
            >
              ‹
            </button>
          )}

          <img
            className="projeto-modal__lightbox-imagem"
            src={itensFiltrados[indiceAmpliado].src}
            alt={alt}
            onClick={(evento) => evento.stopPropagation()}
          />

          {itensFiltrados.length > 1 && (
            <button
              type="button"
              className="projeto-modal__lightbox-nav projeto-modal__lightbox-nav--proxima"
              aria-label="Próxima imagem"
              onClick={(evento) => {
                evento.stopPropagation();
                setIndiceAmpliado((atual) => (atual + 1) % itensFiltrados.length);
              }}
            >
              ›
            </button>
          )}

          {itensFiltrados.length > 1 && (
            <p className="projeto-modal__lightbox-contador">
              {indiceAmpliado + 1} / {itensFiltrados.length}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const ABAS_EXTRAS = [
  { id: "capturas", rotulo: "Sistema em produção" },
  { id: "codigo", rotulo: "Trechos de código" },
  { id: "readme", rotulo: "README" },
];

/** Modal de prévia de um projeto — fecha por Esc, clique fora ou no X, devolvendo o foco a quem abriu. */
export function ProjetoModal({ projeto, onFechar }) {
  const botaoFecharRef = useRef(null);
  const elementoAnteriorFocoRef = useRef(null);
  const [abaExtraAtiva, setAbaExtraAtiva] = useState(null);

  useEffect(() => {
    if (!projeto) return;

    elementoAnteriorFocoRef.current = document.activeElement;
    document.body.style.overflow = "hidden"; // trava o scroll da página por trás do modal
    botaoFecharRef.current?.focus();
    setAbaExtraAtiva(null); // sempre reabre fechado, sem herdar a aba do projeto anterior

    function aoTeclar(evento) {
      if (evento.key === "Escape") onFechar();
    }
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", aoTeclar);
      elementoAnteriorFocoRef.current?.focus();
    };
  }, [projeto, onFechar]);

  if (!projeto) return null;

  const ComponenteDemo = projeto.demo && REGISTRO_DEMOS[projeto.demo];

  // Só mostra as abas extras (fotos reais / código / README) pra projeto que
  // de fato tem pelo menos um desses conteúdos preenchido.
  const abasDisponiveis = ABAS_EXTRAS.filter((aba) => {
    if (aba.id === "capturas") return (projeto.capturas?.length ?? 0) > 0;
    if (aba.id === "codigo") return (projeto.codigoImagens?.length ?? 0) > 0;
    if (aba.id === "readme") return Boolean(projeto.readme);
    return false;
  });

  return (
    <aside className="projeto-modal" aria-hidden="false">
      <div className="projeto-modal__fundo" onClick={onFechar} />

      <article
        className={`projeto-modal__janela${ComponenteDemo ? " projeto-modal__janela--larga" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="projetoModalTitulo"
      >
        <button type="button" ref={botaoFecharRef} className="projeto-modal__fechar" aria-label="Fechar prévia" onClick={onFechar}>
          ×
        </button>

        <p className="projeto-modal__eyebrow">projeto</p>
        <h2 className="projeto-modal__titulo" id="projetoModalTitulo">{projeto.nome}</h2>

        {ComponenteDemo ? (
          <ComponenteDemo />
        ) : projeto.imagem ? (
          <img className="projeto-modal__imagem" src={projeto.imagem} alt={`Prévia de ${projeto.nome}`} />
        ) : (
          <p className="projeto-modal__sem-imagem">Prévia visual em breve.</p>
        )}

        <p className="projeto-modal__descricao">{projeto.descricao}</p>

        <ul className="projeto-modal__stack">
          {projeto.stack.map((tecnologia) => (
            <li key={tecnologia}>{tecnologia}</li>
          ))}
        </ul>

        {abasDisponiveis.length > 0 && (
          <div className="projeto-modal__abas-extras">
            <div className="projeto-modal__abas-extras-botoes" role="tablist">
              {abasDisponiveis.map((aba) => (
                <button
                  key={aba.id}
                  type="button"
                  role="tab"
                  aria-selected={abaExtraAtiva === aba.id}
                  className={`projeto-modal__aba-extra${abaExtraAtiva === aba.id ? " projeto-modal__aba-extra--ativa" : ""}`}
                  onClick={() => setAbaExtraAtiva((atual) => (atual === aba.id ? null : aba.id))}
                >
                  {aba.rotulo}
                </button>
              ))}
            </div>

            {abaExtraAtiva === "capturas" && (
              <GaleriaImagens itens={projeto.capturas} alt={`Sistema em produção — ${projeto.nome}`} textoVazio="Fotos do sistema em produção em breve." />
            )}
            {abaExtraAtiva === "codigo" && (
              <GaleriaImagens itens={projeto.codigoImagens} alt={`Trecho de código — ${projeto.nome}`} textoVazio="Imagens de código em breve." />
            )}
            {abaExtraAtiva === "readme" && <ReadmeRenderizado texto={projeto.readme} />}
          </div>
        )}

        <div className="projeto-modal__links">
          {projeto.linkRepo && (
            <a href={projeto.linkRepo} target="_blank" rel="noopener noreferrer">
              Ver repositório
            </a>
          )}
          {projeto.linkDemo && (
            <a href={projeto.linkDemo} target="_blank" rel="noopener noreferrer">
              Ver demo
            </a>
          )}
        </div>
      </article>
    </aside>
  );
}
