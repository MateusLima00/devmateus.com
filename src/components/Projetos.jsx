/**
 * @component Projetos
 * @description
 * Seção de portfolio que renderiza um grid responsivo (2 colunas) de projetos
 * com suporte a preview flutuante no cursor (desktop) e modal interativo para
 * projetos com documentação.
 *
 * @architecture
 * - Separação clara entre dados (PROJETOS) e apresentação (JSX)
 * - Hook customizado useCursorPreview para lógica de preview descentralizada
 * - Estado mínimo (apenas isTouch e neroOpen) para melhor performance
 * - Renderização condicional segura de links (nunca renderiza href={null})
 *
 * @dependencies
 * - react: useState, useEffect hooks
 * - ./CursorPreview.jsx: Componente de preview flutuante
 * - ./NeroModal.jsx: Modal dedicado para documentação do NERO
 * - ../hooks/useCursorPreview: Hook customizado para interação cursor-preview
 */

import { useState, useEffect } from 'react'
import CursorPreview from './CursorPreview.jsx'
import NeroModal from './NeroModal.jsx'
import { useCursorPreview } from '../hooks/useCursorPreview'

// ──────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ──────────────────────────────────────────────────────────────────────────

/**
 * @constant {string} SECTION_ID
 * @description ID do elemento section para referência no DOM e navegação
 */
const SECTION_ID = 'projetos'

/**
 * @constant {string} SECTION_INDEX
 * @description Índice da seção no portfolio (usado para badge [02])
 */
const SECTION_INDEX = '[02]'

/**
 * @constant {number} GRID_REVEAL_DELAY
 * @description Delay em ms entre revelação de cada card (stagger animation)
 */
const GRID_REVEAL_DELAY = 100

/**
 * @constant {Object} LINK_ICONS
 * @description Mapeamento de tipos de link para seus ícones/labels unicode
 */
const LINK_ICONS = {
  demo: '↗',
  codigo: '⌥',
  docs: '↳'
}

/**
 * @constant {Object} ARIA_LABELS
 * @description Template para acessibilidade (ARIA labels) - mantém consistência
 */
const ARIA_LABELS = {
  demo: (titulo) => `Ver demo de ${titulo}`,
  codigo: (titulo) => `Ver código de ${titulo} no GitHub`,
  docs: (titulo) => `Ver documentação de ${titulo}`
}

// ──────────────────────────────────────────────────────────────────────────
// BASE DE DADOS DE PROJETOS
// ──────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Projeto
 * @property {number} id - Identificador único do projeto
 * @property {string} titulo - Título exibido do projeto
 * @property {string} descricao - Descrição breve (2-3 linhas máximo)
 * @property {Array<string>} tecnologias - Stack técnica utilizada
 * @property {string|null} linkDemo - URL da demo (null se não disponível)
 * @property {string|null} linkRepo - URL do repositório (null se privado)
 * @property {boolean|null} linkDocs - Flag para habilitar modal de docs
 * @property {string} previewImg - Caminho para imagem/SVG de preview
 */

/**
 * @constant {Array<Projeto>} PROJETOS
 * @description
 * Catálogo de projetos do portfolio. Cada projeto é um objeto self-contained
 * que define sua própria navegação, descrição e assets de preview.
 *
 * NOTA: A ordem aqui define a ordem de renderização (0-indexed, mas display é 1-indexed).
 * URLs null indicam projeto não publicado/repositório privado/demo indisponível.
 *
 * @architecture_note_NERO
 * O projeto NERO implementa padrão de MULTI-PROVIDER de IAs:
 *   • Gemini 2.5 Pro: 1.000 req/dia, 15 req/min, 1M contexto
 *   • Groq Llama 4: Requests ilimitadas, 30 req/min
 *   • Cerebras Scout: 1M tokens/dia, 2.600 t/s
 *   • OpenRouter: 50 req/dia free + 50+ modelos
 *   • Mistral Small: 1B tokens/mês, alta qualidade
 * 
 * Strategy: Rotaciona entre provedores baseado em rate limits e custo.
 * Fallback automático se um provedor atingir limite.
 *
 * @validation
 * - Cada ID deve ser único e sequencial
 * - linkDocs deve ser boolean (true/false), nunca string
 * - previewImg deve existir em /public/img/previews/
 */
const PROJETOS = [
  {
    id: 1,
    titulo: 'Variação Dólar em Real',
    descricao: 'Aplicação web que exibe a variação do dólar e euro em tempo real frente ao Real, consumindo API de câmbio e apresentando os dados com gráficos interativos.',
    tecnologias: ['JavaScript', 'HTML', 'CSS', 'API de câmbio'],
    linkDemo: 'https://variacao-dolar-em-real.vercel.app',
    linkRepo: 'https://github.com/MateusLima00/variacao_dolar_em_real',
    linkDocs: false,
    previewImg: '/img/previews/projeto-1.svg',
  },
  {
    id: 2,
    titulo: 'Coletar AFD',
    descricao: 'Script Python para automatizar o download e envio de arquivos AFD (Arquivo Fonte de Dados) de relógios de ponto, eliminando processo manual e recorrente.',
    tecnologias: ['Python', 'Automação', 'Script'],
    linkDemo: null,
    linkRepo: 'https://github.com/MateusLima00/Coletar-AFD-',
    linkDocs: false,
    previewImg: '/img/previews/projeto-2.svg',
  },
  {
    id: 3,
    titulo: 'FreelaTracker',
    descricao: 'Plataforma full-stack para freelancers gerenciarem projetos, tempo, entregas e pagamentos — com portal dedicado para o cliente acompanhar tudo em tempo real.',
    tecnologias: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    linkDemo: null,
    linkRepo: null,
    linkDocs: false,
    previewImg: '/img/previews/projeto-3.svg',
  },
  {
    id: 4,
    titulo: 'NERO',
    descricao: 'PWA mobile-first de assistente pessoal com multi-IA (Gemini, Groq, Cerebras, OpenRouter, Mistral), gamificação e bot Telegram. Gerencia tarefas, hábitos, finanças, treinos com XP, missões e respostas por voz via ElevenLabs.',
    tecnologias: [
      'JavaScript',
      'Cloudflare Workers',
      'PWA',
      'Telegram Bot',
      'ElevenLabs TTS',
      'Gemini 2.5 Pro',
      'Groq Llama 4',
      'Cerebras Scout',
      'OpenRouter',
      'Mistral Small'
    ],
    linkDemo: null,
    linkRepo: null,
    linkDocs: true,
    previewImg: '/img/previews/projeto-nero.svg',
  },
]

// ──────────────────────────────────────────────────────────────────────────
// COMPONENTES AUXILIARES (Renderização Condicional)
// ──────────────────────────────────────────────────────────────────────────

/**
 * @component ProjetoLinks
 * @description
 * Renderiza o grupo de links do projeto (demo, código, documentação).
 * Implementa renderização condicional segura: só renderiza links disponíveis
 * (nunca href={null}). Botão de docs dispara estado do modal.
 *
 * DECISÃO ARQUITETURAL:
 * Separado em componente próprio para:
 * 1. Reduzir complexidade do JSX principal
 * 2. Facilitar manutenção (mudanças em links ficam localizadas)
 * 3. Reutilizar em outros contextos se necessário
 *
 * @param {Object} props
 * @param {Projeto} props.projeto - Objeto do projeto contendo links e metadados
 * @param {Function} props.onDocsClick - Callback quando "docs" é clicado
 *
 * @returns {JSX.Element} Fragment com links seguros
 */
const ProjetoLinks = ({ projeto, onDocsClick }) => (
  <div className="projeto__links">
    {/* 
      Link de DEMO
      ─────────────────────────────────────────────────
      Renderiza APENAS se linkDemo existe (não é null/undefined/false).
      Abre em nova aba com segurança apropriada.
      Classe especial "projeto__link--demo" para styling diferenciado.
    */}
    {projeto.linkDemo && (
      <a
        href={projeto.linkDemo}
        target="_blank"
        rel="noopener noreferrer"
        className="projeto__link projeto__link--demo"
        aria-label={ARIA_LABELS.demo(projeto.titulo)}
        title={`Acessar demo de ${projeto.titulo}`}
      >
        {LINK_ICONS.demo} demo
      </a>
    )}

    {/* 
      Link de CÓDIGO (GitHub)
      ─────────────────────────────────────────────────
      Renderiza APENAS se linkRepo existe.
      FIX CRÍTICO: Sem condicional anterior, linkRepo={null} quebrava.
      rel="noopener noreferrer" previne acesso a window.opener por segurança.
    */}
    {projeto.linkRepo && (
      <a
        href={projeto.linkRepo}
        target="_blank"
        rel="noopener noreferrer"
        className="projeto__link"
        aria-label={ARIA_LABELS.codigo(projeto.titulo)}
        title={`Ver repositório GitHub de ${projeto.titulo}`}
      >
        {LINK_ICONS.codigo} código
      </a>
    )}

    {/* 
      Botão de DOCUMENTAÇÃO
      ─────────────────────────────────────────────────
      Renderiza APENAS se projeto.linkDocs === true.
      Diferente dos links: é um <button>, não <a>, porque abre modal local.
      Dispara callback onDocsClick para atualizar estado do modal no parent.
    */}
    {projeto.linkDocs && (
      <button
        onClick={onDocsClick}
        className="projeto__link"
        type="button"
        aria-label={ARIA_LABELS.docs(projeto.titulo)}
        title={`Abrir documentação de ${projeto.titulo}`}
      >
        {LINK_ICONS.docs} docs
      </button>
    )}
  </div>
)

/**
 * @component ProjetoTags
 * @description
 * Lista de tags de tecnologias. Separado em componente para clareza,
 * testabilidade isolada e eventual reutilização em badges/charts.
 *
 * Cada tag é imutável e renderizada sem state. O key={tech} é seguro
 * porque nenhuma tech se repete dentro de um projeto (atuação como ID).
 *
 * @param {Object} props
 * @param {Array<string>} props.tecnologias - Lista de techs (ex: ['React', 'TypeScript'])
 *
 * @returns {JSX.Element} Container com tags
 */
const ProjetoTags = ({ tecnologias }) => (
  <div className="projeto__tags">
    {tecnologias.map((tech) => (
      <span key={tech} className="projeto__tag">
        {tech}
      </span>
    ))}
  </div>
)

// ──────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────────────────────

/**
 * @component Projetos
 *
 * @description
 * Renderiza a seção [02] Projetos do portfolio. Grid responsivo com:
 * 1. Preview flutuante no cursor (desktop) via hook customizado
 * 2. Detecção automática de device (touch vs pointer)
 * 3. Modal de documentação para projeto NERO
 * 4. Renderização condicional segura de links
 *
 * @hooks
 * - useState: Gerencia isTouch (device detection) e neroOpen (modal state)
 * - useEffect: Setup de media query listener para responsividade
 * - useCursorPreview: Lógica descentralizada de preview e cursor tracking
 *
 * @state
 * - isTouch {boolean}
 *   Indica se dispositivo suporta hover (false = pointer, true = touch only).
 *   Usado para desativar preview flutuante em mobile.
 *
 * - neroOpen {boolean}
 *   Controla se modal de documentação do NERO está aberto.
 *   True = modal visível, False = modal hidden.
 *
 * @performance
 * - Renderização do grid é otimizada via key={projeto.id}
 * - Event handlers (onMouseEnter, etc) são condicionais (não executam em touch)
 * - Media query listener é removido no cleanup (useEffect return) → sem memory leaks
 * - Componentes auxiliares (ProjetoLinks, ProjetoTags) não causam re-renders extras
 *   pois recebem props estáveis (objetos de PROJETOS)
 *
 * @accessibility
 * - Cada link tem aria-label apropriado e title para tooltip
 * - Links externos têm rel="noopener noreferrer" para segurança
 * - Semantic HTML: <section>, <article>, <h2>, <h3>, <p>
 * - Botão de docs tem type="button" explícito para clarity
 *
 * @returns {JSX.Element} Seção com grid de projetos + componentes auxiliares
 */
function Projetos() {
  // ─────────────────────────────────────────────────────────────────────
  // HOOKS & STATE
  // ─────────────────────────────────────────────────────────────────────

  // Hook customizado para lógica de preview no cursor
  const { preview, elRef, handlers } = useCursorPreview()

  // Detecta se é device touch (mobile/tablet) ou pointer-based (desktop)
  const [isTouch, setIsTouch] = useState(false)

  // Controla visibilidade do modal de documentação (NERO)
  const [neroOpen, setNeroOpen] = useState(false)

  // ─────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────

  /**
   * @effect DeviceDetection
   * @description
   * Detecta se dispositivo suporta "hover" (pointer-based vs touch-only).
   * Essencial para ativar/desativar preview flutuante e event handlers.
   *
   * LÓGICA:
   * - Media query "(hover: none)" retorna true em touch devices
   * - Retorna false em devices com pointer/trackpad (desktop)
   *
   * LISTENER DINÂMICO:
   * - Mantém listener ativo para adaptar quando device muda
   *   (ex: tablet que conecta/desconecta mouse Bluetooth)
   * - Cleanup remove listener ao desmontar (previne memory leaks)
   *
   * @dependency [] - Executa uma vez ao montar (setup inicial)
   */
  useEffect(() => {
    // Cria media query para detecção de suporte a hover
    const mediaQuery = window.matchMedia('(hover: none)')

    // Define estado inicial baseado na media query atual
    setIsTouch(mediaQuery.matches)

    // Cria handler que atualiza state quando media query muda
    const handleChange = (event) => {
      setIsTouch(event.matches)
    }

    // Registra listener para mudanças de media query
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup: Remove listener ao desmontar para evitar memory leak
    // Sem isso, listener persistiria mesmo após componente ser removido do DOM
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // ─────────────────────────────────────────────────────────────────────
  // EVENT HANDLERS
  // ─────────────────────────────────────────────────────────────────────

  /**
   * @function handleNeroDocsClick
   * @description
   * Callback disparado quando usuário clica no botão "docs" do NERO.
   * Simplesmente abre o modal (setNeroOpen = true).
   *
   * Separado como named function para clarity e facilitar debug.
   */
  const handleNeroDocsClick = () => {
    setNeroOpen(true)
  }

  /**
   * @function handleModalClose
   * @description
   * Callback disparado quando modal pede para fechar.
   * Pode vir do botão X, clique no backdrop, ou tecla ESC.
   */
  const handleModalClose = () => {
    setNeroOpen(false)
  }

  // ─────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────

  return (
    <section id={SECTION_ID} className="secao">
      <div className="secao__container">
        {/* 
          CABEÇALHO DA SEÇÃO
          Índice [02] usado para navegação e visual hierarchy
        */}
        <h2 className="secao__titulo" data-index={SECTION_INDEX}>
          Projetos
        </h2>

        {/* 
          GRID PRINCIPAL
          ─────────────────────────────────────────────
          Atributo data-reveal="stagger" dispara animação de revelação
          cascata (cada item com delay de GRID_REVEAL_DELAY ms).
          
          data-stagger-ms permite que CSS/JS detecte o delay configurado.
        */}
        <div
          className="projetos__grid"
          data-reveal="stagger"
          data-stagger-ms={GRID_REVEAL_DELAY}
        >
          {/* 
            MAPEAMENTO DE PROJETOS
            ─────────────────────────────────────────────
            Itera sobre PROJETOS (constante) e renderiza cada um como <article>.
            key={projeto.id} é obrigatório para React rastrear identidade de cada item.
          */}
          {PROJETOS.map((projeto, index) => (
            <article
              key={projeto.id}
              className="projeto__card reveal-item"
              data-reveal-from="up"
              data-project-id={projeto.id}
              // ─── INTERAÇÃO COM PREVIEW ───
              // Eventos de mouse APENAS se não for touch device (isTouch === false)
              // Em touch, esses handlers nunca são attachados (undefined)
              onMouseEnter={
                !isTouch
                  ? () => handlers.onMouseEnter(projeto.previewImg)
                  : undefined
              }
              onMouseLeave={!isTouch ? handlers.onMouseLeave : undefined}
              onMouseMove={!isTouch ? handlers.onMouseMove : undefined}
            >
              {/* 
                NÚMERO SEQUENCIAL
                Exibe como "001 ·", "002 ·", etc.
                padStart(3, '0') garante 3 dígitos com zero padding.
              */}
              <span className="projeto__numero">
                {String(index + 1).padStart(3, '0')} ·
              </span>

              {/* TÍTULO DO PROJETO */}
              <h3 className="projeto__titulo">{projeto.titulo}</h3>

              {/* DESCRIÇÃO BREVE (2-3 linhas máximo) */}
              <p className="projeto__descricao">{projeto.descricao}</p>

              {/* STACK TÉCNICA (componente separado) */}
              <ProjetoTags tecnologias={projeto.tecnologias} />

              {/* 
                LINKS DE AÇÃO
                Renderiza demo, código, docs com lógica condicional segura.
                Callback onDocsClick abre modal quando NERO é selecionado.
              */}
              <ProjetoLinks
                projeto={projeto}
                onDocsClick={handleNeroDocsClick}
              />
            </article>
          ))}
        </div>
      </div>

      {/* 
        PREVIEW FLUTUANTE
        ─────────────────────────────────────────────
        Renderiza em background e segue cursor em desktop.
        Gerenciado por hook useCursorPreview (preview.src, preview.visible, elRef).
        Invisível em touch devices pois handlers.onMouseEnter nunca é chamado.
      */}
      <CursorPreview
        src={preview.src}
        visible={preview.visible}
        elRef={elRef}
      />

      {/* 
        MODAL DE DOCUMENTAÇÃO
        ─────────────────────────────────────────────
        Abre quando usuario clica "docs" no NERO.
        isOpen controla visibilidade, onClose fecha modal.
      */}
      <NeroModal isOpen={neroOpen} onClose={handleModalClose} />
    </section>
  )
}

export default Projetos