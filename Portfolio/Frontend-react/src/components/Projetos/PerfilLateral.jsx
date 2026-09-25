import { useGithubPerfil, USUARIO_GITHUB } from "../../hooks/useGithub.js";

/** Sidebar do perfil estilo GitHub: foto, bio, localização, links e seguidores/seguindo reais. */
export function PerfilLateral() {
  const perfil = useGithubPerfil();

  return (
    <aside className="perfil-readme__lateral">
      <img className="perfil-readme__foto" src="/img/PERFIL/IMG_7889.PNG" alt="Foto de Mateus Lima" />

      <h1 className="perfil-readme__nome">Mateus Lima</h1>
      <p className="perfil-readme__usuario">@{USUARIO_GITHUB}</p>

      <p className="perfil-readme__bio">
        Engenheiro de Software em formação, migrando de infraestrutura de TI pra desenvolvimento — hoje entre suporte/infra e
        código no dia a dia.
      </p>

      {/* Só aparece se a API do GitHub responder — dados reais, não estimados. */}
      {perfil && (
        <div className="perfil-readme__social">
          <div className="perfil-readme__contadores">
            <span><strong>{perfil.followers}</strong> seguidores</span>
            <span>·</span>
            <span><strong>{perfil.following}</strong> seguindo</span>
          </div>
          <a className="perfil-readme__follow" href={`https://github.com/${USUARIO_GITHUB}`} target="_blank" rel="noopener noreferrer">
            Follow
          </a>
        </div>
      )}

      <ul className="perfil-readme__info">
        <li>
          <svg className="perfil-readme__info-icone" viewBox="0 0 16 16" aria-hidden="true">
            <path fill="currentColor" d="M8 0C4.7 0 2 2.7 2 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6Zm0 8.5A2.5 2.5 0 1 1 8 3.5a2.5 2.5 0 0 1 0 5Z" />
          </svg>
          Maracanau — CE
        </li>
        <li>
          <svg className="perfil-readme__info-icone" viewBox="0 0 16 16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M7.78 5.22a.75.75 0 0 1 0 1.06L4.56 9.5a1.75 1.75 0 1 0 2.47 2.47l3.22-3.22a.75.75 0 0 1 1.06 1.06l-3.22 3.22a3.25 3.25 0 1 1-4.6-4.6l3.23-3.22a.75.75 0 0 1 1.06 0Zm.44 5.56a.75.75 0 0 1 0-1.06l3.22-3.22a1.75 1.75 0 1 0-2.47-2.47L5.75 7.25a.75.75 0 0 1-1.06-1.06l3.22-3.22a3.25 3.25 0 1 1 4.6 4.6l-3.23 3.22a.75.75 0 0 1-1.06 0Z"
            />
          </svg>
          <a href="https://www.linkedin.com/in/mateus-costa-3b5960207/" target="_blank" rel="noopener noreferrer">
            in/mateus-costa
          </a>
        </li>
        <li>
          <img className="perfil-readme__info-icone perfil-readme__info-icone--github" src="/img/ICONES-REDESOCIAL/icons8-github-48.png" alt="" />
          <a href={`https://github.com/${USUARIO_GITHUB}`} target="_blank" rel="noopener noreferrer">
            github.com/{USUARIO_GITHUB}
          </a>
        </li>
      </ul>
    </aside>
  );
}
