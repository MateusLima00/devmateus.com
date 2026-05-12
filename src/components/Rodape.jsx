// ─────────────────────────────────────────────
// Rodape.jsx — Rodapé da página
//
// Responsabilidades:
//   • Crédito do autor e tecnologias usadas
//   • Link rápido para o GitHub
// ─────────────────────────────────────────────

function Rodape() {
  const anoAtual = new Date().getFullYear()

  return (
    <footer className="rodape">
      <p className="rodape__titulo">
        Feito por Mateus Lima com React &amp; Vite — {anoAtual}
      </p>
      <a
        href="https://github.com/MateusLima00"
        target="_blank"
        rel="noopener noreferrer"
        className="rodape__texto"
        aria-label="Ver perfil no GitHub"
      >
        @MateusLima00
      </a>
    </footer>
  )
}

export default Rodape
