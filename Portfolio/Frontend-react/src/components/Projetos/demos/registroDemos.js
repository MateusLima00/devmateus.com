import { DemoControleTi } from "./DemoControleTi.jsx";
import { DemoBolsoLeve } from "./DemoBolsoLeve.jsx";

/**
 * Mapeia o campo "demo" de /data/projetos.json pro componente React que
 * desenha a prévia interativa daquele projeto. Um projeto sem "demo"
 * simplesmente não tem essa seção no modal (ver ProjetoModal.jsx).
 */
export const REGISTRO_DEMOS = {
  "controle-ti": DemoControleTi,
  "bolso-leve": DemoBolsoLeve,
};
