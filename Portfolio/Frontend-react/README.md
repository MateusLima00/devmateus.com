# Portfolio — versão React

Migração da versão vanilla (`../Frontend`) pra React + Vite + React Router,
mantendo o mesmo visual, comportamento e dados — sem reescrever do zero.
A versão vanilla continua no ar em `../Frontend` até essa aqui ser validada.

## Rodando

```bash
npm install
npm run dev
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
    Contato/                  formulário + lista de contatos diretos
    Projetos/                 sidebar de perfil, README.md, grade de pastas, modal

  context/                  estado compartilhado entre componentes que não têm
                             relação direta de pai/filho
    IntroContext              quando a intro terminou (Hero espera isso pra revelar o texto)
    HeroVisibilidadeContext   se o hero está visível (BarraNavegacao usa isso)
    TransicaoPaginaContext    a transição circular entre rotas

  hooks/                    lógica reutilizável extraída dos componentes
    useReveal / useScrollReveal   fade + subida ao entrar na tela (scroll)
    useGithub                     dados reais da API do GitHub (perfil/linguagens/atividade)
    useProjetos                   projetos.json, stats do portfolio, skills

  styles/                   CSS puro, portado quase 1:1 da versão vanilla
    global.css                 só @import, importado uma vez em App.jsx
    base/                      variáveis, reset, animação de reveal
    secoes/                    um arquivo por seção da home
    pagina-projetos.css        só usado nas páginas /projetos e /sobre
    responsivo.css             todos os breakpoints, importado por último

public/
  data/                    os mesmos JSONs da versão vanilla (experiencias,
                           certificados, tecnologias, projetos) — editar aqui
                           não exige tocar em nenhum componente
  img/                     as mesmas imagens
```

## Decisões da migração

- **Rotas em vez de páginas separadas**: `/`, `/projetos` e `/sobre` substituem
  `index.html`, `Project.html` e `Aboutme.html`. A navegação usa
  `<LinkComTransicao>` (não `<a>`/`<Link>` puro) pra manter a transição
  circular entre páginas.
- **A intro só toca na home**: igual à versão vanilla, onde só `index.html`
  carregava `intro.js`. Entrar direto em `/projetos` ou `/sobre` não mostra a
  intro (ver comentário em `IntroOverlay.jsx`).
- **O bug do globo sumindo ao voltar** (bfcache perdendo o contexto WebGL,
  corrigido na versão vanilla com um listener de `pageshow`) **não existe
  mais aqui**: o React desmonta e remonta o componente `Globo` a cada troca
  de rota, recriando o canvas do zero naturalmente.
- **Responsividade**: além dos breakpoints que a versão vanilla já tinha
  (seção 2 e a página de projetos), foram adicionados breakpoints pro hero
  (empilha texto/globo em telas estreitas), pra barra de navegação flutuante
  e pro formulário de contato — ver `styles/responsivo.css`.
