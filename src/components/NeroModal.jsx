/**
 * @component NeroModal
 * @description
 * Modal de documentação interativa para o projeto NERO.
 * 
 * Exibe:
 * - Descrição geral do projeto
 * - Arquitetura de múltiplas IAs (5 provedores com estratégia de fallback)
 * - Limites de rate e tokens de cada IA
 * - Use cases (quando usa qual IA)
 * - Stack técnica
 * 
 * Modal é acessível, responsivo e fecha com ESC / clique no backdrop.
 */

import { useState, useEffect } from 'react'

/**
 * @typedef {Object} IAProvider
 * @property {string} name - Nome exibido da IA
 * @property {string} icon - Emoji/símbolo representativo
 * @property {string} model - Modelo específico
 * @property {string} rateLimit - Limite de requisições
 * @property {string} tokenLimit - Limite de tokens/contexto
 * @property {string} speed - Velocidade de processamento
 * @property {Array<string>} useCases - Para quais tarefas é ideal
 * @property {string} color - Cor tema (HSL)
 * @property {boolean} free - Se oferece tier gratuito
 */

/**
 * @constant {Array<IAProvider>} AI_PROVIDERS
 * @description
 * Catálogo de IAs integradas no NERO com metadados completos.
 * 
 * ESTRATÉGIA DE MULTI-PROVIDER:
 * 1. Gemini: Raciocínio aprofundado, análise longa
 * 2. Groq: Velocidade extrema, respostas rápidas
 * 3. Cerebras: Processamento de contexto grande (1M tokens)
 * 4. OpenRouter: Escolha de múltiplos modelos
 * 5. Mistral: Qualidade-custo, bom português
 * 
 * FAILOVER: Se um atinge rate limit → próximo na fila
 */
const AI_PROVIDERS = [
  {
    name: 'Gemini 2.5 Pro',
    icon: '🔮',
    model: 'gemini-2.5-pro',
    rateLimit: '1.000 req/dia, 15 req/min',
    tokenLimit: '1M contexto',
    speed: 'Média (2-3s)',
    useCases: [
      'Análise profunda de tarefas',
      'Raciocínio passo a passo',
      'Processamento de documentos longos',
      'Decisões complexas do sistema'
    ],
    color: '199, 89%, 48%',
    free: true
  },
  {
    name: 'Groq Llama 4',
    icon: '⚡',
    model: 'llama-3.1-405b',
    rateLimit: 'Requisições ilimitadas, 30 req/min',
    tokenLimit: '128K contexto',
    speed: 'Ultrarrápido (<500ms)',
    useCases: [
      'Respostas em tempo real via bot Telegram',
      'Processamento de fila de mensagens',
      'Queries rápidas de tarefas',
      'Gamificação (atualizar XP, badges)'
    ],
    color: '280, 100%, 55%',
    free: true
  },
  {
    name: 'Cerebras Scout',
    icon: '🧠',
    model: 'llama-3.1-70b',
    rateLimit: '1M tokens/dia',
    tokenLimit: '200K contexto',
    speed: 'Rápido (1-2s)',
    useCases: [
      'Processamento em batch (relatórios)',
      'Análise de histórico longo',
      'Sintetização de dados',
      'Geração de insights'
    ],
    color: '291, 64%, 42%',
    free: true
  },
  {
    name: 'OpenRouter',
    icon: '🌐',
    model: '50+ modelos disponíveis',
    rateLimit: '50 req/dia free',
    tokenLimit: 'Varia por modelo',
    speed: 'Varia por modelo',
    useCases: [
      'Experimentação com múltiplos modelos',
      'Seleção dinâmica baseada em task',
      'Fallback quando outros atingem limite',
      'Modelos proprietários (GPT, Claude, etc)'
    ],
    color: '3, 100%, 63%',
    free: true
  },
  {
    name: 'Mistral Small',
    icon: '✨',
    model: 'mistral-small-latest',
    rateLimit: '1B tokens/mês',
    tokenLimit: '32K contexto',
    speed: 'Rápido (1s)',
    useCases: [
      'Tarefas do dia a dia',
      'Categorização de dados',
      'Português de alta qualidade',
      'Custo-benefício ótimo'
    ],
    color: '200, 80%, 45%',
    free: true
  }
]

/**
 * @component IACard
 * @description
 * Cartão individual de um provedor de IA.
 * Exibe nome, limite, casos de uso e visual identificador.
 * 
 * @param {Object} props
 * @param {IAProvider} props.provider - Dados do provedor
 * @param {boolean} props.expanded - Se seção está expandida
 * @param {Function} props.onToggle - Callback para expandir/recolher
 * 
 * @returns {JSX.Element}
 */
const IACard = ({ provider, expanded, onToggle }) => (
  <div
    className="ia-card"
    style={{
      '--ia-color': `hsl(${provider.color})`,
      '--ia-light': `hsl(${provider.color}, 0.1)`
    }}
  >
    <button
      className="ia-card__header"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={`ia-${provider.model}`}
    >
      <span className="ia-card__icon">{provider.icon}</span>
      <div className="ia-card__title-group">
        <h4 className="ia-card__name">{provider.name}</h4>
        <p className="ia-card__model">{provider.model}</p>
      </div>
      <span className="ia-card__toggle" aria-hidden="true">
        {expanded ? '−' : '+'}
      </span>
    </button>

    {expanded && (
      <div id={`ia-${provider.model}`} className="ia-card__content">
        <div className="ia-stats">
          <div className="ia-stat">
            <span className="ia-stat__label">Limite de Requisições</span>
            <span className="ia-stat__value">{provider.rateLimit}</span>
          </div>
          <div className="ia-stat">
            <span className="ia-stat__label">Contexto Máximo</span>
            <span className="ia-stat__value">{provider.tokenLimit}</span>
          </div>
          <div className="ia-stat">
            <span className="ia-stat__label">Velocidade</span>
            <span className="ia-stat__value">{provider.speed}</span>
          </div>
        </div>

        <div className="ia-usecases">
          <h5 className="ia-usecases__title">Ideal para:</h5>
          <ul className="ia-usecases__list">
            {provider.useCases.map((useCase, idx) => (
              <li key={idx} className="ia-usecase-item">
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        {provider.free && (
          <div className="ia-badge">
            <span className="ia-badge__icon">✓</span>
            Tier gratuito disponível (sem cartão de crédito)
          </div>
        )}
      </div>
    )}
  </div>
)

/**
 * @component NeroModal
 * @param {Object} props
 * @param {boolean} props.isOpen - Se modal está visível
 * @param {Function} props.onClose - Callback para fechar modal
 * 
 * @returns {JSX.Element|null}
 */
function NeroModal({ isOpen, onClose }) {
  // Controla qual IA está expandida (null = nenhuma)
  const [expandedProvider, setExpandedProvider] = useState(null)

  /**
   * @effect KeyboardClose
   * Permite fechar com tecla ESC
   */
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  /**
   * @effect BackdropFocus
   * Bloqueia scroll do body quando modal está aberto
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            🤖 NERO — Arquitetura Multi-IA
          </h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Fechar documentação"
            title="Fechar (ESC)"
          >
            ✕
          </button>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="modal-body">
          {/* INTRODUÇÃO */}
          <section className="modal-section">
            <h3 className="modal-section__title">Sobre NERO</h3>
            <p className="modal-section__text">
              <strong>NERO</strong> é um assistente pessoal em tempo real que integra
              <strong> 5 provedores de IA diferentes</strong> em uma arquitetura de
              multi-provider. Cada IA é escolhida dinamicamente baseado em:
            </p>
            <ul className="modal-list">
              <li>Complexidade da tarefa (rápida vs análise profunda)</li>
              <li>Disponibilidade de rate limits</li>
              <li>Tamanho do contexto necessário</li>
              <li>Latência aceitável</li>
              <li>Custo-benefício da requisição</li>
            </ul>
          </section>

          {/* ESTRATÉGIA */}
          <section className="modal-section">
            <h3 className="modal-section__title">Estratégia de Rotação</h3>
            <div className="strategy-flow">
              <div className="strategy-step">
                <span className="strategy-step__num">1</span>
                <span className="strategy-step__text">
                  Sistema analisa tipo de tarefa
                </span>
              </div>
              <span className="strategy-arrow">→</span>
              <div className="strategy-step">
                <span className="strategy-step__num">2</span>
                <span className="strategy-step__text">
                  Seleciona IA ideal (próxima disponível)
                </span>
              </div>
              <span className="strategy-arrow">→</span>
              <div className="strategy-step">
                <span className="strategy-step__num">3</span>
                <span className="strategy-step__text">
                  Faz requisição
                </span>
              </div>
              <span className="strategy-arrow">→</span>
              <div className="strategy-step">
                <span className="strategy-step__num">4</span>
                <span className="strategy-step__text">
                  Se rate limit atingido → próxima na fila
                </span>
              </div>
            </div>
          </section>

          {/* PROVEDORES */}
          <section className="modal-section">
            <h3 className="modal-section__title">Provedores Disponíveis</h3>
            <p className="modal-section__subtext">
              Clique em qualquer provedor para ver detalhes e casos de uso ideais.
            </p>

            <div className="ia-cards-grid">
              {AI_PROVIDERS.map((provider) => (
                <IACard
                  key={provider.model}
                  provider={provider}
                  expanded={expandedProvider === provider.model}
                  onToggle={() =>
                    setExpandedProvider(
                      expandedProvider === provider.model
                        ? null
                        : provider.model
                    )
                  }
                />
              ))}
            </div>
          </section>

          {/* DECISÕES DE DESIGN */}
          <section className="modal-section modal-section--highlight">
            <h3 className="modal-section__title">🎯 Por que múltiplas IAs?</h3>
            <div className="decision-grid">
              <div className="decision-item">
                <h5 className="decision-item__title">Flexibilidade</h5>
                <p className="decision-item__text">
                  Cada IA tem força própria. Usar a melhor para cada caso.
                </p>
              </div>
              <div className="decision-item">
                <h5 className="decision-item__title">Confiabilidade</h5>
                <p className="decision-item__text">
                  Se uma IA cai ou atinge limite, fallback automático.
                </p>
              </div>
              <div className="decision-item">
                <h5 className="decision-item__title">Custo</h5>
                <p className="decision-item__text">
                  Freemium de todos = sem cartão, mas funciona completo.
                </p>
              </div>
              <div className="decision-item">
                <h5 className="decision-item__title">Inovação</h5>
                <p className="decision-item__text">
                  Testar novos modelos sem refatorar arquitetura.
                </p>
              </div>
            </div>
          </section>

          {/* STACK TÉCNICA */}
          <section className="modal-section">
            <h3 className="modal-section__title">Stack Técnica</h3>
            <div className="tech-stack">
              <div className="tech-badge">Frontend: React + PWA</div>
              <div className="tech-badge">Backend: Cloudflare Workers</div>
              <div className="tech-badge">Bot: Telegram Bot API</div>
              <div className="tech-badge">Voice: ElevenLabs TTS</div>
              <div className="tech-badge">IAs: 5 provedores gratuitos</div>
              <div className="tech-badge">Storage: Workers KV</div>
            </div>
          </section>

          {/* PRÓXIMOS PASSOS */}
          <section className="modal-section modal-section--footer">
            <h3 className="modal-section__title">Repositório</h3>
            <p className="modal-section__text">
              Este é um projeto <strong>privado</strong>. Para acessar o código:
            </p>
            <div className="code-info">
              <code>github.com/MateusLima00/NERO</code>
              <p style={{ fontSize: '0.85em', marginTop: '0.5rem', opacity: 0.7 }}>
                (Repositório privado — entre em contato para acesso)
              </p>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button
            className="modal-btn modal-btn--secondary"
            onClick={onClose}
          >
            Fechar (ESC)
          </button>
        </div>
      </div>

      <style jsx>{`
        /* OVERLAY */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(2px);
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(2px);
          }
        }

        /* MODAL PRINCIPAL */
        .modal-content {
          background: #0a0e27;
          color: #e4e4e7;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
          max-width: 900px;
          max-height: 85vh;
          width: 90%;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease-out;
          border: 1px solid rgba(255, 193, 7, 0.1);
        }

        @keyframes slideUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* HEADER */
        .modal-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(255, 193, 7, 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .modal-close {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #ffc107;
        }

        /* BODY - SCROLLABLE */
        .modal-body {
          overflow-y: auto;
          padding: 2rem;
          flex: 1;
        }

        /* SECTIONS */
        .modal-section {
          margin-bottom: 2.5rem;
        }

        .modal-section:last-child {
          margin-bottom: 0;
        }

        .modal-section__title {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
          color: #ffc107;
        }

        .modal-section__subtext {
          font-size: 0.9rem;
          color: #9ca3af;
          margin-bottom: 1rem;
        }

        .modal-section__text {
          line-height: 1.6;
          margin-bottom: 1rem;
          color: #d4d4d8;
        }

        .modal-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0 0 0;
        }

        .modal-list li {
          padding: 0.5rem 0 0.5rem 1.5rem;
          position: relative;
          color: #d4d4d8;
        }

        .modal-list li:before {
          content: '▸';
          position: absolute;
          left: 0;
          color: #ffc107;
        }

        /* HIGHLIGHT SECTION */
        .modal-section--highlight {
          background: rgba(255, 193, 7, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 3px solid #ffc107;
        }

        /* DECISION GRID */
        .decision-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .decision-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 193, 7, 0.1);
        }

        .decision-item__title {
          margin: 0 0 0.5rem 0;
          color: #ffc107;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .decision-item__text {
          margin: 0;
          font-size: 0.85rem;
          color: #9ca3af;
          line-height: 1.5;
        }

        /* STRATEGY FLOW */
        .strategy-flow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 1.5rem;
        }

        .strategy-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 193, 7, 0.05);
          padding: 0.75rem 1rem;
          border-radius: 6px;
          border: 1px solid rgba(255, 193, 7, 0.1);
          flex: 1;
          min-width: 140px;
        }

        .strategy-step__num {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: #ffc107;
          color: #0a0e27;
          font-weight: 600;
          border-radius: 50%;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .strategy-step__text {
          font-size: 0.85rem;
          color: #d4d4d8;
        }

        .strategy-arrow {
          color: #9ca3af;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        /* IA CARDS */
        .ia-cards-grid {
          display: grid;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .ia-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--ia-light);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .ia-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: hsl(var(--ia-color), 0.3);
        }

        .ia-card__header {
          width: 100%;
          padding: 1rem;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: background 0.2s;
          text-align: left;
          color: inherit;
          font-size: inherit;
          font-family: inherit;
        }

        .ia-card__header:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .ia-card__icon {
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .ia-card__title-group {
          flex: 1;
          min-width: 0;
        }

        .ia-card__name {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: hsl(var(--ia-color));
        }

        .ia-card__model {
          margin: 0.25rem 0 0 0;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .ia-card__toggle {
          font-size: 1.25rem;
          color: #9ca3af;
          flex-shrink: 0;
        }

        /* CONTEÚDO EXPANDIDO */
        .ia-card__content {
          padding: 0 1rem 1rem 1rem;
          border-top: 1px solid var(--ia-light);
          animation: expandDown 0.2s ease-out;
        }

        @keyframes expandDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 1000px;
          }
        }

        /* IA STATS */
        .ia-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .ia-stat {
          background: rgba(255, 255, 255, 0.03);
          padding: 0.75rem;
          border-radius: 4px;
          border-left: 2px solid hsl(var(--ia-color));
        }

        .ia-stat__label {
          display: block;
          font-size: 0.75rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.25rem;
        }

        .ia-stat__value {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #e4e4e7;
        }

        /* IA USE CASES */
        .ia-usecases {
          margin-bottom: 1rem;
        }

        .ia-usecases__title {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #d4d4d8;
        }

        .ia-usecases__list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .ia-usecase-item {
          font-size: 0.85rem;
          color: #9ca3af;
          padding-left: 0.75rem;
          position: relative;
        }

        .ia-usecase-item:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: hsl(var(--ia-color));
          font-weight: 600;
        }

        /* IA BADGE */
        .ia-badge {
          background: rgba(132, 204, 22, 0.1);
          color: #84cc16;
          border: 1px solid rgba(132, 204, 22, 0.2);
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ia-badge__icon {
          font-weight: 600;
        }

        /* TECH STACK */
        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .tech-badge {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.2);
          color: #ffc107;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* CODE INFO */
        .code-info {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 6px;
          border-left: 3px solid #ffc107;
          margin-top: 1rem;
        }

        .code-info code {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          color: #ffc107;
        }

        /* FOOTER */
        .modal-footer {
          padding: 1rem 2rem;
          border-top: 1px solid rgba(255, 193, 7, 0.2);
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          flex-shrink: 0;
        }

        .modal-btn {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          border: none;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-btn--secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #e4e4e7;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-btn--secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* MODAL SECTION FOOTER */
        .modal-section--footer {
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 193, 7, 0.1);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .modal-content {
            max-height: 90vh;
            width: 95%;
          }

          .modal-body {
            padding: 1.5rem;
          }

          .modal-header {
            padding: 1rem 1.5rem;
          }

          .modal-footer {
            padding: 1rem 1.5rem;
          }

          .strategy-flow {
            flex-direction: column;
          }

          .strategy-arrow {
            transform: rotate(90deg);
            margin: 0.25rem 0;
          }

          .decision-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default NeroModal