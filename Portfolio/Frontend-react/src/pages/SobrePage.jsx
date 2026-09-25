import { LinkComTransicao } from "../components/LinkComTransicao.jsx";
import { Rodape } from "../components/Rodape.jsx";

/**
 * Página /sobre — ainda em construção (o conteúdo de verdade fica pra
 * depois). O botão de voltar usa a classe compartilhada `.botao-voltar`
 * (CSS puro, ver secoes/botao-voltar.css) em vez de Tailwind — o resto do
 * site inteiro é CSS puro, então essa era a única página sem estilo de
 * verdade aplicado a esse botão.
 */
export function SobrePage() {
  return (
    <div className="pagina-sobre-body">
      <LinkComTransicao className="botao-voltar" to="/">
        Voltar
      </LinkComTransicao>

      <main className="pagina-sobre">
        <h1 className="pagina-sobre__titulo">Em produção...</h1>
      </main>

      <Rodape />
    </div>
  );
}
