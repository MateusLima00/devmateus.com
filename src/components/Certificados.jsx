/**
 * Certificados — Seção [03] Certificados
 *
 * Responsabilidades:
 *   • Grid 3 colunas com todos os certificados
 *   • Busca em tempo real por título ou tag
 *   • Modal ao clicar em um card
 *   • Floating preview da imagem no hover via useCursorPreview
 *
 * Estado:
 *   busca       — texto do campo de pesquisa
 *   modalAberto — objeto do certificado selecionado (null = fechado)
 */

import { useState } from 'react'
import certificados from '../data/certificados.json'
import Modal from './Modal.jsx'
import CursorPreview from './CursorPreview.jsx'
import { useCursorPreview } from '../hooks/useCursorPreview'

function Certificados() {
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(null)
  const { preview, elRef, handlers } = useCursorPreview()

  const filtrados = busca.trim()
    ? certificados.filter(c =>
        c.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(busca.toLowerCase()))
      )
    : certificados

  return (
    <section id="certificados">
      <div className="secao__container">
        <h2 className="secao__titulo" data-index="[03]">Certificados</h2>

        <input
          className="certificados__busca"
          type="search"
          placeholder="// buscar por título ou tecnologia"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          aria-label="Pesquisar certificados"
        />

        {busca.trim() && (
          <p className="certificados__contador">
            {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''}
          </p>
        )}

        <div className="certificados__grid" data-reveal="stagger" data-stagger-ms="60">
          {filtrados.length > 0 ? (
            filtrados.map((c, index) => (
              <button
                key={c.id}
                className="certificado__card reveal-item"
                data-reveal-from={Math.floor(index / 3) % 2 === 0 ? 'left' : 'right'}
                onClick={() => setModalAberto(c)}
                aria-label={`Ver detalhes de ${c.titulo}`}
                onMouseEnter={() => handlers.onMouseEnter(c.imagem)}
                onMouseLeave={handlers.onMouseLeave}
                onMouseMove={handlers.onMouseMove}
              >
                <span className="certificado__area">{c.area}</span>
                <p className="certificado__nome">{c.titulo}</p>
                <p className="certificado__emissor">Alura · {c.data}</p>
              </button>
            ))
          ) : (
            <p className="certificados__vazio">
              Nenhum resultado para &quot;{busca}&quot;
            </p>
          )}
        </div>
      </div>

      {modalAberto && (
        <Modal cert={modalAberto} onFechar={() => setModalAberto(null)} />
      )}

      <CursorPreview
        src={preview.src}
        visible={preview.visible}
        elRef={elRef}
      />
    </section>
  )
}

export default Certificados
