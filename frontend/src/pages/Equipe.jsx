import { useEffect, useState } from 'react';
import { CHEF_DE_PROJET, EQUIPE_PROJET, EQUIPE_SALON } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import PageHero from '../components/PageHero.jsx';
import SceneFlow, { Scene } from '../components/scene/SceneFlow.jsx';
import { order } from '../components/scene/order.js';
import ClosingCta from '../components/ClosingCta.jsx';
import './pages.css';
import './Equipe.css';

function ChefDeProjet() {
  const [parcours, vision, ambition] = CHEF_DE_PROJET.paragraphs;
  return (
    <div className="container team-lead">
      <figure className="team-lead__photo">
        <div className="team-lead__frame build build--arch" style={order(0)}>
          <img
            src={`/images/equipe/${CHEF_DE_PROJET.slug}.webp`}
            alt={`${CHEF_DE_PROJET.name}, ${CHEF_DE_PROJET.role}`}
            width="717"
            height="1076"
          />
        </div>
      </figure>
      <div className="team-lead__text">
        <p className="eyebrow build" style={order(1)}>
          {CHEF_DE_PROJET.role}
        </p>
        <h2 className="scene-title build" style={order(2)}>
          {CHEF_DE_PROJET.name}
        </h2>
        <p className="lead build" style={order(3)}>
          {parcours}
        </p>
        <blockquote className="pullquote build" style={order(4)}>
          <p>{vision.replace(/^«\s*|\s*»$/g, '')}</p>
          <cite>{CHEF_DE_PROJET.name}</cite>
        </blockquote>
        <p className="lead build" style={order(5)}>
          {ambition}
        </p>
      </div>
    </div>
  );
}

// Mur d'arches : décalage vertical de chaque colonne (en rem) et amplitude de son glissement au
// défilement (en px), de la première à la cinquième colonne
const WALL_LIFT = [0, 4.5, 1.5, 5.5, 2.5];
const WALL_DRIFT = [40, 120, 70, 140, 90];
const WALL_QUERIES = [
  ['(max-width: 640px)', 2],
  ['(max-width: 980px)', 3],
];

// Quatre colonnes sur grand écran (une équipe de cinq tient sur une seule ligne), puis trois et deux
function wallColumns(count) {
  const narrow = WALL_QUERIES.find(([query]) => window.matchMedia(query).matches);
  if (narrow) return Math.min(count, narrow[1]);
  return count > 5 ? 4 : count;
}

function useWallColumns(count) {
  const [columns, setColumns] = useState(() => wallColumns(count));

  useEffect(() => {
    const medias = WALL_QUERIES.map(([query]) => window.matchMedia(query));
    const onChange = () => setColumns(wallColumns(count));
    medias.forEach((media) => media.addEventListener('change', onChange));
    return () => medias.forEach((media) => media.removeEventListener('change', onChange));
  }, [count]);

  return columns;
}

// Une équipe en mur d'arches : les colonnes sont décalées et glissent chacune à sa vitesse au fil du
// défilement (--q, posé par SceneFlow) ; chaque portrait s'ouvre comme une porte en entrant dans
// l'écran, et son arche devient rectangle au survol pour montrer toute l'affiche.
function Team({ eyebrow, title, people }) {
  const columns = useWallColumns(people.length);
  return (
    <div className="container team">
      <div className="team__head">
        <p className="eyebrow eyebrow--center build" style={order(0)}>
          {eyebrow}
        </p>
        <h2 className="scene-title build" style={order(1)}>
          {title}
        </h2>
      </div>
      <ul
        className="arch-wall"
        data-progress
        data-start="1"
        data-end="-1"
        style={{ '--cols': columns, '--lift-max': Math.max(...WALL_LIFT.slice(0, columns)) }}
      >
        {people.map((person, index) => {
          const column = index % columns;
          return (
            <li key={person.slug} className="arch-wall__item" style={{ '--lift': WALL_LIFT[column], '--drift': WALL_DRIFT[column] }}>
              <figure className="arch-card">
                <div className="arch-card__reveal build build--arch" style={order(column)}>
                  <div className="arch-card__door">
                    <div className="arch-card__window">
                      <img
                        src={`/images/equipe/${person.slug}.webp`}
                        alt={`${person.name}, ${person.role}`}
                        width="400"
                        height="596"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
                <figcaption className="arch-card__caption build" style={order(column + 2)}>
                  <span className="arch-card__name">{person.name}</span>
                  <span className="arch-card__role">{person.role}</span>
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Equipe() {
  useDocumentMeta('L’équipe', 'L’équipe du salon ÉBËNA 2027, menée par Boubacar Obeye Thioye, chef de projet événementiel.');

  return (
    <>
      <PageHero
        eyebrow="L’équipe du salon"
        title={
          <>
            Les visages <em className="text-gold">d’ÉBËNA</em>
          </>
        }
        intro="Journalistes, communicants, scénographes, logisticiens, experts du tourisme et du numérique : une équipe engagée pour faire d’ÉBËNA un rendez-vous de référence."
      />

      <SceneFlow>
        <Scene id="chef-de-projet">
          <ChefDeProjet />
        </Scene>
        <Scene id="equipe-du-salon" tone="sable" transition="balayage">
          <Team
            eyebrow="Équipe du salon"
            title={
              <>
                L’équipe qui fait <em className="text-gold">vivre le salon</em>
              </>
            }
            people={EQUIPE_SALON}
          />
        </Scene>
        <Scene id="equipe-du-projet" transition="porte">
          <Team
            eyebrow="Équipe du projet"
            title={
              <>
                Les forces vives <em className="text-gold">du projet</em>
              </>
            }
            people={EQUIPE_PROJET}
          />
        </Scene>
        <Scene id="rejoindre" tone="soleil" transition="cercle">
          <ClosingCta
            eyebrow="Rejoindre l’aventure"
            title={
              <>
                Envie de contribuer à <em className="text-gold">ÉBËNA</em> ?
              </>
            }
            text="Bénévoles, partenaires, médias : écrivez-nous, nous serons ravis d’échanger avec vous."
            primary={{ to: '/contact?sujet=benevolat', label: 'Nous écrire' }}
            secondary={{ to: '/exposants', label: 'Devenir exposant' }}
          />
        </Scene>
      </SceneFlow>
    </>
  );
}
