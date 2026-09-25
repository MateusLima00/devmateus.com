import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Porta de assets/js/transicao-pagina.js pro React Router: o overlay com
 * "buraco" circular (clip-path) continua o mesmo efeito visual, mas em vez
 * de interceptar cliques em <a> e navegar via location.href (recarregando
 * a página), aqui a troca de rota é feita pelo próprio React Router — o
 * componente só orquestra a animação em volta dela.
 *
 * Fluxo:
 *   1. navegarCom(evento, destino) — chamado pelos links do site em vez de
 *      deixar o <Link>/<a> navegar direto. Guarda o ponto do clique, fecha
 *      o "buraco" (círculo cresce cobrindo a tela) e só troca de rota
 *      depois da animação terminar.
 *   2. Ao entrar numa rota nova, o círculo começa cobrindo tudo (a origem
 *      é a mesma do clique, pra dar sensação de continuidade) e encolhe,
 *      revelando a página.
 */

const TransicaoPaginaContext = createContext(null);

const DURACAO_MS = 650; // mantido em sincronia com o CSS (--duracao-transicao)

export function TransicaoPaginaProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [origem, setOrigem] = useState({ x: "50%", y: "50%" });
  const [aberta, setAberta] = useState(false);
  const origemPendente = useRef(null);

  // Ao trocar de rota: se tinha uma origem de clique guardada, usa ela;
  // senão (link direto/refresh) abre a partir do centro da tela.
  useEffect(() => {
    if (origemPendente.current) {
      setOrigem(origemPendente.current);
      origemPendente.current = null;
    }

    // Dois rAF: garante que o navegador pintou o estado "coberta" antes
    // de ligar a classe que dispara a transição (senão os dois estados
    // podem ser fundidos num frame só e a animação não roda).
    setAberta(false);
    const quadro1 = requestAnimationFrame(() => {
      const quadro2 = requestAnimationFrame(() => setAberta(true));
      return () => cancelAnimationFrame(quadro2);
    });
    return () => cancelAnimationFrame(quadro1);
  }, [location.pathname]);

  const navegarCom = useCallback(
    (evento, destino) => {
      // Ctrl/Cmd/Shift+clique e clique do meio abrem em nova aba — deixa passar
      if (evento.button !== 0 || evento.ctrlKey || evento.metaKey || evento.shiftKey) return;
      if (destino === location.pathname) return; // já está na página, não anima à toa

      evento.preventDefault();
      origemPendente.current = { x: `${evento.clientX}px`, y: `${evento.clientY}px` };
      setOrigem(origemPendente.current);
      setAberta(false); // círculo cresce, cobrindo a tela

      setTimeout(() => navigate(destino), DURACAO_MS);
    },
    [location.pathname, navigate]
  );

  return (
    <TransicaoPaginaContext.Provider value={{ navegarCom }}>
      <div
        className={`transicao-pagina${aberta ? " transicao-pagina--aberta" : ""}`}
        style={{ "--tp-x": origem.x, "--tp-y": origem.y }}
        aria-hidden="true"
      />
      {children}
    </TransicaoPaginaContext.Provider>
  );
}

/** Hook pros links do site — ver componente <LinkComTransicao>. */
export function useTransicaoPagina() {
  const contexto = useContext(TransicaoPaginaContext);
  if (!contexto) throw new Error("useTransicaoPagina precisa estar dentro de <TransicaoPaginaProvider>");
  return contexto;
}
