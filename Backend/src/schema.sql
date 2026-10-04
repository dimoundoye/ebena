-- Schéma de la base ÉBËNA (idempotent : exécuté à chaque démarrage de l'API)

CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(254) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  nom           VARCHAR(120),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

-- Demandes de réservation de stand (packs exposants)
CREATE TABLE IF NOT EXISTS reservations (
  id               SERIAL PRIMARY KEY,
  reference        VARCHAR(20)  NOT NULL UNIQUE,
  pack             VARCHAR(20)  NOT NULL CHECK (pack IN ('silver', 'gold', 'platinum')),
  entreprise       VARCHAR(200) NOT NULL,
  secteur          VARCHAR(120),
  pavillon         VARCHAR(60),
  pays             VARCHAR(120),
  ville            VARCHAR(120),
  contact_nom      VARCHAR(160) NOT NULL,
  contact_fonction VARCHAR(120),
  email            VARCHAR(254) NOT NULL,
  telephone        VARCHAR(40)  NOT NULL,
  site_web         VARCHAR(300),
  message          TEXT,
  statut           VARCHAR(20)  NOT NULL DEFAULT 'nouveau'
                   CHECK (statut IN ('nouveau', 'en_cours', 'confirme', 'annule')),
  note_interne     TEXT,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reservations_created_at_idx ON reservations (created_at DESC);

-- Pré-inscriptions des visiteurs
CREATE TABLE IF NOT EXISTS inscriptions (
  id         SERIAL PRIMARY KEY,
  reference  VARCHAR(20)  NOT NULL UNIQUE,
  prenom     VARCHAR(100) NOT NULL,
  nom        VARCHAR(100) NOT NULL,
  email      VARCHAR(254) NOT NULL UNIQUE,
  telephone  VARCHAR(40),
  ville      VARCHAR(120),
  profil     VARCHAR(30)  NOT NULL,
  jours      TEXT[]       NOT NULL,
  interets   TEXT[]       NOT NULL DEFAULT '{}',
  newsletter BOOLEAN      NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inscriptions_created_at_idx ON inscriptions (created_at DESC);

-- Messages du formulaire de contact
CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  nom        VARCHAR(160) NOT NULL,
  email      VARCHAR(254) NOT NULL,
  telephone  VARCHAR(40),
  sujet      VARCHAR(40)  NOT NULL,
  message    TEXT         NOT NULL,
  lu         BOOLEAN      NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at DESC);

-- Abonnés à la newsletter
CREATE TABLE IF NOT EXISTS newsletter (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(254) NOT NULL UNIQUE,
  source     VARCHAR(40)  NOT NULL DEFAULT 'site',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);
