import { useLocation } from "react-router-dom";
import { LinkComTransicao } from "./LinkComTransicao.jsx";
import { useHeroVisibilidade } from "../context/HeroVisibilidadeContext.jsx";

/**
 * Porta de assets/js/barra-navegacao.js: nav flutuante centralizada no
 * topo. Na home, só aparece depois que o hero (seção 1) sai da tela —
 * ver Hero.jsx, que atualiza o HeroVisibilidadeContext. Nas outras
 * páginas (sem hero) aparece direto.
 */
export function BarraNavegacao() {
  const location = useLocation();
  const { heroVisivel } = useHeroVisibilidade();

  const mostrar = location.pathname !== "/" || !heroVisivel;

  return (
    <nav className={`barra-nav${mostrar ? " barra-nav--visivel" : ""}`} aria-label="Navegação principal">
      <LinkComTransicao to="/sobre">Sobre mim</LinkComTransicao>
      <LinkComTransicao to="/projetos">Projetos</LinkComTransicao>
    </nav>
  );
}
