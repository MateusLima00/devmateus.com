/**
 * Projetos — Seção [02] Projetos publicados
 *
 * Responsabilidades:
 *   • Grid 2 colunas com separador de 1px
 *   • Floating preview de imagem no hover via useCursorPreview
 *
 * Para adicionar projeto:
 *   1. Adicione objeto no array PROJETOS abaixo
 *   2. Adicione screenshot em /public/img/previews/projeto-{id}.png
 */

import CursorPreview from './CursorPreview.jsx'
import { useCursorPreview } from '../hooks/useCursorPreview'

// ── Array de projetos ────────────────────────────────
const PROJETOS = [
  {
    id: 1,
    titulo: 'Variação Dólar em Real',
    descricao: 'Aplicação web que exibe a variação do dólar e euro em tempo real frente ao Real, consumindo API de câmbio e apresentando os dados com gráficos interativos.',
    tecnologias: ['JavaScript', 'HTML', 'CSS', 'API de câmbio'],
    linkDemo: 'https://variacao-dolar-em-real.vercel.app',
    linkRepo: 'https://github.com/MateusLima00/variacao_dolar_em_real',
    previewImg: '/img/previews/projeto-1.svg',
  },
  {
    id: 2,
    titulo: 'Coletar AFD',
    descricao: 'Script Python para automatizar o download e envio de arquivos AFD (Arquivo Fonte de Dados) de relógios de ponto, eliminando processo manual e recorrente.',
    tecnologias: ['Python', 'Automação', 'Script'],
    linkDemo: null,
    linkRepo: 'https://github.com/MateusLima00/Coletar-AFD-',
    previewImg: '/img/previews/projeto-2.svg',
  },
]

function Projetos() {
  const { preview, elRef, handlers } = useCursorPreview()

  return (
    <section id="projetos">
      <div className="secao__container">
        <h2 className="secao__titulo" data-index="[02]">Projetos</h2>

        <div className="projetos__grid" data-reveal="stagger" data-stagger-ms="100">
          {PROJETOS.map((projeto, index) => (
            <article
              key={projeto.id}
              className="projeto__card reveal-item"
              data-reveal-from="up"
              onMouseEnter={() => handlers.onMouseEnter(projeto.previewImg)}
              onMouseLeave={handlers.onMouseLeave}
              onMouseMove={handlers.onMouseMove}
            >
              <span className="projeto__numero">
                {String(index + 1).padStart(3, '0')} ·
              </span>

              <h3 className="projeto__titulo">{projeto.titulo}</h3>

              <p className="projeto__descricao">{projeto.descricao}</p>

              <div className="projeto__tags">
                {projeto.tecnologias.map(tech => (
                  <span key={tech} className="projeto__tag">{tech}</span>
                ))}
              </div>

              <div className="projeto__links">
                {projeto.linkDemo && (
                  <a
                    href={projeto.linkDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="projeto__link projeto__link--demo"
                    aria-label={`Ver demo de ${projeto.titulo}`}
                  >
                    ↗ demo
                  </a>
                )}
                <a
                  href={projeto.linkRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="projeto__link"
                  aria-label={`Ver código de ${projeto.titulo} no GitHub`}
                >
                  ⌥ código
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <CursorPreview
        src={preview.src}
        visible={preview.visible}
        elRef={elRef}
      />
    </section>
  )
}

export default Projetos
