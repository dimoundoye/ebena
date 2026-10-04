import { useRef } from 'react';
import { ArrowRight, CircleCheck, LoaderCircle } from 'lucide-react';
import { useApiForm } from '../lib/useApiForm.js';
import { Honeypot } from './forms.jsx';
import './NewsletterForm.css';

export default function NewsletterForm({ source = 'site' }) {
  const formRef = useRef(null);
  const { status, submitting, errors, message, submit, clearError } = useApiForm('/newsletter');

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await submit({ email: String(data.get('email') || '').trim(), website: data.get('website') || '', source });
  };

  if (status === 'success') {
    return (
      <p className="newsletter-success" role="status">
        <CircleCheck aria-hidden="true" /> Merci ! Vous recevrez les prochaines actualités d’ÉBËNA.
      </p>
    );
  }

  const error = errors.email || (status === 'error' ? message : '');

  return (
    <form ref={formRef} className="newsletter-form" onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor={`newsletter-${source}`}>
        Votre adresse e-mail
      </label>
      <div className={`newsletter-form__row ${error ? 'has-error' : ''}`}>
        <input
          id={`newsletter-${source}`}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="votre@email.com"
          className="newsletter-form__input"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `newsletter-${source}-error` : undefined}
          onInput={() => clearError('email')}
        />
        <button type="submit" className="newsletter-form__button" disabled={submitting} aria-label="S’abonner à la newsletter">
          {submitting ? <LoaderCircle className="spinner" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
        </button>
      </div>
      <Honeypot />
      {error ? (
        <p className="field__error" id={`newsletter-${source}-error`} role="alert">
          {error}
        </p>
      ) : (
        <p className="newsletter-form__note">Désinscription possible à tout moment. Aucune donnée n’est cédée à des tiers.</p>
      )}
    </form>
  );
}
