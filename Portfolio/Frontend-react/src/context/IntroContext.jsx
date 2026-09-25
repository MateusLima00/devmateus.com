import { createContext, useContext, useState } from "react";

/**
 * Sinaliza pro resto do app quando a intro (<IntroOverlay>) terminou de
 * tocar — o Hero usa isso pra saber a hora de revelar o texto por trás
 * do overlay (mesma ideia de [data-reveal-apos-intro] na versão HTML).
 */
const IntroContext = createContext({ introTerminou: false });

export function IntroProvider({ children }) {
  const [introTerminou, setIntroTerminou] = useState(false);
  return <IntroContext.Provider value={{ introTerminou, setIntroTerminou }}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
