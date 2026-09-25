import { LinkComTransicao } from "../components/LinkComTransicao.jsx";

/**
 * Página /sobre — ainda em construção (o conteúdo de verdade fica pra
 * depois). Estilizada em Tailwind, diferente do resto do site (CSS puro em
 * src/styles/) — é a única página que usa Tailwind por enquanto.
 */
export function SobrePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">Em produção...</h1>

      <LinkComTransicao
        to="/"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
      >
        ← Voltar
      </LinkComTransicao>
    </div>
  );
}
