import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Handshake, Megaphone, Phone, Send, Store, Users } from 'lucide-react';
import { CONTACTS, formatPrix, PACKS, PAVILLONS } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import { focusFirstError, formToObject, useApiForm } from '../lib/useApiForm.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import PackCard from '../components/PackCard.jsx';
import { ConsentCheckbox, FormAlert, Honeypot, SelectField, SubmitButton, TextField } from '../components/forms.jsx';
import '../components/PackCard.css';
import './pages.css';
import './Exposants.css';

const AVANTAGES = [
  { icon: Megaphone, title: 'Visibilité', text: 'Votre logo et votre entreprise sur les supports de communication d’ÉBËNA.' },
  { icon: Users, title: 'Networking', text: 'Accès aux espaces de rencontre avec entrepreneurs, investisseurs et institutions.' },
  { icon: Store, title: 'Six pavillons', text: 'Un univers thématique adapté à votre activité, de l’artisanat au numérique.' },
  { icon: Handshake, title: 'Opportunités', text: 'Rendez-vous B2B, pitchs et présentations de marché pendant trois jours.' },
];

const PAVILLON_OPTIONS = [
  ...PAVILLONS.map((pavillon) => ({ value: pavillon.slug, label: pavillon.short })),
  { value: 'indecis', label: 'Je ne sais pas encore' },
];

function ReservationForm({ pack, onPackChange }) {
  const formRef = useRef(null);
  const { status, submitting, errors, message, result, submit, clearError, reset } = useApiForm('/reservations');
  const selected = PACKS.find((item) => item.id === pack);

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = formToObject(event.currentTarget, { booleans: ['consentement'] });
    const outcome = await submit(payload);
    if (!outcome.ok) focusFirstError(formRef.current, outcome.errors);
  };

  if (status === 'success') {
    return (
      <div className="card success-card" role="status">
        <span className="success-card__seal">
          <Check strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h3 className="h3">Votre demande est bien enregistrée</h3>
        <p className="lead">
          Merci ! L’équipe ÉBËNA revient vers vous très prochainement pour finaliser la réservation de votre stand ({selected?.name},{' '}
          {selected?.surface}).
        </p>
        <p className="reference">{result?.reference}</p>
        <p className="field__hint">Conservez cette référence : elle vous sera demandée lors de nos échanges. Un e-mail de confirmation vous a été envoyé.</p>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          Faire une autre demande
        </button>
      </div>
    );
  }

  const onInput = (event) => clearError(event.target.name);

  return (
    <form ref={formRef} className="card form-card form" onSubmit={onSubmit} noValidate>
      <div>
        <h3 className="h3 form-card__title">Demande de réservation</h3>
        <p className="form-card__intro">Les champs marqués d’un astérisque sont obligatoires.</p>
      </div>

      <FormAlert message={status === 'error' ? message : ''} />

      <fieldset className={`field pack-picker ${errors.pack ? 'has-error' : ''}`}>
        <legend className="field__label">Formule souhaitée *</legend>
        <div className="pack-picker__options">
          {PACKS.map((item) => (
            <label key={item.id} className={`pack-option pack-option--${item.id}`}>
              <input
                type="radio"
                name="pack"
                value={item.id}
                checked={pack === item.id}
                onChange={() => {
                  onPackChange(item.id);
                  clearError('pack');
                }}
              />
              <span className="pack-option__name">{item.name}</span>
              <span className="pack-option__meta">
                {formatPrix(item.prix)} HT · {item.surface}
              </span>
            </label>
          ))}
        </div>
        {errors.pack && <p className="field__error">{errors.pack}</p>}
      </fieldset>

      <div className="form-grid">
        <TextField label="Entreprise / structure *" name="entreprise" autoComplete="organization" error={errors.entreprise} onInput={onInput} />
        <TextField label="Secteur d’activité" name="secteur" optional placeholder="Mode, cosmétique, tech…" error={errors.secteur} onInput={onInput} />
        <SelectField
          label="Pavillon souhaité"
          name="pavillon"
          optional
          options={PAVILLON_OPTIONS}
          defaultValue="indecis"
          error={errors.pavillon}
          onInput={onInput}
        />
        <TextField label="Site web ou réseau social" name="site_web" optional placeholder="www.votre-marque.com" error={errors.site_web} onInput={onInput} />
        <TextField label="Pays" name="pays" optional autoComplete="country-name" error={errors.pays} onInput={onInput} />
        <TextField label="Ville" name="ville" optional autoComplete="address-level2" error={errors.ville} onInput={onInput} />
        <TextField label="Nom et prénom du contact *" name="contact_nom" autoComplete="name" error={errors.contact_nom} onInput={onInput} />
        <TextField label="Fonction" name="contact_fonction" optional autoComplete="organization-title" error={errors.contact_fonction} onInput={onInput} />
        <TextField label="E-mail *" name="email" type="email" autoComplete="email" error={errors.email} onInput={onInput} />
        <TextField label="Téléphone *" name="telephone" type="tel" autoComplete="tel" placeholder="+33 6 00 00 00 00" error={errors.telephone} onInput={onInput} />
        <TextField
          label="Votre projet"
          name="message"
          optional
          rows={5}
          className="span-2"
          placeholder="Présentez en quelques lignes vos produits, vos besoins (électricité, mobilier…) ou vos questions."
          error={errors.message}
          onInput={onInput}
        />
      </div>

      <Honeypot />

      <ConsentCheckbox error={errors.consentement} onChange={() => clearError('consentement')}>
        J’accepte que les informations saisies soient utilisées par l’équipe ÉBËNA pour traiter ma demande de réservation. Voir la{' '}
        <Link to="/mentions-legales#donnees">politique de confidentialité</Link>. *
      </ConsentCheckbox>

      <div className="form-actions">
        <p className="form-actions__note">
          {selected ? (
            <>
              Formule choisie : <strong>Pack {selected.name}</strong> — {formatPrix(selected.prix)} HT
            </>
          ) : (
            'Choisissez une formule ci-dessus.'
          )}
        </p>
        <SubmitButton submitting={submitting} icon={Send}>
          Envoyer ma demande
        </SubmitButton>
      </div>
    </form>
  );
}

export default function Exposants() {
  useDocumentMeta(
    'Exposants et sponsors',
    'Réservez votre stand à ÉBËNA 2027 : packs Silver (600 € HT), Gold (1 000 € HT) et Platinum (1 500 € HT), du 4 au 6 juin 2027 à Nantes.'
  );
  const [params] = useSearchParams();
  const initial = PACKS.some((item) => item.id === params.get('pack')) ? params.get('pack') : 'gold';
  const [pack, setPack] = useState(initial);

  const choosePack = (id) => {
    setPack(id);
    document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <PageHero
        eyebrow="Exposants et sponsors"
        title={
          <>
            Devenez partenaire <em className="text-gold">de l’excellence</em>
          </>
        }
        intro="Choisissez le niveau de visibilité qui correspond à vos ambitions : exposez votre savoir-faire, développez votre réseau et faites rayonner votre entreprise auprès d’un public international."
      >
        <ul className="exposants-facts">
          <li>
            <strong>3</strong> jours d’exposition
          </li>
          <li>
            <strong>6</strong> pavillons thématiques
          </li>
          <li>
            <strong>9 à 18 m²</strong> de stand
          </li>
        </ul>
      </PageHero>

      <section className="section" id="packs">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="Formules exposant"
            title={
              <>
                Trois packs, <em className="text-gold">une même exigence</em>
              </>
            }
            intro="Tous les tarifs sont indiqués hors taxes. Un membre de l’équipe vous accompagne pour finaliser votre réservation."
          />
          <div className="packs-grid">
            {PACKS.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.1} style={{ display: 'flex' }}>
                <PackCard pack={item} selected={pack === item.id} onSelect={choosePack} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight section--alt">
        <div className="container">
          <ul className="avantages">
            {AVANTAGES.map(({ icon: IconComponent, title, text }, index) => (
              <Reveal as="li" key={title} className="avantage" delay={index * 0.08}>
                <span className="icon-medallion">
                  <IconComponent aria-hidden="true" />
                </span>
                <h3 className="h4">{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="reservation">
        <div className="container form-layout">
          <div className="split__aside">
            <Reveal as="p" className="eyebrow">
              Réservation
            </Reveal>
            <Reveal as="h2" className="h2" delay={0.08}>
              Réservez <em className="text-gold">votre stand</em>
            </Reveal>
            <Reveal as="p" className="lead" delay={0.12}>
              Envoyez votre demande en quelques minutes : l’équipe ÉBËNA vous recontacte pour finaliser votre réservation.
            </Reveal>
            <Reveal as="ol" className="steps" delay={0.16}>
              <li>
                <span>1</span>
                <p>
                  <strong>Vous envoyez votre demande</strong> avec la formule choisie.
                </p>
              </li>
              <li>
                <span>2</span>
                <p>
                  <strong>Nous vous recontactons</strong> pour l’emplacement, le paiement et la logistique.
                </p>
              </li>
              <li>
                <span>3</span>
                <p>
                  <strong>Vous préparez votre venue</strong> : badges exposants, flyers et installation du stand.
                </p>
              </li>
            </Reveal>
            <Reveal className="info-item" delay={0.2}>
              <span className="icon-medallion">
                <Phone aria-hidden="true" />
              </span>
              <div>
                <p className="info-item__label">Une question ?</p>
                <p className="info-item__value">
                  <a href={`tel:${CONTACTS.coordination.tel}`}>{CONTACTS.coordination.phone}</a>
                </p>
                <p className="info-item__detail">
                  ou <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ReservationForm pack={pack} onPackChange={setPack} />
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container exposants-partner">
          <Reveal as="h2" className="h3">
            Vous souhaitez sponsoriser un pavillon ou un temps fort ?
          </Reveal>
          <Reveal delay={0.08}>
            <Link to="/contact?sujet=partenariat" className="btn btn--ghost">
              Parlons partenariat <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
