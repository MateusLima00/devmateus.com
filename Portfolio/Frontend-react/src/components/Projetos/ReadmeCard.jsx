import { useGithubAtividade, useGithubLinguagens } from "../../hooks/useGithub.js";
import { useSkills, useStatsPortfolio } from "../../hooks/useProjetos.js";

const ROTULOS_DIA = ["", "Seg", "", "Qua", "", "Sex", ""]; // igual ao GitHub: só ímpares aparecem

/** README.md do perfil: saudação, banner, redes, stats, skills, linguagens e heatmap de atividade. */
export function ReadmeCard() {
  const stats = useStatsPortfolio();
  const skills = useSkills();
  const linguagens = useGithubLinguagens();
  const atividade = useGithubAtividade();

  return (
    <article className="readme-card">
      <div className="vscode-barra">
        <span className="vscode-bolha vscode-bolha--vermelha"></span>
        <span className="vscode-bolha vscode-bolha--amarela"></span>
        <span className="vscode-bolha vscode-bolha--verde"></span>
        <span className="vscode-aba">MateusLima00 / README.md</span>
      </div>

      <div className="readme-card__corpo">
        <p className="readme-card__saudacao">Hi there! 👋 — Bem-vindo(a) ao meu perfil</p>

        <div className="readme-card__banner">
          <h2 className="readme-card__banner-titulo">Mateus Lima</h2>
          <p className="readme-card__banner-usuario">@MateusLima00</p>
        </div>

        <ul className="readme-card__redes">
          <li>
            <a href="https://www.linkedin.com/in/mateus-costa-3b5960207/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/img/ICONES-REDESOCIAL/icons8-linkedin-48.png" alt="" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/mateuslmx_" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/img/ICONES-REDESOCIAL/image.png" alt="" />
            </a>
          </li>
          <li>
            <a href="https://github.com/MateusLima00" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <img src="/img/ICONES-REDESOCIAL/icons8-github-48.png" alt="" />
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <img src="/img/ICONES-REDESOCIAL/icons8-tiktok-48.png" alt="" />
            </a>
          </li>
        </ul>

        <ul className="readme-card__atualmente">
          <li>🖥️ Atualmente trabalho com infraestrutura de TI (redes, AD, suporte)</li>
          <li>🔄 Migrando carreira pra desenvolvimento</li>
          <li>📚 Cursando: especialização em segurança e boas práticas de código</li>
        </ul>

        {stats && (
          <div className="readme-card__stats" aria-live="polite">
            {stats.map((item) => (
              <div className="readme-card__stat" key={item.rotulo}>
                <strong>{item.valor}</strong>
                <span>{item.rotulo}</span>
              </div>
            ))}
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="readme-card__skills">
            <h3 className="readme-card__skills-titulo">Skills</h3>
            <ul className="readme-card__badges">
              {skills.map((tecnologia) => (
                <li className="readme-card__badge readme-card__badge--skill" key={tecnologia.nome}>
                  {tecnologia.icone && <img src={tecnologia.icone} alt="" />}
                  {tecnologia.nome}
                </li>
              ))}
            </ul>
          </div>
        )}

        {linguagens && (
          <div className="readme-card__linguagens">
            <h3 className="readme-card__secao-titulo">Top Languages</h3>

            <div className="readme-card__barra-linguagens">
              {linguagens.map(({ linguagem, porcentagem, cor }) => (
                <span key={linguagem} className="readme-card__barra-segmento" style={{ width: `${porcentagem}%`, background: cor }} />
              ))}
            </div>

            <ul className="readme-card__linguagens-legenda">
              {linguagens.map(({ linguagem, porcentagem, cor }) => (
                <li className="readme-card__linguagem-item" key={linguagem}>
                  <span className="readme-card__linguagem-ponto" style={{ background: cor }} />
                  {linguagem}
                  <span className="readme-card__linguagem-porcentagem">{porcentagem}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {atividade && (
          <div className="readme-card__atividade">
            <h3 className="readme-card__secao-titulo">Contribution Activity</h3>

            <div className="readme-card__heatmap">
              <div className="readme-card__heatmap-corpo">
                <div className="readme-card__heatmap-dias-semana">
                  {ROTULOS_DIA.map((rotulo, indice) => (
                    <span key={indice}>{rotulo}</span>
                  ))}
                </div>

                <div className="readme-card__heatmap-principal">
                  <div className="readme-card__heatmap-meses">
                    {atividade.rotulosMes.map((rotulo, indice) => (
                      <span key={indice}>{rotulo}</span>
                    ))}
                  </div>

                  <div className="readme-card__heatmap-grade" style={{ gridTemplateColumns: `repeat(${atividade.semanas.length}, 1fr)` }}>
                    {atividade.semanas.map((semana, indiceSemana) => (
                      <div className="readme-card__heatmap-semana" key={indiceSemana}>
                        {semana.map((dia, indiceDia) =>
                          dia ? (
                            <span
                              key={indiceDia}
                              className="readme-card__heatmap-dia"
                              data-nivel={dia.level}
                              title={`${dia.count} contribuições em ${dia.date}`}
                            />
                          ) : (
                            <span key={indiceDia} className="readme-card__heatmap-dia readme-card__heatmap-dia--vazio" />
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="readme-card__heatmap-legenda">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((nivel) => (
                  <span key={nivel} className="readme-card__heatmap-dia" data-nivel={nivel} />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
