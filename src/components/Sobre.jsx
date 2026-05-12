// ─────────────────────────────────────────────
// Sobre.jsx — Seção hero (primeira tela)
//
// Responsabilidades:
//   • Apresentar foto de perfil com animação de anéis
//   • Exibir nome com efeito typewriter
//   • Mostrar texto de apresentação
//   • Indicar scroll com seta animada
//
// Sem props — dados estáticos do próprio dev.
// ─────────────────────────────────────────────

function Sobre() {
  return (
    <section className="container__sobre">

      {/* Wrapper dos anéis giratórios — os anéis são
          criados via ::before e ::after no CSS */}
      <div className="foto__perfil__anel">
        <img
          src="/img/IMG_7889.PNG"
          alt="Foto de perfil de Mateus Lima"
          className="foto__perfil_inicio"
        />
      </div>

      <h2 className="container__inicio__titulo">Oi, eu sou o</h2>

      {/* Nome com animação de typewriter + gradiente de texto */}
      <h1 className="container__inicio_nome">Mateus Lima :)</h1>

      <p className="container__inicio__texto">
        Procuro sempre me desenvolver mais, gosto muito de aprender e ter novos desafios,
        acho que só assim você aprende, na prática. Aqui vocês vão ver minhas experiências,
        conhecimentos, certificados e projetos já publicados que tenho, irei deixar minhas
        redes sociais para dúvidas, sugestão ou troca de conhecimentos também, bora lá
      </p>

      {/* Seta animada que indica "role para baixo" */}
      <div className="seta" aria-hidden="true">↓</div>

    </section>
  )
}

export default Sobre
