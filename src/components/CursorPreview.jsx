/**
 * CursorPreview — Floating preview de imagem que segue o mouse
 *
 * Renderizado via portal em document.body para escapar de qualquer
 * transform de seção pai (que quebraria o position: fixed).
 *
 * Props:
 *   src     — caminho da imagem a exibir
 *   visible — boolean controla visibilidade
 *   elRef   — ref do elemento DOM (posição atualizada diretamente)
 */

import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

function CursorPreview({ src, visible, elRef }) {
  return createPortal(
    <div
      ref={elRef}
      className={`cursor-preview ${visible ? 'cursor-preview--visivel' : 'cursor-preview--oculto'}`}
      aria-hidden="true"
    >
      {src && (
        <img src={src} alt="" className="cursor-preview__img" />
      )}
    </div>,
    document.body
  )
}

CursorPreview.propTypes = {
  src:     PropTypes.string,
  visible: PropTypes.bool.isRequired,
  elRef:   PropTypes.object.isRequired,
}

CursorPreview.defaultProps = {
  src: '',
}

export default CursorPreview
