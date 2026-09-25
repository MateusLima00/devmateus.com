import { useEffect, useRef } from "react";
import createGlobe from "cobe";

/**
 * Porta de assets/js/globo.js: globo 3D giratório (lib "cobe"), com
 * arraste em dois eixos e inércia ao soltar. Só tem um marcador, no Brasil.
 *
 * Na versão vanilla, voltar pro site pelo botão "voltar" do navegador podia
 * restaurar a página do bfcache e perder o contexto WebGL do canvas — aqui
 * isso nem existe: o React desmonta esse componente ao trocar de rota e
 * remonta (recria o globo do zero) ao voltar pra home, então o problema
 * simplesmente não acontece.
 */

const MARCADOR_BRASIL = { location: [-14.235, -51.9253], size: 0.09 };

const VELOCIDADE_AUTO_ROTACAO = 0.0035; // giro contínuo quando não está sendo arrastado
const ATRITO_INERCIA = 0.94; // quanto mais perto de 1, mais tempo o globo continua girando após soltar
const SENSIBILIDADE_ARRASTE = 0.011;

const THETA_MIN = -Math.PI / 2 + 0.05;
const THETA_MAX = Math.PI / 2 - 0.05;

export function Globo() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    let phi = 0;
    let theta = 0.28;
    let velocidadePhi = 0;
    let larguraCanvas = 0;
    let arrastando = false;
    let pontoInicialX = 0;
    let pontoInicialY = 0;
    let phiNoInicioDoArraste = 0;
    let thetaNoInicioDoArraste = 0;

    function ajustarTamanhoCanvas() {
      larguraCanvas = canvas.offsetWidth;
      canvas.width = larguraCanvas * 2;
      canvas.height = canvas.offsetHeight * 2;
    }

    ajustarTamanhoCanvas();

    // ResizeObserver em vez de só "resize" da janela: cobre qualquer mudança
    // de tamanho do canvas (inclusive de layout, não só a janela inteira
    // mudando), sem depender de quando exatamente o CSS terminou de aplicar.
    const observador = new ResizeObserver(ajustarTamanhoCanvas);
    observador.observe(canvas);

    const globo = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: larguraCanvas * 2,
      height: canvas.offsetHeight * 2,
      phi: 0,
      theta,
      dark: 1,
      diffuse: 1.6,
      mapSamples: 24000,
      mapBrightness: 6,
      baseColor: [0.15, 0.2, 0.35],
      markerColor: [0.06, 0.98, 0.45],
      glowColor: [0.15, 0.35, 0.9],
      markers: [MARCADOR_BRASIL],

      onRender(state) {
        if (!arrastando) {
          phi += VELOCIDADE_AUTO_ROTACAO + velocidadePhi;
          velocidadePhi *= ATRITO_INERCIA;
        }

        state.phi = phi;
        state.theta = theta;
        state.width = larguraCanvas * 2;
        state.height = canvas.offsetHeight * 2;
      },
    });

    function aoPressionar(evento) {
      arrastando = true;
      pontoInicialX = evento.clientX;
      pontoInicialY = evento.clientY;
      phiNoInicioDoArraste = phi;
      thetaNoInicioDoArraste = theta;
      velocidadePhi = 0;

      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(evento.pointerId);
    }

    function aoMover(evento) {
      if (!arrastando) return;

      const deltaX = evento.clientX - pontoInicialX;
      const novoPhi = phiNoInicioDoArraste + deltaX * SENSIBILIDADE_ARRASTE;
      velocidadePhi = novoPhi - phi;
      phi = novoPhi;

      const deltaY = evento.clientY - pontoInicialY;
      const novoTheta = thetaNoInicioDoArraste - deltaY * SENSIBILIDADE_ARRASTE;
      theta = Math.min(THETA_MAX, Math.max(THETA_MIN, novoTheta));
    }

    function aoSoltar() {
      arrastando = false;
      canvas.style.cursor = "grab";
    }

    function aoSairSemArrastar() {
      if (!arrastando) canvas.style.cursor = "grab";
    }

    canvas.addEventListener("pointerdown", aoPressionar);
    canvas.addEventListener("pointermove", aoMover);
    canvas.addEventListener("pointerup", aoSoltar);
    canvas.addEventListener("pointerout", aoSairSemArrastar);

    return () => {
      globo.destroy();
      observador.disconnect();
      canvas.removeEventListener("pointerdown", aoPressionar);
      canvas.removeEventListener("pointermove", aoMover);
      canvas.removeEventListener("pointerup", aoSoltar);
      canvas.removeEventListener("pointerout", aoSairSemArrastar);
    };
  }, []);

  return <canvas ref={canvasRef} className="globo-devmateus" />;
}
