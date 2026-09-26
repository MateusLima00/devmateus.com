import { useLocation } from "react-router-dom";
import { LinkComTransicao } from "./LinkComTransicao.jsx";

/**
 * Barra flutuante de navegação: aparece apenas na página principal.
 * Nas páginas internas, fica oculta.
 */
export function BarraNavegacao() {
  const location = useLocation();

  const mostrar = location.pathname === "/";

  return (
    <nav className={`barra-nav${mostrar ? " barra-nav--visivel" : ""}`} aria-label="Navegação principal">
      <LinkComTransicao to="/sobre">Sobre mim</LinkComTransicao>
      <LinkComTransicao to="/projetos">Projetos</LinkComTransicao>
    </nav>
  );
}
