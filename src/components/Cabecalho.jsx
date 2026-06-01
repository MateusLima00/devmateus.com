/**
 * Cabecalho — Barra de navegação fixa
 *
 * Responsabilidades:
 *   • Logo estático com identidade do site
 *   • Links âncora para as seções
 *
 * Acessibilidade:
 *   • <header> + <nav> semânticos com aria-label
 */

function Cabecalho() {
  return (
    <header className="cabecalho">
      <a href="#" className="cabecalho__logo" aria-label="Ir ao início">
        devmateus<span>.com</span>
      </a>

      <nav aria-label="Navegação principal">
        <ul className="cabecalho__navegacao">
          <li>
            <a href="#informacoes" className="cabecalho__link">Informações</a>
          </li>
          <li>
            <a href="#projetos" className="cabecalho__link">Projetos</a>
          </li>
          <li>
            <a href="#certificados" className="cabecalho__link">Certificados</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Cabecalho
