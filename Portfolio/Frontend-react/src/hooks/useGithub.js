import { useEffect, useState } from "react";

/**
 * Porta de assets/js/github-atividade.js: dados reais puxados direto da
 * conta do GitHub, sem número inventado.
 *
 *   • Linguagens: API pública do GitHub (api.github.com/users/.../repos),
 *     contando a linguagem primária de cada repositório. É uma aproximação
 *     (1 linguagem por repo, não bytes de código) — de propósito, pra
 *     gastar 1 request só e não estourar o limite de taxa (60/h sem
 *     autenticação).
 *
 *   • Atividade: API pública github-contributions-api.jogruber.de, que
 *     espelha o calendário de contribuições do perfil (a API oficial do
 *     GitHub só expõe isso via GraphQL autenticado, inviável no navegador).
 *
 * Cada hook devolve `null` enquanto carrega/se a API falhar — os
 * componentes que usam isso simplesmente não renderizam a seção nesse caso.
 */

export const USUARIO_GITHUB = "MateusLima00";

// Cores oficiais (aproximadas) do GitHub Linguist pras linguagens mais comuns.
const CORES_LINGUAGEM = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4F5D95",
  Go: "#00ADD8",
  Java: "#b07219",
  "C#": "#178600",
  Shell: "#89e051",
  Dockerfile: "#384d54",
};
const COR_LINGUAGEM_PADRAO = "#8b949e";

export function useGithubPerfil() {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    let cancelado = false;

    fetch(`https://api.github.com/users/${USUARIO_GITHUB}`)
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
      .then((dados) => !cancelado && setPerfil(dados))
      .catch(() => {});

    return () => {
      cancelado = true;
    };
  }, []);

  return perfil;
}

export function useGithubLinguagens() {
  const [linguagens, setLinguagens] = useState(null);

  useEffect(() => {
    let cancelado = false;

    fetch(`https://api.github.com/users/${USUARIO_GITHUB}/repos?per_page=100`)
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
      .then((repositorios) => {
        const contagem = new Map();
        for (const repo of repositorios) {
          if (repo.fork || !repo.language) continue;
          contagem.set(repo.language, (contagem.get(repo.language) || 0) + 1);
        }
        if (contagem.size === 0) throw new Error("nenhum repositório com linguagem definida");

        const total = [...contagem.values()].reduce((soma, quantidade) => soma + quantidade, 0);
        const ordenadas = [...contagem.entries()].sort(([, a], [, b]) => b - a);

        const resultado = ordenadas.map(([linguagem, quantidade], indice) => {
          let porcentagem = Math.round((quantidade / total) * 100);
          // último item absorve a diferença de arredondamento pra somar exatos 100%
          if (indice === ordenadas.length - 1) {
            const somaAnteriores = ordenadas
              .slice(0, -1)
              .reduce((soma, [, q]) => soma + Math.round((q / total) * 100), 0);
            porcentagem = 100 - somaAnteriores;
          }
          return { linguagem, porcentagem, cor: CORES_LINGUAGEM[linguagem] || COR_LINGUAGEM_PADRAO };
        });

        if (!cancelado) setLinguagens(resultado);
      })
      .catch(() => {});

    return () => {
      cancelado = true;
    };
  }, []);

  return linguagens;
}

const NOMES_MES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** Agrupa os dias em semanas (colunas, domingo a sábado — igual ao GitHub) e monta os rótulos de mês. */
function agruparEmSemanas(dias) {
  const semanas = [];
  let semanaAtual = [];

  dias.forEach((dia, indice) => {
    const dataDoDia = new Date(dia.date);
    if (indice === 0) {
      for (let i = 0; i < dataDoDia.getDay(); i++) semanaAtual.push(null);
    }
    semanaAtual.push(dia);
    if (dataDoDia.getDay() === 6 || indice === dias.length - 1) {
      semanas.push(semanaAtual);
      semanaAtual = [];
    }
  });

  let ultimoMes = -1;
  const rotulosMes = semanas.map((semana) => {
    const primeiroDiaValido = semana.find(Boolean);
    if (!primeiroDiaValido) return "";
    const mes = new Date(primeiroDiaValido.date).getMonth();
    if (mes === ultimoMes) return "";
    ultimoMes = mes;
    return NOMES_MES[mes];
  });

  return { semanas, rotulosMes };
}

export function useGithubAtividade() {
  const [atividade, setAtividade] = useState(null);

  useEffect(() => {
    let cancelado = false;

    fetch(`https://github-contributions-api.jogruber.de/v4/${USUARIO_GITHUB}?y=last`)
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
      .then((dados) => !cancelado && setAtividade(agruparEmSemanas(dados.contributions)))
      .catch(() => {});

    return () => {
      cancelado = true;
    };
  }, []);

  return atividade;
}
