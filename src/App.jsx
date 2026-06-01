/**
 * App — Componente raiz da aplicação
 *
 * Responsabilidades:
 *   • Montar o layout global
 *   • UniversoCanvas fica fixo atrás de tudo (z-index: 0)
 *   • app-wrapper garante z-index: 1 sobre o canvas
 *   • Mouse tracking via CSS custom properties --mouse-x / --mouse-y
 */

import { useEffect } from 'react'
import { useReveal } from './hooks/useReveal'
import UniversoCanvas from './components/UniversoCanvas.jsx'
import Cabecalho      from './components/Cabecalho.jsx'
import Sobre          from './components/Sobre.jsx'
import Informacoes    from './components/Informacoes.jsx'
import Projetos       from './components/Projetos.jsx'
import Certificados   from './components/Certificados.jsx'
import Rodape         from './components/Rodape.jsx'

function App() {
  useReveal()

  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <UniversoCanvas />

      <div className="app-wrapper">
        <Cabecalho />

        <main className="container__principal">
          <Sobre />
          <Informacoes />
          <Projetos />
          <Certificados />
        </main>

        <Rodape />
      </div>
    </>
  )
}

export default App
