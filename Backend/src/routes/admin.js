const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const config = require('../config');
const { PACKS, PAVILLONS, INTERETS, PROFILS, JOURS, SUJETS, STATUTS } = require('../constants');
const { ADMIN_COOKIE, adminCookieOptions, requireAdmin, loginLimiter } = require('../middleware');
const { toCsv } = require('../utils');
const { validate, loginSchema, reservationUpdateSchema, messageUpdateSchema } = require('../validators');

const router = express.Router();

// Hash factice : la comparaison prend le même temps que l'e-mail existe ou non.
const DUMMY_HASH = bcrypt.hashSync('ebena-dummy-password', 12);

// --- Authentification -----------------------------------------------------------------------------
router.post('/login', loginLimiter, async (req, res) => {
  const { data, errors } = validate(loginSchema, req.body);
  if (errors) return res.status(400).json({ message: 'Identifiants incorrects.', errors });

  const { rows } = await pool.query('SELECT id, email, nom, password_hash FROM admins WHERE email = $1', [data.email]);
  const admin = rows[0];
  const passwordOk = await bcrypt.compare(data.password, admin ? admin.password_hash : DUMMY_HASH);
  if (!admin || !passwordOk) return res.status(401).json({ message: 'Identifiants incorrects.' });

  await pool.query('UPDATE admins SET last_login_at = now() WHERE id = $1', [admin.id]);
  const token = jwt.sign({ sub: String(admin.id), email: admin.email }, config.jwtSecret, {
    expiresIn: `${config.adminSessionHours}h`,
  });
  res.cookie(ADMIN_COOKIE, token, adminCookieOptions());
  res.json({ admin: { email: admin.email, nom: admin.nom } });
});

router.post('/logout', (req, res) => {
  const { maxAge, ...clearOptions } = adminCookieOptions();
  res.clearCookie(ADMIN_COOKIE, clearOptions);
  res.json({ message: 'Déconnecté.' });
});

router.use(requireAdmin);

router.get('/me', async (req, res) => {
  const { rows } = await pool.query('SELECT email, nom FROM admins WHERE id = $1', [req.admin.id]);
  if (!rows[0]) return res.status(401).json({ message: 'Session expirée. Reconnectez-vous.' });
  res.json({ admin: rows[0] });
});

// --- Tableau de bord ---------------------------------------------------------------------------------
router.get('/stats', async (req, res) => {
  const [totals, byPack, byDay, byProfil, recentReservations, recentMessages] = await Promise.all([
    pool.query(`SELECT
      (SELECT count(*) FROM reservations)::int                          AS reservations,
      (SELECT count(*) FROM reservations WHERE statut = 'nouveau')::int AS reservations_nouvelles,
      (SELECT count(*) FROM inscriptions)::int                          AS inscriptions,
      (SELECT count(*) FROM messages)::int                              AS messages,
      (SELECT count(*) FROM messages WHERE NOT lu)::int                 AS messages_non_lus,
      (SELECT count(*) FROM newsletter)::int                            AS newsletter`),
    pool.query(`SELECT pack, statut, count(*)::int AS total FROM reservations GROUP BY pack, statut`),
    pool.query(`SELECT jour, count(*)::int AS total FROM inscriptions, unnest(jours) AS jour GROUP BY jour ORDER BY jour`),
    pool.query(`SELECT profil, count(*)::int AS total FROM inscriptions GROUP BY profil ORDER BY total DESC`),
    pool.query(`SELECT id, reference, entreprise, pack, statut, created_at FROM reservations ORDER BY created_at DESC LIMIT 5`),
    pool.query(`SELECT id, nom, sujet, lu, created_at FROM messages ORDER BY created_at DESC LIMIT 5`),
  ]);

  const packs = Object.fromEntries(Object.keys(PACKS).map((pack) => [pack, { total: 0, confirmes: 0 }]));
  let caConfirme = 0;
  let caPotentiel = 0;
  for (const row of byPack.rows) {
    packs[row.pack].total += row.total;
    if (row.statut === 'confirme') {
      packs[row.pack].confirmes += row.total;
      caConfirme += row.total * PACKS[row.pack].prix;
    }
    if (row.statut !== 'annule') caPotentiel += row.total * PACKS[row.pack].prix;
  }

  res.json({
    totals: totals.rows[0],
    packs,
    chiffreAffaires: { confirme: caConfirme, potentiel: caPotentiel },
    inscriptionsParJour: Object.keys(JOURS).map((jour) => ({
      jour,
      total: byDay.rows.find((row) => row.jour === jour)?.total || 0,
    })),
    inscriptionsParProfil: byProfil.rows,
    recentReservations: recentReservations.rows,
    recentMessages: recentMessages.rows,
  });
});

// Référentiels pour les libellés du back-office.
router.get('/referentiels', (req, res) => {
  res.json({ PACKS, PAVILLONS, INTERETS, PROFILS, JOURS, SUJETS, STATUTS });
});

// --- Listes filtrables -----------------------------------------------------------------------------------
const RESOURCES = {
  reservations: {
    table: 'reservations',
    search: ['reference', 'entreprise', 'contact_nom', 'email', 'secteur', 'pays', 'ville'],
    filters: { statut: Object.keys(STATUTS), pack: Object.keys(PACKS) },
  },
  inscriptions: {
    table: 'inscriptions',
    search: ['reference', 'prenom', 'nom', 'email', 'ville'],
    filters: { profil: Object.keys(PROFILS) },
    arrayFilters: { jour: { column: 'jours', values: Object.keys(JOURS) } },
  },
  messages: {
    table: 'messages',
    search: ['nom', 'email', 'message'],
    filters: { sujet: Object.keys(SUJETS) },
    booleanFilters: { lu: 'lu' },
  },
  newsletter: {
    table: 'newsletter',
    search: ['email'],
    filters: { source: null },
  },
};

// Construit une clause WHERE paramétrée à partir de la query string (valeurs filtrées par liste blanche).
function buildWhere(resource, query) {
  const clauses = [];
  const params = [];
  const q = typeof query.q === 'string' ? query.q.trim() : '';
  if (q) {
    params.push(`%${q}%`);
    clauses.push(`(${resource.search.map((column) => `${column} ILIKE $${params.length}`).join(' OR ')})`);
  }
  for (const [name, allowed] of Object.entries(resource.filters || {})) {
    const value = query[name];
    if (typeof value !== 'string' || !value) continue;
    if (allowed && !allowed.includes(value)) continue;
    params.push(value);
    clauses.push(`${name} = $${params.length}`);
  }
  for (const [name, { column, values }] of Object.entries(resource.arrayFilters || {})) {
    const value = query[name];
    if (typeof value !== 'string' || !values.includes(value)) continue;
    params.push(value);
    clauses.push(`$${params.length} = ANY(${column})`);
  }
  for (const [name, column] of Object.entries(resource.booleanFilters || {})) {
    if (query[name] === 'true' || query[name] === 'false') {
      params.push(query[name] === 'true');
      clauses.push(`${column} = $${params.length}`);
    }
  }
  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params };
}

for (const [name, resource] of Object.entries(RESOURCES)) {
  router.get(`/${name}`, async (req, res) => {
    const { where, params } = buildWhere(resource, req.query);
    const { rows } = await pool.query(
      `SELECT * FROM ${resource.table} ${where} ORDER BY created_at DESC LIMIT 2000`,
      params
    );
    res.json({ items: rows });
  });

  router.delete(`/${name}/:id`, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Identifiant invalide.' });
    const { rowCount } = await pool.query(`DELETE FROM ${resource.table} WHERE id = $1`, [id]);
    if (!rowCount) return res.status(404).json({ message: 'Élément introuvable.' });
    res.json({ message: 'Élément supprimé.' });
  });
}

router.patch('/reservations/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Identifiant invalide.' });
  const { data, errors } = validate(reservationUpdateSchema, req.body);
  if (errors) return res.status(400).json({ message: errors._ || 'Modification invalide.', errors });

  const { rows } = await pool.query(
    `UPDATE reservations
        SET statut = COALESCE($2, statut),
            note_interne = CASE WHEN $3::boolean THEN $4 ELSE note_interne END,
            updated_at = now()
      WHERE id = $1
      RETURNING *`,
    [id, data.statut ?? null, data.note_interne !== undefined, data.note_interne ?? null]
  );
  if (!rows[0]) return res.status(404).json({ message: 'Réservation introuvable.' });
  res.json({ item: rows[0] });
});

router.patch('/messages/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Identifiant invalide.' });
  const { data, errors } = validate(messageUpdateSchema, req.body);
  if (errors) return res.status(400).json({ message: 'Modification invalide.', errors });

  const { rows } = await pool.query('UPDATE messages SET lu = $2 WHERE id = $1 RETURNING *', [id, data.lu]);
  if (!rows[0]) return res.status(404).json({ message: 'Message introuvable.' });
  res.json({ item: rows[0] });
});

// --- Exports CSV ------------------------------------------------------------------------------------------
const date = (value) => (value ? new Date(value).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) : '');
const labels = (dict) => (keys) => (keys || []).map((key) => dict[key] || key);

const EXPORTS = {
  reservations: [
    { label: 'Référence', value: (r) => r.reference },
    { label: 'Date', value: (r) => date(r.created_at) },
    { label: 'Statut', value: (r) => STATUTS[r.statut] },
    { label: 'Pack', value: (r) => PACKS[r.pack]?.label },
    { label: 'Tarif HT (€)', value: (r) => PACKS[r.pack]?.prix },
    { label: 'Entreprise', value: (r) => r.entreprise },
    { label: 'Secteur', value: (r) => r.secteur },
    { label: 'Pavillon souhaité', value: (r) => PAVILLONS[r.pavillon] },
    { label: 'Pays', value: (r) => r.pays },
    { label: 'Ville', value: (r) => r.ville },
    { label: 'Contact', value: (r) => r.contact_nom },
    { label: 'Fonction', value: (r) => r.contact_fonction },
    { label: 'E-mail', value: (r) => r.email },
    { label: 'Téléphone', value: (r) => r.telephone },
    { label: 'Site web', value: (r) => r.site_web },
    { label: 'Message', value: (r) => r.message },
    { label: 'Note interne', value: (r) => r.note_interne },
  ],
  inscriptions: [
    { label: 'Référence', value: (r) => r.reference },
    { label: 'Date', value: (r) => date(r.created_at) },
    { label: 'Prénom', value: (r) => r.prenom },
    { label: 'Nom', value: (r) => r.nom },
    { label: 'E-mail', value: (r) => r.email },
    { label: 'Téléphone', value: (r) => r.telephone },
    { label: 'Ville', value: (r) => r.ville },
    { label: 'Profil', value: (r) => PROFILS[r.profil] },
    { label: 'Jours', value: (r) => labels(JOURS)(r.jours) },
    { label: 'Centres d’intérêt', value: (r) => labels(INTERETS)(r.interets) },
    { label: 'Newsletter', value: (r) => (r.newsletter ? 'Oui' : 'Non') },
  ],
  messages: [
    { label: 'Date', value: (r) => date(r.created_at) },
    { label: 'Sujet', value: (r) => SUJETS[r.sujet] },
    { label: 'Nom', value: (r) => r.nom },
    { label: 'E-mail', value: (r) => r.email },
    { label: 'Téléphone', value: (r) => r.telephone },
    { label: 'Message', value: (r) => r.message },
    { label: 'Lu', value: (r) => (r.lu ? 'Oui' : 'Non') },
  ],
  newsletter: [
    { label: 'E-mail', value: (r) => r.email },
    { label: 'Source', value: (r) => r.source },
    { label: 'Date', value: (r) => date(r.created_at) },
  ],
};

router.get('/export/:resource', async (req, res) => {
  const columns = EXPORTS[req.params.resource];
  if (!columns) return res.status(404).json({ message: 'Export inconnu.' });
  const resource = RESOURCES[req.params.resource];
  const { where, params } = buildWhere(resource, req.query);
  const { rows } = await pool.query(`SELECT * FROM ${resource.table} ${where} ORDER BY created_at DESC`, params);
  const today = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="ebena-${req.params.resource}-${today}.csv"`);
  res.send(toCsv(columns, rows));
});

module.exports = router;
