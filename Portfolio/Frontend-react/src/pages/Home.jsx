import { Hero } from "../components/Hero/Hero.jsx";
import { TerminalExperiencias } from "../components/Terminal/TerminalExperiencias.jsx";
import { PerfilCarrossel } from "../components/PerfilCarrossel/PerfilCarrossel.jsx";
import { FormularioContato } from "../components/Contato/FormularioContato.jsx";
import { ContatosDevmateus } from "../components/Contato/ContatosDevmateus.jsx";
import { Rodape } from "../components/Rodape.jsx";

/** Home: hero + terminal/tecnologias + contato + rodapé (as 3 seções originais do site). */
export function Home() {
  return (
    <main className="container-devmateus">
      <Hero />

      <section className="container__sessao_dois-devmateus">
        <TerminalExperiencias />
        <PerfilCarrossel />
      </section>

      <section className="container__sessao_utres-devmateus">
        <FormularioContato />
        <ContatosDevmateus />
      </section>

      <Rodape />
    </main>
  );
}
