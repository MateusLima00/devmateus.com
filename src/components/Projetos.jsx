// ─────────────────────────────────────────────
// Projetos.jsx — Seção de projetos publicados
//
// Responsabilidades:
//   • Listar projetos com descrição, tecnologias e links
//
// Como adicionar um projeto:
//   1. Adicione um objeto no array PROJETOS abaixo
//   2. Preencha: titulo, descricao, tecnologias, linkDemo, linkRepo
//   3. Salve — aparece automaticamente na página
// ─────────────────────────────────────────────

// Array de projetos — edite aqui para adicionar/remover
const PROJETOS = [
  {
    id: 1,
    titulo: 'Variação Dólar em Real',
    descricao:
      'Aplicação web que exibe a variação do dólar e euro em tempo real frente ao Real, consumindo API de câmbio e apresentando os dados com gráficos interativos.',
    tecnologias: ['JavaScript', 'HTML', 'CSS', 'API de câmbio'],
    linkDemo: 'https://variacao-dolar-em-real.vercel.app',
    linkRepo: 'https://github.com/MateusLima00/variacao_dolar_em_real',
  },
  {
    id: 2,
    titulo: 'Coletar AFD',
    descricao:
      'Script Python para automatizar o download e envio de arquivos AFD (Arquivo Fonte de Dados) de relógios de ponto, eliminando processo manual e recorrente.',
    tecnologias: ['Python', 'Automação', 'Script'],
    linkDemo: null, // sem demo — projeto interno
    linkRepo: 'https://github.com/MateusLima00/Coletar-AFD-',
  },
]

function Projetos() {
  return (
    <section className="container__projetos" id="projetos">
      <h2 className="container__projetos__titulo">Projetos</h2>

      <div className="projetos__grid">
        {PROJETOS.map(projeto => (
          <article key={projeto.id} className="projeto__card">

            {/* Cabeçalho do card */}
            <div className="projeto__card__header">
              {/* Ícone decorativo de pasta */}
              <span className="projeto__icone" aria-hidden="true">📁</span>
              <h3 className="projeto__titulo">{projeto.titulo}</h3>
            </div>

            {/* Descrição */}
            <p className="projeto__descricao">{projeto.descricao}</p>

            {/* Tags de tecnologias */}
            <div className="projeto__tags">
              {projeto.tecnologias.map(tech => (
                <span key={tech} className="projeto__tag">{tech}</span>
              ))}
            </div>

            {/* Links — só renderiza se existirem */}
            <div className="projeto__links">
              {projeto.linkDemo && (
                <a
                  href={projeto.linkDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="projeto__link projeto__link--demo"
                  aria-label={`Ver demo de ${projeto.titulo}`}
                >
                  ↗ Demo
                </a>
              )}
              <a
                href={projeto.linkRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="projeto__link projeto__link--repo"
                aria-label={`Ver código de ${projeto.titulo} no GitHub`}
              >
                {/* Ícone GitHub inline (SVG) */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                {' '}Código
              </a>
            </div>

          </article>
        ))}
      </div>
    </section>
  )
}

export default Projetos
