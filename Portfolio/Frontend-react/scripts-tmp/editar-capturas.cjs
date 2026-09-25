const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const BASE = path.resolve(
  __dirname,
  "..",
  "public/img/IMAGENS-PROJETOS/controle-ti/capturas"
);
const OUT = path.resolve(BASE, "editado");

fs.mkdirSync(path.join(OUT, "celular"), { recursive: true });
fs.mkdirSync(path.join(OUT, "tablet"), { recursive: true });

function caixa(w, h, cor) {
  return sharp({ create: { width: w, height: h, channels: 4, background: cor } }).png().toBuffer();
}

const NAVY = { r: 0x1a, g: 0x1a, b: 0x7a, alpha: 1 };
const BRANCO = { r: 0xff, g: 0xff, b: 0xff, alpha: 1 };
const LAVANDA = { r: 0xe4, g: 0xe2, b: 0xfb, alpha: 1 };

async function redigir(entrada, saida, boxes) {
  const composites = [];
  for (const b of boxes) {
    composites.push({ input: await caixa(b.w, b.h, b.cor), left: b.x, top: b.y });
  }
  await sharp(entrada).composite(composites).toFile(saida);
  console.log("ok:", saida);
}

async function cortarERedigir(entrada, saida, larguraCorte, boxes) {
  const composites = [];
  for (const b of boxes) {
    composites.push({ input: await caixa(b.w, b.h, b.cor), left: b.x, top: b.y });
  }
  const img = sharp(entrada);
  const meta = await img.metadata();
  await img
    .extract({ left: 0, top: 0, width: Math.min(larguraCorte, meta.width), height: meta.height })
    .composite(composites)
    .toFile(saida);
  console.log("ok:", saida);
}

async function main() {
  // ── Desktop ──
  await redigir(
    path.join(BASE, "Captura de tela 2026-09-24 211946.png"),
    path.join(OUT, "desktop-1-dashboard.png"),
    [
      { x: 0, y: 0, w: 260, h: 150, cor: NAVY }, // logo + "TI Unilink" da sidebar
      { x: 285, y: 35, w: 410, h: 60, cor: BRANCO }, // "Painel de TI — Unilink Transportes"
    ]
  );

  await redigir(
    path.join(BASE, "Captura de tela 2026-09-24 212105.png"),
    path.join(OUT, "desktop-2-chamados.png"),
    [
      { x: 835, y: 350, w: 125, h: 270, cor: BRANCO }, // coluna Solicitante (nomes reais)
      { x: 1195, y: 350, w: 90, h: 270, cor: BRANCO }, // coluna Técnico atribuído (nome real)
    ]
  );

  await redigir(
    path.join(BASE, "Captura de tela 2026-09-24 212156.png"),
    path.join(OUT, "desktop-3-portal.png"),
    [
      { x: 638, y: 36, w: 300, h: 66, cor: NAVY }, // logo + "Suporte de TI — Unilink Transportes"
      { x: 1495, y: 455, w: 240, h: 100, cor: LAVANDA }, // balão do chat mencionando "Unilink"
    ]
  );

  await redigir(
    path.join(BASE, "Captura de tela 2026-09-24 212322.png"),
    path.join(OUT, "desktop-4-manutencao.png"),
    [{ x: 775, y: 85, w: 340, h: 200, cor: BRANCO }] // logo + título "Manutenção preventiva — TI"
  );

  fs.copyFileSync(
    path.join(BASE, "Captura de tela 2026-09-10 204847.png"),
    path.join(OUT, "desktop-5-tarefas.png")
  ); // sem marca/dado sensível — só copia

  // ── Celular (recorta o painel do DevTools + redige o que tiver marca) ──
  await cortarERedigir(
    path.join(BASE, "Celular", "Captura de tela 2026-09-24 212415.png"),
    path.join(OUT, "celular", "celular-1-dashboard.png"),
    1400,
    [{ x: 800, y: 218, w: 310, h: 55, cor: BRANCO }] // "Painel de TI — Unilink Transportes"
  );

  await cortarERedigir(
    path.join(BASE, "Celular", "Captura de tela 2026-09-24 212453.png"),
    path.join(OUT, "celular", "celular-2-manutencao.png"),
    1390,
    [{ x: 780, y: 255, w: 260, h: 180, cor: BRANCO }] // logo + título "Manutenção preventiva — TI"
  );

  await cortarERedigir(
    path.join(BASE, "Celular", "Captura de tela 2026-09-24 212535.png"),
    path.join(OUT, "celular", "celular-3-chamado.png"),
    1530,
    []
  );

  // ── Tablet (idem) ──
  await cortarERedigir(
    path.join(BASE, "tablet", "Captura de tela 2026-09-24 212558.png"),
    path.join(OUT, "tablet", "tablet-1-portal.png"),
    1420,
    [{ x: 785, y: 313, w: 220, h: 32, cor: NAVY }] // texto pequeno do cabeçalho
  );

  await cortarERedigir(
    path.join(BASE, "tablet", "Captura de tela 2026-09-24 212632.png"),
    path.join(OUT, "tablet", "tablet-2-dashboard.png"),
    1430,
    [{ x: 720, y: 233, w: 300, h: 32, cor: BRANCO }] // texto pequeno do cabeçalho
  );

  await cortarERedigir(
    path.join(BASE, "tablet", "Captura de tela 2026-09-24 212710.png"),
    path.join(OUT, "tablet", "tablet-3-termos.png"),
    1410,
    [{ x: 840, y: 310, w: 210, h: 90, cor: BRANCO }] // logo grande
  );
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
