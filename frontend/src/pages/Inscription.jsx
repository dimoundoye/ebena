import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, CalendarPlus, Check, Clock, MapPin, Send, Ticket } from 'lucide-react';
import { EVENT, INTERETS, JOURS, PROFILS } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import { focusFirstError, formToObject, useApiForm } from '../lib/useApiForm.js';
import { downloadEventIcs } from '../lib/calendar.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Countdown from '../components/Countdown.jsx';
import { ChipGroup, ConsentCheckbox, FormAlert, Honeypot, SelectField, SubmitButton, TextField } from '../components/forms.jsx';
import './pages.css';
import './Inscription.css';

export default function Inscription() {
  useDocumentMeta('Inscription visiteurs', 'Inscrivez-vous à ÉBËNA 2027, les 4, 5 et 6 juin 2027 au Parc des Chantiers à Nantes.');
  const formRef = useRef(null);
  const { status, submitting, errors, message, result, submit, clearError, reset } = useApiForm('/inscriptions');

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = formToObject(event.currentTarget, { arrays: ['jours', 'interets'], booleans: ['newsletter', 'consentement'] });
    const outcome = await submit(payload);
    if (!outcome.ok) focusFirstError(formRef.current, outcome.errors);
  };

  const onInput = (event) => clearError(event.target.name);

  return (
    <>
      <PageHero
        eyebrow="Inscription visiteurs"
        title={
          <>
            Réservez votre place <em className="text-gold">à ÉBËNA</em>
          </>
        }
        intro="Inscrivez-vous en une minute pour recevoir votre numéro d’inscription, le programme détaillé et toutes les informations pratiques avant le salon."
      />

      <section className="section">
        <div className="container form-layout">
          <aside className="inscription-aside">
            <Reveal className="inscription-ticket">
              <div className="inscription-ticket__head">
                <Ticket aria-hidden="true" />
                <span>Laissez-passer</span>
              </div>
              <p className="inscription-ticket__name">ÉBËNA 2027</p>
              <p className="inscription-ticket__tagline">{EVENT.tagline}</p>
              <ul className="inscription-ticket__infos">
                <li>
                  <CalendarDays aria-hidden="true" />
                  <span>
                    <strong>{EVENT.datesLong}</strong>
                    Du vendredi au dimanche
                  </span>
                </li>
                <li>
                  <MapPin aria-hidden="true" />
                  <span>
                    <strong>{EVENT.venue}</strong>
                    {EVENT.city}
                  </span>
                </li>
                <li>
                  <Clock aria-hidden="true" />
                  <span>
                    <strong>Horaires</strong>
                    Communiqués avec le programme détaillé
                  </span>
                </li>
              </ul>
              <div className="inscription-ticket__perforation" aria-hidden="true" />
              <Countdown className="inscription-ticket__countdown" />
            </Reveal>
            <Reveal as="ul" className="list-cowrie inscription-aside__list" delay={0.1}>
              <li>Six pavillons thématiques à explorer</li>
              <li>Défilés, talks et showcases sur la Scène ÉBËNA</li>
              <li>Le Bénin, pays invité d’honneur</li>
              <li>Rencontres avec des créateurs, entrepreneurs et investisseurs</li>
            </Reveal>
          </aside>

          <Reveal delay={0.1}>
            {status === 'success' ? (
              <div className="card success-card" role="status">
                <span className="success-card__seal">
                  <Check strokeWidth={2.5} aria-hidden="true" />
                </span>
                <h2 className="h3">Votre inscription est confirmée</h2>
                <p className="lead">Merci ! Voici votre numéro d’inscription, à conserver pour l’accueil du salon.</p>
                <p className="reference">{result?.reference}</p>
                <p className="field__hint">Un e-mail de confirmation vient de vous être envoyé.</p>
                <div className="inscription-success__actions">
                  <button type="button" className="btn btn--dark" onClick={() => downloadEventIcs(result?.reference)}>
                    <CalendarPlus /> Ajouter à mon agenda
                  </button>
                  <Link to="/programme" className="btn btn--ghost">
                    Découvrir le programme
                  </Link>
                </div>
                <button type="button" className="inscription-success__again" onClick={reset}>
                  Inscrire une autre personne
                </button>
              </div>
            ) : (
              <form ref={formRef} className="card form-card form" onSubmit={onSubmit} noValidate>
                <div>
                  <h2 className="h3 form-card__title">Vos informations</h2>
                  <p className="form-card__intro">Les champs marqués d’un astérisque sont obligatoires.</p>
                </div>

                <FormAlert message={status === 'error' ? message : ''} />

                <div className="form-grid">
                  <TextField label="Prénom *" name="prenom" autoComplete="given-name" error={errors.prenom} onInput={onInput} />
                  <TextField label="Nom *" name="nom" autoComplete="family-name" error={errors.nom} onInput={onInput} />
                  <TextField label="E-mail *" name="email" type="email" autoComplete="email" error={errors.email} onInput={onInput} />
                  <TextField label="Téléphone" name="telephone" type="tel" optional autoComplete="tel" error={errors.telephone} onInput={onInput} />
                  <TextField label="Ville" name="ville" optional autoComplete="address-level2" error={errors.ville} onInput={onInput} />
                  <SelectField
                    label="Vous êtes *"
                    name="profil"
                    placeholder="Choisissez votre profil"
                    options={PROFILS}
                    defaultValue=""
                    error={errors.profil}
                    onInput={onInput}
                  />
                </div>

                <ChipGroup
                  legend="Jour(s) de venue *"
                  name="jours"
                  options={JOURS}
                  error={errors.jours}
                  onChange={() => clearError('jours')}
                />

                <ChipGroup
                  legend="Ce qui vous intéresse (facultatif)"
                  name="interets"
                  options={INTERETS}
                  error={errors.interets}
                  onChange={() => clearError('interets')}
                />

                <Honeypot />

                <div className="stack" style={{ '--stack-gap': '0.9rem' }}>
                  <label className="check">
                    <input type="checkbox" name="newsletter" />
                    <span>Je souhaite recevoir la newsletter d’ÉBËNA (programme, invités, informations pratiques).</span>
                  </label>
                  <ConsentCheckbox error={errors.consentement} onChange={() => clearError('consentement')}>
                    J’accepte que mes données soient utilisées par l’équipe ÉBËNA pour gérer mon inscription. Voir la{' '}
                    <Link to="/mentions-legales#donnees">politique de confidentialité</Link>. *
                  </ConsentCheckbox>
                </div>

                <div className="form-actions">
                  <p className="form-actions__note">Vous recevrez votre numéro d’inscription par e-mail.</p>
                  <SubmitButton submitting={submitting} icon={Send}>
                    Valider mon inscription
                  </SubmitButton>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
