/**
 * useCursorPreview — Gerencia o floating preview de imagem
 *
 * Retorna:
 *   preview   — { visible, src }
 *   elRef     — ref do elemento DOM do preview (posição via DOM direto)
 *   handlers  — { onMouseEnter, onMouseLeave, onMouseMove }
 *
 * Posição é atualizada diretamente no DOM (sem re-render) para seguir
 * o cursor sem lag. Visibilidade e src usam estado React normalmente.
 * Timer de saída é cancelado se o mouse entrar em outro card antes de 150ms.
 */

import { useState, useCallback, useRef } from 'react'

export function useCursorPreview() {
  const [preview, setPreview] = useState({ visible: false, src: '' })
  const elRef   = useRef(null)
  const timerRef = useRef(null)

  const onMouseEnter = useCallback((src) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setPreview({ visible: true, src })
  }, [])

  const onMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setPreview(prev => ({ ...prev, visible: false }))
    }, 150)
  }, [])

  // Atualiza posição direto no DOM — zero re-render, zero lag
  const onMouseMove = useCallback((e) => {
    if (elRef.current) {
      elRef.current.style.left = `${e.clientX + 18}px`
      elRef.current.style.top  = `${e.clientY + 18}px`
    }
  }, [])

  return { preview, elRef, handlers: { onMouseEnter, onMouseLeave, onMouseMove } }
}
