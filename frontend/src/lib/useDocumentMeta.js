import { useEffect } from 'react';

const SITE = 'ÉBËNA 2027';

// Met à jour le titre et la description de la page (référencement et partage).
export function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Carrefour des talents, des identités et de l’avenir`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
