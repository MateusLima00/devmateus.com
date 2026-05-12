// ─────────────────────────────────────────────
// Cabecalho.jsx — Barra de navegação fixa no topo
//
// Responsabilidades:
//   • Exibir o nome/marca com animação de typewriter
//   • Fornecer links âncora para as seções da página
//
// Acessibilidade:
//   • Usa <header> e <nav> semânticos
//   • aria-label no <nav> descreve o propósito
// ─────────────────────────────────────────────

function Cabecalho() {
  return (
    <header className="cabecalho">
      {/* Título com efeito typewriter definido no CSS */}
      <h3 className="cabecalho__titulo">Bem-Vindo</h3>

      {/* aria-label identifica a navegação para leitores de tela */}
      <nav className="cabecalho__navegacao" aria-label="Navegação principal">
        <a href="#informacoes" className="cabacalho__item">Informações</a>
        <a href="#projetos"    className="cabacalho__item">Projetos</a>
        <a href="#certificados" className="cabacalho__item">Certificados</a>
      </nav>
    </header>
  )
}

export default Cabecalho
