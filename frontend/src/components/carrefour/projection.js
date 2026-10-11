// Projection de la carte « Le Carrefour » (projection de Miller) : de la côte ouest des États-Unis
// jusqu'au Moyen-Orient, de l'Afrique australe au nord de l'Europe. Cadre large (≈ 1,8 : 1) pour
// remplir l'écran d'un bord à l'autre. Utilisée par la page et par scripts/carrefour-carte.mjs
// (qui génère les points des continents) : après un changement ici, relancer « npm run carte ».
export const BOUNDS = { west: -125, east: 70, south: -36, north: 60 };
export const WIDTH = 1000;

const rad = (degrees) => (degrees * Math.PI) / 180;
const millerY = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * rad(lat)));
const SPAN_X = rad(BOUNDS.east - BOUNDS.west);
const TOP = millerY(BOUNDS.north);
const BOTTOM = millerY(BOUNDS.south);

export const HEIGHT = Math.round((WIDTH * (TOP - BOTTOM)) / SPAN_X);

// [longitude, latitude] → [x, y] dans un repère de WIDTH × HEIGHT
export const project = (lon, lat) => [
  (rad(lon - BOUNDS.west) / SPAN_X) * WIDTH,
  ((TOP - millerY(lat)) / (TOP - BOTTOM)) * HEIGHT,
];

// [x, y] → [longitude, latitude]
export const invert = (x, y) => {
  const miller = TOP - (y / HEIGHT) * (TOP - BOTTOM);
  const lat = ((2.5 * Math.atan(Math.exp(0.8 * miller)) - 0.625 * Math.PI) * 180) / Math.PI;
  return [BOUNDS.west + (x / WIDTH) * (BOUNDS.east - BOUNDS.west), lat];
};
