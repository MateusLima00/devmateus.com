import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles/global.css";
import { IntroProvider } from "./context/IntroContext.jsx";
import { HeroVisibilidadeProvider } from "./context/HeroVisibilidadeContext.jsx";
import { TransicaoPaginaProvider } from "./context/TransicaoPaginaContext.jsx";
import { IntroOverlay } from "./components/IntroOverlay.jsx";
import { BarraNavegacao } from "./components/BarraNavegacao.jsx";
import { Home } from "./pages/Home.jsx";
import { ProjetosPage } from "./pages/ProjetosPage.jsx";
import { SobrePage } from "./pages/SobrePage.jsx";

/**
 * Raiz do app. Ordem dos providers importa:
 *   Router      — <TransicaoPaginaProvider> precisa de useNavigate/useLocation
 *   Intro       — toca uma vez só, fora das rotas (não reinicia ao navegar)
 *   Transição   — overlay circular entre rotas (ver TransicaoPaginaContext)
 *   HeroVisível — <BarraNavegacao> lê daqui se deve aparecer
 */
export default function App() {
  return (
    <BrowserRouter>
      <IntroProvider>
        <TransicaoPaginaProvider>
          <HeroVisibilidadeProvider>
            <IntroOverlay />
            <BarraNavegacao />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projetos" element={<ProjetosPage />} />
              <Route path="/sobre" element={<SobrePage />} />
            </Routes>
          </HeroVisibilidadeProvider>
        </TransicaoPaginaProvider>
      </IntroProvider>
    </BrowserRouter>
  );
}
