const config = require('./src/config');
const app = require('./src/app');
const { migrate } = require('./src/migrate');

async function start() {
  try {
    await migrate();
  } catch (err) {
    console.error('[db] Impossible de préparer la base de données :', err.message);
    console.error('[db] Vérifiez les variables DB_* (ou DATABASE_URL) dans Backend/.env.');
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`API ÉBËNA en écoute sur http://localhost:${config.port}`);
  });
}

start();
