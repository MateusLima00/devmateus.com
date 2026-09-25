import { useEffect, useRef, useState } from "react";

/**
 * Porta de assets/js/reveal.js pro mundo React: em vez de observar
 * ".reveal" no DOM inteiro, cada componente que quer o efeito chama esse
 * hook e aplica a classe "reveal" + o className retornado no próprio
 * elemento. Anima uma vez só (unobserve ao entrar na tela).
 *
 * @param {number} atrasoMs atraso da transição (efeito de entrada escalonada)
 */
export function useReveal(atrasoMs = 0) {
  const ref = useRef(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true);
          observador.unobserve(elemento);
        }
      },
      { threshold: 0.2 }
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return {
    ref,
    className: `reveal${visivel ? " reveal-visivel" : ""}`,
    style: { "--atraso-reveal": `${atrasoMs}ms` },
  };
}
