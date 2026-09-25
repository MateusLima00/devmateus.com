import { useEffect, useRef } from "react";
import { LinkComTransicao } from "../LinkComTransicao.jsx";
import { ChuvaCodigo } from "./ChuvaCodigo.jsx";
import { Globo } from "./Globo.jsx";
import { useHeroVisibilidade } from "../../context/HeroVisibilidadeContext.jsx";

/**
 * Seção 1 (hero) da home: título + globo 3D. O texto fica sempre visível
 * (sem depender da intro terminar) — a pedido explícito, pra não correr
 * risco de parecer "apagado" enquanto a intro ainda está tocando.
 *
 * Também informa o HeroVisibilidadeContext quando sai da tela, pra
 * <BarraNavegacao> saber a hora de aparecer.
 */
export function Hero() {
  const { setHeroVisivel } = useHeroVisibilidade();
  const secaoRef = useRef(null);

  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao) return;

    const observador = new IntersectionObserver(([entrada]) => setHeroVisivel(entrada.isIntersecting), {
      threshold: 0,
    });

    observador.observe(secao);
    return () => observador.disconnect();
  }, [setHeroVisivel]);

  return (
    <section ref={secaoRef} className="container__sessao_um-devmateus">
      <div className="hero-texto">
        <h1 className="titulo">Mateus Lima</h1>
        <h3 className="subTitulo_provissao">Engenheiro de Software - em formação</h3>
        <p className="texto_segundario">"Código limpo, arquitetura escalável e soluções prontas para enfrentar desafios reais."</p>

        <div className="btn-paginas">
          <LinkComTransicao to="/sobre">Sobre me</LinkComTransicao>
          <LinkComTransicao to="/projetos">Projetos</LinkComTransicao>
        </div>
      </div>

      <ChuvaCodigo />
      <Globo />
    </section>
  );
}
