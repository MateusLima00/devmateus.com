import { useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { useAnoAtual } from "../hooks/useAnoAtual.js";

export function Rodape() {
  const ref = useRef(null);
  const visivel = useScrollReveal(ref);
  const ano = useAnoAtual();

  return (
    <footer ref={ref} className={`rodape-devmateus reveal${visivel ? " reveal-visivel" : ""}`}>
      <p className="rodape-devmateus__texto">&copy; {ano} Mateus Lima. Todos os direitos reservados.</p>

      <ul className="lista_redes lista_redes--rodape">
        <li>
          <a href="https://github.com/MateusLima00" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <img src="/img/ICONES-REDESOCIAL/icons8-github-48.png" alt="" />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/mateus-costa-3b5960207/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <img src="/img/ICONES-REDESOCIAL/icons8-linkedin-48.png" alt="" />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/mateuslmx_" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <img src="/img/ICONES-REDESOCIAL/image.png" alt="" />
          </a>
        </li>
        <li>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <img src="/img/ICONES-REDESOCIAL/icons8-tiktok-48.png" alt="" />
          </a>
        </li>
      </ul>
    </footer>
  );
}
