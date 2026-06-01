import { useEffect } from 'react'

export function useMagnetic(ref, strength = 0.3) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(hover: none)').matches) return

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      el.style.transform = `translate(${distX * strength}px, ${distY * strength}px)`
    }

    const handleMouseLeave = () => {
      el.style.transform = 'translate(0, 0)'
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, strength])
}
