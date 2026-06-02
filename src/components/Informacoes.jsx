/**
 * Informacoes — Seção [01] Informações
 *
 * Responsabilidades:
 *   • Grid 2 colunas: tabs (experiências/conhecimentos) + card de perfil
 *   • Tabs com acessibilidade role="tab" / role="tabpanel"
 *   • Card de perfil com avatar de iniciais e links sociais
 *
 * Estado:
 *   abaAtiva — 'experiencias' | 'conhecimentos'
 */

import { useState } from 'react'

// Experiências profissionais
const EXPERIENCIAS = [
  {
    empresa: 'Sistema de Gestão de Guias Médicas',
    cargos: [
      {
        titulo: 'Desenvolvedor Freelancer — Contrato (05/2026)',
        texto: 'Auditoria técnica completa com identificação e documentação de 20 vulnerabilidades (6 críticas, 8 altas, 6 médias) em sistema PHP legado que processa dados sensíveis de saúde. Elaboração de relatório técnico e proposta de reconstrução cobrindo análise de risco, conformidade com LGPD e cronograma de 6 fases. Mapeamento de 15 módulos (autenticação, guias médicas, faturamento, agenda, relatórios, auditoria) e planejamento de migração segura de banco de dados. Correção de vulnerabilidades críticas incluindo SQL Injection, credenciais hardcoded, upload sem validação MIME e backup público exposto. Proposta de modernização da stack para Laravel PHP 8.2 + Livewire + Tailwind CSS + MySQL com arquitetura segura, conformidade LGPD e CI/CD.',
      },
    ],
  },
  {
    empresa: 'Unilink Transportes Integrados Ltda',
    cargos: [
      {
        titulo: 'Assistente de TI (Atual)',
        texto: 'Desenvolvimento de soluções de automatização em Python para melhoria operacional. Gestão e manutenção de sistema web integrado a operações logísticas (Porto do Pecém). Gestão de dados via API Autotrac (ATIC/Telemetria) com cadastro de frota e veículos pesados, extração de relatórios e banco de dados PostgreSQL, com testes via Postman. Análise e suporte funcional ao ERP Protheus. Administração de servidores, firewall e infraestrutura de rede. Suporte N1/N2 em ambiente multiunidades. Desenvolvimento de painel para gerenciamento de equipamentos de TI usando AppScript do Google Sheets.',
      },
      {
        titulo: 'Estagiário de TI',
        texto: 'Suporte técnico presencial e remoto nas três unidades. Implantação e manutenção de redes (MikroTik e switches), administração de servidores e firewall, CFTV (câmeras IP/analógicas e DVR), gestão de ativos de TI.',
      },
      {
        titulo: 'Aprendiz de TI',
        texto: 'Suporte técnico ao usuário, manutenção preventiva, formatação e instalação de SO, Office, câmeras e organização de equipamentos.',
      },
    ],
  },
  {
    empresa: 'Atacadão Led',
    cargos: [
      {
        titulo: 'Estagiário de TI',
        texto: 'Suporte técnico a colaboradores, manutenção de hardware e software, verificação e controle de equipamentos, formatação e configuração de sistemas operacionais e pacote Office.',
      },
    ],
  },
]

// Grupos de conhecimentos
const CONHECIMENTOS = [
  {
    categoria: 'Infraestrutura & Redes',
    itens: [
      { nome: 'Manutenção de Computadores', nivel: 'Avançado' },
      { nome: 'Cabeamento Estruturado', nivel: 'Avançado' },
      { nome: 'CFTV (Câmeras analógicas e IP)', nivel: 'Avançado' },
      { nome: 'Administração de Servidores e Firewall', nivel: 'Intermediário' },
      { nome: 'Linux', nivel: 'Intermediário' },
      { nome: 'Cibersegurança & Kali Linux', nivel: 'Iniciante' },
    ],
  },
  {
    categoria: 'Fundamentos',
    itens: [
      { nome: 'Internet & Fundamentos da Web', nivel: 'Intermediário' },
      { nome: 'Pensamento Computacional', nivel: 'Intermediário' },
    ],
  },
  {
    categoria: 'Desenvolvimento',
    itens: [
      { nome: 'HTML & CSS', nivel: 'Intermediário' },
      { nome: 'JavaScript', nivel: 'Intermediário' },
      { nome: 'React', nivel: 'Intermediário' },
      { nome: 'Python', nivel: 'Iniciante' },
      { nome: 'PHP', nivel: 'Intermediário' },
      { nome: 'SQL · PostgreSQL · MySQL', nivel: 'Iniciante' },
    ],
  },
]

// Links sociais do card de perfil
const LINKS_SOCIAIS = [
  { label: 'Gh', href: 'https://github.com/MateusLima00', ariaLabel: 'GitHub de Mateus Lima' },
  { label: 'Li', href: 'https://www.linkedin.com/in/mateus-costa-3b5960207/', ariaLabel: 'LinkedIn de Mateus Lima' },
  { label: 'Ig', href: 'https://www.instagram.com/mateuslmx_?igsh=eXQ3YzNtODR2MWo0&utm_source=qr', ariaLabel: 'Instagram de Mateus Lima' },
]

// Skills exibidas no card de perfil
const SKILLS_PERFIL = ['React', 'JavaScript', 'Python', 'Redes', 'Linux']

function Informacoes() {
  const [abaAtiva, setAbaAtiva] = useState('experiencias')

  return (
    <section id="informacoes">
      <div className="secao__container">
        <h2 className="secao__titulo" data-index="[01]">Informações</h2>

        <div className="informacoes__grid">
          {/* ── Coluna esquerda: tabs ── */}
          <div>
            <ul
              className="tabs__lista"
              role="tablist"
              aria-label="Seções de informações"
            >
              <li
                role="tab"
                id="aba-experiencias"
                aria-selected={abaAtiva === 'experiencias'}
                aria-controls="painel-experiencias"
                tabIndex={abaAtiva === 'experiencias' ? 0 : -1}
                className={`tabs__item ${abaAtiva === 'experiencias' ? 'tabs__item--ativo' : ''}`}
                onClick={() => setAbaAtiva('experiencias')}
                onKeyDown={e => e.key === 'Enter' && setAbaAtiva('experiencias')}
              >
                Experiências
              </li>
              <li
                role="tab"
                id="aba-conhecimentos"
                aria-selected={abaAtiva === 'conhecimentos'}
                aria-controls="painel-conhecimentos"
                tabIndex={abaAtiva === 'conhecimentos' ? 0 : -1}
                className={`tabs__item ${abaAtiva === 'conhecimentos' ? 'tabs__item--ativo' : ''}`}
                onClick={() => setAbaAtiva('conhecimentos')}
                onKeyDown={e => e.key === 'Enter' && setAbaAtiva('conhecimentos')}
              >
                Conhecimentos
              </li>
            </ul>

            <div className="tabs__painel">
              {/* Painel Experiências */}
              {abaAtiva === 'experiencias' && (
                <div
                  role="tabpanel"
                  id="painel-experiencias"
                  aria-labelledby="aba-experiencias"
                >
                  {EXPERIENCIAS.map(exp => (
                    <div key={exp.empresa} className="exp__item">
                      <h3 className="exp__empresa">{exp.empresa}</h3>
                      {exp.cargos.map(cargo => (
                        <div key={cargo.titulo}>
                          <p className="exp__vaga">— {cargo.titulo}</p>
                          <p className="exp__texto">{cargo.texto}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Painel Conhecimentos */}
              {abaAtiva === 'conhecimentos' && (
                <div
                  role="tabpanel"
                  id="painel-conhecimentos"
                  aria-labelledby="aba-conhecimentos"
                >
                  {CONHECIMENTOS.map(grupo => (
                    <div key={grupo.categoria} className="conhecimento__grupo">
                      <h3 className="conhecimento__categoria">{grupo.categoria}</h3>
                      <ul
                        className="conhecimento__lista"
                        data-reveal="stagger"
                      >
                        {grupo.itens.map(item => (
                          <li
                            key={item.nome}
                            className="conhecimento__item reveal-item"
                            data-reveal-from="right"
                          >
                            <span className="conhecimento__nome">{item.nome}</span>
                            <span className={`conhecimento__nivel nivel--${item.nivel.toLowerCase()}`}>
                              {item.nivel}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Coluna direita: card de perfil ── */}
          <div className="perfil__card">
            <div className="perfil__avatar" aria-hidden="true">ML</div>

            <div>
              <p className="perfil__nome">Mateus Lima</p>
              <p className="perfil__cargo">Analista de TI · Dev</p>
            </div>

            <ul className="perfil__links" aria-label="Redes sociais">
              {LINKS_SOCIAIS.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="perfil__link"
                    aria-label={link.ariaLabel}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <ul className="perfil__skills" aria-label="Principais habilidades">
              {SKILLS_PERFIL.map(skill => (
                <li key={skill} className="perfil__skill">{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Informacoes
