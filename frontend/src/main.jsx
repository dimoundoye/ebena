import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Trois familles, chacune avec un rôle (voir global.css) et sans italique.
// Plus Jakarta Sans pour tout le site : police variable (toutes les graisses dans un seul
// fichier) ; le navigateur ne télécharge que les jeux de caractères utilisés.
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource/yellowtail/latin-400.css';
import '@fontsource/yellowtail/latin-ext-400.css';

import './styles/global.css';
import App from './App.jsx';

// Le défilement est géré par l'application (ScrollManager) : le navigateur ne le restaure pas lui-même.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
