// Référentiels partagés par la validation, les e-mails et les exports.
// Garder les clés synchronisées avec frontend/src/data/site.js.

const PACKS = {
  silver: { label: 'Pack Silver', prix: 600, surface: '9 m²' },
  gold: { label: 'Pack Gold', prix: 1000, surface: '12 m²' },
  platinum: { label: 'Pack Platinum', prix: 1500, surface: '18 m²' },
};

const PAVILLONS = {
  memoire: 'Mémoires et histoires africaines',
  artisanat: 'Artisanat, design et mode',
  numerique: 'Innovation numérique',
  musique: 'Marché de la musique',
  agroalimentaire: 'Agroalimentaire',
  business: 'Africa Business Meeting',
  indecis: 'À définir avec l’équipe',
};

const INTERETS = {
  ...Object.fromEntries(Object.entries(PAVILLONS).filter(([key]) => key !== 'indecis')),
  scene: 'La Scène ÉBËNA (défilés, talks, showcases)',
};

const PROFILS = {
  visiteur: 'Grand public',
  professionnel: 'Professionnel / entreprise',
  entrepreneur: 'Entrepreneur / porteur de projet',
  investisseur: 'Investisseur',
  artiste: 'Artiste / créateur',
  etudiant: 'Étudiant / chercheur',
  presse: 'Presse / média',
  institution: 'Institution / collectivité',
};

const JOURS = {
  '2027-06-04': 'Vendredi 4 juin 2027',
  '2027-06-05': 'Samedi 5 juin 2027',
  '2027-06-06': 'Dimanche 6 juin 2027',
};

const SUJETS = {
  information: 'Information générale',
  exposer: 'Exposer au salon',
  partenariat: 'Partenariat / sponsoring',
  presse: 'Presse / médias',
  benevolat: 'Bénévolat',
  autre: 'Autre',
};

const STATUTS = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  confirme: 'Confirmé',
  annule: 'Annulé',
};

module.exports = { PACKS, PAVILLONS, INTERETS, PROFILS, JOURS, SUJETS, STATUTS };
