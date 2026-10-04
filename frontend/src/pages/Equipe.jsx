import { CHEF_DE_PROJET, EQUIPE_PROJET, EQUIPE_SALON } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CtaBand from '../components/CtaBand.jsx';
import './pages.css';
import './Equipe.css';

function People({ people }) {
  return (
    <ul className="people">
      {people.map((person, index) => (
        <Reveal as="li" key={person.slug} className="person" delay={(index % 4) * 0.08}>
          <figure>
            <div className="person__photo">
              <img
                src={`/images/equipe/${person.slug}.webp`}
                alt={`${person.name}, ${person.role}`}
                loading="lazy"
                width="400"
                height="596"
              />
            </div>
            <figcaption className="person__caption">
              <span className="person__name">{person.name}</span>
              <span className="person__role">{person.role}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
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

      <section className="section">
        <div className="container feature equipe-chef">
          <Reveal className="feature__media">
            <div className="equipe-chef__photo">
              <img
                src={`/images/equipe/${CHEF_DE_PROJET.slug}.webp`}
                alt={`${CHEF_DE_PROJET.name}, ${CHEF_DE_PROJET.role}`}
                width="717"
                height="1076"
              />
            </div>
          </Reveal>
          <div className="feature__text">
            <Reveal as="p" className="eyebrow">
              {CHEF_DE_PROJET.role}
            </Reveal>
            <Reveal as="h2" className="h2" delay={0.08}>
              {CHEF_DE_PROJET.name}
            </Reveal>
            <Reveal as="p" className="lead" delay={0.12}>
              {CHEF_DE_PROJET.paragraphs[0]}
            </Reveal>
            <Reveal as="blockquote" className="pullquote" delay={0.16}>
              <p>{CHEF_DE_PROJET.paragraphs[1].replace(/^«\s*|\s*»$/g, '')}</p>
              <cite>{CHEF_DE_PROJET.name}</cite>
            </Reveal>
            <Reveal as="p" className="lead" delay={0.2}>
              {CHEF_DE_PROJET.paragraphs[2]}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading
            eyebrow="Équipe du salon"
            title={
              <>
                L’équipe qui fait <em className="text-gold">vivre le salon</em>
              </>
            }
          />
          <People people={EQUIPE_SALON} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Équipe du projet"
            title={
              <>
                Les forces vives <em className="text-gold">du projet</em>
              </>
            }
          />
          <People people={EQUIPE_PROJET} />
        </div>
      </section>

      <CtaBand
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
    </>
  );
}
