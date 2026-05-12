// ─────────────────────────────────────────────
// main.jsx — Ponto de entrada da aplicação React
//
// Responsabilidades:
//   • Selecionar o nó #root no index.html
//   • Envolver o App em React.StrictMode
//     (ativa avisos extras em desenvolvimento)
//   • Importar os estilos globais na ordem correta:
//     reset → principal → cards
// ─────────────────────────────────────────────

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Reset de estilos padrão do navegador
import './style/reset.css'

// Estilos principais: variáveis CSS, layout, animações
import './style/princi.css'

// Estilos da seção de projetos
import './style/projetos.css'

// Estilos específicos dos cards de certificados
import './style/cards-react.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
