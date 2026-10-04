import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useDocumentMeta } from '../../lib/useDocumentMeta.js';
import { FormAlert, SubmitButton, TextField } from '../../components/forms.jsx';
import './admin.css';

export default function AdminLogin() {
  useDocumentMeta('Connexion au back-office');
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Déjà connecté : direction le tableau de bord.
  useEffect(() => {
    const controller = new AbortController();
    api('/admin/me', { signal: controller.signal })
      .then(() => navigate('/admin', { replace: true }))
      .catch(() => {});
    return () => controller.abort();
  }, [navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setError('');
    try {
      await api('/admin/login', {
        method: 'POST',
        body: { email: String(data.get('email') || '').trim(), password: String(data.get('password') || '') },
      });
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login__card card">
        <img className="admin-login__logo" src="/images/logo-ebena-sm.webp" alt="ÉBËNA" width="480" height="134" />
        <div>
          <p className="eyebrow eyebrow--center">Espace équipe</p>
          <h1 className="h3 admin-login__title">Back-office</h1>
        </div>
        <form className="form" onSubmit={onSubmit} noValidate>
          <FormAlert message={error} />
          <TextField label="E-mail" name="email" type="email" autoComplete="username" required />
          <TextField label="Mot de passe" name="password" type="password" autoComplete="current-password" required />
          <SubmitButton submitting={submitting} className="btn btn--dark btn--block" icon={LogIn}>
            Se connecter
          </SubmitButton>
        </form>
        <Link to="/" className="admin-login__back">
          <ArrowLeft aria-hidden="true" /> Retour au site
        </Link>
      </div>
    </main>
  );
}
