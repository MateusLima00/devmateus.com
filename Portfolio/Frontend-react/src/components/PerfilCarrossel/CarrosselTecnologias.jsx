import { useEffect, useRef, useState } from "react";

/**
 * Porta de assets/js/carrossel-tecnologias.js: mostra um card de
 * categoria por vez (Linguagens, Frameworks...), avançando sozinho
 * (autoplay) — as setas/pontinhos são um atalho manual que reinicia o
 * temporizador. A troca de categoria faz um fade (DURACAO_TRANSICAO_MS,
 * tem que bater com a transition de .carrossel-tech__card no CSS).
 *
 * Dados em /data/tecnologias.json — editar o JSON basta pra mudar as
 * tecnologias, não precisa mexer aqui.
 */

const INTERVALO_AUTOPLAY_MS = 4000;
const DURACAO_TRANSICAO_MS = 450;

export function CarrosselTecnologias() {
  const [categorias, setCategorias] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [transicionando, setTransicionando] = useState(false);
  const temporizadorRef = useRef(null);

  useEffect(() => {
    fetch("/data/tecnologias.json")
      .then((resposta) => resposta.json())
      .then(setCategorias);
  }, []);

  // Autoplay — reinicia sempre que o índice muda (troca manual também conta).
  useEffect(() => {
    if (categorias.length === 0) return;

    clearInterval(temporizadorRef.current);
    temporizadorRef.current = setInterval(() => {
      trocarPara((indiceAtual + 1) % categorias.length);
    }, INTERVALO_AUTOPLAY_MS);

    return () => clearInterval(temporizadorRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só precisa reiniciar quando o índice ou a lista mudam, não a cada render
  }, [indiceAtual, categorias.length]);

  /** Troca o card com fade: some, troca o conteúdo por baixo, aparece de novo. */
  function trocarPara(novoIndice) {
    setTransicionando(true);
    setTimeout(() => {
      setIndiceAtual(novoIndice);
      setTransicionando(false);
    }, DURACAO_TRANSICAO_MS);
  }

  function irParaAnterior() {
    trocarPara((indiceAtual - 1 + categorias.length) % categorias.length);
  }

  function irParaProximo() {
    trocarPara((indiceAtual + 1) % categorias.length);
  }

  const categoria = categorias[indiceAtual];

  return (
    <>
      <h2 className="carrossel-tech__titulo-externo">Tecnologias que uso</h2>

      <div className="carrossel-tech__linha">
        <button type="button" className="carrossel-tech__seta" onClick={irParaAnterior} aria-label="Categoria anterior">
          ‹
        </button>

        <section className="carrossel-tech" aria-roledescription="carrossel" aria-label="Tecnologias por categoria">
          <div
            className={`carrossel-tech__card${transicionando ? " carrossel-tech__card--transicionando" : ""}`}
            aria-live="polite"
          >
            {categoria && (
              <>
                <h3 className="carrossel-tech__titulo">
                  <span className="carrossel-tech__titulo-icone" aria-hidden="true">&lt;/&gt;</span>
                  {categoria.titulo}
                </h3>
                <ul className="carrossel-tech__grade">
                  {categoria.itens.map((item) => (
                    <li
                      className="carrossel-tech__pill"
                      key={item.nome}
                      style={item.borda ? { backgroundColor: item.cor, border: `1px solid ${item.borda}` } : { backgroundColor: item.cor }}
                    >
                      {item.icone && <img src={item.icone} alt="" className="carrossel-tech__pill-icone" />}
                      {item.nome}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        <button type="button" className="carrossel-tech__seta" onClick={irParaProximo} aria-label="Próxima categoria">
          ›
        </button>
      </div>

      <div className="carrossel-tech__pontos">
        {categorias.map((_, indice) => (
          <button
            type="button"
            key={indice}
            className={`carrossel-tech__ponto${indice === indiceAtual ? " carrossel-tech__ponto--ativo" : ""}`}
            aria-label={`Ir para categoria ${indice + 1}`}
            onClick={() => trocarPara(indice)}
          />
        ))}
      </div>
    </>
  );
}
