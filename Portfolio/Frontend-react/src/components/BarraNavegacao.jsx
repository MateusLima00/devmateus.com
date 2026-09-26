import { useLocation } from "react-router-dom";
import { useHeroVisibilidade } from "../context/HeroVisibilidadeContext.jsx";
import { LinkComTransicao } from "./LinkComTransicao.jsx";

/**
 * Barra flutuante de navegação: aparece só quando a seção 1 (hero) sai da
 * viewport na home. Nas páginas internas permanece oculta.
 */
export function BarraNavegacao() {
  const location = useLocation();
  const { heroVisivel } = useHeroVisibilidade();

  const mostrar = location.pathname === "/" && !heroVisivel;

  return (
    <nav className={`barra-nav${mostrar ? " barra-nav--visivel" : ""}`} aria-label="Navegação principal">
      <LinkComTransicao to="/sobre">Sobre mim</LinkComTransicao>
      <LinkComTransicao to="/projetos">Projetos</LinkComTransicao>
    </nav>
  );
}
