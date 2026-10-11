// Génère les points dorés de la carte « Le Carrefour » : npm run carte
// Une grille hexagonale couvre la zone de la carte ; chaque point tombant sur la terre ferme est
// rangé sous le code ISO numérique de son pays, ce qui permet d'allumer n'importe quel pays depuis
// src/data/site.js (CARREFOUR) sans relancer ce script. Données : Natural Earth via world-atlas.
import { readFileSync, writeFileSync } from 'node:fs';
import { geoBounds, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import { HEIGHT, WIDTH, invert } from '../src/components/carrefour/projection.js';

const STEP = 5; // écart entre deux points, dans le repère WIDTH × HEIGHT de la carte
const ROW = (STEP * Math.sqrt(3)) / 2;
const OUTPUT = new URL('../src/data/carrefour-carte.json', import.meta.url);

const topology = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/countries-50m.json', import.meta.url)));
const countries = feature(topology, topology.objects.countries).features.map((country) => {
  const [[west, south], [east, north]] = geoBounds(country);
  return { id: country.id ?? 'autre', country, west, south, east, north };
});

const inBounds = (box, lon, lat) => lat >= box.south && lat <= box.north && (box.west <= box.east ? lon >= box.west && lon <= box.east : lon >= box.west || lon <= box.east);

const dots = new Map();
for (let row = 0; row * ROW <= HEIGHT; row += 1) {
  const y = Math.round(row * ROW * 10) / 10;
  for (let x = row % 2 ? STEP / 2 : 0; x <= WIDTH; x += STEP) {
    const [lon, lat] = invert(x, y);
    const match = countries.find((box) => inBounds(box, lon, lat) && geoContains(box.country, [lon, lat]));
    if (!match) continue;
    if (!dots.has(match.id)) dots.set(match.id, []);
    dots.get(match.id).push([x, y]);
  }
}

// Un tracé SVG par pays : chaque point est un segment nul (« h0 ») que le trait arrondi rend en disque.
// Déplacements relatifs pour un fichier compact.
const round = (value) => Math.round(value * 10) / 10;
const toPath = (points) => {
  let [px, py] = points[0];
  let path = `M${px} ${py}h0`;
  for (const [x, y] of points.slice(1)) {
    path += `m${round(x - px)} ${round(y - py)}h0`;
    [px, py] = [x, y];
  }
  return path;
};

const paths = Object.fromEntries([...dots.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([id, points]) => [id, toPath(points)]));
writeFileSync(OUTPUT, `${JSON.stringify({ width: WIDTH, height: HEIGHT, step: STEP, dots: paths })}\n`);

const total = [...dots.values()].reduce((sum, points) => sum + points.length, 0);
console.log(`${total} points, ${dots.size} pays → ${OUTPUT.pathname}`);
