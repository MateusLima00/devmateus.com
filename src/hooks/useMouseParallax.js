/**
 * useMouseParallax — Rotação suave da câmera Three.js com mouse
 *
 * @param {React.MutableRefObject} cameraRef — ref para a câmera Three.js
 *
 * Ao mover o mouse, aplica rotação leve na câmera usando lerp
 * (fator MOUSE_FACTOR) para um efeito de "olhar ao redor" sutil.
 * Desativado automaticamente em touch devices.
 */

import { useEffect } from 'react'

// Intensidade do parallax de mouse — ajuste aqui para calibrar
const MOUSE_FACTOR = 0.0015

export function useMouseParallax(cameraRef) {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let rafId = null

    const handleMouseMove = (e) => {
      targetX = (e.clientY / window.innerHeight - 0.5) * MOUSE_FACTOR * 60
      targetY = (e.clientX / window.innerWidth - 0.5) * MOUSE_FACTOR * 60
    }

    const tick = () => {
      const cam = cameraRef.current
      if (cam) {
        // Lerp suave em direção ao alvo
        currentX += (targetX - currentX) * 0.05
        currentY += (targetY - currentY) * 0.05
        cam.rotation.x = currentX
        cam.rotation.y = currentY
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [cameraRef])
}
