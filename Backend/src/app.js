const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const config = require('./config');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('trust proxy', config.trustProxy);
app.disable('x-powered-by');
app.use(helmet());
if (config.corsOrigins.length) {
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
}
app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Ressource introuvable.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (res.headersSent) {
    console.error('[api] Erreur après réponse :', err);
    return;
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Requête invalide.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ message: 'Requête trop volumineuse.' });
  console.error('[api]', err);
  res.status(500).json({ message: 'Une erreur interne est survenue. Réessayez dans un instant.' });
});

module.exports = app;
