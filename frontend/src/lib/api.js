const BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors || {};
  }
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal,
      credentials: 'include',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.', 0);
  }

  // L'API répond toujours en JSON : une autre réponse (page HTML d'un hébergeur, API absente)
  // est traitée comme une erreur, jamais comme un envoi réussi.
  const isJson = (response.headers.get('content-type') || '').includes('application/json');
  let data = null;
  if (isJson) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok || !isJson) {
    const fallback = response.ok
      ? 'Le service est momentanément indisponible. Réessayez plus tard.'
      : 'Une erreur est survenue. Réessayez dans un instant.';
    throw new ApiError(data?.message || fallback, response.ok ? 503 : response.status, data?.errors);
  }
  return data;
}

export const apiUrl = (path) => `${BASE_URL}${path}`;
