const jwt = require('jsonwebtoken');
const { rateLimit } = require('express-rate-limit');
const config = require('./config');

const ADMIN_COOKIE = 'ebena_admin';

function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: config.cookieSecure,
    path: '/api',
    maxAge: config.adminSessionHours * 60 * 60 * 1000,
  };
}

function requireAdmin(req, res, next) {
  const token = req.cookies?.[ADMIN_COOKIE];
  if (!token) return res.status(401).json({ message: 'Session expirée. Reconnectez-vous.' });
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.admin = { id: Number(payload.sub), email: payload.email };
    return next();
  } catch {
    const { maxAge, ...clearOptions } = adminCookieOptions();
    res.clearCookie(ADMIN_COOKIE, clearOptions);
    return res.status(401).json({ message: 'Session expirée. Reconnectez-vous.' });
  }
}

const limitMessage = (message) => ({ message });

// Formulaires publics : un compteur par formulaire et par IP, assez large pour un Wi-Fi partagé
// (accueil du salon, bureaux) mais suffisant pour bloquer l'envoi massif.
const formLimiter = () =>
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: config.formRateLimit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: limitMessage('Trop de demandes envoyées. Réessayez dans quelques minutes.'),
  });

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: limitMessage('Trop de tentatives de connexion. Réessayez dans 15 minutes.'),
});

// Champ piège invisible pour les humains : s'il est rempli, c'est un robot.
const isBot = (body) => Boolean(body && typeof body.website === 'string' && body.website.trim());

module.exports = { ADMIN_COOKIE, adminCookieOptions, requireAdmin, formLimiter, loginLimiter, isBot };
