import { useEffect, useRef } from "react";

/**
 * Porta de assets/js/chuva-codigo.js: chuva de código estilo "Matrix"
 * atrás do globo, puramente decorativa, em loop com requestAnimationFrame.
 * pointer-events:none (CSS) — não atrapalha o arraste do globo por cima.
 */

const CARACTERES = "01{}<>/;()[]=+-*ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TAMANHO_FONTE = 15;
const COR_RASTRO = "rgba(2, 4, 8, 0.08)"; // sobrepõe o frame anterior sem apagar de vez -> efeito de rastro
const COR_CARACTERE = "rgba(85, 152, 225, 0.4)"; // mesmo azul do resto do site

export function ChuvaCodigo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let larguraCanvas = 0;
    let alturaCanvas = 0;
    let posicaoYPorColuna = [];
    let idAnimacao;

    function ajustarTamanho() {
      larguraCanvas = canvas.offsetWidth;
      alturaCanvas = canvas.offsetHeight;
      canvas.width = larguraCanvas;
      canvas.height = alturaCanvas;

      const colunas = Math.floor(larguraCanvas / TAMANHO_FONTE);
      posicaoYPorColuna = Array.from({ length: colunas }, () => Math.random() * -100);
    }

    function desenharFrame() {
      ctx.fillStyle = COR_RASTRO;
      ctx.fillRect(0, 0, larguraCanvas, alturaCanvas);

      ctx.fillStyle = COR_CARACTERE;
      ctx.font = `${TAMANHO_FONTE}px monospace`;

      posicaoYPorColuna.forEach((linha, coluna) => {
        const caractere = CARACTERES[Math.floor(Math.random() * CARACTERES.length)];
        const x = coluna * TAMANHO_FONTE;
        const y = linha * TAMANHO_FONTE;

        ctx.fillText(caractere, x, y);

        // reinicia a coluna lá em cima depois de passar do fim (aleatório, pra não cair tudo junto)
        if (y > alturaCanvas && Math.random() > 0.975) {
          posicaoYPorColuna[coluna] = 0;
        } else {
          posicaoYPorColuna[coluna] += 1;
        }
      });
    }

    function loop() {
      desenharFrame();
      idAnimacao = requestAnimationFrame(loop);
    }

    ajustarTamanho();
    window.addEventListener("resize", ajustarTamanho);
    idAnimacao = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(idAnimacao);
      window.removeEventListener("resize", ajustarTamanho);
    };
  }, []);

  return <canvas ref={canvasRef} className="chuva-codigo" />;
}
