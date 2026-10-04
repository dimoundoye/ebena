import { CONTACTS } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import PageHero from '../components/PageHero.jsx';
import './pages.css';
import './MentionsLegales.css';

// Les mentions entre crochets sont à compléter avec les informations officielles de l'association.
export default function MentionsLegales() {
  useDocumentMeta('Mentions légales', 'Mentions légales et politique de confidentialité du site ÉBËNA 2027.');

  return (
    <>
      <PageHero
        eyebrow="Informations légales"
        title={
          <>
            Mentions légales <em className="text-gold">et confidentialité</em>
          </>
        }
      />

      <section className="section">
        <div className="container--narrow legal">
          <h2 className="h3">Éditeur du site</h2>
          <p>
            Le site ÉBËNA est édité par l’<strong>association Art à Conter</strong>, association loi 1901.
            <br />
            Siège social : <span className="todo">[adresse à compléter]</span>
            <br />
            Numéro RNA / SIRET : <span className="todo">[à compléter]</span>
            <br />
            Directeur ou directrice de la publication : <span className="todo">[à compléter]</span>
            <br />
            Contact : <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
          </p>

          <h2 className="h3">Hébergement</h2>
          <p>
            <span className="todo">[Nom, adresse et téléphone de l’hébergeur à compléter]</span>
          </p>

          <h2 className="h3">Propriété intellectuelle</h2>
          <p>
            Les textes, visuels, logos et photographies présents sur ce site sont la propriété d’ÉBËNA, de l’association Art à
            Conter ou de leurs auteurs respectifs. Les logos des partenaires restent la propriété de leurs titulaires. Toute
            reproduction sans autorisation préalable est interdite.
          </p>

          <h2 className="h3" id="donnees">
            Protection des données personnelles
          </h2>
          <p>
            Les informations recueillies via les formulaires du site (inscription visiteurs, réservation de stand, contact et
            newsletter) sont destinées exclusivement à l’équipe ÉBËNA. Elles servent à gérer votre inscription ou votre demande,
            à vous adresser les informations pratiques relatives au salon et, si vous l’avez accepté, la newsletter.
          </p>
          <ul className="list-cowrie">
            <li>
              <strong>Base légale :</strong> votre consentement, donné en cochant la case prévue dans chaque formulaire.
            </li>
            <li>
              <strong>Destinataires :</strong> l’équipe d’organisation d’ÉBËNA. Vos données ne sont ni vendues ni cédées à des
              tiers.
            </li>
            <li>
              <strong>Durée de conservation :</strong> <span className="todo">[à définir, par exemple jusqu’à 12 mois après le salon]</span>.
            </li>
            <li>
              <strong>Vos droits :</strong> vous pouvez accéder à vos données, les rectifier, demander leur suppression ou vous
              désinscrire de la newsletter à tout moment en écrivant à <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>.
              Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).
            </li>
          </ul>

          <h2 className="h3">Cookies</h2>
          <p>
            Ce site n’utilise aucun cookie publicitaire ni outil de mesure d’audience. Seul un cookie technique, strictement
            nécessaire, est utilisé pour sécuriser l’espace d’administration réservé à l’équipe.
          </p>

          <h2 className="h3">Crédits</h2>
          <p>Visuels : ÉBËNA 2027. Conception et développement du site : <span className="todo">[à compléter]</span>.</p>
        </div>
      </section>
    </>
  );
}
