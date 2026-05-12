// ─────────────────────────────────────────────
// Certificados.jsx — Seção de certificados
//
// Responsabilidades:
//   • Exibir carrossel Swiper quando não há busca ativa
//   • Filtrar certificados por título ou tag em tempo real
//   • Abrir modal com detalhes ao clicar em um card
//
// Estado:
//   • busca       — texto digitado no campo de pesquisa
//   • modalAberto — objeto do certificado selecionado (ou null)
//
// Nota sobre o import:
//   O arquivo JSON foi renomeado para certificados.json (minúsculo)
//   para garantir compatibilidade com sistemas Linux (case-sensitive).
// ─────────────────────────────────────────────

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules'

// Importações de CSS do Swiper
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

// ATENÇÃO: nome do arquivo em minúsculo — evita quebra no Linux/Vercel
import certificados from '../data/certificados.json'
import Modal from './Modal.jsx'

function Certificados() {
  // Texto atual do campo de busca
  const [busca, setBusca] = useState('')

  // Certificado clicado para abrir no modal (null = modal fechado)
  const [modalAberto, setModalAberto] = useState(null)

  // Filtra por título OU por qualquer tag do certificado
  const filtrados = busca.trim()
    ? certificados.filter(c =>
        c.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(busca.toLowerCase()))
      )
    : []

  // Carrossel visível apenas quando a busca está vazia
  const mostrarCarrossel = busca.trim() === ''

  return (
    <section className="container__carrossel" id="certificados">
      <h2 className="container__Carrosel__texto">Certificados</h2>

      {/* Campo de busca — filtra em tempo real */}
      <input
        className="pesqui"
        type="search"
        placeholder="Pesquisar por título ou tecnologia..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
        aria-label="Pesquisar certificados"
      />

      {/* ── CARROSSEL (busca vazia) ── */}
      {mostrarCarrossel && (
        <Swiper
          modules={[Autoplay, Pagination, EffectCoverflow]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          className="mySwiper"
          aria-label="Carrossel de certificados"
        >
          {certificados.map(c => (
            <SwiperSlide key={c.id}>
              <img src={c.imagem} alt={c.titulo} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* ── CARDS DE BUSCA (busca ativa) ── */}
      {!mostrarCarrossel && (
        <div>
          {filtrados.length > 0 ? (
            <>
              {/* Contador de resultados */}
              <p className="react-contador">
                {filtrados.length} certificado{filtrados.length !== 1 ? 's' : ''}{' '}
                encontrado{filtrados.length !== 1 ? 's' : ''}
              </p>

              {/* Grid de cards clicáveis */}
              <div className="react-cards-grid">
                {filtrados.map(c => (
                  <button
                    key={c.id}
                    className="react-card"
                    onClick={() => setModalAberto(c)}
                    aria-label={`Ver detalhes de ${c.titulo}`}
                  >
                    <img src={c.imagem} alt={c.titulo} className="react-card-img" />
                    <div className="react-card-body">
                      <p className="react-card-titulo">{c.titulo}</p>
                      <div className="react-card-tags">
                        {c.tags.map(t => (
                          <span key={t} className="react-tag">{t}</span>
                        ))}
                      </div>
                      <div className="react-card-meta">
                        <span>📅 {c.data}</span>
                        <span>⏱ {c.horas}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Mensagem quando nenhum certificado bate com a busca */
            <p className="react-sem-resultado">
              Nenhum certificado encontrado para &quot;{busca}&quot;
            </p>
          )}
        </div>
      )}

      {/* ── MODAL (certificado selecionado) ── */}
      {modalAberto && (
        <Modal
          cert={modalAberto}
          onFechar={() => setModalAberto(null)}
        />
      )}
    </section>
  )
}

export default Certificados
