import { useCallback, useState } from 'react';
import { api } from './api.js';

// Gère l'envoi d'un formulaire vers l'API : état, erreurs par champ, résultat.
export function useApiForm(endpoint) {
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const submit = useCallback(
    async (payload) => {
      setStatus('submitting');
      setErrors({});
      setMessage('');
      try {
        const data = await api(endpoint, { method: 'POST', body: payload });
        setResult(data);
        setStatus('success');
        return { ok: true, data };
      } catch (err) {
        setErrors(err.errors || {});
        setMessage(err.message);
        setStatus('error');
        return { ok: false, errors: err.errors || {} };
      }
    },
    [endpoint]
  );

  const clearError = useCallback((name) => {
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setErrors({});
    setMessage('');
    setResult(null);
  }, []);

  return { status, submitting: status === 'submitting', errors, message, result, submit, clearError, reset };
}

// Convertit un <form> en objet JSON : listes pour les cases multiples, booléens pour les cases simples.
export function formToObject(form, { arrays = [], booleans = [] } = {}) {
  const data = new FormData(form);
  const output = {};
  for (const [key, value] of data.entries()) {
    if (arrays.includes(key)) {
      (output[key] ||= []).push(value);
    } else if (!booleans.includes(key)) {
      output[key] = typeof value === 'string' ? value.trim() : value;
    }
  }
  for (const key of arrays) output[key] ||= [];
  for (const key of booleans) output[key] = data.has(key);
  return output;
}

// Place le focus sur le premier champ en erreur après une réponse de l'API.
export function focusFirstError(form, errors) {
  const first = Object.keys(errors || {})[0];
  if (!form || !first) return;
  const field = form.querySelector(`[name="${first}"]`);
  if (field) {
    field.focus({ preventScroll: true });
    field.closest('.field, fieldset')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
