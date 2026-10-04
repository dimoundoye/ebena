const { z } = require('zod');
const { PACKS, PAVILLONS, INTERETS, PROFILS, JOURS, SUJETS, STATUTS } = require('./constants');

const keys = (obj) => Object.keys(obj);

const required = (label, max = 160) =>
  z
    .string({ error: `${label} est obligatoire.` })
    .trim()
    .min(1, `${label} est obligatoire.`)
    .max(max, `${max} caractères maximum.`);

const optional = (max = 160) =>
  z
    .string({ error: 'Valeur invalide.' })
    .trim()
    .max(max, `${max} caractères maximum.`)
    .optional()
    .nullable()
    .transform((value) => value || null);

const email = z
  .string({ error: 'L’adresse e-mail est obligatoire.' })
  .trim()
  .toLowerCase()
  .min(1, 'L’adresse e-mail est obligatoire.')
  .max(254, 'Adresse e-mail trop longue.')
  .pipe(z.email({ error: 'Adresse e-mail invalide.' }));

const PHONE = /^\+?[\d\s().-]{6,40}$/;

const phoneRequired = z
  .string({ error: 'Le téléphone est obligatoire.' })
  .trim()
  .min(1, 'Le téléphone est obligatoire.')
  .regex(PHONE, 'Numéro de téléphone invalide.');

const phoneOptional = z
  .string({ error: 'Numéro de téléphone invalide.' })
  .trim()
  .optional()
  .nullable()
  .refine((value) => !value || PHONE.test(value), 'Numéro de téléphone invalide.')
  .transform((value) => value || null);

const consent = z.literal(true, { error: 'Vous devez accepter l’utilisation de vos données pour continuer.' });

const reservationSchema = z.object({
  pack: z.enum(keys(PACKS), { error: 'Choisissez un pack.' }),
  entreprise: required('Le nom de l’entreprise', 200),
  secteur: optional(120),
  pavillon: z
    .enum(keys(PAVILLONS), { error: 'Pavillon inconnu.' })
    .optional()
    .nullable()
    .transform((value) => value || 'indecis'),
  pays: optional(120),
  ville: optional(120),
  contact_nom: required('Le nom du contact', 160),
  contact_fonction: optional(120),
  email,
  telephone: phoneRequired,
  site_web: optional(300),
  message: optional(3000),
  consentement: consent,
});

const inscriptionSchema = z.object({
  prenom: required('Le prénom', 100),
  nom: required('Le nom', 100),
  email,
  telephone: phoneOptional,
  ville: optional(120),
  profil: z.enum(keys(PROFILS), { error: 'Choisissez votre profil.' }),
  jours: z
    .array(z.enum(keys(JOURS)), { error: 'Sélectionnez au moins un jour.' })
    .min(1, 'Sélectionnez au moins un jour.')
    .transform((jours) => [...new Set(jours)].sort()),
  interets: z
    .array(z.enum(keys(INTERETS)), { error: 'Centres d’intérêt invalides.' })
    .optional()
    .default([])
    .transform((items) => [...new Set(items)]),
  newsletter: z.boolean({ error: 'Valeur invalide.' }).optional().default(false),
  consentement: consent,
});

const contactSchema = z.object({
  nom: required('Le nom', 160),
  email,
  telephone: phoneOptional,
  sujet: z.enum(keys(SUJETS), { error: 'Choisissez un sujet.' }),
  message: required('Le message', 5000).refine((value) => value.length >= 10, 'Votre message est un peu court (10 caractères minimum).'),
  consentement: consent,
});

const newsletterSchema = z.object({
  email,
  source: z.string().trim().max(40).optional().default('site'),
});

const loginSchema = z.object({
  email,
  password: z.string({ error: 'Le mot de passe est obligatoire.' }).min(1, 'Le mot de passe est obligatoire.').max(200),
});

const reservationUpdateSchema = z
  .object({
    statut: z.enum(keys(STATUTS), { error: 'Statut inconnu.' }).optional(),
    note_interne: z.string().trim().max(3000).optional().nullable(),
  })
  .refine((value) => value.statut !== undefined || value.note_interne !== undefined, 'Aucune modification fournie.');

const messageUpdateSchema = z.object({ lu: z.boolean({ error: 'Valeur invalide.' }) });

// Retourne { data } si valide, sinon { errors: { champ: message } } (premier message par champ).
function validate(schema, input) {
  const result = schema.safeParse(input ?? {});
  if (result.success) return { data: result.data };
  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path.length ? String(issue.path[0]) : '_';
    if (!errors[field]) errors[field] = issue.message;
  }
  return { errors };
}

module.exports = {
  validate,
  reservationSchema,
  inscriptionSchema,
  contactSchema,
  newsletterSchema,
  loginSchema,
  reservationUpdateSchema,
  messageUpdateSchema,
};
