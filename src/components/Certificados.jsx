/**
 * Certificados — Seção [03] Certificados
 *
 * Responsabilidades:
 *   • Grid 3 colunas com todos os certificados
 *   • Busca em tempo real por título ou tag
 *   • Modal ao clicar em um card
 *   • Floating preview da imagem no hover via useCursorPreview (desktop only)
 *   • No mobile: exibe 4 cards inicialmente, botão "ver mais" para expandir
 *
 * Estado:
 *   busca       — texto do campo de pesquisa
 *   modalAberto — objeto do certificado selecionado (null = fechado)
 *   expandido   — se true, mostra todos os certificados (mobile)
 *   isMobile    — detectado via matchMedia após mount (evita erro SSR)
 *   isTouch     — dispositivo sem hover real (touch)
 */

import { useState, useEffect, useCallback } from 'react'
import certificados from '../data/certificados.json'
import Modal from './Modal.jsx'
import CursorPreview from './CursorPreview.jsx'
import { useCursorPreview } from '../hooks/useCursorPreview'

const LIMITE_MOBILE = 4

function Certificados() {
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(null)
  const [expandido, setExpandido] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const { preview, elRef, handlers } = useCursorPreview()

  // Detecta mobile/touch após mount — seguro para SSR/Vite
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const mqTouch = window.matchMedia('(hover: none)')

    const update = () => {
      setIsMobile(mq.matches)
      setIsTouch(mqTouch.matches)
    }

    update()
    mq.addEventListener('change', update)
    mqTouch.addEventListener('change', update)
    return () => {
      mq.removeEventListener('change', update)
      mqTouch.removeEventListener('change', update)
    }
  }, [])

  const filtrados = busca.trim()
    ? certificados.filter(c =>
        c.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(busca.toLowerCase()))
      )
    : certificados

  const temLimite = isMobile && !busca.trim() && !expandido
  const visiveis = temLimite ? filtrados.slice(0, LIMITE_MOBILE) : filtrados
  const temMais = isMobile && filtrados.length > LIMITE_MOBILE && !busca.trim() && !expandido

  const handleCardClick = useCallback((c) => {
    setModalAberto(c)
  }, [])

  return (
    <section id="certificados">
      <div className="secao__container">
        <h2 className="secao__titulo" data-index="[03]">Certificados</h2>

        <input
          className="certificados__busca"
          type="search"
          inputMode="search"
          placeholder="// buscar por título ou tecnologia"
          value={busca}
          onChange={e => { setBusca(e.target.value); setExpandido(false) }}
          aria-label="Pesquisar certificados"
        />

        {busca.trim() && (
          <p className="certificados__contador">
            {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''}
          </p>
        )}

        <div className="certificados__grid" data-reveal="stagger" data-stagger-ms="60">
          {visiveis.length > 0 ? (
            visiveis.map((c, index) => (
              <button
                key={c.id}
                className="certificado__card reveal-item"
                data-reveal-from={Math.floor(index / 3) % 2 === 0 ? 'left' : 'right'}
                onClick={() => handleCardClick(c)}
                aria-label={`Ver detalhes de ${c.titulo}`}
                onMouseEnter={!isTouch ? () => handlers.onMouseEnter(c.imagem) : undefined}
                onMouseLeave={!isTouch ? handlers.onMouseLeave : undefined}
                onMouseMove={!isTouch ? handlers.onMouseMove : undefined}
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

        {temMais && (
          <button
            className="certificados__ver-mais"
            onClick={() => setExpandido(true)}
            aria-label="Ver todos os certificados"
          >
            ver mais ({filtrados.length - LIMITE_MOBILE} restantes)
          </button>
        )}

        {isMobile && expandido && !busca.trim() && (
          <button
            className="certificados__ver-mais certificados__ver-mais--recolher"
            onClick={() => setExpandido(false)}
          >
            recolher
          </button>
        )}
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