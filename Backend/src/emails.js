// Gabarits HTML des e-mails (styles en ligne pour la compatibilité des clients mail).
const config = require('./config');
const { PACKS, PAVILLONS, INTERETS, PROFILS, JOURS, SUJETS } = require('./constants');

const C = {
  page: '#FDF5E8',
  card: '#FFFBF5',
  line: '#EAD3AE',
  gold: '#B07A2A',
  ebene: '#311502',
  text: '#3D2715',
  muted: '#8A7059',
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const nl2br = (value) => escapeHtml(value).replace(/\r?\n/g, '<br>');

function layout({ preheader, title, body }) {
  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${C.page};font-family:Arial,Helvetica,sans-serif;color:${C.text};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:16px;">
<tr><td align="center" style="padding:32px 32px 8px;">
<img src="${config.siteUrl}/images/logo-ebena-email.png" width="260" alt="ÉBËNA" style="display:block;width:260px;max-width:100%;height:auto;border:0;">
</td></tr>
<tr><td style="padding:8px 40px 0;text-align:center;">
<p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.gold};">4 · 5 · 6 juin 2027 — Parc des Chantiers, Nantes</p>
<h1 style="margin:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:normal;font-size:26px;line-height:1.3;color:${C.ebene};">${escapeHtml(title)}</h1>
</td></tr>
<tr><td style="padding:24px 40px 8px;font-size:15px;line-height:1.7;">${body}</td></tr>
<tr><td style="padding:24px 40px 32px;">
<hr style="border:0;border-top:1px solid ${C.line};margin:0 0 16px;">
<p style="margin:0;font-size:12px;line-height:1.6;color:${C.muted};text-align:center;">
ÉBËNA — Carrefour des talents, des identités et de l'avenir<br>
Un projet de l'association Art à Conter · <a href="mailto:contacts.ebena@gmail.com" style="color:${C.gold};">contacts.ebena@gmail.com</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function detailsTable(rows) {
  const cells = rows
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(
      ([label, value]) => `<tr>
<td style="padding:8px 12px 8px 0;vertical-align:top;color:${C.muted};font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td>
<td style="padding:8px 0;vertical-align:top;font-size:14px;color:${C.ebene};">${value}</td>
</tr>`
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};border-bottom:1px solid ${C.line};margin:16px 0;">${cells}</table>`;
}

const button = (href, label) =>
  `<p style="margin:24px 0 8px;text-align:center;"><a href="${href}" style="display:inline-block;background:${C.ebene};color:#F9DF9A;text-decoration:none;padding:13px 26px;border-radius:999px;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;">${escapeHtml(label)}</a></p>`;

const formatPrix = (prix) => `${prix.toLocaleString('fr-FR')} € HT`;

// --- Réservations de stand -------------------------------------------------------

function reservationAdmin(r) {
  const pack = PACKS[r.pack];
  return {
    subject: `Nouvelle demande de stand — ${pack.label} — ${r.entreprise}`,
    html: layout({
      preheader: `${r.entreprise} souhaite réserver le ${pack.label}.`,
      title: 'Nouvelle demande de stand',
      body: `<p style="margin:0;">Une nouvelle demande de réservation vient d'être déposée sur le site.</p>
${detailsTable([
  ['Référence', `<strong>${escapeHtml(r.reference)}</strong>`],
  ['Pack', `${escapeHtml(pack.label)} — ${pack.surface} — ${formatPrix(pack.prix)}`],
  ['Entreprise', escapeHtml(r.entreprise)],
  ['Secteur', escapeHtml(r.secteur)],
  ['Pavillon souhaité', escapeHtml(PAVILLONS[r.pavillon])],
  ['Pays / ville', escapeHtml([r.pays, r.ville].filter(Boolean).join(' — '))],
  ['Contact', escapeHtml([r.contact_nom, r.contact_fonction].filter(Boolean).join(', '))],
  ['E-mail', `<a href="mailto:${escapeHtml(r.email)}" style="color:${C.gold};">${escapeHtml(r.email)}</a>`],
  ['Téléphone', escapeHtml(r.telephone)],
  ['Site web', escapeHtml(r.site_web)],
  ['Message', r.message ? nl2br(r.message) : ''],
])}
${button(`${config.siteUrl}/admin`, 'Ouvrir le back-office')}`,
    }),
  };
}

function reservationConfirmation(r) {
  const pack = PACKS[r.pack];
  return {
    subject: `ÉBËNA 2027 — Votre demande de stand ${pack.label} est bien reçue`,
    html: layout({
      preheader: `Référence ${r.reference} — notre équipe revient vers vous très prochainement.`,
      title: 'Votre demande de stand est bien reçue',
      body: `<p style="margin:0 0 12px;">Bonjour ${escapeHtml(r.contact_nom)},</p>
<p style="margin:0 0 12px;">Merci pour l'intérêt que <strong>${escapeHtml(r.entreprise)}</strong> porte au salon ÉBËNA. Votre demande de réservation a bien été enregistrée.</p>
${detailsTable([
  ['Référence', `<strong>${escapeHtml(r.reference)}</strong>`],
  ['Formule', `${escapeHtml(pack.label)} — stand de ${pack.surface}`],
  ['Tarif', formatPrix(pack.prix)],
  ['Pavillon souhaité', escapeHtml(PAVILLONS[r.pavillon])],
])}
<p style="margin:0 0 12px;">Notre équipe reviendra vers vous très prochainement pour finaliser votre réservation (emplacement, modalités de paiement et logistique).</p>
<p style="margin:0;">Au plaisir de vous accueillir à Nantes,<br><em>L'équipe ÉBËNA</em></p>`,
    }),
  };
}

// --- Inscriptions visiteurs ----------------------------------------------------------

function inscriptionConfirmation(i) {
  const jours = i.jours.map((jour) => escapeHtml(JOURS[jour] || jour)).join('<br>');
  const interets = (i.interets || []).map((key) => escapeHtml(INTERETS[key] || key)).join(', ');
  return {
    subject: `ÉBËNA 2027 — Votre inscription est confirmée (${i.reference})`,
    html: layout({
      preheader: `Rendez-vous au Parc des Chantiers à Nantes. Votre numéro : ${i.reference}.`,
      title: 'Votre inscription est confirmée',
      body: `<p style="margin:0 0 12px;">Bonjour ${escapeHtml(i.prenom)},</p>
<p style="margin:0 0 12px;">Merci pour votre inscription à la première édition d'ÉBËNA, le grand rendez-vous de la création africaine en Europe.</p>
${detailsTable([
  ['N° d’inscription', `<strong style="font-size:16px;letter-spacing:1px;">${escapeHtml(i.reference)}</strong>`],
  ['Jour(s)', jours],
  ['Lieu', 'Parc des Chantiers, Nantes'],
  ['Profil', escapeHtml(PROFILS[i.profil])],
  ['Centres d’intérêt', interets],
])}
<p style="margin:0 0 12px;">Conservez ce message : votre numéro d'inscription pourra vous être demandé à l'accueil. Le programme détaillé vous sera communiqué à l'approche de l'événement.</p>
${button(`${config.siteUrl}/programme`, 'Découvrir le programme')}
<p style="margin:16px 0 0;">À très bientôt,<br><em>L'équipe ÉBËNA</em></p>`,
    }),
  };
}

// --- Contact -------------------------------------------------------------------------------

function contactAdmin(m) {
  return {
    subject: `Nouveau message — ${SUJETS[m.sujet]} — ${m.nom}`,
    html: layout({
      preheader: m.message.slice(0, 120),
      title: 'Nouveau message depuis le site',
      body: `${detailsTable([
        ['Sujet', escapeHtml(SUJETS[m.sujet])],
        ['Nom', escapeHtml(m.nom)],
        ['E-mail', `<a href="mailto:${escapeHtml(m.email)}" style="color:${C.gold};">${escapeHtml(m.email)}</a>`],
        ['Téléphone', escapeHtml(m.telephone)],
      ])}
<p style="margin:0;padding:16px;background:${C.page};border-radius:10px;">${nl2br(m.message)}</p>
${button(`${config.siteUrl}/admin`, 'Ouvrir le back-office')}`,
    }),
  };
}

module.exports = {
  escapeHtml,
  reservationAdmin,
  reservationConfirmation,
  inscriptionConfirmation,
  contactAdmin,
};
