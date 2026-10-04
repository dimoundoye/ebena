const nodemailer = require('nodemailer');
const config = require('./config');

const transporter = config.mail.host
  ? nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.secure,
      auth: config.mail.user ? { user: config.mail.user, pass: config.mail.pass } : undefined,
    })
  : null;

if (!transporter) {
  console.info('[mail] SMTP non configuré : les e-mails seront seulement journalisés dans la console.');
}

// Ne lève jamais d'erreur : un e-mail raté ne doit pas faire échouer l'enregistrement d'un formulaire.
async function sendMail({ to, subject, html, text, replyTo }) {
  if (!transporter) {
    console.info(`[mail:dev] À : ${to} | Objet : ${subject}`);
    return { skipped: true };
  }
  try {
    await transporter.sendMail({ from: config.mail.from, to, subject, html, text, replyTo });
    return { sent: true };
  } catch (err) {
    console.error(`[mail] Échec de l'envoi « ${subject} » à ${to} :`, err.message);
    return { error: true };
  }
}

module.exports = { sendMail };
