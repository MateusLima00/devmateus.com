// ─────────────────────────────────────────────
// Modal.jsx — Janela de detalhes do certificado
//
// Props:
//   cert     — objeto com { titulo, imagem, data, horas, tags }
//   onFechar — callback para fechar o modal
//
// Acessibilidade:
//   • role="dialog" + aria-modal="true" para leitores de tela
//   • aria-labelledby aponta para o título do modal
//   • Fecha com tecla Escape (useEffect + keydown)
//   • Foco movido para o botão de fechar ao abrir (useEffect + ref)
//   • Clique no overlay também fecha
//
// Nota: renomeado de Model.jsx para Modal.jsx (nome mais correto)
// ─────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

function Modal({ cert, onFechar }) {
  // Ref para mover o foco ao botão de fechar quando o modal abre
  const btnFecharRef = useRef(null)

  useEffect(() => {
    // Move o foco para o botão de fechar ao montar
    btnFecharRef.current?.focus()

    // Fecha o modal ao pressionar Escape
    const handleKeyDown = e => {
      if (e.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', handleKeyDown)

    // Remove o listener ao desmontar (evita vazamento)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onFechar])

  return (
    // Overlay escuro — clique fora fecha o modal
    <div
      className="react-modal-overlay"
      onClick={onFechar}
      role="presentation"
    >
      {/* Caixa do modal — stopPropagation evita fechar ao clicar dentro */}
      <div
        className="react-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={e => e.stopPropagation()}
      >
        {/* Botão de fechar — recebe foco ao abrir */}
        <button
          ref={btnFecharRef}
          className="react-modal-fechar"
          onClick={onFechar}
          aria-label="Fechar modal"
        >
          ✕
        </button>

        {/* Imagem do certificado */}
        <img
          src={cert.imagem}
          alt={`Certificado: ${cert.titulo}`}
          className="react-modal-img"
        />

        {/* Informações do certificado */}
        <div className="react-modal-body">
          <p id="modal-titulo" className="react-modal-titulo">
            {cert.titulo}
          </p>

          <div className="react-modal-meta">
            <span>📅 {cert.data}</span>
            <span>⏱ {cert.horas}</span>
          </div>

          <div className="react-modal-tags">
            {cert.tags.map(t => (
              <span key={t} className="react-tag">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Validação de props — previne bugs silenciosos
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
