import { useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";

export function ContatosDevmateus() {
  const ref = useRef(null);
  const visivel = useScrollReveal(ref);

  return (
    <aside ref={ref} className={`contatos-devmateus reveal${visivel ? " reveal-visivel" : ""}`} style={{ "--atraso-reveal": "120ms" }}>
      <h2 className="contatos-devmateus__titulo">Outras formas de falar comigo</h2>

      <ul className="contatos-devmateus__lista">
        <li>
          <a href="mailto:contatomateus00@gmail.com">
            <span className="contatos-devmateus__rotulo">E-mail</span>
            <span className="contatos-devmateus__valor">contatomateus00@gmail.com</span>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/mateus-costa-3b5960207/" target="_blank" rel="noopener noreferrer">
            <span className="contatos-devmateus__rotulo">LinkedIn</span>
            <span className="contatos-devmateus__valor">Chamar no LinkedIn</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}
