import { useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, ExternalLink, Mail, MapPin, Megaphone, Phone, Send } from 'lucide-react';
import { CONTACTS, EVENT, SUJETS } from '../data/site.js';
import { useDocumentMeta } from '../lib/useDocumentMeta.js';
import { focusFirstError, formToObject, useApiForm } from '../lib/useApiForm.js';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { ConsentCheckbox, FormAlert, Honeypot, SelectField, SubmitButton, TextField } from '../components/forms.jsx';
import './pages.css';
import './Contact.css';

export default function Contact() {
  useDocumentMeta('Contact', 'Contactez l’équipe ÉBËNA 2027 : coordination générale, communication, partenariats et presse.');
  const [params] = useSearchParams();
  const sujetInitial = SUJETS.some((sujet) => sujet.value === params.get('sujet')) ? params.get('sujet') : '';
  const formRef = useRef(null);
  const { status, submitting, errors, message, submit, clearError, reset } = useApiForm('/contact');

  const onSubmit = async (event) => {
    event.preventDefault();
    const outcome = await submit(formToObject(event.currentTarget, { booleans: ['consentement'] }));
    if (!outcome.ok) focusFirstError(formRef.current, outcome.errors);
  };

  const onInput = (event) => clearError(event.target.name);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Parlons <em className="text-gold">d’ÉBËNA</em>
          </>
        }
        intro="Une question sur le salon, un projet d’exposition, une proposition de partenariat ou une demande presse ? L’équipe vous répond."
      />

      <section className="section">
        <div className="container form-layout">
          <div className="contact-aside">
            <ul className="info-list">
              <Reveal as="li" className="info-item">
                <span className="icon-medallion">
                  <Mail aria-hidden="true" />
                </span>
                <div>
                  <p className="info-item__label">E-mail</p>
                  <p className="info-item__value">
                    <a href={`mailto:${CONTACTS.email}`}>{CONTACTS.email}</a>
                  </p>
                </div>
              </Reveal>
              <Reveal as="li" className="info-item" delay={0.06}>
                <span className="icon-medallion">
                  <Phone aria-hidden="true" />
                </span>
                <div>
                  <p className="info-item__label">{CONTACTS.coordination.label}</p>
                  <p className="info-item__value">
                    <a href={`tel:${CONTACTS.coordination.tel}`}>{CONTACTS.coordination.phone}</a>
                  </p>
                </div>
              </Reveal>
              <Reveal as="li" className="info-item" delay={0.12}>
                <span className="icon-medallion">
                  <Megaphone aria-hidden="true" />
                </span>
                <div>
                  <p className="info-item__label">Communication</p>
                  <ul className="contact-phones">
                    {CONTACTS.communication.map((contact) => (
                      <li key={contact.tel} className="info-item__value">
                        <a href={`tel:${contact.tel}`}>{contact.phone}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal as="li" className="info-item" delay={0.18}>
                <span className="icon-medallion">
                  <MapPin aria-hidden="true" />
                </span>
                <div>
                  <p className="info-item__label">Lieu du salon</p>
                  <p className="info-item__value">{EVENT.venue}</p>
                  <p className="info-item__detail">{EVENT.address}</p>
                  <a className="link-arrow contact-map" href={EVENT.mapUrl} target="_blank" rel="noreferrer">
                    Voir sur la carte <ExternalLink />
                  </a>
                </div>
              </Reveal>
            </ul>
          </div>

          <Reveal delay={0.1}>
            {status === 'success' ? (
              <div className="card success-card" role="status">
                <span className="success-card__seal">
                  <Check strokeWidth={2.5} aria-hidden="true" />
                </span>
                <h2 className="h3">Message envoyé</h2>
                <p className="lead">Merci pour votre message. L’équipe ÉBËNA vous répondra dans les meilleurs délais.</p>
                <button type="button" className="btn btn--ghost" onClick={reset}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form key={sujetInitial} ref={formRef} className="card form-card form" onSubmit={onSubmit} noValidate>
                <div>
                  <h2 className="h3 form-card__title">Écrivez-nous</h2>
                  <p className="form-card__intro">Les champs marqués d’un astérisque sont obligatoires.</p>
                </div>

                <FormAlert message={status === 'error' ? message : ''} />

                <div className="form-grid">
                  <TextField label="Nom et prénom *" name="nom" autoComplete="name" error={errors.nom} onInput={onInput} />
                  <TextField label="E-mail *" name="email" type="email" autoComplete="email" error={errors.email} onInput={onInput} />
                  <TextField label="Téléphone" name="telephone" type="tel" optional autoComplete="tel" error={errors.telephone} onInput={onInput} />
                  <SelectField
                    label="Sujet *"
                    name="sujet"
                    placeholder="Choisissez un sujet"
                    options={SUJETS}
                    defaultValue={sujetInitial}
                    error={errors.sujet}
                    onInput={onInput}
                  />
                  <TextField label="Message *" name="message" rows={6} className="span-2" error={errors.message} onInput={onInput} />
                </div>

                <Honeypot />

                <ConsentCheckbox error={errors.consentement} onChange={() => clearError('consentement')}>
                  J’accepte que mes données soient utilisées par l’équipe ÉBËNA pour répondre à ma demande. Voir la{' '}
                  <Link to="/mentions-legales#donnees">politique de confidentialité</Link>. *
                </ConsentCheckbox>

                <div className="form-actions">
                  <p className="form-actions__note">L’équipe vous répond par e-mail.</p>
                  <SubmitButton submitting={submitting} icon={Send}>
                    Envoyer le message
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
