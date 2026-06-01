# devmateus.com — Portfólio Pessoal

## Stack
React 18 + Vite 6 + CSS puro (sem Tailwind, sem UI libs) + Three.js 0.184

---

## Design — Terminal Brutalist

- Fundo: `#0a0a0a` / cena 3D Three.js cobrindo 100% do viewport
- Tipografia principal: `Space Mono` (monospace)
- Cor de destaque: azul elétrico `#4d9fff`
- Zero gradientes decorativos, zero efeitos neon, zero cards genéricos

---

## Permissões e Modo de Operação

Execução autônoma total. Execute diretamente, sem perguntar:
- Criar, editar, renomear e deletar qualquer arquivo do projeto
- Instalar e desinstalar dependências via npm
- Rodar comandos de build, dev e preview
- Refatorar e reescrever componentes inteiros

Só pare e informe se o problema exigir uma decisão que dependa de informação que você não tem.

---

## Dependências (`package.json`)

```json
"dependencies": {
  "prop-types": "^15.8.1",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "swiper": "^12.1.4",
  "three": "^0.184.0"
},
"devDependencies": {
  "@vitejs/plugin-react": "^4.2.0",
  "vite": "^6.3.5"
}
```

> `swiper` ainda está instalado mas não é usado — pode ser removido.
> `three` é usado pelo `UniversoCanvas.jsx`.

---

## Estrutura de Arquivos — Estado Atual

```
devmateus.com/
├── index.html
├── package.json
├── vite.config.js
├── CLAUDE.md
├── public/
│   └── img/
│       ├── IMG_7889.PNG
│       ├── favicon.svg
│       ├── instagram_779093 1.png
│       ├── linkedin_2585158 1.png
│       ├── github_779088 1.png
│       ├── Certificado Front-End react.png
│       ├── Certificado Python.png
│       ├── HTML e CSS resnpo.png
│       ├── HTML e CSS praticando HTMLCSS.png
│       ├── HTML e CSS Classes posicionamento e Flexbox.png
│       ├── HTML e CSS cabecalho footer e variaveis CSS.png
│       ├── HTML e CSS ambientes de desenvolvimento.png
│       ├── programação com JavaScript.png
│       └── previews/
│           ├── projeto-1.svg   ← placeholder SVG projeto Variação Dólar
│           └── projeto-2.svg   ← placeholder SVG projeto Coletar AFD
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── Cabecalho.jsx
    │   ├── Sobre.jsx
    │   ├── Informacoes.jsx
    │   ├── Projetos.jsx
    │   ├── Certificados.jsx
    │   ├── Modal.jsx
    │   ├── Rodape.jsx
    │   ├── UniversoCanvas.jsx
    │   └── CursorPreview.jsx
    ├── hooks/
    │   ├── useReveal.js
    │   ├── useMagnetic.js
    │   ├── useCursorPreview.js
    │   └── useMouseParallax.js
    ├── data/
    │   └── certificados.json
    └── style/
        ├── reset.css          ← importado
        ├── variables.css      ← importado
        ├── layout.css         ← importado
        ├── components.css     ← importado
        ├── animations.css     ← importado
        ├── universe.css       ← importado
        ├── princi.css         ← legado, NÃO importado
        ├── projetos.css       ← legado, NÃO importado
        └── cards-react.css    ← legado, NÃO importado
```

### Ordem de importação CSS em `main.jsx`
`reset.css` → `variables.css` → `layout.css` → `components.css` → `animations.css` → `universe.css`

---

## Detalhamento dos Arquivos

### `src/App.jsx`
- Monta layout global: `<UniversoCanvas />` (fixo, z-index 0) + `<div className="app-wrapper">` (z-index 1)
- Dentro do wrapper: `<Cabecalho>` + `<main>` + `<Rodape>`
- `<main>`: `<Sobre>` + `<Informacoes>` + `<Projetos>` + `<Certificados>`
- `useReveal()` chamado no topo
- `useEffect` com listener de `mousemove` que seta `--mouse-x` / `--mouse-y` no `:root`

---

### `src/components/Cabecalho.jsx`
Nav fixa com:
- Logo `devmateus<span>.com</span>` com link `href="#"` e `aria-label="Ir ao início"`
- Links âncora: `#informacoes`, `#projetos`, `#certificados`
- Semântica: `<header>` + `<nav aria-label="Navegação principal">`
- CSS: `position: fixed`, `backdrop-filter: blur(12px)`, `border-bottom: 1px solid #1e1e1e`

---

### `src/components/Sobre.jsx`
Hero com:
- **Constante `TICKER_ITEMS`** no topo: `['React', 'JavaScript', 'Python', 'HTML', 'CSS', 'Node.js', 'PostgreSQL', 'MySQL', 'Linux', 'MikroTik', 'Redes', 'CFTV', 'Vite', 'Git', 'GitHub']`
- Grid 2 colunas:
  - Esquerda: tag `// portfolio`, nome `Mateus Lima`, cargo `_ Analista de TI & Dev Front-End`, descrição, dois botões
  - Direita: métricas `3+ anos em TI` e `8+ certificados`
- Botões `.btn-solid` e `.btn-ghost` com `useMagnetic` aplicado
- Ticker: `<div className="ticker">` com `<div className="ticker__track">` — itens duplicados para loop infinito
- `<section className="hero">` + ticker separado (não dentro da section)

---

### `src/components/Informacoes.jsx`
Seção `[01]` com:

**Constante `EXPERIENCIAS`** (3 empresas, ordem: mais recente primeiro):
1. **Sistema de Gestão de Guias Médicas**
   - Cargo: Desenvolvedor Freelancer — Contrato (05/2026)
   - Atividades: auditoria de segurança PHP legado (20 vulnerabilidades), relatório LGPD, mapeamento de 15 módulos, correção de SQL Injection/credenciais hardcoded/upload sem validação/backup exposto, proposta Laravel 8.2 + Livewire + Tailwind + MySQL
2. **Unilink Transportes Integrados Ltda**
   - Assistente de TI (Atual): automatização Python, sistema web Porto do Pecém, API Autotrac/ATIC, PostgreSQL + Postman, ERP Protheus, servidores/firewall/redes, suporte N1/N2, painel AppScript Google Sheets
   - Estagiário de TI: suporte técnico, redes MikroTik, servidores, firewall, CFTV
   - Aprendiz de TI: suporte, manutenção preventiva, formatação
3. **Atacadão Led**
   - Estagiário de TI: suporte, hardware/software, formatação

**Constante `CONHECIMENTOS`** (3 categorias):
- Infraestrutura & Redes: Manutenção de Computadores (Avançado), Cabeamento Estruturado (Avançado), CFTV (Avançado), Administração de Servidores e Firewall (Intermediário), Linux (Intermediário)
- Desenvolvimento: HTML & CSS (Intermediário), JavaScript (Intermediário), React (Intermediário), Python (Iniciante), PHP (Intermediário), SQL · PostgreSQL · MySQL (Iniciante)
- Geral: Informática Geral (Avançado)

**Constante `LINKS_SOCIAIS`**: gh → GitHub, in → LinkedIn, ig → `#` (sem link ainda)

**Constante `SKILLS_PERFIL`**: `['React', 'JavaScript', 'Python', 'Redes', 'Linux']`

Estado: `abaAtiva` — `'experiencias'` | `'conhecimentos'`

Acessibilidade: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`

---

### `src/components/Projetos.jsx`
Seção `[02]` com:

**Constante `PROJETOS`** (hardcoded no arquivo, não em arquivo separado):
```js
[
  {
    id: 1,
    titulo: 'Variação Dólar em Real',
    descricao: '...',
    tecnologias: ['JavaScript', 'HTML', 'CSS', 'API de câmbio'],
    linkDemo: 'https://variacao-dolar-em-real.vercel.app',
    linkRepo: 'https://github.com/MateusLima00/variacao_dolar_em_real',
    previewImg: '/img/previews/projeto-1.svg',
  },
  {
    id: 2,
    titulo: 'Coletar AFD',
    descricao: '...',
    tecnologias: ['Python', 'Automação', 'Script'],
    linkDemo: null,
    linkRepo: 'https://github.com/MateusLima00/Coletar-AFD-',
    previewImg: '/img/previews/projeto-2.svg',
  },
]
```

- Grid 2 colunas com `data-reveal="stagger"` e `data-stagger-ms="100"`
- Floating preview via `useCursorPreview` + `<CursorPreview>` (portal)
- Card tem: número `001 ·`, título, descrição, tags, links demo/repo

Para adicionar projeto: adicionar objeto em `PROJETOS` + imagem em `/public/img/previews/projeto-{id}.svg` (ou `.png`)

---

### `src/components/Certificados.jsx`
Seção `[03]` com:
- Dados de `src/data/certificados.json` (8 certificados)
- Estado: `busca` (string) + `modalAberto` (objeto | null)
- Busca em tempo real filtrando por `titulo` ou `tags`
- Grid 3 colunas com `data-reveal="stagger"` e `data-stagger-ms="60"`
- Cards alternam `data-reveal-from="left"` e `"right"` por linha (`Math.floor(index/3) % 2`)
- Cada card é `<button>` abrindo `<Modal>` ao clicar
- Floating preview via `useCursorPreview` + `<CursorPreview>` — mostra imagem do certificado
- Swiper foi removido (pacote ainda instalado, mas não importado)

---

### `src/components/Modal.jsx`
Modal de detalhes do certificado:
- Props: `{ cert, onFechar }` (PropTypes definidos)
- Fecha com: botão ✕, clique no overlay, tecla `Escape`
- Acessibilidade: `role="dialog"`, `aria-modal`, `aria-labelledby`, foco automático no botão ao abrir
- Mostra: imagem grande, título, data, horas, tags

---

### `src/components/Rodape.jsx`
Footer com:
- **Constante `ANO`**: `new Date().getFullYear()` — dinâmico
- **Constante `LINKS`**: github, linkedin, instagram (instagram ainda em `#`)
- Flex row: identidade `devmateus.com — Fortaleza / CE · {ANO}` + links sociais
- `useMagnetic` aplicado em cada link (strength 0.25)

---

### `src/components/UniversoCanvas.jsx`
Canvas Three.js fixo (`position: fixed; inset: 0; z-index: 0`).

**Renderer**: WebGLRenderer, ACESFilmicToneMapping, exposure 0.8, fundo `#00000a`

**Câmera**: PerspectiveCamera fov 75, posição inicial `(0, 8, 50)`, lookAt origin

**Iluminação**:
- PointLight sol: `0xfff5cc`, intensidade 8.0, range 800, posição `(80, 60, -120)` — pulsa levemente no loop
- PointLight fill: `0x1a2a4a`, intensidade 2.5, range 1000, posição `(-200, -80, -200)`
- PointLight borda: `0x0044aa`, intensidade 3.0, range 600, posição `(-100, 200, -50)`
- AmbientLight: `0x111122`, intensidade 0.8

**Estrelas — 3 camadas**:
- Camada 1: 12.000 pontos, raio 800, opacity 0.60 (fundo distante)
- Camada 2: 5.000 pontos, raio 400, opacity 0.85 (médias)
- Camada 3: 800 pontos, raio 150, opacity 1.0 (próximas, brilhantes)
- Distribuição esférica uniforme, `vertexColors: true`, sprites com bloom manual

**Via Láctea**: 3 grupos — faixa densa 18k pontos, núcleo central 4k pontos amarelados, halo externo 5k pontos. Rotação `z = Math.PI * 0.15`

**Nebulosas — 4** (sub-nuvens deslocadas + filamentos Bezier 3D):
1. Roxa: posição `(-80, 30, -100)`, spread 100
2. Azul: posição `(100, -20, -200)`, spread 120
3. Laranja: posição `(-60, -80, -300)`, spread 110
4. Verde: posição `(80, -150, -380)`, spread 100

Cada nebulosa: 8 sub-nuvens gaussianas + 22 filamentos Bezier curvos + estrelas jovens embutidas. Animação: rotação lenta + pulso de escala + variação de opacidade.

**Galáxias — 8** com braços espirais logarítmicos:
- Estrutura: núcleo denso + 2 braços em espiral + halo difuso
- Espalhadas de z=-550 a z=-900
- Rotação lenta e contínua no loop

**Sol** (posição `(80, 60, -120)`):
- Núcleo MeshBasicMaterial `#ffee44`, raio 6
- 3 coronas semitransparentes pulsando com fases diferentes
- 12 sprites de protuberâncias orbitando
- 8 raios de luz (`LineSegments`)
- 2.000 partículas de vento solar saindo do núcleo

**Planetas — 4** com texturas procedurais 1024×1024:
1. **Júpiter** (raio 14, pos `(130, 35, -160)`): laranja listrado, Grande Mancha Vermelha, anel inclinado, atmosfera, lua orbitante
2. **Netuno** (raio 9, pos `(-160, -55, -260)`): azul elétrico, Grande Mancha Escura, nuvens de alta altitude, camada de nuvens independente orbitando mais rápido
3. **Saturno** (raio 11, pos `(200, -100, -350)`): dourado/bege, 5 anéis concêntricos inclinados `rotation.x = Math.PI * 0.42`, hexágono polar
4. **Exoplaneta** (raio 7, pos `(-120, 80, -200)`): roxo/magenta, vulcânico, atmosfera espessa, 2 luas em planos diferentes

**Asteroides — 600** (cinturão ao redor do sol):
- Geometria fBm com ruído de 6 oitavas + sistema de crateras por impacto
- 4 tipos: C (carbonáceo, cinza escuro), S (silicato, marrom), M (metálico), V (basáltico)
- Distribuídos em torus achatado, raio orbital 50–80 unidades do sol
- Lei de Kepler aproximada para velocidade orbital

**Asteroides viajantes — 40** (atravessam a tela):
- Geometria fBm, cor e cauda colorida (8 paletas: laranja, azul, amarelo, rosa, verde, vermelho, roxo, ciano)
- Cauda com sprites Bezier seguindo o trajeto
- Resetam ao sair do viewport

**Buraco negro** (posição `(0, -50, -450)`):
- Centro sólido preto, 5 anéis de acreção laranja→vermelho escuro
- Halo gravitacional pulsante, 2 jets polares azuis, 300 partículas em espiral

**Scroll parallax**:
- `camera.position.z = 50 - scrollAtual * 480` (lerp 0.04)
- Camadas de estrelas se movem em velocidades diferentes (20, 60, 120)
- Via Láctea: z offset 30

**Mouse parallax**:
- `targetX = mouseX * 0.06`, `targetY = mouseY * 0.04`
- Lerp 0.025 na câmera

**Funções auxiliares** no topo do arquivo (fora do componente):
- `criarSprite(cor, tamanho)` — textura canvas de estrela com bloom
- `criarTexturaChama()` — textura de protuberância solar
- `criarTexturaCauda(cor1, cor2)` — cauda de asteroide viajante
- `criarTexturaNebulosaSuave()` — elipse assimétrica para partículas de nebulosa
- `criarTexturaPlaneta(tipo)` — textura 1024px por tipo: `'jupiter'|'netuno'|'saturno'|'exoplaneta'`
- `posicaoEsferica(raio)` — distribuição esférica uniforme
- `posicaoViaLactea()` — distribuição de disco galáctico
- `reconstruirNebulosaCompleta(grupo, cfg)` — monta sub-nuvens + filamentos de uma nebulosa
- `criarGalaxia(cfg)` — cria sistema de partículas em espiral
- `hash(n)`, `noise3(x,y,z)`, `fbm(x,y,z,oitavas)` — ruído procedural para asteroides
- `criarGeometriaAsteroide(raioBase, semente)` — geometria fBm com crateras
- `criarMaterialAsteroide(tipo)` — material por tipo mineralógico
- `criarBuracoNegro()` — monta grupo completo do buraco negro

**ATENÇÃO — bug já corrigido**: na função `criarTexturaPlaneta`, bloco `saturno`, a linha `ctx.fillRect(0,0,size,size)` precisa de ponto e vírgula ao final (antes do array de cores do forEach na linha seguinte) para evitar parsing como subscript access.

---

### `src/components/CursorPreview.jsx`
Floating preview de imagem:
- Renderizado via `createPortal(document.body)` — escapa de transforms de pai
- Props: `{ src, visible, elRef }` (PropTypes definidos)
- Classes CSS: `cursor-preview--visivel` / `cursor-preview--oculto`
- Posição atualizada diretamente no DOM via `elRef` (zero re-render)

---

### `src/hooks/useReveal.js`
`IntersectionObserver` triplo:
1. Revela `<section>` (exceto `.hero`) e `<footer>` adicionando classe `visivel` — threshold 0.06, rootMargin `-60px` bottom
2. Stagger reveal em filhos de `[data-reveal="stagger"]`:
   - Delay configurável via `data-stagger-ms` (padrão 80ms)
   - Direção via `data-reveal-from="left|right|up|down"` por filho ou herdado do container
   - Adiciona `reveal-item--visivel` com delay escalonado
3. `MutationObserver` em `document.body` para capturar containers dinâmicos (troca de tabs, resultados de busca)

---

### `src/hooks/useMagnetic.js`
- Recebe `ref` e `strength` (padrão 0.3)
- `mousemove` → `translate(distX * strength, distY * strength)`
- `mouseleave` → `translate(0, 0)`
- Desativado em touch devices (`hover: none`)
- Aplicado em: `.btn-solid` / `.btn-ghost` no hero, links do footer (strength 0.25)

---

### `src/hooks/useCursorPreview.js`
- Estado: `{ visible, src }` + `elRef` (DOM ref do preview) + `timerRef`
- `onMouseEnter(src)` — cancela timer pendente, mostra preview
- `onMouseLeave()` — oculta preview após 150ms (timer cancelável)
- `onMouseMove(e)` — atualiza posição direto no DOM (`left = clientX + 18`, `top = clientY + 18`)
- Zero re-render na movimentação do mouse

---

### `src/hooks/useMouseParallax.js`
- Constante `MOUSE_FACTOR = 0.0015`
- Lerp 0.05 em direção ao alvo
- Desativado em touch devices
- **Nota**: este hook existe mas o parallax de mouse está implementado diretamente no loop do `UniversoCanvas.jsx`. Não é chamado em nenhum componente atualmente.

---

### `src/data/certificados.json`
8 certificados com campos: `id`, `area`, `titulo`, `tags`, `data`, `horas`, `imagem`

| id | área | titulo (resumido) | imagem |
|----|------|-------------------|--------|
| 1  | front-end  | Front-End React: Boas-Vindas | `/img/Certificado Front-End react.png` |
| 2  | back-end   | Python: Boas-Vindas | `/img/Certificado Python.png` |
| 3  | front-end  | HTML/CSS: Responsividade | `/img/HTML e CSS resnpo.png` |
| 4  | front-end  | HTML/CSS: Praticando | `/img/HTML e CSS praticando HTMLCSS.png` |
| 5  | front-end  | HTML/CSS: Flexbox | `/img/HTML e CSS Classes posicionamento e Flexbox.png` |
| 6  | front-end  | HTML/CSS: Cabeçalho e Footer | `/img/HTML e CSS cabecalho footer e variaveis CSS.png` |
| 7  | front-end  | HTML/CSS: Ambientes | `/img/HTML e CSS ambientes de desenvolvimento.png` |
| 8  | linguagem  | JavaScript: Lógica | `/img/programação com JavaScript.png` |

---

## Convenções de código

- Comentários JSDoc em todos os componentes e hooks
- Constantes (arrays de dados, configs) sempre no topo do arquivo, fora do componente
- Nomes em português para componentes/classes (padrão do projeto)
- Nomes em inglês para hooks e utilitários
- CSS: variáveis em `variables.css`, sem valores hardcoded nos componentes
- Sem inline styles — apenas classes CSS
- Acessibilidade: `aria-label` em todos os links de ícone, `alt` descritivo em imagens

---

## Como adicionar conteúdo

- **Novo projeto**: adicionar objeto em `PROJETOS` em `Projetos.jsx` + imagem em `/public/img/previews/projeto-{id}.svg`
- **Novo certificado**: adicionar entrada em `certificados.json` + imagem em `/public/img/`
- **Nova experiência**: editar constante `EXPERIENCIAS` em `Informacoes.jsx` (mais recente primeiro)
- **Novo conhecimento**: editar constante `CONHECIMENTOS` em `Informacoes.jsx`
- **Trocar cor de destaque**: alterar `--accent` em `variables.css`
- **Ajustar velocidade do universo**: constante `SCROLL_SPEED` no topo de `UniversoCanvas.jsx` (não existe explicitamente — é o fator `480` em `camera.position.z = 50 - scrollAtual * 480`)
- **Ajustar parallax de mouse**: constante `MOUSE_FACTOR` em `useMouseParallax.js` (ou os fatores `0.06`/`0.04` diretamente no `UniversoCanvas.jsx`)

---

## Arquivos CSS legados (não remover, não importar)

`princi.css`, `projetos.css`, `cards-react.css` — existem em `src/style/` mas não são importados em `main.jsx`. Podem ser removidos com segurança se necessário.
