/**
 * useReveal — Scroll reveal com IntersectionObserver
 *
 * Responsabilidades:
 *   1. Revela <section> e <footer> adicionando classe "visivel"
 *   2. Stagger reveal nos filhos de [data-reveal="stagger"],
 *      com delay configurável via data-stagger-ms (padrão 80ms)
 *      e direção via data-reveal-from
 *   3. MutationObserver captura novos containers dinâmicos
 *      (troca de tabs, resultados de busca)
 */

import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
    // 1. Reveal de sections e footer
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visivel')
            sectionObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -60px 0px' }
    )

    document.querySelectorAll('section:not(.hero)').forEach(s => sectionObserver.observe(s))

    const footer = document.querySelector('footer')
    if (footer) sectionObserver.observe(footer)

    // 2. Aplica direção de entrada e dispara stagger
    const revealStagger = (container) => {
      const delay = parseInt(container.dataset.staggerMs || '80', 10)

      const trigger = () => {
        Array.from(container.children).forEach((child, i) => {
          const direction = child.dataset.revealFrom || container.dataset.revealFrom || 'up'
          child.dataset.revealFrom = direction
          child.style.transitionDelay = `${i * delay}ms`
          child.classList.add('reveal-item--visivel')
        })
        container.dataset.staggerDone = '1'
      }

      const rect = container.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0

      if (inView) {
        trigger()
      } else {
        const io = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
            trigger()
            io.disconnect()
          }
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' })
        io.observe(container)
      }
    }

    document.querySelectorAll('[data-reveal="stagger"]').forEach(c => {
      c.dataset.staggerSeen = '1'
      revealStagger(c)
    })

    // 3. MutationObserver para conteúdo dinâmico
    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll('[data-reveal="stagger"]:not([data-stagger-seen])').forEach(c => {
        c.dataset.staggerSeen = '1'
        revealStagger(c)
      })

      document.querySelectorAll('[data-stagger-done="1"]').forEach(c => {
        Array.from(c.children).forEach(child => {
          if (!child.classList.contains('reveal-item--visivel')) {
            child.style.transitionDelay = '0ms'
            child.classList.add('reveal-item--visivel')
          }
        })
      })
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      sectionObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}
