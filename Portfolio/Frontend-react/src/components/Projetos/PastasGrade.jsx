/**
 * Grade de "pastas" — cada uma é um projeto (/data/projetos.json). Hover
 * entreabre a pasta (CSS, .pasta-projeto__frente); clique abre a prévia
 * (ver ProjetosPage, que controla o estado do modal).
 */
export function PastasGrade({ projetos, onAbrirProjeto }) {
  return (
    <section className="projetos-pastas" aria-label="Lista de projetos">
      <p className="projetos-pastas__caminho">~/projetos</p>

      <aside className="projetos-pastas__grade">
        {projetos === null && <p className="projetos-pastas__erro">Carregando projetos...</p>}
        {projetos?.length === 0 && <p className="projetos-pastas__erro">Não consegui carregar os projetos agora. Tenta recarregar a página.</p>}

        {projetos?.map((projeto) => (
          <button
            type="button"
            className="pasta-projeto"
            key={projeto.id}
            aria-label={`Ver prévia de ${projeto.nome}`}
            onClick={() => onAbrirProjeto(projeto)}
          >
            <span className="pasta-projeto__forma" aria-hidden="true">
              <span className="pasta-projeto__aba"></span>
              <span className="pasta-projeto__corpo"></span>
              <span className="pasta-projeto__frente"></span>
            </span>
            <span className="pasta-projeto__nome">{projeto.nome}</span>
          </button>
        ))}
      </aside>
    </section>
  );
}
