import { createRoot } from "react-dom/client";
import "./styles/tailwind.css";
import App from "./App.jsx";

// Sem <StrictMode>: em dev ele monta/desmonta cada componente 2x de
// propósito (pra pegar side-effects mal escritos), mas isso quebra o globo
// (assets/js .../Globo.jsx usa WebGL via "cobe" — criar/destruir o contexto
// WebGL duas vezes rápido no mesmo <canvas> falha silenciosamente, sem
// nenhum erro no console). Só acontecia em dev; produção nunca dobra os
// efeitos, StrictMode ou não.
createRoot(document.getElementById("root")).render(<App />);
