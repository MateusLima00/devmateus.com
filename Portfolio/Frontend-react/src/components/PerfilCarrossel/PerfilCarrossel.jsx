import { useRef } from "react";
import { CarrosselTecnologias } from "./CarrosselTecnologias.jsx";
import { useScrollReveal } from "../../hooks/useScrollReveal.js";

/** Aside da seção 2: foto, redes sociais e o carrossel de tecnologias. */
export function PerfilCarrossel() {
  const ref = useRef(null);
  const visivel = useScrollReveal(ref);

  return (
    <aside
      ref={ref}
      className={`perfil_redes_sessao_dois reveal${visivel ? " reveal-visivel" : ""}`}
      style={{ "--atraso-reveal": "120ms" }}
    >
      <img className="perfil_redes_sessao_dois__foto" src="/img/PERFIL/IMG_7889.PNG" alt="Foto de Mateus Lima" />

      <ul className="lista_redes">
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

      <CarrosselTecnologias />
    </aside>
  );
}
