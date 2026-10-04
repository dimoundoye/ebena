// Crée ou met à jour un compte du back-office.
// Usage : npm run create-admin -- admin@exemple.com "MotDePasseSolide" "Prénom Nom"
const bcrypt = require('bcryptjs');
const pool = require('../src/db');
const { migrate } = require('../src/migrate');

async function main() {
  const [email, password, nom = 'Administrateur'] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Usage : npm run create-admin -- <email> <mot-de-passe> ["Prénom Nom"]');
    process.exit(1);
  }
  if (password.length < 10) {
    console.error('Le mot de passe doit contenir au moins 10 caractères.');
    process.exit(1);
  }

  await migrate();
  const hash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO admins (email, password_hash, nom) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, nom = EXCLUDED.nom`,
    [email.trim().toLowerCase(), hash, nom]
  );
  console.log(`Compte admin prêt : ${email.trim().toLowerCase()}`);
}

main()
  .catch((err) => {
    console.error('Erreur :', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
