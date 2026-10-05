# ÉBËNA 2027 — site officiel

Site du salon **ÉBËNA, carrefour des talents, des identités et de l’avenir** : 4, 5 et 6 juin 2027, Parc des Chantiers, Nantes.
Un projet de l’association Art à Conter.

- **frontend/** : site vitrine multi-pages (React 19 + Vite), direction artistique « ivoire et or » reprise de la plaquette du client.
- **Backend/** : API Node/Express + PostgreSQL pour les formulaires et le back-office.
- **Document/** : plaquette PDF fournie par le client (source des textes et visuels), exclue de git.

## Pages

| Route | Contenu |
|---|---|
| `/` | Accueil : hero, puis des sections qui arrivent chacune avec une transition au fil du défilement (manifeste, chiffres clés, les six pavillons, Scène ÉBËNA, les intervenants de la Méthode des Leaders, Bénin et parrain, packs, partenaires, compte à rebours) |
| `/le-salon` | Pourquoi ÉBËNA, le concept, le Parc des Chantiers et le Mât de la Fraternité, le Bénin, le mot du parrain |
| `/programme` | Les six pavillons en détail (chacun avec sa porte aux couleurs du pavillon), La Scène ÉBËNA, La Cour Royale de Maam, Le Voyage (le tram avance au défilement), La Méthode des Leaders et ses intervenants en carrousel |
| `/equipe` | Chef de projet, équipe du salon, équipe du projet (portraits qui s’ouvrent en arche) |
| `/exposants` | Packs Silver, Gold et Platinum et formulaire de réservation de stand (`?pack=gold` présélectionne un pack) |
| `/partenaires` | Institutions, partenaires, organisations associées |
| `/inscription` | Pré-inscription des visiteurs (numéro d’inscription et ajout à l’agenda) |
| `/contact` | Coordonnées et formulaire de contact (`?sujet=presse` présélectionne le sujet) |
| `/mentions-legales` | Mentions légales et confidentialité (**informations à compléter**, voir plus bas) |
| `/admin` | Back-office : tableau de bord, demandes de stand (statuts, notes internes), inscriptions, messages, newsletter, exports CSV |

## Lancer le projet en local

Prérequis : Node.js 20 ou plus récent et PostgreSQL 14 ou plus récent.

**1. Base de données** : créer une base vide `ebena`, par exemple avec pgAdmin ou :

```bash
createdb -U postgres ebena
```

**2. API** : copier `Backend/.env.example` en `Backend/.env`, puis renseigner au minimum `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_EMAIL` et `ADMIN_PASSWORD`. Une valeur qui contient `#` ou des espaces doit être entre guillemets.

```bash
cd Backend
npm install
npm run dev
```

Les tables sont créées automatiquement au démarrage. Le premier compte admin est créé à partir de `ADMIN_EMAIL` et `ADMIN_PASSWORD` s’il n’en existe aucun. L’API écoute sur http://localhost:4000.

**3. Site**, dans un second terminal :

```bash
cd frontend
npm install
npm run dev
```

Le site est alors disponible sur http://localhost:5173. Vite relaie les appels `/api` vers l’API.

### Comptes du back-office

Pour créer un compte ou changer un mot de passe (10 caractères minimum) :

```bash
cd Backend
npm run create-admin -- prenom@exemple.com "MotDePasseSolide" "Prénom Nom"
```

### E-mails

Sans `SMTP_HOST`, les e-mails sont seulement affichés dans la console de l’API, ce qui est pratique en développement. En production, renseigner les variables `SMTP_*` : Brevo, Mailjet ou l’hébergeur du domaine conviennent. Avec Gmail, il faut un mot de passe d’application.

Les envois effectués :

- **Réservation de stand** : notification à l’équipe (`NOTIFY_TO`) et accusé de réception à l’exposant.
- **Inscription visiteur** : confirmation avec le numéro d’inscription.
- **Contact** : notification à l’équipe, avec l’adresse du visiteur en « répondre à ».

## Mise en production (Docker)

```bash
cp .env.example .env     # puis compléter DB_PASSWORD, JWT_SECRET, ADMIN_*, SMTP_*, SITE_URL
docker compose up -d --build
```

Cette commande lance trois conteneurs :

- `db` : PostgreSQL, avec un volume persistant ;
- `backend` : l’API ;
- `frontend` : Nginx, qui sert le site et relaie `/api`.

Le site écoute sur le port `HTTP_PORT` (8080 par défaut). Pour le HTTPS, placer devant un proxy (Caddy, Traefik ou Nginx avec Certbot), puis régler `COOKIE_SECURE=true` et `TRUST_PROXY=2`.

### Site sur Netlify

Le fichier [frontend/netlify.toml](frontend/netlify.toml) contient toute la configuration :

- commande `npm run build` et publication du dossier `dist` ;
- version de Node ;
- renvoi de toutes les routes vers `index.html`, ce qui est nécessaire pour `/programme`, `/admin`, etc.

Dans Netlify, seul le **dossier de base** doit être renseigné : `frontend`. Les valeurs du fichier remplacent celles de l’interface. Le dossier `dist` n’a pas besoin d’être dans git : Netlify le reconstruit à chaque déploiement.

Netlify n’héberge que le site. L’API (Express + PostgreSQL) doit tourner ailleurs : VPS, Render, Railway… Tant qu’elle n’est pas en ligne, les formulaires affichent « Ce service n’est pas encore disponible en ligne ». Une fois l’API en ligne :

1. Dans `netlify.toml`, remplacer la règle `/api/*` par le relais en commentaire, avec l’adresse de l’API. Netlify transmettra alors les appels `/api` à l’API, sans souci de CORS ni de cookies.
2. Côté API, régler `SITE_URL` sur l’adresse du site Netlify et `COOKIE_SECURE=true`.

## Modifier les contenus

- **Textes, équipe, leaders, packs, partenaires, contacts, réseaux sociaux** : tout est dans [frontend/src/data/site.js](frontend/src/data/site.js). Les réseaux sociaux ne s’affichent que lorsqu’une URL est renseignée.
- **Images** : dans [frontend/public/images](frontend/public/images), au format WebP. Elles ont été extraites de la plaquette PDF.
- **Couleurs et typographies** : variables CSS en tête de [frontend/src/styles/global.css](frontend/src/styles/global.css). La palette a été relevée sur l’affiche officielle. Trois polices au plus, sans italique : Cormorant Garamond pour les titres et les chiffres, Montserrat pour le texte, Yellowtail réservée à la signature « L’Afrique créative en mouvement ».
- Les listes des formulaires (packs, pavillons, profils, jours, sujets) existent côté site **et** côté API ([Backend/src/constants.js](Backend/src/constants.js)) : garder les mêmes clés.

### Les transitions des pages (accueil, programme, équipe)

Sous l’en-tête, la page défile normalement et chaque section arrive avec sa transition (balayage, porte en arche, rideau, stores, cercle doré…), qui avance au rythme du défilement sans jamais le bloquer. Les éléments de texte apparaissent quand ils entrent dans l’écran.

- Le mécanisme est dans [frontend/src/components/scene](frontend/src/components/scene). Les sections de l’accueil sont dans [frontend/src/pages/home](frontend/src/pages/home) ; les blocs communs à plusieurs pages (porte d’un pavillon, ligne de tram, carrousel des intervenants, La Scène, La Cour Royale, appel à l’action final) dans [frontend/src/components](frontend/src/components).
- Pour passer une autre page à ce style : entourer ses sections de `<SceneFlow>` et donner aux éléments qui doivent apparaître la classe `build` (variantes `build--zoom`, `build--left`, `build--fade`, `build--wipe`, `build--arch`).
- Une section se déclare ainsi : `<Scene id="benin" tone="ivoire" transition="drapeau">…</Scene>`. `id` sert d’ancre (`/#benin`).
- Transitions : `fondu`, `zoom`, `balayage`, `drapeau`, `porte`, `rideau`, `stores`, `poussee`, `noir`, `cercle`. Fonds : `ivoire`, `sable`, `scene`, `soleil`, `bordeaux`, `ebene`.
- Les six pavillons : sur grand écran, une porte en arche reste à côté du texte (une seule porte qui change de couleur sur l’accueil, une porte par pavillon sur le programme). Les intervenants : carrousel d’affiches (flèches, vignettes, glisser, clavier), qui défile seul tant que le visiteur ne s’en sert pas.
- Avec le réglage système « réduire les animations », tout s’affiche directement, sans transition.

## API

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/api/reservations` | Demande de stand |
| POST | `/api/inscriptions` | Pré-inscription visiteur (une par adresse e-mail) |
| POST | `/api/contact` | Message de contact |
| POST | `/api/newsletter` | Abonnement à la newsletter |
| GET | `/api/health` | État de l’API et de la base |
| POST | `/api/admin/login` · `/api/admin/logout` | Session admin (cookie httpOnly) |
| GET | `/api/admin/stats` · `/api/admin/{reservations,inscriptions,messages,newsletter}` | Tableau de bord et listes filtrables |
| PATCH | `/api/admin/reservations/:id` · `/api/admin/messages/:id` | Statut, note interne, lu ou non lu |
| DELETE | `/api/admin/{ressource}/:id` | Suppression |
| GET | `/api/admin/export/{ressource}` | Export CSV (compatible Excel) |

Protections en place :

- validation des données (Zod) ;
- limite d’envois par formulaire et par IP (`FORM_RATE_LIMIT`) ;
- champ piège anti-robots ;
- en-têtes de sécurité (Helmet) ;
- mots de passe hachés (bcrypt) ;
- cookie de session `httpOnly` et `SameSite=Strict`.

## À obtenir du client

- **Logo** en haute définition sur fond transparent (PNG ou SVG). Celui du site a été détouré depuis le PDF.
- **Photos** en haute définition, et **logos des partenaires** en fichiers séparés : dans le PDF, ils forment une seule image en basse définition.
- **Lieu** : « Parc des Chantiers » ou « Parc des Chantiers Navals » ? L’affiche et la plaquette diffèrent ; le site utilise « Parc des Chantiers ».
- **Entrée visiteurs** gratuite ou payante, et **horaires** d’ouverture. S’il y a une billetterie externe, son lien.
- **Programme détaillé** jour par jour, quand il sera prêt.
- **Réseaux sociaux** et **nom de domaine**.
- **Mentions légales** :
  - adresse du siège et numéro RNA/SIRET d’Art à Conter ;
  - directeur ou directrice de la publication ;
  - hébergeur ;
  - durée de conservation des données.

  Ces informations sont marquées « [à compléter] » sur `/mentions-legales`.
