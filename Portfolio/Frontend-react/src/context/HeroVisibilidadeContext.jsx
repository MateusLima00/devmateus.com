import { createContext, useContext, useState } from "react";

/**
 * Só existe pra <BarraNavegacao> saber quando a seção 1 (hero) da home
 * saiu da tela — nas outras páginas (sem hero) o valor fica no padrão
 * "visível" e a barra aparece direto. Ver componente Hero.
 */
const HeroVisibilidadeContext = createContext({ heroVisivel: true, setHeroVisivel: () => {} });

export function HeroVisibilidadeProvider({ children }) {
  const [heroVisivel, setHeroVisivel] = useState(true);
  return (
    <HeroVisibilidadeContext.Provider value={{ heroVisivel, setHeroVisivel }}>
      {children}
    </HeroVisibilidadeContext.Provider>
  );
}

export function useHeroVisibilidade() {
  return useContext(HeroVisibilidadeContext);
}
