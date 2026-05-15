// ─────────────────────────────────────────────
// Informacoes.jsx — Seção de experiências e conhecimentos
//
// Responsabilidades:
//   • Exibir experiências profissionais e conhecimentos
//     em abas alternáveis (tab navigation)
//   • Mostrar foto de perfil e links das redes sociais
//
// Estado:
//   • abaAtiva: qual conteúdo está visível ('experiencias' | 'conhecimentos')
//
// Acessibilidade:
//   • Abas usam role="tab" / role="tabpanel" / aria-selected
//   • Links sociais têm aria-label descritivo
//   • Imagens têm alt adequado
// ─────────────────────────────────────────────

import { useState } from 'react'

// Links das redes sociais centralizados — fácil de atualizar
const REDES = [
  {
    nome: 'Instagram',
    href: '#', // TODO: adicionar link do Instagram
    icone: '/img/instagram_779093 1.png',
  },
  {
    nome: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mateus-costa-3b5960207/',
    icone: '/img/linkedin_2585158 1.png',
  },
  {
    nome: 'GitHub',
    href: 'https://github.com/MateusLima00',
    icone: '/img/github_779088 1.png',
  },
]

function Informacoes() {
  // Controla qual aba está ativa
  const [abaAtiva, setAbaAtiva] = useState('experiencias')

  return (
    <section className="container__redes" id="informacoes">

      {/* ── Coluna esquerda: abas de conteúdo ── */}
      <div className="container__menu">

        {/* Lista de abas — role="tablist" para leitores de tela */}
        <ul
          className="container__menu__botao"
          role="tablist"
          aria-label="Seções de informações"
        >
          {/* Aba Experiências */}
          <li
            role="tab"
            aria-selected={abaAtiva === 'experiencias'}
            aria-controls="painel-experiencias"
            id="aba-experiencias"
            tabIndex={abaAtiva === 'experiencias' ? 0 : -1}
            className={`container__menu__item ${abaAtiva === 'experiencias' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva('experiencias')}
            onKeyDown={e => e.key === 'Enter' && setAbaAtiva('experiencias')}
          >
            Experiências
          </li>

          {/* Aba Conhecimentos */}
          <li
            role="tab"
            aria-selected={abaAtiva === 'conhecimentos'}
            aria-controls="painel-conhecimentos"
            id="aba-conhecimentos"
            tabIndex={abaAtiva === 'conhecimentos' ? 0 : -1}
            className={`container__menu__item ${abaAtiva === 'conhecimentos' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva('conhecimentos')}
            onKeyDown={e => e.key === 'Enter' && setAbaAtiva('conhecimentos')}
          >
            Conhecimentos
          </li>
        </ul>

        {/* ── Painel de conteúdo das abas ── */}
        <div className="container__menu__conteudo">

          {/* Painel: Experiências */}
{abaAtiva === 'experiencias' && (
  <div
    role="tabpanel"
    id="painel-experiencias"
    aria-labelledby="aba-experiencias"
  >
    {/* Experiência 1 */}
    <div className="texto texto__mobile">
      <h2 className="item__titulo">
        <span className="item__seta" aria-hidden="true">▸</span>
        <span className="item__empresa">Unilink Transportes Integrados Ltda</span>
      </h2>
      <h3 className="item__vaga">- Assistente de TI (Atual)</h3>
      <p className="item__text">
        Desenvolvimento de soluções de automação em Python para melhoria operacional Gestão e 
        manutenção de sistema web integrado a operações logísticas (Porto do Pecém) Gestão de 
        dados via API  autotrac (ATIC/Telemetria), realizando cadastros de frota/veículos 
        pesados e extração de relatórios em PostgreSQL com testes e validação via Postman 
        Análise e suporte funcional ao ERP Protheus  Administração de servidores, firewall 
        e infraestrutura de rede  Suporte técnico N1/N2 em ambiente multiunidades.
      </p>
      <h3 className="item__vaga">- Estagiário de Ti </h3>
      <p className="item__text"> Suporte técnico presencial e remoto nas três unidades da empresa
        Implantação e manutenção de infraestrutura de redes (roteadores, MikroTik e switches)
        Administração básica de servidores e firewall
        Instalação e configuração de CFTV (câmeras IP/analógicas e DVR)
        Gestão e controle de ativos de TI 
      </p>
      <h3 className="item__vaga">- Aprendiz de Ti</h3>
      <p className="item__text">
        Suporte técnico ao usuário, Manutenção preventiva e limpeza de desktops e notebooks, formatação e
        instalação de sistema operacionais, instalação e configuração do pacote offices instalação de câmeras e analógicas e
        IP, e organização e controle de equipamentos de Ti. 
      </p>
    </div>

    {/* Experiência 2 */}
    <div className="texto">
      <h2 className="item__titulo">
        <span className="item__seta" aria-hidden="true">▸</span>
        <span className="item__empresa">Atacadão Led</span>
      </h2>
      <h3 className="item__vaga"> - Estagiário de TI</h3>
      <p className="item__text">
        Prestar suporte técnico aos colaboradores na utilização dos recursos de TI,
        hardware e software. Apoiar os colaboradores na utilização de recursos e
        ferramentas tecnológicas disponíveis. Manutenção de Computadores: Verificar e
        controlar equipamentos da empresa, formatação, instalação e configuração de
        sistemas operacionais e pacote Office.
      </p>
    </div>
  </div>
)}
   {/* Painel: Conhecimentos */}
          {abaAtiva === 'conhecimentos' && (
            <div
              role="tabpanel"
              id="painel-conhecimentos"
              aria-labelledby="aba-conhecimentos"
            >
              {[
                {
                  categoria: 'Infraestrutura & Redes',
                  itens: [
                    { nome: 'Manutenção de Computadores', nivel: 'Avançado' },
                    { nome: 'Cabeamento Estruturado', nivel: 'Avançado' },
                    { nome: 'CFTV (Câmeras analógicas e IP)', nivel: 'Avançado' },
                    { nome: 'Administração de Servidores e Firewall', nivel: 'Intermediário' },
                  ],
                },
                {
                  categoria: 'Desenvolvimento',
                  itens: [
                    { nome: 'HTML & CSS', nivel: 'Intermediário' },
                    { nome: 'JavaScript', nivel: 'Intermediário' },
                    { nome: 'React', nivel: 'Intermediário' },
                    { nome: 'Python', nivel: 'Iniciante' },
                    { nome: 'SQL · PostgreSQL · MySQL', nivel: 'Iniciante' },
                  ],
                },
                {
                  categoria: 'Geral',
                  itens: [
                    { nome: 'Informática Geral', nivel: 'Avançado' },
                  ],
                },
              ].map(({ categoria, itens }) => (
                <div key={categoria} className="conhecimento__grupo">
                  <h3 className="conhecimento__categoria">{categoria}</h3>
                  <ul className="item__menu__conhecimento__lista">
                    {itens.map(({ nome, nivel }) => (
                      <li key={nome} className="item__conhecimento__lista">
                        <span className="item__seta" aria-hidden="true">▸</span>
                        <span className="item__con">{nome}</span>
                        <span className={`conhecimento__nivel nivel--${nivel.toLowerCase()}`}>
                          {nivel}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
 
        </div>
        {/* fim container__menu__conteudo */}
 
      </div>
      {/* fim container__menu */}
 
      {/* ── Coluna direita: card de perfil + redes ── */}
      <div className="container__redes__perfil">
        <div className="container__perfil_e_redes">
          <img
            src="/img/IMG_7889.PNG"
            alt="Foto de perfil de Mateus Lima"
            className="foto_perfil"
          />
 
          {/* Lista de ícones de redes sociais */}
          <ul className="redes__sociais" aria-label="Redes sociais">
            {REDES.map(({ nome, href, icone }) => (
              <li key={nome}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Acessar ${nome} de Mateus Lima`}
                >
                  <img src={icone} alt={nome} className="icones" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
 
    </section>
  )
}
 
export default Informacoes
 
