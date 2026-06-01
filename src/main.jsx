/**
 * main.jsx — Ponto de entrada da aplicação React
 *
 * Ordem de importação dos estilos:
 *   reset → variables → layout → components → animations → universe
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import './style/reset.css'
import './style/variables.css'
import './style/layout.css'
import './style/components.css'
import './style/animations.css'
import './style/universe.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
