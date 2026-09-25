import { useEffect, useState } from "react";
import "./demo-controle-ti.css";

/**
 * Prévia interativa de um sistema real de gestão de TI que ajudei a
 * construir (nome, logo, dados e endereços de servidor trocados por
 * fictícios de propósito — é um sistema interno de uma empresa real,
 * não está no GitHub). Layout, cores e estrutura seguem fielmente o
 * dashboard original: login split-screen com carrossel de marca,
 * sidebar com degradê azul, topbar com indicador "ao vivo", cards de
 * métrica com barra de destaque colorida, mini-gráfico de barras e
 * quadro de tarefas estilo Kanban.
 *
 * "Login" aqui aceita qualquer usuário/senha (é só uma demonstração,
 * sem backend) — a validação de verdade, throttle de tentativas etc.
 * existem no sistema real.
 */

/** Fotos do carrossel da tela de login — ficam em public/, fora do bundle,
 * então são referenciadas direto pela URL (ver public/img/IMAGENS-PROJETOS/login-carousel). */
const PASTA_CARROSSEL = "/img/IMAGENS-PROJETOS/login-carousel";

const SLIDES_CARROSSEL = [
  { imagem: `url("${PASTA_CARROSSEL}/01-chamados.jpg")`, titulo: "Gestão centralizada", desc: "Chamados, tarefas e inventário de TI num só lugar." },
  { imagem: `url("${PASTA_CARROSSEL}/02-equipamentos.jpg")`, titulo: "Controle total do parque de TI", desc: "Equipamentos e infraestrutura monitorados e organizados." },
  { imagem: `url("${PASTA_CARROSSEL}/03-radios.jpg")`, titulo: "Painel em tempo real", desc: "Métricas de atendimento atualizadas a cada consulta." },
  { imagem: `url("${PASTA_CARROSSEL}/04-seguranca.jpg")`, titulo: "Acesso por perfil", desc: "Permissões separadas por setor e nível de usuário." },
];

const CHAMADOS_EXEMPLO = [
  { id: 1, titulo: "Impressora do setor Financeiro sem tinta", setor: "Financeiro", status: "aberto" },
  { id: 2, titulo: "Computador não liga — Recepção", setor: "Recepção", status: "atendimento" },
  { id: 3, titulo: "Solicitação de acesso ao sistema X", setor: "RH", status: "aberto" },
  { id: 4, titulo: "Rede lenta no 2º andar", setor: "Operações", status: "atendimento" },
  { id: 5, titulo: "Troca de monitor — sala de reuniões", setor: "Diretoria", status: "resolvido" },
  { id: 6, titulo: "Instalação de sistema de ponto", setor: "RH", status: "resolvido" },
];

const STATUS_CONFIG = {
  aberto: { rotulo: "Aberto", cor: "#d97706" },
  atendimento: { rotulo: "Em atendimento", cor: "#2563eb" },
  resolvido: { rotulo: "Resolvido", cor: "#0d9488" },
};

const CHAMADOS_POR_SETOR = [
  { setor: "Financeiro", total: 6, cor: "#2121e4" },
  { setor: "RH", total: 4, cor: "#0d9488" },
  { setor: "Operações", total: 3, cor: "#d97706" },
  { setor: "Recepção", total: 2, cor: "#7c3aed" },
];
const MAX_CHAMADOS_SETOR = Math.max(...CHAMADOS_POR_SETOR.map((s) => s.total));

/** "Chamados por dia" — réplica simplificada do gráfico de linha do dashboard real. */
const CHAMADOS_POR_DIA = [3, 1, 0, 2, 4, 1, 3, 2, 0, 1];
const MAX_CHAMADOS_DIA = Math.max(...CHAMADOS_POR_DIA);

/** "Por unidade" — réplica da seção real (3 filiais, ocupação de máquinas). */
const UNIDADES = [
  { id: "centro", nome: "PC | Centro", classe: "dct-centro", total: 42, notebooks: 18, desktops: 24, ocupacao: 88 },
  { id: "br", nome: "PC | BR", classe: "dct-br", total: 27, notebooks: 9, desktops: 18, ocupacao: 74 },
  { id: "pecem", nome: "PC | Pecém", classe: "dct-pecem", total: 35, notebooks: 12, desktops: 23, ocupacao: 91 },
];
const TOTAL_MAQUINAS = UNIDADES.reduce((soma, u) => soma + u.total, 0);
const TOTAL_NOTEBOOKS = UNIDADES.reduce((soma, u) => soma + u.notebooks, 0);
const TOTAL_DESKTOPS = UNIDADES.reduce((soma, u) => soma + u.desktops, 0);

const COLUNAS_INICIAIS = {
  "A fazer": ["Trocar switch da sala de servidores", "Configurar 2 notebooks novos"],
  "Em andamento": ["Levantamento de inventário — filial 2"],
  "Concluído": ["Backup mensal verificado"],
};

/** Grupos colapsáveis da sidebar real (menu.js) — só os rótulos e submenus,
 * os links internos não abrem página nenhuma nessa prévia (fora de escopo). */
const GRUPOS_MENU = [
  { id: "comp", titulo: "Gerenc.. Computadores", itens: ["Checklist Preventiva", "Histórico de Preventivas", "Controle de Computadores", "Entrega | Recebimento"] },
  { id: "cel", titulo: "Gerenc.. Celulares", itens: ["Controle de Celulares", "Entrega | Recebimento"] },
  { id: "radios", titulo: "Rádios", itens: ["Gestão de Rádios", "Controle de Rádios", "Entrega | Recebimento"] },
  { id: "equi", titulo: "Equipamentos", itens: ["CFTV", "Equipamentos"] },
];

export function DemoControleTi() {
  const [tela, setTela] = useState("login");
  const [entrando, setEntrando] = useState(false);
  const [slideAtivo, setSlideAtivo] = useState(0);
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [colunas, setColunas] = useState(COLUNAS_INICIAIS);
  const [gruposAbertos, setGruposAbertos] = useState({});

  function alternarGrupo(id) {
    setGruposAbertos((atual) => ({ ...atual, [id]: !atual[id] }));
  }

  /** Carrossel de marca gira sozinho, igual à tela de login real. */
  useEffect(() => {
    if (tela !== "login") return;
    const intervalo = setInterval(() => setSlideAtivo((atual) => (atual + 1) % SLIDES_CARROSSEL.length), 3500);
    return () => clearInterval(intervalo);
  }, [tela]);

  function aoEntrar(evento) {
    evento.preventDefault();
    setEntrando(true);
    setTimeout(() => {
      setEntrando(false);
      setTela("app");
    }, 500);
  }

  const chamadosFiltrados =
    filtroStatus === "todos" ? CHAMADOS_EXEMPLO : CHAMADOS_EXEMPLO.filter((c) => c.status === filtroStatus);

  const nomesColuna = Object.keys(colunas);

  /** Clicar num card de tarefa avança ele pra próxima coluna (só de propósito pra ter uma interação — o quadro real usa drag-and-drop de verdade). */
  function avancarTarefa(colunaAtual, tarefa) {
    const indiceAtual = nomesColuna.indexOf(colunaAtual);
    const proximaColuna = nomesColuna[indiceAtual + 1];
    if (!proximaColuna) return;

    setColunas((atual) => ({
      ...atual,
      [colunaAtual]: atual[colunaAtual].filter((t) => t !== tarefa),
      [proximaColuna]: [...atual[proximaColuna], tarefa],
    }));
  }

  return (
    <div className="dct-monitor">
      <div className="dct-monitor-barra">
        <div className="dct-monitor-bolinhas">
          <span />
          <span />
          <span />
        </div>
        <div className="dct-monitor-url">vetorlog.sistema.interno/{tela === "login" ? "login" : abaAtiva}</div>
      </div>

      <div className="dct-monitor-tela">
        <div className="dct-shell">
      {tela === "login" && (
        <div className="dct-login">
          <div className="dct-login-marca">
            <div className="dct-login-marca-cabecalho">
              <div className="dct-login-logo">TI</div>
              <span className="dct-login-marca-nome">
                TI Vetor Log
                <small>Sistema de Gestão de TI</small>
              </span>
            </div>

            {SLIDES_CARROSSEL.map((slide, indice) => (
              <div
                key={slide.titulo}
                className={`dct-login-marca-slide${indice === slideAtivo ? " dct-ativo" : ""}`}
                style={{ backgroundImage: slide.imagem }}
              />
            ))}

            <div>
              <div className="dct-login-marca-legenda">
                <span className="dct-login-marca-titulo">{SLIDES_CARROSSEL[slideAtivo].titulo}</span>
                <span className="dct-login-marca-desc">{SLIDES_CARROSSEL[slideAtivo].desc}</span>
              </div>
              <div className="dct-login-marca-pontos">
                {SLIDES_CARROSSEL.map((slide, indice) => (
                  <button
                    key={slide.titulo}
                    type="button"
                    className={`dct-login-marca-ponto${indice === slideAtivo ? " dct-ativo" : ""}`}
                    aria-label={`Slide ${indice + 1}`}
                    onClick={() => setSlideAtivo(indice)}
                  />
                ))}
              </div>
              <p className="dct-login-rodape">© Vetor Log — prévia, dados fictícios</p>
            </div>
          </div>

          <div className="dct-login-form-painel">
            <div className="dct-login-card">
              <p className="dct-login-title">Acesse sua conta</p>
              <p className="dct-login-sub">Área restrita — sistema de TI</p>

              <form onSubmit={aoEntrar}>
                <div className="dct-field">
                  <label htmlFor="dctUsuario">Usuário</label>
                  <input id="dctUsuario" type="text" placeholder="seu.usuario" defaultValue="visitante" />
                </div>
                <div className="dct-field">
                  <label htmlFor="dctSenha">Senha</label>
                  <input id="dctSenha" type="password" placeholder="••••••••" defaultValue="demo1234" />
                </div>
                <button type="submit" className="dct-btn-entrar" disabled={entrando}>
                  {entrando ? "Verificando..." : "Entrar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {tela === "app" && (
        <div className="dct-app">
          <aside className="sidebar">
            <div className="sidebar-scroll">
              <button type="button" className="logo-menu-wrap" onClick={() => setAbaAtiva("home")}>
                <span>TI</span>
                <h2>TI Vetor Log</h2>
              </button>

              <ul>
                {GRUPOS_MENU.map((grupo) => (
                  <li key={grupo.id}>
                    <div className="menu-title" onClick={() => alternarGrupo(grupo.id)}>
                      {grupo.titulo}
                      <span className={`menu-title-seta${gruposAbertos[grupo.id] ? " dct-aberta" : ""}`}>▾</span>
                    </div>
                    <ul className={`submenu${gruposAbertos[grupo.id] ? " dct-aberta" : ""}`}>
                      {grupo.itens.map((item) => (
                        <li key={item}>
                          <a href="#" onClick={(evento) => evento.preventDefault()}>{item}</a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}

                <li>
                  <a
                    href="#"
                    className={`menu-title menu-link${abaAtiva === "chamados" ? " active" : ""}`}
                    onClick={(evento) => { evento.preventDefault(); setAbaAtiva("chamados"); }}
                  >
                    <span>Chamados</span>
                    <span className="menu-badge">{CHAMADOS_EXEMPLO.filter((c) => c.status !== "resolvido").length}</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={`menu-title menu-link${abaAtiva === "tarefas" ? " active" : ""}`}
                    onClick={(evento) => { evento.preventDefault(); setAbaAtiva("tarefas"); }}
                  >
                    <span>Tarefas TI</span>
                    <span className="menu-badge">{nomesColuna.reduce((soma, nome) => soma + colunas[nome].length, 0)}</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="menu-title menu-link" onClick={(evento) => evento.preventDefault()}>
                    <span>Solicitações de Compras</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="menu-title menu-link" onClick={(evento) => evento.preventDefault()}>
                    <span>Histórico de Termos</span>
                  </a>
                </li>
              </ul>
            </div>

            <a href="#" className="menu-config-btn" onClick={(evento) => evento.preventDefault()}>
              ⚙️ Configurações
            </a>
          </aside>

          <div className="dct-coluna-app">
            <div className={`content${abaAtiva === "tarefas" ? " dct-sem-padding" : ""}`}>
              {abaAtiva === "home" && (
                <>
                  <div className="db-topbar">
                    <div>
                      <div className="db-topbar-title">Painel de TI — Vetor Log</div>
                      <div className="db-topbar-sub">Última atualização: agora · atualiza a cada 5 min</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="db-badge">Ao vivo</span>
                      <button type="button" className="btn-atualizar">Atualizar</button>
                    </div>
                  </div>

                  <p className="section-label">Chamados de suporte</p>
                  <div className="metrics-row">
                    <div className="metric-card">
                      <span className="metric-accent accent-red" />
                      <p className="metric-label">Pendentes</p>
                      <p className="metric-val">{CHAMADOS_EXEMPLO.filter((c) => c.status !== "resolvido").length}</p>
                      <p className="metric-sub">aguardando + em atendimento</p>
                    </div>
                    <div className="metric-card">
                      <span className="metric-accent accent-orange" />
                      <p className="metric-label">Abertos</p>
                      <p className="metric-val">{CHAMADOS_EXEMPLO.filter((c) => c.status === "aberto").length}</p>
                      <p className="metric-sub">novos, sem atendimento</p>
                    </div>
                    <div className="metric-card">
                      <span className="metric-accent accent-blue" />
                      <p className="metric-label">Em atendimento</p>
                      <p className="metric-val">{CHAMADOS_EXEMPLO.filter((c) => c.status === "atendimento").length}</p>
                      <p className="metric-sub">sendo resolvidos</p>
                    </div>
                    <div className="metric-card">
                      <span className="metric-accent accent-teal" />
                      <p className="metric-label">Resolvidos</p>
                      <p className="metric-val">{CHAMADOS_EXEMPLO.filter((c) => c.status === "resolvido").length}</p>
                      <p className="metric-sub">total concluído</p>
                    </div>
                  </div>

                  <div className="db-periodo-wrap">
                    <span className="db-periodo-label">Ver período:</span>
                    <div className="db-periodo-btns">
                      <button type="button" className="db-periodo-btn">Semana</button>
                      <button type="button" className="db-periodo-btn ativo">Mês</button>
                      <button type="button" className="db-periodo-btn">Trimestre</button>
                    </div>
                    <span className="db-periodo-sub">últimos 30 dias</span>
                  </div>

                  <div className="metrics-row">
                    <div className="metric-card">
                      <span className="metric-accent accent-purple" />
                      <p className="metric-label">Chamados no período</p>
                      <p className="metric-val">21</p>
                      <p className="metric-sub">últimos 30 dias</p>
                    </div>
                    <div className="metric-card">
                      <span className="metric-accent accent-cyan" />
                      <p className="metric-label">Tempo médio de atendimento</p>
                      <p className="metric-val">39.4h</p>
                      <p className="metric-sub">horas corridas, da abertura à resolução</p>
                    </div>
                  </div>

                  <div className="charts-row">
                    <div className="chart-card">
                      <p className="chart-title">📈 Chamados por dia</p>
                      <div className="chart-box">
                        <svg viewBox="0 0 260 90" width="100%" height="100%" preserveAspectRatio="none">
                          <polyline
                            fill="none"
                            stroke="#2121e4"
                            strokeWidth="2"
                            points={CHAMADOS_POR_DIA.map(
                              (valor, indice) =>
                                `${(indice / (CHAMADOS_POR_DIA.length - 1)) * 260},${90 - (valor / MAX_CHAMADOS_DIA) * 80 - 5}`
                            ).join(" ")}
                          />
                          {CHAMADOS_POR_DIA.map((valor, indice) => (
                            <circle
                              key={indice}
                              cx={(indice / (CHAMADOS_POR_DIA.length - 1)) * 260}
                              cy={90 - (valor / MAX_CHAMADOS_DIA) * 80 - 5}
                              r="2.5"
                              fill="#2121e4"
                            />
                          ))}
                        </svg>
                      </div>
                    </div>
                    <div className="chart-card">
                      <p className="chart-title">🏷️ Chamados por setor</p>
                      {CHAMADOS_POR_SETOR.map((item) => (
                        <div className="dct-bar-linha" key={item.setor}>
                          <span className="dct-bar-nome">{item.setor}</span>
                          <div className="dct-bar-trilho">
                            <div
                              className="dct-bar-fill"
                              style={{ width: `${(item.total / MAX_CHAMADOS_SETOR) * 100}%`, background: item.cor }}
                            >
                              <span>{item.total}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="section-label">Visão geral</p>
                  <div className="metrics-row">
                    <div className="metric-card">
                      <span className="metric-accent accent-indigo" />
                      <p className="metric-label">Total de máquinas</p>
                      <p className="metric-val">{TOTAL_MAQUINAS}</p>
                      <p className="metric-sub">PC | Centro · BR · Pecém</p>
                    </div>
                    <div className="metric-card">
                      <span className="metric-accent accent-amber" />
                      <p className="metric-label">Notebooks</p>
                      <p className="metric-val">{TOTAL_NOTEBOOKS}</p>
                      <p className="metric-sub">total geral</p>
                    </div>
                    <div className="metric-card">
                      <span className="metric-accent accent-slate" />
                      <p className="metric-label">Desktops</p>
                      <p className="metric-val">{TOTAL_DESKTOPS}</p>
                      <p className="metric-sub">total geral</p>
                    </div>
                    <div className="metric-card">
                      <span className="metric-accent accent-teal" />
                      <p className="metric-label">Disponíveis</p>
                      <p className="metric-val">5</p>
                      <p className="metric-sub">não alocadas</p>
                    </div>
                  </div>

                  <p className="section-label">Por unidade</p>
                  <div className="units-row">
                    {UNIDADES.map((unidade) => (
                      <div className="unit-card" key={unidade.id}>
                        <div className={`unit-header ${unidade.id}`}>{unidade.nome}</div>
                        <div className="unit-body">
                          <p className="unit-num">{unidade.total}</p>
                          <div className="unit-detail">
                            <span>{unidade.notebooks} notebooks</span>
                            <span>{unidade.desktops} desktops</span>
                          </div>
                          <div className="progress-head">
                            <span>Ocupação</span>
                            <span>{unidade.ocupacao}%</span>
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${unidade.ocupacao}%`, background: "#2121e4" }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="dct-aviso-escopo">
                    💡 O painel real ainda tem seções de planilhas importadas, preventivas, solicitações de compra, rádios e celulares — não entraram nessa prévia pra não ficar gigante.
                  </p>
                </>
              )}

              {abaAtiva === "chamados" && (
                <>
                  <header className="page-header">
                    <div className="header-info">
                      <h1>Chamados de Suporte</h1>
                      <p>Solicitações abertas pelos setores</p>
                    </div>
                    <div className="header-right">
                      <button type="button" className="btn-refresh">➕ Novo chamado</button>
                      <button type="button" className="btn-refresh">💬 Chats</button>
                      <button type="button" className="btn-refresh">🔗 Link p/ funcionários</button>
                      <button type="button" className="btn-refresh">Atualizar</button>
                    </div>
                  </header>

                  <div className="filtros">
                    {["todos", "aberto", "atendimento", "resolvido"].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`chip${filtroStatus === status ? " ativo" : ""}`}
                        onClick={() => setFiltroStatus(status)}
                      >
                        {status === "todos" ? "Todos" : STATUS_CONFIG[status].rotulo}
                        <span className="qtd">
                          {status === "todos" ? CHAMADOS_EXEMPLO.length : CHAMADOS_EXEMPLO.filter((c) => c.status === status).length}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="filtros-avancados">
                    <div className="fa-campo">
                      <span className="fa-label">Departamento</span>
                      <select className="fa-input"><option>Todos</option></select>
                    </div>
                    <div className="fa-campo">
                      <span className="fa-label">Solicitante</span>
                      <input className="fa-input" placeholder="Nome de quem pediu..." />
                    </div>
                    <div className="fa-campo">
                      <span className="fa-label">Técnico atribuído</span>
                      <select className="fa-input"><option>Todos</option></select>
                    </div>
                    <button type="button" className="fa-limpar">✕ Limpar filtros</button>
                  </div>

                  <div className="ch-tabela-wrap">
                    <table className="ch-tabela">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Título</th>
                          <th>Status</th>
                          <th>Setor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chamadosFiltrados.map((chamado) => (
                          <tr key={chamado.id}>
                            <td className="col-id">#{chamado.id}</td>
                            <td className="col-titulo">
                              <p className="titulo-txt">{chamado.titulo}</p>
                            </td>
                            <td>
                              <span className={`selo selo-${chamado.status === "atendimento" ? "em_atendimento" : chamado.status}`}>
                                {STATUS_CONFIG[chamado.status].rotulo}
                              </span>
                            </td>
                            <td>{chamado.setor}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {abaAtiva === "tarefas" && (
                <div className="tk-wrap">
                  <div className="tk-topbar">
                    <div className="tk-topbar-title">📋 Tarefas TI</div>
                    <button type="button" className="tk-btn-novo-quadro">+ Novo Quadro</button>
                  </div>
                  <div className="tk-board-wrap">
                    {nomesColuna.map((nomeColuna) => (
                      <div className="tk-col" key={nomeColuna}>
                        <div className="tk-col-head">
                          <span className="tk-col-nome">{nomeColuna}</span>
                          <span className="tk-col-count">{colunas[nomeColuna].length}</span>
                        </div>
                        <div className="tk-cards-area">
                          {colunas[nomeColuna].map((tarefa) => (
                            <div className="tk-card" key={tarefa} onClick={() => avancarTarefa(nomeColuna, tarefa)}>
                              <p className="tk-card-titulo">{tarefa}</p>
                            </div>
                          ))}
                        </div>
                        <div className="tk-col-footer">
                          <button type="button" className="tk-add-card-btn">+ Adicionar card</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="tk-dica">💡 Clique num cartão pra movê-lo pra próxima coluna (o quadro real usa arrastar-e-soltar).</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
}
