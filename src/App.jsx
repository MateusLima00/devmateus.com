// ─────────────────────────────────────────────
// App.jsx — Componente raiz da aplicação
//
// Responsabilidades:
//   • Montar o layout global (Cabeçalho → main → Rodapé)
//   • Ativar o hook de animação de scroll (useReveal)
//
// Nota: o import do React não é necessário com o
// JSX Transform automático do Vite ≥ 3, mas foi
// mantido para clareza nos estudos.
// ─────────────────────────────────────────────

import { useReveal } from './hooks/useReveal'
import Cabecalho    from './components/Cabecalho.jsx'
import Sobre        from './components/Sobre.jsx'
import Informacoes  from './components/Informacoes.jsx'
import Projetos     from './components/Projetos.jsx'
import Certificados from './components/Certificados.jsx'
import Rodape       from './components/Rodape.jsx'

function App() {
  // Ativa o IntersectionObserver que revela cada <section>
  // ao entrar na viewport — definido em hooks/useReveal.js
  useReveal()

  return (
    <>
      <Cabecalho />

      {/* container__principal garante padding-top para não
          ficar embaixo do header fixo */}
      <main className="container__principal">
        <Sobre />
        <Informacoes />
        <Projetos />
        <Certificados />
      </main>

      <Rodape />
    </>
  )
}

export default App
