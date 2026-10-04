const path = require('path');
const crypto = require('crypto');

require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const env = process.env;
const isProd = env.NODE_ENV === 'production';

function parseTrustProxy(value) {
  if (value === undefined || value === '') return false;
  if (value === 'true') return true;
  if (value === 'false') return false;
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? value : asNumber;
}

let jwtSecret = env.JWT_SECRET;
if (!jwtSecret) {
  if (isProd) throw new Error('JWT_SECRET est obligatoire en production.');
  jwtSecret = crypto.randomBytes(32).toString('hex');
  console.warn('[config] JWT_SECRET absent : clé temporaire générée (les sessions admin seront perdues au redémarrage).');
}

module.exports = {
  isProd,
  port: Number(env.PORT) || 4000,
  corsOrigins: (env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean),
  trustProxy: parseTrustProxy(env.TRUST_PROXY),
  siteUrl: (env.SITE_URL || 'http://localhost:5173').replace(/\/$/, ''),
  formRateLimit: Number(env.FORM_RATE_LIMIT) || 30,

  db: env.DATABASE_URL
    ? { connectionString: env.DATABASE_URL, ssl: env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined }
    : {
        host: env.DB_HOST || 'localhost',
        port: Number(env.DB_PORT) || 5432,
        user: env.DB_USER || 'postgres',
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE || 'ebena',
      },

  jwtSecret,
  adminSessionHours: Number(env.ADMIN_SESSION_HOURS) || 8,
  cookieSecure: env.COOKIE_SECURE ? env.COOKIE_SECURE === 'true' : isProd,
  seedAdmin: { email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD },

  mail: {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT) || 587,
    secure: env.SMTP_SECURE === 'true',
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
    from: env.MAIL_FROM || 'ÉBËNA 2027 <contacts.ebena@gmail.com>',
    notifyTo: env.NOTIFY_TO || 'contacts.ebena@gmail.com',
  },
};
