import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Trois familles, chacune avec un rôle (voir global.css) et sans italique.
// Seuls les jeux de caractères latins sont chargés : le site est en français.
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/cormorant-garamond/latin-ext-600.css';
import '@fontsource/cormorant-garamond/latin-700.css';
import '@fontsource/cormorant-garamond/latin-ext-700.css';
import '@fontsource/montserrat/latin-400.css';
import '@fontsource/montserrat/latin-ext-400.css';
import '@fontsource/montserrat/latin-500.css';
import '@fontsource/montserrat/latin-ext-500.css';
import '@fontsource/montserrat/latin-600.css';
import '@fontsource/montserrat/latin-ext-600.css';
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
