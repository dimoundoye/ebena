const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const config = require('./config');

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  await seedAdmin();
}

// Crée le premier compte admin à partir de ADMIN_EMAIL / ADMIN_PASSWORD si aucun n'existe encore.
async function seedAdmin() {
  const { email, password } = config.seedAdmin;
  if (!email || !password) return;

  const { rows } = await pool.query('SELECT count(*)::int AS total FROM admins');
  if (rows[0].total > 0) return;

  const hash = await bcrypt.hash(password, 12);
  await pool.query('INSERT INTO admins (email, password_hash, nom) VALUES ($1, $2, $3)', [
    email.trim().toLowerCase(),
    hash,
    'Administrateur',
  ]);
  console.info(`[db] Compte admin initial créé pour ${email}.`);
}

module.exports = { migrate };
