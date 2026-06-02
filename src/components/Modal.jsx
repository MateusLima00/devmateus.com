/**
 * Modal — Janela de detalhes do certificado
 *
 * Props:
 *   cert     — { titulo, imagem, data, horas, tags, area }
 *   onFechar — callback para fechar o modal
 *
 * Acessibilidade:
 *   • role="dialog" + aria-modal + aria-labelledby
 *   • Fecha com Escape, clique no overlay e botão ✕
 *   • Foco vai para o botão de fechar ao abrir
 *
 * UX mobile/desktop:
 *   • Desktop: só overflow:hidden (sem position:fixed — evita pulo pro topo)
 *   • iOS Safari: position:fixed necessário para travar scroll de verdade
 */

import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

function Modal({ cert, onFechar }) {
  const btnRef = useRef(null)

  useEffect(() => {
    btnRef.current?.focus()

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    const scrollY = window.scrollY

    if (isIOS) {
      // iOS Safari ignora overflow:hidden no body — precisa de position:fixed
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      // Desktop e Android: overflow:hidden basta, sem pulo de scroll
      document.body.style.overflow = 'hidden'
    }

    const handleKeyDown = e => {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      if (isIOS) {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo({ top: scrollY, behavior: 'instant' })
      } else {
        document.body.style.overflow = ''
      }
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onFechar])

  return (
    <div
      className="modal__overlay"
      onClick={onFechar}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={e => e.stopPropagation()}
      >
        <button
          ref={btnRef}
          className="modal__fechar"
          onClick={onFechar}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        <img
          src={cert.imagem}
          alt={`Certificado: ${cert.titulo}`}
          className="modal__img"
        />

        <div className="modal__corpo">
          <p id="modal-titulo" className="modal__titulo">{cert.titulo}</p>

          <div className="modal__meta">
            <span>📅 {cert.data}</span>
            <span>⏱ {cert.horas}</span>
          </div>

          <div className="modal__tags">
            {cert.tags.map(t => (
              <span key={t} className="modal__tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  cert: PropTypes.shape({
    titulo: PropTypes.string.isRequired,
    imagem: PropTypes.string.isRequired,
    data:   PropTypes.string.isRequired,
    horas:  PropTypes.string.isRequired,
    tags:   PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onFechar: PropTypes.func.isRequired,
}

export default Modal