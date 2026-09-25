import { useState } from "react";
import "../styles/pagina-projetos.css";
import { LinkComTransicao } from "../components/LinkComTransicao.jsx";
import { PerfilLateral } from "../components/Projetos/PerfilLateral.jsx";
import { ReadmeCard } from "../components/Projetos/ReadmeCard.jsx";
import { PastasGrade } from "../components/Projetos/PastasGrade.jsx";
import { ProjetoModal } from "../components/Projetos/ProjetoModal.jsx";
import { useProjetos } from "../hooks/useProjetos.js";

/** Página /projetos: perfil estilo GitHub (sidebar + README) + grade de pastas com prévia em modal. */
export function ProjetosPage() {
  const projetos = useProjetos();
  const [projetoAberto, setProjetoAberto] = useState(null);

  return (
    <div className="pagina-projetos-body">
      <LinkComTransicao className="pagina-projetos__voltar" to="/">
        ← Voltar
      </LinkComTransicao>

      <main className="pagina-projetos">
        <section className="perfil-readme" aria-label="Perfil">
          <PerfilLateral />
          <ReadmeCard />
        </section>

        <PastasGrade projetos={projetos} onAbrirProjeto={setProjetoAberto} />
      </main>

      <ProjetoModal projeto={projetoAberto} onFechar={() => setProjetoAberto(null)} />
    </div>
  );
}
