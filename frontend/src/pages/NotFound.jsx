import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import Button from '../components/Button.jsx';
import { CowriePair } from '../components/Cowrie.jsx';
import './NotFound.css';

export default function NotFound() {
  useDocumentMeta('Page introuvable');
  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <CowriePair className="not-found__cowries" />
        <p className="eyebrow eyebrow--center">Erreur 404</p>
        <h1 className="display">
          Cette page s’est <em className="text-gold">égarée</em> en chemin
        </h1>
        <p className="lead">La page que vous cherchez n’existe pas ou a été déplacée.</p>
        <Button to="/">Retour à l’accueil</Button>
      </div>
    </section>
  );
}
