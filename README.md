# 💼 Portfólio — Mateus Lima

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modules-1572B6?style=flat-square&logo=css3&logoColor=white)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mateus_Lima-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/mateus-costa-3b5960207/)
[![GitHub](https://img.shields.io/badge/GitHub-MateusLima00-181717?style=flat-square&logo=github)](https://github.com/MateusLima00)

**Portfólio pessoal de Mateus Lima — Desenvolvedor Front-End em formação e Assistente de TI**

[Ver online →](https://variacao-dolar-em-real.vercel.app) <!-- Substitua pelo link do portfólio quando publicar -->

</div>

---

## 📸 Visão Geral

Site portfólio construído do zero com **React + Vite**, com foco em design moderno (tema escuro, efeito typewriter, anéis animados), acessibilidade e performance.

Seções:
- **Hero** — apresentação com foto e animação typewriter
- **Informações** — experiências profissionais e habilidades em abas
- **Projetos** — cards dos projetos publicados com links para demo e código
- **Certificados** — carrossel Swiper + busca dinâmica com modal de detalhes

---

## 🚀 Tecnologias

| Tecnologia | Uso |
|---|---|
| [React 18](https://react.dev) | UI declarativa com hooks |
| [Vite 5](https://vitejs.dev) | Build ultrarrápido + HMR |
| [Swiper.js](https://swiperjs.com) | Carrossel de certificados |
| [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) | Animação de scroll (hook `useReveal`) |
| CSS Animations | Typewriter, anéis giratórios, fade-in |
| PropTypes | Validação de props em desenvolvimento |

---

## 📁 Estrutura do Projeto

```
portfolio/
├── public/
│   └── img/               # Imagens estáticas (foto, ícones, certificados)
│
├── src/
│   ├── components/
│   │   ├── Cabecalho.jsx  # Header fixo com navegação
│   │   ├── Sobre.jsx      # Seção hero (foto + apresentação)
│   │   ├── Informacoes.jsx # Experiências e conhecimentos em abas
│   │   ├── Projetos.jsx   # Cards dos projetos publicados
│   │   ├── Certificados.jsx # Carrossel + busca de certificados
│   │   ├── Modal.jsx      # Modal de detalhes do certificado
│   │   └── Rodape.jsx     # Rodapé com créditos
│   │
│   ├── data/
│   │   └── certificados.json  # Dados dos certificados (fácil de editar)
│   │
│   ├── hooks/
│   │   └── useReveal.js   # Hook de animação de scroll com IntersectionObserver
│   │
│   ├── style/
│   │   ├── reset.css      # Normalização de estilos do navegador
│   │   ├── princi.css     # Estilos globais: variáveis, layout, animações
│   │   ├── projetos.css   # Estilos da seção de projetos
│   │   └── cards-react.css # Estilos dos cards e modal de certificados
│   │
│   ├── App.jsx            # Componente raiz — monta o layout
│   └── main.jsx           # Ponto de entrada — ReactDOM.createRoot
│
├── index.html
├── vite.config.js
└── package.json
```

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org) 18 ou superior
- npm (já vem com o Node)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/MateusLima00/portfolio.git
cd portfolio

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** no navegador.

### Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Gera a versão de produção em `/dist` |
| `npm run preview` | Visualiza o build de produção localmente |

---

## ✏️ Como adicionar um projeto

Abra `src/components/Projetos.jsx` e adicione um objeto no array `PROJETOS`:

```js
{
  id: 3,
  titulo: 'Nome do Projeto',
  descricao: 'Descrição curta do que o projeto faz.',
  tecnologias: ['React', 'Node.js', 'PostgreSQL'],
  linkDemo: 'https://seu-projeto.vercel.app',  // null se não tiver
  linkRepo: 'https://github.com/MateusLima00/seu-repo',
}
```

---

## ✏️ Como adicionar um certificado

Abra `src/data/certificados.json` e adicione um objeto ao array:

```json
{
  "id": 9,
  "titulo": "Nome do Curso",
  "tags": ["tecnologia", "plataforma"],
  "data": "DD/MM/AAAA",
  "horas": "Xh",
  "imagem": "/img/nome-do-arquivo.png"
}
```

Coloque a imagem do certificado em `public/img/`.

---

## 🚢 Deploy

O projeto está configurado para deploy na **Vercel** (zero configuração):

1. Crie uma conta em [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"** → importe o repositório do GitHub
3. A Vercel detecta o Vite automaticamente — clique em **Deploy**

Para outros provedores (Netlify, GitHub Pages), o comando `npm run build` gera a pasta `/dist` pronta para publicar.

---

## ♿ Acessibilidade

Este projeto segue boas práticas de acessibilidade:

- Navegação semântica com `<header>`, `<main>`, `<section>`, `<footer>`, `<article>`
- Abas com `role="tablist"`, `role="tab"`, `role="tabpanel"` e `aria-selected`
- Modal com `role="dialog"`, `aria-modal`, foco gerenciado e fechamento por `Escape`
- Links sociais com `aria-label` descritivo
- Imagens com `alt` adequado
- Elementos decorativos com `aria-hidden="true"`

---

## 📬 Contato

- **LinkedIn:** [linkedin.com/in/mateus-costa-3b5960207](https://www.linkedin.com/in/mateus-costa-3b5960207/)
- **GitHub:** [github.com/MateusLima00](https://github.com/MateusLima00)

---

<div align="center">
  Feito com ☕ e muito React por <strong>Mateus Lima</strong>
</div>
