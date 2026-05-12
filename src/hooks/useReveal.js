// ─────────────────────────────────────────────
// useReveal.js — Hook de animação de scroll
//
// O que faz:
//   Observa todas as <section> da página e adiciona
//   a classe "visivel" quando cada uma entra na viewport.
//   O CSS de princi.css usa essa classe para animar
//   o surgimento (opacity + translateY).
//
// Como usar:
//   Chame `useReveal()` no App.jsx — ele roda uma vez
//   e observa todas as sections automaticamente.
//
// Por que IntersectionObserver?
//   É a API moderna para detectar visibilidade de elementos.
//   Muito mais performático do que ouvir o evento "scroll"
//   e calcular offsets manualmente.
// ─────────────────────────────────────────────

import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
    // Seleciona todas as sections do documento
    const sections = document.querySelectorAll('section')

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Adiciona a classe que dispara a transição CSS
            entry.target.classList.add('visivel')

            // Para de observar após revelar — evita re-trigger
            // desnecessário e economiza recursos
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,              // inicia quando 12% da section está visível
        rootMargin: '0px 0px -40px 0px', // margem negativa: revela um pouco antes do fim
      }
    )

    // Começa a observar cada section
    sections.forEach(s => observer.observe(s))

    // Cleanup: desconecta o observer quando o componente desmonta
    // (importante para evitar vazamento de memória)
    return () => observer.disconnect()
  }, []) // [] = roda apenas uma vez, após a montagem inicial
}
