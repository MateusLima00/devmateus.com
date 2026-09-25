import { Link } from "react-router-dom";
import { useTransicaoPagina } from "../context/TransicaoPaginaContext.jsx";

/**
 * <Link> comum, só que aciona a transição circular (ver
 * TransicaoPaginaContext) antes de trocar de rota. Usar no lugar de
 * <Link>/<a> em toda navegação interna do site.
 */
export function LinkComTransicao({ to, children, ...resto }) {
  const { navegarCom } = useTransicaoPagina();

  return (
    <Link to={to} onClick={(evento) => navegarCom(evento, to)} {...resto}>
      {children}
    </Link>
  );
}
