import { useEffect, useState } from "react";

/**
 * Igual a useReveal, mas recebe um ref já existente em vez de criar um —
 * pra usar em componentes que já têm outro propósito pro próprio ref
 * (ex: TerminalExperiencias, que usa o ref pra focar o terminal).
 * Devolve só o booleano; o componente monta a className como quiser.
 */
export function useScrollReveal(ref) {
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
  }, [ref]);

  return visivel;
}
