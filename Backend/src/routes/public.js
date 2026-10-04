const express = require('express');
const pool = require('../db');
const config = require('../config');
const { sendMail } = require('../mailer');
const emails = require('../emails');
const { formLimiter, isBot } = require('../middleware');
const { insertWithReference, makeReference, UNIQUE_VIOLATION } = require('../utils');
const {
  validate,
  reservationSchema,
  inscriptionSchema,
  contactSchema,
  newsletterSchema,
} = require('../validators');

const router = express.Router();

const invalid = (res, errors) =>
  res.status(400).json({ message: 'Certains champs sont à corriger.', errors });

router.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: true });
  } catch {
    res.status(503).json({ ok: false, db: false });
  }
});

// --- Réservation de stand ------------------------------------------------------------------
router.post('/reservations', formLimiter(), async (req, res) => {
  if (isBot(req.body)) return res.status(201).json({ message: 'Demande enregistrée.', reference: makeReference('STD27') });

  const { data, errors } = validate(reservationSchema, req.body);
  if (errors) return invalid(res, errors);

  const reservation = await insertWithReference('STD27', async (reference) => {
    const { rows } = await pool.query(
      `INSERT INTO reservations
         (reference, pack, entreprise, secteur, pavillon, pays, ville, contact_nom, contact_fonction, email, telephone, site_web, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        reference, data.pack, data.entreprise, data.secteur, data.pavillon, data.pays, data.ville,
        data.contact_nom, data.contact_fonction, data.email, data.telephone, data.site_web, data.message,
      ]
    );
    return rows[0];
  });

  res.status(201).json({ message: 'Demande enregistrée.', reference: reservation.reference });

  const toTeam = emails.reservationAdmin(reservation);
  const toExhibitor = emails.reservationConfirmation(reservation);
  sendMail({ to: config.mail.notifyTo, replyTo: reservation.email, ...toTeam });
  sendMail({ to: reservation.email, ...toExhibitor });
});

// --- Inscription visiteur ---------------------------------------------------------------------
router.post('/inscriptions', formLimiter(), async (req, res) => {
  if (isBot(req.body)) return res.status(201).json({ message: 'Inscription enregistrée.', reference: makeReference('EB27') });

  const { data, errors } = validate(inscriptionSchema, req.body);
  if (errors) return invalid(res, errors);

  let inscription;
  try {
    inscription = await insertWithReference('EB27', async (reference) => {
      const { rows } = await pool.query(
        `INSERT INTO inscriptions (reference, prenom, nom, email, telephone, ville, profil, jours, interets, newsletter)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [reference, data.prenom, data.nom, data.email, data.telephone, data.ville, data.profil, data.jours, data.interets, data.newsletter]
      );
      return rows[0];
    });
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION && String(err.constraint).includes('email')) {
      return res.status(409).json({
        message: 'Cette adresse e-mail est déjà inscrite. Consultez l’e-mail de confirmation reçu ou contactez-nous.',
        errors: { email: 'Adresse déjà inscrite.' },
      });
    }
    throw err;
  }

  if (data.newsletter) {
    await pool.query(
      `INSERT INTO newsletter (email, source) VALUES ($1, 'inscription') ON CONFLICT (email) DO NOTHING`,
      [data.email]
    );
  }

  res.status(201).json({ message: 'Inscription enregistrée.', reference: inscription.reference });

  sendMail({ to: inscription.email, ...emails.inscriptionConfirmation(inscription) });
});

// --- Contact ---------------------------------------------------------------------------------------
router.post('/contact', formLimiter(), async (req, res) => {
  if (isBot(req.body)) return res.status(201).json({ message: 'Message envoyé.' });

  const { data, errors } = validate(contactSchema, req.body);
  if (errors) return invalid(res, errors);

  const { rows } = await pool.query(
    `INSERT INTO messages (nom, email, telephone, sujet, message) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [data.nom, data.email, data.telephone, data.sujet, data.message]
  );

  res.status(201).json({ message: 'Message envoyé.' });

  sendMail({ to: config.mail.notifyTo, replyTo: data.email, ...emails.contactAdmin(rows[0]) });
});

// --- Newsletter ---------------------------------------------------------------------------------
router.post('/newsletter', formLimiter(), async (req, res) => {
  if (isBot(req.body)) return res.status(201).json({ message: 'Inscription à la newsletter confirmée.' });

  const { data, errors } = validate(newsletterSchema, req.body);
  if (errors) return invalid(res, errors);

  // Même réponse que l'adresse soit nouvelle ou déjà inscrite (ne révèle pas qui est abonné).
  await pool.query(
    'INSERT INTO newsletter (email, source) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
    [data.email, data.source]
  );
  res.status(201).json({ message: 'Inscription à la newsletter confirmée.' });
});

module.exports = router;
