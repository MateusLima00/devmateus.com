import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Tags,
  Landmark,
  Target,
  TrendingUp,
  CalendarClock,
  Wallet2,
  CreditCard,
  PieChart,
  Settings,
  Mail,
  Lock,
  ShieldCheck,
  RefreshCw,
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  Plane,
  PiggyBank,
  Laptop,
  LineChart,
  Clapperboard,
  Music,
} from "lucide-react";
import "./demo-bolso-leve.css";

/**
 * Prévia interativa do "Bolso Leve" — app pessoal de finanças que fiz do
 * zero (FastAPI + React), conectado a um bot de Telegram e a um assistente
 * irmão chamado "Nero". Paleta, layout, textos e até a ilustração da tela
 * de login replicam o app de verdade (ver src/index.css do projeto) — só
 * os números são fictícios.
 *
 * "Login" aceita qualquer e-mail/senha (é só demonstração, sem backend) — a
 * autenticação real usa sessão em cookie httpOnly + login opcional via Google.
 */

const ITENS_MENU = [
  { id: "dashboard", label: "Dashboard", Icone: LayoutDashboard },
  { id: "extrato", label: "Extrato", Icone: Receipt },
  { id: "gastos", label: "Gastos diários", Icone: CalendarClock },
  { id: "orcamento", label: "Orçamento", Icone: PieChart },
  { id: "metas", label: "Metas e planos", Icone: Target },
  { id: "investimentos", label: "Investimentos", Icone: TrendingUp },
  { id: "assinaturas", label: "Assinaturas", Icone: Wallet2 },
  { id: "parcelamentos", label: "Cartão/Parcelamentos", Icone: CreditCard },
  { id: "categorias", label: "Categorias", Icone: Tags },
  { id: "contas", label: "Contas", Icone: Landmark },
  { id: "config", label: "Configurações", Icone: Settings },
];

const TELAS_PRONTAS = ["dashboard", "extrato", "metas", "investimentos", "assinaturas"];

const TRANSACOES = [
  { id: 1, data: "03/08", descricao: "Uber", categoria: "Transporte", conta: "Nubank", valor: -32, tipo: "debit" },
  { id: 2, data: "02/08", descricao: "iFood", categoria: "Alimentação", conta: "Inter", valor: -58, tipo: "debit" },
  { id: 3, data: "01/08", descricao: "Salário", categoria: "Renda", conta: "Nubank", valor: 4200, tipo: "credit" },
  { id: 4, data: "31/07", descricao: "Netflix", categoria: "Assinaturas", conta: "Nubank", valor: -39.9, tipo: "debit" },
  { id: 5, data: "30/07", descricao: "Posto Shell", categoria: "Transporte", conta: "Inter", valor: -150, tipo: "debit" },
  { id: 6, data: "29/07", descricao: "Mercado Extra", categoria: "Alimentação", conta: "Nubank", valor: -210, tipo: "debit" },
];

const EVOLUCAO = [
  { mes: "Mar", saldo: 5200, gasto: 2680 },
  { mes: "Abr", saldo: 6100, gasto: 2340 },
  { mes: "Mai", saldo: 6800, gasto: 2510 },
  { mes: "Jun", saldo: 7200, gasto: 2190 },
  { mes: "Jul", saldo: 7800, gasto: 2350 },
  { mes: "Ago", saldo: 8420, gasto: 2180 },
];
const MAX_EVOLUCAO = Math.max(...EVOLUCAO.flatMap((e) => [e.saldo, e.gasto]));

const PROXIMAS_CONTAS = [
  { nome: "Netflix", Icone: Clapperboard, valor: 39.9, texto: "Vencimento em 6 dias" },
  { nome: "Spotify", Icone: Music, valor: 21.9, texto: "Vencimento em 11 dias" },
  { nome: "Notebook (3/10)", Icone: CreditCard, valor: 320, texto: "Vencimento em 14 dias" },
];

const METAS = [
  { id: 1, nome: "Viagem para a China", Icone: Plane, cor: "#3f7593", valorAtual: 3200, valorAlvo: 15000 },
  { id: 2, nome: "Reserva de emergência", Icone: PiggyBank, cor: "#4f817d", valorAtual: 6200, valorAlvo: 10000 },
  { id: 3, nome: "Notebook novo", Icone: Laptop, cor: "#173b4a", valorAtual: 1400, valorAlvo: 6000 },
];

const INVESTIMENTOS = [
  { id: 1, nome: "Tesouro Selic", tipo: "Renda fixa", Icone: TrendingUp, cor: "#3f7593", valorInvestido: 5000, valorAtual: 5320 },
  { id: 2, nome: "Ações (carteira)", tipo: "Renda variável", Icone: LineChart, cor: "#b06e86", valorInvestido: 2000, valorAtual: 1840 },
  { id: 3, nome: "CDB banco X", tipo: "Renda fixa", Icone: Landmark, cor: "#4f817d", valorInvestido: 3000, valorAtual: 3110 },
];

const ASSINATURAS = [
  { id: 1, nome: "Netflix", Icone: Clapperboard, cor: "#b98a2f", valor: 39.9, ciclo: "Mensal", proxima: "10/08" },
  { id: 2, nome: "Spotify", Icone: Music, cor: "#4f817d", valor: 21.9, ciclo: "Mensal", proxima: "15/08" },
];

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DemoBolsoLeve() {
  const [tela, setTela] = useState("login");
  const [entrando, setEntrando] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("dashboard");
  const [atualizando, setAtualizando] = useState(false);

  function aoEntrar(evento) {
    evento.preventDefault();
    setEntrando(true);
    setTimeout(() => {
      setEntrando(false);
      setTela("app");
    }, 500);
  }

  function aoAtualizar() {
    if (atualizando) return;
    setAtualizando(true);
    setTimeout(() => setAtualizando(false), 900);
  }

  const totalInvestido = INVESTIMENTOS.reduce((s, i) => s + i.valorInvestido, 0);
  const totalInvestimentoAtual = INVESTIMENTOS.reduce((s, i) => s + i.valorAtual, 0);
  const rendimento = (((totalInvestimentoAtual - totalInvestido) / totalInvestido) * 100).toFixed(1);
  const totalAssinaturas = ASSINATURAS.reduce((s, a) => s + a.valor, 0);

  return (
    <div className="bl-monitor">
      <div className="bl-monitor-barra">
        <div className="bl-monitor-bolinhas">
          <span />
          <span />
          <span />
        </div>
        <div className="bl-monitor-url">🔒 bolsoleve.app/{tela === "login" ? "login" : abaAtiva}</div>
      </div>

      <div className="bl-monitor-tela">
        <div className="bl-shell">
          {tela === "login" && (
            <div className="bl-login">
              <div className="bl-login-historia">
                <div className="bl-login-marca">
                  <span className="bl-marca" aria-hidden="true"><span /><span /></span>
                  Bolso Leve
                </div>

                <div>
                  <p className="bl-login-kicker">Equilíbrio financeiro</p>
                  <h1 className="bl-login-titulo">Organize seu dinheiro com clareza.</h1>
                  <p className="bl-login-sub">Mais controle para hoje. Mais tranquilidade para amanhã.</p>
                </div>

                <p className="bl-login-nota">Finanças mais simples para uma vida mais leve.</p>
              </div>

              <div className="bl-login-formulario">
                <form className="bl-login-card" onSubmit={aoEntrar}>
                  <p className="bl-login-card-kicker">Bem-vindo de volta</p>
                  <p className="bl-login-card-titulo">Acesse sua conta</p>
                  <p className="bl-login-card-sub">Acesse sua conta e continue sua jornada.</p>

                  <div className="bl-campo">
                    <label htmlFor="blEmail">E-mail</label>
                    <input id="blEmail" type="email" placeholder="Digite seu e-mail" defaultValue="visitante@exemplo.com" />
                  </div>
                  <div className="bl-campo">
                    <label htmlFor="blSenha">Senha</label>
                    <input id="blSenha" type="password" placeholder="Digite sua senha" defaultValue="demo1234" />
                  </div>

                  <label className="bl-lembrar">
                    <input type="checkbox" defaultChecked />
                    Manter conectado
                  </label>

                  <button type="submit" className="bl-btn-entrar" disabled={entrando}>
                    {entrando ? "Entrando..." : "Entrar"}
                  </button>

                  <div className="bl-login-privacidade">
                    <ShieldCheck size={13} />
                    Seus dados financeiros ficam só nessa conta.
                  </div>
                </form>
              </div>
            </div>
          )}

          {tela === "app" && (
            <div className="bl-app">
              <aside className="bl-sidebar">
                <div className="bl-sidebar-marca">
                  <span className="bl-marca" aria-hidden="true"><span /><span /></span>
                  Bolso Leve
                </div>
                {ITENS_MENU.map(({ id, label, Icone }) => (
                  <button
                    key={id}
                    type="button"
                    className={`bl-nav-item${abaAtiva === id ? " bl-ativo" : ""}`}
                    onClick={() => setAbaAtiva(id)}
                  >
                    <Icone size={15} />
                    {label}
                  </button>
                ))}
              </aside>

              <div className="bl-conteudo">
                {!TELAS_PRONTAS.includes(abaAtiva) && (
                  <p className="bl-em-breve">Essa tela não entrou nessa prévia — só as principais do dashboard.</p>
                )}

                {abaAtiva === "dashboard" && (
                  <>
                    <div className="bl-topo">
                      <div>
                        <p className="bl-saudacao">Boa tarde, visitante</p>
                        <p className="bl-topo-sub">Aqui está o resumo das suas finanças.</p>
                      </div>
                      <button type="button" className="bl-btn-atualizar" onClick={aoAtualizar}>
                        <RefreshCw size={13} className={atualizando ? "bl-girando" : ""} />
                        {atualizando ? "Atualizando..." : "Atualizar"}
                      </button>
                    </div>

                    <div className="bl-linha-topo">
                      <div className="bl-card bl-card-saldo">
                        <div>
                          <p className="bl-card-label">Saldo disponível</p>
                          <p className="bl-card-valor-grande">{formatarMoeda(8420)}</p>
                          <p className="bl-card-tendencia" style={{ color: "#4f817d" }}>
                            <ArrowUpRight size={11} style={{ display: "inline", verticalAlign: -1 }} /> +8% vs mês passado
                          </p>
                        </div>
                        <svg viewBox="0 0 90 60" width="72" aria-hidden="true">
                          <rect x="4" y="36" width="10" height="20" rx="2" fill="#4f817d" opacity="0.4" />
                          <rect x="20" y="26" width="10" height="30" rx="2" fill="#4f817d" opacity="0.6" />
                          <rect x="36" y="16" width="10" height="40" rx="2" fill="#4f817d" opacity="0.8" />
                          <rect x="52" y="6" width="10" height="50" rx="2" fill="#4f817d" />
                          <polyline points="4,38 20,28 36,18 62,8" fill="none" stroke="#4f817d" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>

                      <div className="bl-card">
                        <div className="bl-card-icone" style={{ background: "#e6f2ef", color: "#4f817d" }}>
                          <ArrowDownRight size={15} />
                        </div>
                        <p className="bl-card-label" style={{ marginTop: 8 }}>Entradas</p>
                        <p className="bl-card-mini-valor">{formatarMoeda(4200)}</p>
                        <p className="bl-resumo-sub">realizado este mês</p>
                      </div>

                      <div className="bl-card">
                        <div className="bl-card-icone" style={{ background: "#f7e9e4", color: "#d78673" }}>
                          <ArrowUpRight size={15} />
                        </div>
                        <p className="bl-card-label" style={{ marginTop: 8 }}>Saídas</p>
                        <p className="bl-card-mini-valor">{formatarMoeda(2180)}</p>
                        <p className="bl-resumo-sub">realizado este mês</p>
                      </div>
                    </div>

                    <div className="bl-linha-meio">
                      <div className="bl-card">
                        <div className="bl-evolucao-legenda">
                          <span className="bl-secao-titulo" style={{ marginBottom: 0 }}>Fluxo de caixa</span>
                          <span style={{ display: "flex", gap: 10, fontSize: 10, color: "#7d8997" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4f817d", display: "inline-block" }} /> Saldo
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#d78673", display: "inline-block" }} /> Gasto
                            </span>
                          </span>
                        </div>
                        <div className="bl-evolucao-barras">
                          {EVOLUCAO.map((item) => (
                            <div className="bl-evolucao-col" key={item.mes}>
                              <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: "100%", width: "100%", justifyContent: "center" }}>
                                <div style={{ height: `${(item.saldo / MAX_EVOLUCAO) * 100}%`, width: 8, background: "#4f817d", borderRadius: "3px 3px 0 0" }} />
                                <div style={{ height: `${(item.gasto / MAX_EVOLUCAO) * 100}%`, width: 8, background: "#d78673", borderRadius: "3px 3px 0 0" }} />
                              </div>
                              <span className="bl-evolucao-mes">{item.mes}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bl-card">
                        <p className="bl-secao-titulo">Próximas contas</p>
                        {PROXIMAS_CONTAS.map((conta) => (
                          <div className="bl-proxima-conta" key={conta.nome}>
                            <span className="bl-proxima-icone">
                              <conta.Icone size={13} />
                            </span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div>{conta.nome}</div>
                              <div style={{ fontSize: 10, color: "#7d8997" }}>{conta.texto}</div>
                            </div>
                            <span style={{ fontWeight: 600 }}>{formatarMoeda(conta.valor)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bl-card" style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <p className="bl-secao-titulo" style={{ marginBottom: 0 }}>Transações recentes</p>
                        <span style={{ fontSize: 11, color: "#4f817d", fontWeight: 600, display: "flex", alignItems: "center" }}>
                          Ver tudo <ChevronRight size={12} />
                        </span>
                      </div>
                      <table className="bl-tabela">
                        <thead>
                          <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th style={{ textAlign: "right" }}>Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {TRANSACOES.slice(0, 4).map((t) => (
                            <tr key={t.id}>
                              <td style={{ color: "#7d8997" }}>{t.data}</td>
                              <td style={{ fontWeight: 600 }}>{t.descricao}</td>
                              <td><span className="bl-tag-categoria">{t.categoria}</span></td>
                              <td style={{ textAlign: "right", fontWeight: 700, color: t.tipo === "credit" ? "#4f817d" : "#d78673" }}>
                                {t.tipo === "credit" ? "+" : "-"}
                                {formatarMoeda(Math.abs(t.valor))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bl-card" style={{ marginBottom: 12 }}>
                      <p className="bl-secao-titulo">Metas e planos</p>
                      <div className="bl-metas-grid">
                        {METAS.slice(0, 2).map((meta) => {
                          const porcentagem = Math.min(100, Math.round((meta.valorAtual / meta.valorAlvo) * 100));
                          return (
                            <div className="bl-meta-card" key={meta.id}>
                              <div className="bl-meta-cabecalho">
                                <meta.Icone size={15} color={meta.cor} />
                                {meta.nome}
                              </div>
                              <div className="bl-progresso-trilho">
                                <div className="bl-progresso-fill" style={{ width: `${porcentagem}%`, background: meta.cor }} />
                              </div>
                              <div className="bl-progresso-info">
                                <span>{porcentagem}%</span>
                                <span>{formatarMoeda(meta.valorAtual)} de {formatarMoeda(meta.valorAlvo)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bl-resumo-grid">
                      <div className="bl-card">
                        <div className="bl-resumo-topo">
                          <span>Investimentos</span>
                          <span style={{ color: "#4f817d", fontWeight: 600 }}>Ver todos</span>
                        </div>
                        <p className="bl-resumo-valor">{formatarMoeda(totalInvestimentoAtual)}</p>
                        <p className="bl-resumo-sub" style={{ color: rendimento >= 0 ? "#4f817d" : "#d78673" }}>
                          {rendimento >= 0 ? "+" : ""}
                          {rendimento}% desde o investido
                        </p>
                      </div>
                      <div className="bl-card">
                        <div className="bl-resumo-topo">
                          <span>Assinaturas</span>
                          <span style={{ color: "#4f817d", fontWeight: 600 }}>Ver todas</span>
                        </div>
                        <p className="bl-resumo-valor" style={{ color: "#d78673" }}>{formatarMoeda(totalAssinaturas)}/mês</p>
                        <p className="bl-resumo-sub">{ASSINATURAS.length} assinaturas ativas</p>
                      </div>
                      <div className="bl-card">
                        <div className="bl-resumo-topo">
                          <span>Orçamento do mês</span>
                          <span style={{ color: "#4f817d", fontWeight: 600 }}>Ver detalhes</span>
                        </div>
                        <p className="bl-resumo-valor" style={{ color: "#4f817d" }}>{formatarMoeda(2020)}</p>
                        <p className="bl-resumo-sub">receita − despesa realizadas</p>
                      </div>
                    </div>
                  </>
                )}

                {abaAtiva === "extrato" && (
                  <>
                    <p className="bl-saudacao" style={{ marginBottom: 14 }}>Extrato</p>
                    <div className="bl-card">
                      <table className="bl-tabela">
                        <thead>
                          <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Conta</th>
                            <th style={{ textAlign: "right" }}>Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {TRANSACOES.map((t) => (
                            <tr key={t.id}>
                              <td style={{ color: "#7d8997" }}>{t.data}</td>
                              <td style={{ fontWeight: 600 }}>{t.descricao}</td>
                              <td><span className="bl-tag-categoria">{t.categoria}</span></td>
                              <td style={{ color: "#7d8997" }}>{t.conta}</td>
                              <td style={{ textAlign: "right", fontWeight: 700, color: t.tipo === "credit" ? "#4f817d" : "#d78673" }}>
                                {t.tipo === "credit" ? "+" : "-"}
                                {formatarMoeda(Math.abs(t.valor))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {abaAtiva === "metas" && (
                  <>
                    <p className="bl-saudacao" style={{ marginBottom: 14 }}>Metas e planos</p>
                    <div className="bl-metas-grid">
                      {METAS.map((meta) => {
                        const porcentagem = Math.min(100, Math.round((meta.valorAtual / meta.valorAlvo) * 100));
                        return (
                          <div className="bl-card" key={meta.id}>
                            <div className="bl-meta-cabecalho">
                              <meta.Icone size={16} color={meta.cor} />
                              {meta.nome}
                            </div>
                            <div className="bl-progresso-trilho">
                              <div className="bl-progresso-fill" style={{ width: `${porcentagem}%`, background: meta.cor }} />
                            </div>
                            <div className="bl-progresso-info">
                              <span>{porcentagem}%</span>
                              <span>{formatarMoeda(meta.valorAtual)} de {formatarMoeda(meta.valorAlvo)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {abaAtiva === "investimentos" && (
                  <>
                    <p className="bl-saudacao" style={{ marginBottom: 14 }}>Investimentos</p>
                    <div className="bl-metas-grid">
                      {INVESTIMENTOS.map((inv) => {
                        const rend = (((inv.valorAtual - inv.valorInvestido) / inv.valorInvestido) * 100).toFixed(1);
                        return (
                          <div className="bl-card" key={inv.id}>
                            <div className="bl-meta-cabecalho">
                              <inv.Icone size={16} color={inv.cor} />
                              {inv.nome}
                            </div>
                            <p className="bl-resumo-sub" style={{ marginBottom: 8 }}>{inv.tipo}</p>
                            <p className="bl-resumo-valor">{formatarMoeda(inv.valorAtual)}</p>
                            <p className="bl-resumo-sub" style={{ color: rend >= 0 ? "#4f817d" : "#d78673" }}>
                              {rend >= 0 ? "+" : ""}
                              {rend}% desde o investido
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {abaAtiva === "assinaturas" && (
                  <>
                    <p className="bl-saudacao" style={{ marginBottom: 14 }}>Assinaturas</p>
                    <div className="bl-card">
                      {ASSINATURAS.map((a) => (
                        <div className="bl-proxima-conta" key={a.id}>
                          <span className="bl-proxima-icone">
                            <a.Icone size={14} color={a.cor} />
                          </span>
                          <div style={{ flex: 1 }}>
                            <div>{a.nome}</div>
                            <div style={{ fontSize: 10, color: "#7d8997" }}>{a.ciclo} · próxima em {a.proxima}</div>
                          </div>
                          <span style={{ color: "#d78673", fontWeight: 700 }}>{formatarMoeda(a.valor)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
