import { useEffect, useState } from "react";

/** Projetos (/data/projetos.json) pra grade de pastas de pages/Project. */
export function useProjetos() {
  const [projetos, setProjetos] = useState(null);

  useEffect(() => {
    fetch("/data/projetos.json")
      .then((resposta) => resposta.json())
      .then(setProjetos)
      .catch(() => setProjetos([]));
  }, []);

  return projetos;
}

/**
 * Stats do README (Projetos/Experiências/Certificados) — números reais
 * tirados dos próprios dados do site, nada de estatística inventada tipo
 * "GitHub Stats" fake. `null` enquanto carrega.
 */
export function useStatsPortfolio() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/projetos.json").then((r) => r.json()),
      fetch("/data/experiencias.json").then((r) => r.json()),
      fetch("/data/certificados.json").then((r) => r.json()),
    ])
      .then(([projetos, experiencias, certificados]) => {
        setStats([
          { rotulo: "Projetos", valor: projetos.length },
          { rotulo: "Experiências", valor: experiencias.length },
          { rotulo: "Certificados", valor: certificados.length },
        ]);
      })
      .catch(() => setStats(null));
  }, []);

  return stats;
}

/** Skills achatadas de /data/tecnologias.json (todas as categorias numa lista só). */
export function useSkills() {
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    fetch("/data/tecnologias.json")
      .then((resposta) => resposta.json())
      .then((categorias) => setSkills(categorias.flatMap((categoria) => categoria.itens)))
      .catch(() => setSkills([]));
  }, []);

  return skills;
}
