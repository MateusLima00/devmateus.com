# devmateus.com

Portfólio pessoal de **Mateus Lima** — React + Vite, feito do zero (migrado
de uma versão vanilla HTML/CSS/JS), com uma seção de projetos que traz
**prévias interativas reais** dos sistemas que desenvolvi, não só prints:
dashboards navegáveis, réplicas fiéis do layout original (dados e nomes de
empresa anonimizados quando necessário).

## Destaques

- **Hero em 3D**: globo interativo (biblioteca `cobe`, WebGL) com "chuva de
  código" animada atrás, e uma intro que digita um script Python de verdade
  antes de revelar o site.
- **Terminal interativo**: experiência profissional navegável como se fosse
  um terminal de verdade, completando comandos.
- **Página de projetos estilo GitHub**: perfil + README renderizado (mini
  parser de markdown próprio) + grade de "pastas" que abrem uma prévia em
  modal.
- **Prévias interativas dos projetos**: em vez de só uma imagem estática,
  alguns projetos abrem uma réplica funcional do sistema real (sidebar,
  dashboard, tabelas, gráficos) — dá pra navegar entre as telas de verdade.
- **Formulário de contato funcional**: envia e-mail direto via Web3Forms,
  com proteção anti-spam client-side (honeypot, limite de envios por
  minuto/dia, bloqueio de conteúdo tipo script/HTML).
- **Responsivo**: layout pensado pra celular em todas as páginas, incluindo
  as prévias de dashboard (que viram uma caixa com scroll horizontal
  próprio em telas pequenas, sem afetar o resto da página).

## Stack

- **React 19** + **Vite 8** + **React Router v7**
- CSS puro (sem framework de UI) — cada seção tem seu próprio arquivo,
  importado em `styles/global.css`
- `cobe` para o globo 3D do hero
- `lucide-react` para os ícones das prévias de projeto
- Web3Forms para o envio do formulário de contato (sem backend próprio)

## Rodando localmente

```bash
npm install
cp .env.example .env   # e preenche a chave do Web3Forms (opcional — sem ela o formulário fica desabilitado)
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  main.jsx                  ponto de entrada
  App.jsx                   Router + providers (intro, transição, nav)

  pages/                    uma por rota
    Home.jsx                  "/"        — hero + terminal + contato + rodapé
    ProjetosPage.jsx          "/projetos" — perfil estilo GitHub + pastas de projeto
    SobrePage.jsx             "/sobre"    — ainda um stub

  components/               um componente por pedaço visual, agrupados por seção
    IntroOverlay.jsx          splash "digitando" um script Python (só na home)
    BarraNavegacao.jsx        nav flutuante (aparece quando o hero sai da tela)
    LinkComTransicao.jsx      <Link> que dispara a transição circular antes de navegar
    Hero/                     seção 1: título, globo 3D (cobe) e chuva de código
    Terminal/                 terminal interativo (menu → completar comando → lista)
    PerfilCarrossel/          foto + redes + carrossel de tecnologias
    Contato/                  formulário (Web3Forms + anti-spam) + lista de contatos diretos
    Projetos/                 sidebar de perfil, README, grade de pastas, modal
      demos/                   prévias interativas de projetos reais (anonimizados)

  context/                  estado compartilhado entre componentes que não têm
                             relação direta de pai/filho
    IntroContext              quando a intro terminou (Hero espera isso pra revelar o texto)
    HeroVisibilidadeContext   se o hero está visível (BarraNavegacao usa isso)
    TransicaoPaginaContext    a transição circular entre rotas

  hooks/                    lógica reutilizável extraída dos componentes
    useReveal / useScrollReveal   fade + subida ao entrar na tela (scroll)
    useGithub                     dados reais da API do GitHub (perfil/linguagens/atividade)
    useProjetos                   projetos.json, stats do portfolio, skills

  styles/                   CSS puro, organizado por seção
    global.css                 só @import, importado uma vez em App.jsx
    base/                       variáveis, reset, animação de reveal
    secoes/                     um arquivo por seção da home + botão voltar
    pagina-projetos.css         só usado em /projetos
    responsivo.css              breakpoints, importado por último

public/
  data/                    JSONs de conteúdo (experiências, certificados,
                           tecnologias, projetos) — editar aqui não exige
                           tocar em nenhum componente
  img/                     imagens do site e das prévias de projeto
```

## Decisões da migração

- **Rotas em vez de páginas separadas**: `/`, `/projetos` e `/sobre`
  substituem `index.html`, `Project.html` e `Aboutme.html`. A navegação usa
  `<LinkComTransicao>` (não `<a>`/`<Link>` puro) pra manter a transição
  circular entre páginas.
- **A intro só toca na home**: entrar direto em `/projetos` ou `/sobre` não
  mostra a intro (ver comentário em `IntroOverlay.jsx`).
- **Prévias fiéis, não reinterpretadas**: as prévias interativas em
  `Projetos/demos/` usam as mesmas classes CSS e a mesma estrutura HTML dos
  projetos reais (não um redesign) — só nomes/dados sensíveis são trocados
  por versões fictícias.
- **Responsividade**: além dos breakpoints de cada seção, dashboards
  desktop replicados nas prévias (que não fazem sentido espremidos até
  ficar ilegíveis) viram uma caixa com scroll horizontal próprio em telas
  pequenas — o site em volta nunca rola pro lado.
