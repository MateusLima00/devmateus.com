/**
 * Sobre — Seção hero (primeira tela)
 *
 * Responsabilidades:
 *   • Grid 2 colunas: texto/CTA à esquerda, métricas à direita
 *   • Ticker com stack tecnológico passando em loop
 *   • Botões com efeito magnético via useMagnetic
 *
 * Sem props — dados estáticos do dev.
 */

import { useRef } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'

// Stack exibido no ticker — duplicado para criar loop contínuo
const TICKER_ITEMS = [
  'React', 'JavaScript', 'Python', 'HTML', 'CSS',
  'Node.js', 'PostgreSQL', 'MySQL', 'Linux', 'MikroTik',
  'Redes', 'CFTV', 'Vite', 'Git', 'GitHub',
]

function Sobre() {
  const btnSolidRef = useRef(null)
  const btnGhostRef = useRef(null)

  useMagnetic(btnSolidRef)
  useMagnetic(btnGhostRef)

  // Duplica os itens para o loop infinito
  const tickerLoop = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      <section className="hero">
        {/* ── Coluna esquerda: texto e CTA ── */}
        <div className="hero__esquerda">
          <span className="hero__tag">// portfolio </span>

          <h1 className="hero__nome">
            Mateus<br />Lima
          </h1>

          <p className="hero__cargo">_ Analista de TI &amp; Dev Front-End</p>

          <p className="hero__descricao">
            Profissional de TI com experiência em infraestrutura, redes e
            desenvolvimento web. Apaixonado por resolver problemas reais com
            código limpo e sistemas confiáveis.
          </p>

          <div className="hero__botoes">
            <a
              ref={btnSolidRef}
              href="#projetos"
              className="btn-solid"
              aria-label="Ver projetos"
            >
              Ver projetos →
            </a>
            <a
              ref={btnGhostRef}
              href="#informacoes"
              className="btn-ghost"
              aria-label="Conhecer mais sobre mim"
            >
              Sobre mim
            </a>
          </div>
        </div>

        {/* ── Coluna direita: métricas decorativas ── */}
        <div className="hero__direita">
          <div className="hero__metrica">
            <span className="hero__metrica__numero">3+</span>
            <span className="hero__metrica__label">anos em TI</span>
          </div>
          <div className="hero__metrica">
            <span className="hero__metrica__numero">8+</span>
            <span className="hero__metrica__label">certificados</span>
          </div>
        </div>
      </section>

      {/* ── Ticker com stack tecnológico ── */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {tickerLoop.map((item, i) => (
            <span key={i} className="ticker__item">{item}</span>
          ))}
        </div>
      </div>
    </>
  )
}

export default Sobre
