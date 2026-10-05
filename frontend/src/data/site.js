// Contenu éditorial du site ÉBËNA, repris de la plaquette du client (coquilles corrigées).
// Les clés (packs, pavillons, profils, jours, sujets) doivent rester synchronisées avec Backend/src/constants.js.

export const EVENT = {
  name: 'ÉBËNA',
  tagline: 'Carrefour des talents, des identités et de l’avenir',
  signature: 'L’Afrique créative en mouvement',
  baseline: 'Le grand rendez-vous de la création africaine en Europe',
  edition: '1ʳᵉ édition',
  dates: '4 · 5 · 6 juin 2027',
  datesLong: 'Les 4, 5 et 6 juin 2027',
  startsAt: '2027-06-04T00:00:00+02:00',
  venue: 'Parc des Chantiers',
  city: 'Nantes',
  address: 'Parc des Chantiers, boulevard Léon-Bureau, 44200 Nantes',
  mapUrl: 'https://www.openstreetmap.org/search?query=Parc%20des%20Chantiers%20Nantes',
  themes: ['Culture', 'Innovation', 'Entrepreneuriat', 'Dialogue', 'Art de vivre'],
  organizer: 'Association Art à Conter',
};

export const CONTACTS = {
  email: 'contacts.ebena@gmail.com',
  coordination: { label: 'Coordination générale', phone: '07 82 67 15 07', tel: '+33782671507' },
  communication: [
    { phone: '+33 7 63 31 43 11', tel: '+33763314311' },
    { phone: '+33 6 95 25 91 51', tel: '+33695259151' },
    { phone: '+39 328 367 60 48', tel: '+393283676048' },
    { phone: '+33 7 66 87 61 92', tel: '+33766876192' },
  ],
};

// Réseaux sociaux : renseigner les URL quand le client les communique (affichés seulement si remplis).
export const SOCIALS = [
  { label: 'Instagram', url: '' },
  { label: 'Facebook', url: '' },
  { label: 'LinkedIn', url: '' },
  { label: 'TikTok', url: '' },
];

export const NAV = [
  { to: '/le-salon', label: 'Le salon' },
  { to: '/programme', label: 'Programme' },
  { to: '/equipe', label: 'L’équipe' },
  { to: '/exposants', label: 'Exposants' },
  { to: '/partenaires', label: 'Partenaires' },
  { to: '/contact', label: 'Contact' },
];

export const MANIFESTE = {
  title: 'Pourquoi ÉBËNA',
  quote: 'La réappropriation du sens historique d’un mot',
  paragraphs: [
    'Nantes est une ville dont l’histoire est profondément marquée par le commerce triangulaire. Le mot « bois d’ébène » y porte une mémoire particulière : dans le langage brutal des négriers, il désignait cyniquement des hommes, des femmes et des enfants réduits en esclavage. ÉBËNA naît précisément de cette histoire, mais pour en déplacer le regard.',
    'Nous reprenons ce mot, non pour effacer la violence de l’histoire, mais pour nous le réapproprier, lui redonner sa dignité et rappeler ce qu’il portait avant même les usages que la traite et la colonisation lui ont imposés. ÉBËNA est ainsi un acte de réappropriation.',
  ],
  from: ['Marchandisation', 'Déshumanisation'],
  to: ['Création', 'Excellence', 'Dignité', 'Fraternité'],
};

export const CONCEPT = {
  title: 'Le concept ÉBËNA',
  lead: 'Les 4, 5 et 6 juin 2027, le Parc des Chantiers de Nantes accueille la première édition d’ÉBËNA, un rendez-vous inédit dédié à l’excellence, à l’innovation et à la créativité africaines et afro-descendantes.',
  paragraphs: [
    'ÉBËNA est une invitation à découvrir une Afrique plurielle, ambitieuse, créative et tournée vers l’avenir.',
    'Pendant trois jours, Nantes deviendra un carrefour de rencontres, d’échanges et d’inspiration où se croiseront artistes, entrepreneurs, chercheurs, créateurs, décideurs, étudiants, investisseurs et citoyens venus célébrer les talents africains et afro-descendants.',
  ],
  publics: ['Artistes', 'Entrepreneurs', 'Chercheurs', 'Créateurs', 'Décideurs', 'Étudiants', 'Investisseurs', 'Citoyens'],
  lieu: {
    title: 'Le Parc des Chantiers, un lieu hautement symbolique',
    paragraphs: [
      'Ancien port négrier, lieu de mémoire où s’est écrite une page douloureuse de l’histoire, cet espace est aujourd’hui un lieu emblématique de création artistique, d’innovation et de dialogue entre les cultures.',
      'Accueillir ÉBËNA sur ce site, c’est transformer un héritage de souffrance en un espace d’espérance, de coopération et de fraternité. C’est construire un idéal de vivre-ensemble fondé sur la connaissance, le respect mutuel et la tolérance.',
    ],
  },
  mat: {
    title: 'Le Mât de la Fraternité et de la Mémoire',
    text: 'Au cœur d’ÉBËNA, le Mât de la Fraternité et de la Mémoire deviendra le symbole de cette rencontre entre les peuples. Il accueillera de nombreux espaces de réflexion, de découverte et de création.',
  },
};

export const CHIFFRES = [
  { value: '3', label: 'jours de rencontres', detail: '4, 5 et 6 juin 2027' },
  { value: '6', label: 'pavillons thématiques', detail: 'six univers, six portes d’entrée' },
  { value: '3', label: 'grands projets sur scène', detail: 'défilés, exposition, conférences' },
  { value: '1', label: 'pays invité d’honneur', detail: 'le Bénin' },
];

export const EXPOSITIONS = {
  title: 'Des expositions',
  intro: 'Conçu comme une traversée entre mémoire, culture, création, innovation et économie, ÉBËNA propose un parcours au cœur de l’Afrique et de ses diasporas, en mouvement et en perpétuelle connexion avec le monde.',
  ambition: 'Six pavillons thématiques, six univers, six portes d’entrée, une même ambition : faire dialoguer les talents africains avec Nantes, l’Europe et le monde.',
};

export const PAVILLONS = [
  {
    slug: 'memoire',
    numero: '01',
    icon: 'Landmark',
    title: 'Pavillon Mémoires et histoires africaines',
    short: 'Mémoires et histoires africaines',
    quote: 'De la mémoire à la création, de l’histoire à l’avenir',
    excerpt: 'Un espace de connaissance et de dialogue sur les parcours des personnes déportées, leurs résistances et leurs héritages.',
    paragraphs: [
      'Ce pavillon contribuera à faire du salon ÉBËNA un événement de référence alliant développement économique, valorisation des cultures africaines et transmission de l’histoire. En offrant un espace de connaissance et de dialogue, il participe au renforcement des liens entre les peuples, à la reconnaissance des héritages des diasporas africaines et à la promotion des valeurs de dignité, de liberté, de justice et de fraternité.',
      'À Nantes, ce pavillon trouvera une résonance particulière en s’inscrivant dans le travail de mémoire déjà mené par la ville, tout en apportant une perspective internationale centrée sur les parcours des personnes déportées, leurs résistances et les héritages qu’elles ont légués aux sociétés contemporaines.',
    ],
    note: 'Le travail de mémoire se fera entre les associations nantaises et le Musée des civilisations noires du Sénégal.',
  },
  {
    slug: 'artisanat',
    numero: '02',
    icon: 'Gem',
    title: 'Pavillon de l’artisanat, du design et de la mode',
    short: 'Artisanat, design et mode',
    quote: 'Le talent en héritage, l’excellence en signature',
    excerpt: 'Une Afrique qui transforme ses richesses en valeur, ses traditions en opportunités et son patrimoine en moteur de développement.',
    paragraphs: [
      'Au salon ÉBËNA, le pavillon de l’artisanat, du design et de la mode n’est pas seulement un label d’origine : c’est une promesse de qualité, d’innovation et de fierté. Il incarne une Afrique qui transforme ses richesses en valeur, ses traditions en opportunités et son patrimoine en moteur de développement.',
    ],
    listTitle: 'Le pavillon ambitionne de valoriser :',
    list: [
      'les métiers d’art et l’artisanat d’excellence et de luxe ;',
      'l’agrobusiness et la transformation des produits agricoles ;',
      'la décoration, le mobilier et le design inspirés des cultures africaines ;',
      'les arts de vivre, entre tradition et modernité ;',
      'les cosmétiques naturels, les parfums et les huiles essentielles ;',
      'les entreprises engagées dans une production responsable, durable et respectueuse des savoir-faire locaux.',
    ],
  },
  {
    slug: 'numerique',
    numero: '03',
    icon: 'Cpu',
    title: 'Pavillon de l’innovation numérique en Afrique',
    short: 'Innovation numérique',
    quote: 'Faire du savoir, de l’innovation et de la coopération les nouveaux ponts entre les peuples',
    excerpt: 'La vitrine d’une Afrique qui invente, qui entreprend et qui transforme le monde grâce aux technologies.',
    paragraphs: [
      'Démonstrations technologiques, rencontres, échanges… Au cœur d’ÉBËNA, le pavillon de l’innovation numérique sera la vitrine d’une Afrique qui invente, qui entreprend et qui transforme le monde grâce aux technologies.',
      'Loin des clichés, ce pavillon a pour ambition de révéler un continent en pleine révolution numérique, où la jeunesse développe des solutions innovantes dans les domaines de l’IA, de la fintech, de l’agritech, de la santé numérique, de l’éducation et des industries culturelles et créatives.',
      'Permettre aux chercheurs et aux entreprises nantaises et africaines d’échanger, de démontrer, mais aussi de développer leur réseau international sur le marché du numérique : tel est l’objectif de ce pavillon.',
    ],
    tags: ['IA', 'Fintech', 'Agritech', 'Santé numérique', 'Éducation', 'Industries créatives'],
  },
  {
    slug: 'musique',
    numero: '04',
    icon: 'Music',
    title: 'Pavillon du Marché de la musique ÉBËNA',
    short: 'Marché de la musique',
    quote: 'Découvrir des artistes, connecter des industries, faire circuler des talents',
    excerpt: 'Showcases, rencontres B2B, conférences, masterclass et sessions de pitch pour les talents et entrepreneurs de la musique.',
    paragraphs: [
      'Véritable espace d’échanges et d’innovation, le Marché de la musique ÉBËNA propose des showcases, des rencontres B2B, des conférences, des masterclass, des ateliers et des sessions de pitch destinés à accompagner les talents et les entrepreneurs de la musique.',
      'En créant des passerelles entre l’Afrique, l’Europe et les marchés internationaux, le Marché de la musique ÉBËNA ambitionne de renforcer la visibilité des artistes africains, de stimuler les investissements dans les industries culturelles et créatives, et de contribuer au rayonnement de la musique africaine sur la scène mondiale.',
    ],
    listTitle: 'Au programme :',
    list: [
      'des rendez-vous B2B avec des labels africains ;',
      'une conférence sur les échanges musicaux Afrique-Europe ;',
      'un showcase d’artistes afro, afro-fusion, afro-jazz ou afro-électro ;',
      'un programme « Découverte des talents africains » pour les producteurs et les tourneurs.',
    ],
  },
  {
    slug: 'agroalimentaire',
    numero: '05',
    icon: 'Wheat',
    title: 'Pavillon agroalimentaire',
    short: 'Agroalimentaire',
    quote: 'De la terre à l’innovation, construire ensemble l’alimentation de demain',
    excerpt: 'Celles et ceux qui produisent, transforment, innovent et entreprennent pour une alimentation durable.',
    paragraphs: [
      'L’Afrique possède une richesse agricole et agroalimentaire exceptionnelle : ses terres, ses terroirs, ses savoir-faire et la diversité de ses productions constituent un potentiel de création de valeur et d’innovation.',
      'Le pavillon agroalimentaire mettra en valeur celles et ceux qui produisent, transforment, innovent et entreprennent pour construire une alimentation durable et créatrice de valeur.',
    ],
    note: 'Pour cette première édition, ÉBËNA s’allie avec la Maison des Ivoiriens à Nantes, qui sera l’organisatrice de ce pavillon. Cela n’exclut pas l’exposition de produits venant d’autres horizons.',
  },
  {
    slug: 'business',
    numero: '06',
    icon: 'Handshake',
    title: 'Pavillon Africa Business Meeting',
    short: 'Africa Business Meeting',
    quote: 'Là où les idées deviennent des opportunités',
    excerpt: 'Rencontrer, connecter, investir, entreprendre, développer : trois jours de rendez-vous d’affaires.',
    paragraphs: [
      'Le pavillon Africa Business Meeting crée un espace privilégié de rencontre entre entrepreneurs africains et européens, entre investisseurs et institutions, start-up, experts et acteurs de la diaspora.',
      'C’est un espace où l’on ne parle pas seulement de l’Afrique : il est dédié à créer des connexions, développer des projets et construire des partenariats.',
      'Rendez-vous B2B, pitchs, rencontres d’affaires, présentations de marché, networking et échanges sectoriels y sont organisés pendant trois jours.',
    ],
    tags: ['Rencontrer', 'Connecter', 'Investir', 'Entreprendre', 'Développer'],
  },
];

export const SCENE = {
  title: 'La Scène ÉBËNA',
  subtitle: 'Défilés, talks, showcases, performances',
  intro: 'La Scène ÉBËNA est un espace dédié à la création, à l’expression et à la rencontre : défilés de mode, showcases, performances artistiques, conférences et rencontres avec des personnalités et des créateurs. Trois projets y seront présentés pendant cette première édition.',
  projets: [
    {
      slug: 'cour-royale',
      icon: 'Crown',
      kicker: 'Exposition immersive',
      title: 'La Cour Royale de Maam',
      quote: 'Une mémoire vestimentaire sénégalaise mise en scène',
      excerpt: 'Une plongée dans l’histoire et les imaginaires du Sénégal à travers le vêtement, par la créatrice Maguette Gueye.',
    },
    {
      slug: 'voyage',
      icon: 'TramFront',
      kicker: 'Défilés de mode',
      title: 'Le Voyage',
      quote: 'Un voyage au cœur de l’Afrique, au fil des lignes du tramway',
      excerpt: 'Trois collections de stylistes africains qui transforment les rames du tramway nantais en passerelles entre les cultures.',
    },
    {
      slug: 'leaders',
      icon: 'Mic',
      kicker: 'Cycle de conférences',
      title: 'La Méthode des Leaders',
      quote: 'Inspirer, entreprendre, transmettre',
      excerpt: 'Des talk-shows réunissant dirigeants, entrepreneurs, investisseurs, artistes et chercheurs d’Afrique, de la diaspora et d’Europe.',
    },
  ],
};

export const COUR_ROYALE = {
  artiste: 'Maguette Gueye',
  maison: 'La Penderie de Maam',
  paragraphs: [
    'Dans le cadre de sa première édition, ÉBËNA aura l’honneur d’accueillir la créatrice sénégalaise Maguette Gueye, fondatrice de La Penderie de Maam, maison de mémoire consacrée à la reconstitution et à la transmission de l’héritage vestimentaire du Sénégal.',
    'Son projet, La Cour Royale de Maam, est une exposition immersive qui propose une plongée dans l’histoire et les imaginaires du Sénégal à travers le vêtement.',
    'Inspirée du langage cinématographique, la scénographie donne corps à des figures historiques et sociales et invite le visiteur à découvrir le vêtement autrement : non plus comme un simple objet de mode, mais comme un langage, un marqueur de statut, un récit et une mémoire vivante.',
  ],
  // Reprise du dernier paragraphe, présentée en liste sur la diapositive d'accueil
  vetement: ['Un langage', 'Un marqueur de statut', 'Un récit', 'Une mémoire vivante'],
};

export const VOYAGE = {
  intro: [
    'Ces défilés thématiques invitent le public à un véritable voyage au cœur d’un continent riche de ses traditions, de son histoire et de la diversité de ses expressions artistiques. Chaque création raconte une histoire : celle des peuples, des ancêtres, des royaumes d’hier, mais aussi celle d’une Afrique contemporaine, créative, innovante et résolument tournée vers l’avenir.',
  ],
  collections: [
    {
      name: 'Asili',
      langue: 'swahili',
      sens: 'Les origines',
      text: 'Célèbre les racines, l’identité et les fondements des cultures africaines.',
    },
    {
      name: 'Anw ka Fôli',
      langue: 'bambara',
      sens: 'Héritage',
      text: 'Rend hommage à la transmission des savoirs, des valeurs et des traditions qui façonnent les générations.',
    },
    {
      name: 'Yéléma',
      langue: 'bambara',
      sens: 'Changement, évolution',
      text: 'Incarne une Afrique en mouvement, où patrimoine et modernité se rencontrent pour imaginer le monde de demain.',
    },
  ],
  outro: 'Le temps d’un trajet, ÉBËNA ambitionne de transformer les lignes du tramway nantais en une passerelle entre les cultures. À travers les créations de stylistes et de créateurs africains, les voyageurs sont invités à découvrir la richesse, l’élégance et la diversité des savoir-faire du continent, faisant de chaque rame un espace de rencontre, de dialogue et d’évasion.',
};

export const METHODE = {
  intro: '« La Méthode des Leaders » est un cycle de conférences et de talk-shows réunissant des dirigeants d’entreprise, entrepreneurs, investisseurs, personnalités publiques, chercheurs, artistes et acteurs du développement économique d’Afrique, de la diaspora et d’Europe.',
  vocation: 'Cet espace a pour vocation de partager des expériences concrètes, des parcours inspirants et des stratégies de réussite afin d’accompagner les entrepreneurs, les jeunes talents et les porteurs de projets dans leur développement.',
  objectifs: [
    'Renforcer les compétences entrepreneuriales',
    'Développer de nouveaux partenariats et opportunités d’affaires',
    'Mettre en réseau les acteurs économiques',
    'Valoriser les parcours inspirants de leaders africains et de la diaspora',
    'Faire émerger des projets innovants et de nouvelles coopérations entre l’Afrique, la diaspora et les territoires français',
  ],
};

export const LEADERS = [
  { slug: 'mamaissata-camara', name: 'Mamaissata Camara', role: 'Directrice préfectorale de l’artisanat et de la culture de Kindia', pays: 'Guinée' },
  { slug: 'aissatou-diop', name: 'Aissatou Diop', role: 'Directrice de l’artisanat et du tourisme, APDA', pays: 'Sénégal' },
  { slug: 'fatou-jupiter-toure', name: 'Fatou Jupiter Touré', role: 'Scénariste et réalisatrice, CEO de Jupinvite', pays: 'Sénégal' },
  { slug: 'marguerite-correa', name: 'Marguerite Correa', role: 'Fondatrice d’ANW Consulting, business consulting', pays: 'États-Unis' },
  { slug: 'claudy-siar', name: 'Claudy Siar', role: 'Chargé de mission à la culture, aux médias et à la visibilité internationale', pays: 'Bénin' },
  { slug: 'mathydy', name: 'MATHYDY', role: 'Ingénierie et maroquinerie de luxe', pays: 'Sénégal' },
];

export const BENIN = {
  title: 'Le Bénin, pays invité d’honneur',
  slogan: 'ÉBËNA 2027 : le Bénin en lumières, l’Afrique en mouvement',
  text: 'Nation reconnue pour la richesse de son patrimoine culturel, la diversité de ses traditions et son histoire remarquable, berceau du royaume du Dahomey et de la culture vaudou, le Bénin valorise ses arts, sa musique, ses danses et son artisanat tout en préservant son identité. Grâce à son engagement en faveur de la tolérance et de la promotion de son héritage, le Bénin s’affirme comme une référence culturelle en Afrique et une destination incontournable pour la découverte des civilisations africaines.',
};

export const PARRAIN = {
  name: 'Claudy Siar',
  role: 'Chargé de mission à la culture, aux médias et à la visibilité de la République du Bénin',
  title: 'Le mot du parrain',
  quote: 'Faire de la culture un espace de rencontre, de transmission et de rayonnement',
  paragraphs: [
    'Figure reconnue de la scène culturelle et médiatique africaine et afro-descendante, Claudy Siar accompagne et porte les expressions culturelles africaines et celles de ses diasporas, avec une attention particulière à leur rayonnement international.',
    'Sa présence au salon ÉBËNA incarne une volonté de créer des passerelles entre création africaine, valorisation et rayonnement international. À travers sa participation, ÉBËNA souhaite mettre en lumière le Bénin, pays invité d’honneur en terre française.',
  ],
};

export const CHEF_DE_PROJET = {
  slug: 'boubacar-obeye-thioye',
  name: 'Boubacar Obeye Thioye',
  role: 'Chef de projet événementiel',
  paragraphs: [
    'Diplômé d’un master 2 en histoire et valorisation du patrimoine à la Sorbonne et d’un master en expertise des institutions culturelles à l’université de Nantes.',
    '« Ma vision de la culture africaine à l’international doit aujourd’hui s’articuler autour de l’économie, des connexions et de l’ouverture. Ce projet représente l’aboutissement d’un parcours riche d’expériences dans le management de projets culturels et artistiques, ainsi que dans la promotion et la valorisation de la création africaine. »',
    'Le salon ÉBËNA a pour ambition de devenir un espace de référence où les talents d’aujourd’hui et de demain pourront s’exprimer, se révéler et être mis en lumière dans un cadre fondé sur le respect, l’excellence et la dignité.',
  ],
};

export const EQUIPE_SALON = [
  { slug: 'christelle-ndaya-mbaya', name: 'Christelle Ndaya Mbaya', role: 'Journaliste internationale, présentatrice' },
  { slug: 'awa-martin', name: 'Awa Martin', role: 'Responsable gastronomie' },
  { slug: 'psippora-isaac', name: 'Psippora Isaac', role: 'Cheffe de projet événementiel' },
  { slug: 'rokhaya-ndiaye-gueye', name: 'Rokhaya Ndiaye Gueye', role: 'Journaliste' },
  { slug: 'aicha-waggeh', name: 'Aïcha Waggeh', role: 'Experte en communication des organisations internationales' },
  { slug: 'aissata-sow-mercereau', name: 'Aissata Sow Mercereau', role: 'Experte en communication événementielle' },
  { slug: 'mareme-nger', name: 'Mareme Nger', role: 'Responsable de l’expérience touristique' },
  { slug: 'aida-gueye', name: 'Aida Gueye', role: 'Scénographie et décoration' },
];

export const EQUIPE_PROJET = [
  { slug: 'babacar-sow', name: 'Babacar Sow', role: 'Responsable de l’expérience touristique' },
  { slug: 'alassane-ka', name: 'Alassane Ka', role: 'Responsable logistique et sécurité' },
  { slug: 'dieudonne-boutrin', name: 'Dieudonné Boutrin', role: 'Association La Coque Nomade Fraternité' },
  { slug: 'mamadou-khouma-gueye', name: 'Mamadou Khouma Gueye', role: 'Scénographie' },
  { slug: 'cheikh-seck', name: 'Cheikh Seck', role: 'Consultant développement cloud' },
];

export const PACKS = [
  {
    id: 'silver',
    name: 'Silver',
    prix: 600,
    surface: '9 m²',
    accroche: 'Exposez votre savoir-faire. Développez votre réseau.',
    features: [
      { icon: 'Store', title: 'Stand d’exposition', detail: 'de 9 m²' },
      { icon: 'FileText', title: 'Flyers de présentation', detail: 'de votre entreprise' },
      { icon: 'Users', title: 'Accès aux espaces', detail: 'de networking' },
      { icon: 'Megaphone', title: 'Logo dans les supports', detail: 'de communication d’ÉBËNA' },
      { icon: 'IdCard', title: 'Badges exposants', detail: 'pour les membres de votre équipe' },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    prix: 1000,
    surface: '12 m²',
    featured: true,
    accroche: 'Donnez de la visibilité à votre entreprise. Valorisez votre savoir-faire.',
    features: [
      { icon: 'Store', title: 'Stand d’exposition', detail: 'de 12 m²' },
      { icon: 'FileText', title: 'Flyers de présentation', detail: 'de votre entreprise' },
      { icon: 'Video', title: 'Présentation vidéo', detail: 'de votre entreprise sur les réseaux sociaux d’ÉBËNA' },
      { icon: 'Sparkles', title: 'Accompagnement personnalisé', detail: 'avant et pendant l’événement' },
      { icon: 'Users', title: 'Accès aux espaces', detail: 'de networking' },
      { icon: 'Megaphone', title: 'Logo de votre entreprise', detail: 'sur les supports de communication d’ÉBËNA' },
      { icon: 'IdCard', title: 'Badges exposants', detail: 'pour votre équipe' },
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    prix: 1500,
    surface: '18 m²',
    accroche: 'Plus qu’un stand, une opportunité unique de faire rayonner votre entreprise.',
    features: [
      { icon: 'Store', title: 'Stand d’exposition', detail: 'de 18 m²' },
      { icon: 'FileText', title: 'Flyers de présentation', detail: 'de votre entreprise' },
      { icon: 'Video', title: 'Présentation vidéo', detail: 'de votre entreprise sur les réseaux sociaux d’ÉBËNA' },
      { icon: 'UserRound', title: 'Assistante événementielle', detail: 'à votre disposition' },
      { icon: 'Mic', title: 'Prise de parole', detail: 'lors des temps forts de l’événement' },
      { icon: 'Armchair', title: 'Salle de rendez-vous dédiée', detail: 'pour vos échanges et rencontres professionnelles' },
      { icon: 'Users', title: 'Accès aux espaces de networking', detail: 'avec les acteurs clés du secteur' },
      { icon: 'Megaphone', title: 'Logo de votre entreprise', detail: 'sur les supports de communication d’ÉBËNA' },
      { icon: 'IdCard', title: 'Badges exposants', detail: 'pour votre équipe' },
    ],
  },
];

export const PARTENAIRES = {
  institutions: [
    { slug: 'nantes-metropole', name: 'Nantes Métropole' },
    { slug: 'ville-de-nantes', name: 'Ville de Nantes' },
    { slug: 'ministere-benin', name: 'Ministère du Tourisme, de la Culture et des Arts — République du Bénin' },
    { slug: 'mcat-guinee', name: 'Ministère de la Culture, de l’Artisanat et du Tourisme (MCAT)' },
    { slug: 'mcta-guinee', name: 'Ministère de la Culture, du Tourisme et de l’Artisanat (MCTA)' },
  ],
  partenaires: [
    { slug: 'benin-influence', name: 'Bénin Influence' },
    { slug: 'la-coque-nomade', name: 'La Coque Nomade Fraternité' },
    { slug: 'urbain-moodmag', name: 'Urbain Moodmag' },
    { slug: 'maison-de-l-afrique', name: 'La Maison de l’Afrique à Nantes' },
    { slug: 'festival-3-continents', name: 'Festival des 3 Continents' },
    { slug: 'simandou-2040', name: 'Programme Simandou 2040' },
  ],
  associees: [
    'Association La Coque Nomade Fraternité',
    'Yiidi Events',
    'Urbain Mood Nantes',
    'La Maison de l’Afrique à Nantes',
    'La Maison des Ivoiriens à Nantes',
  ],
};

// --- Référentiels des formulaires (identiques au Backend) -------------------------
export const JOURS = [
  { value: '2027-06-04', label: 'Vendredi 4 juin' },
  { value: '2027-06-05', label: 'Samedi 5 juin' },
  { value: '2027-06-06', label: 'Dimanche 6 juin' },
];

export const PROFILS = [
  { value: 'visiteur', label: 'Grand public' },
  { value: 'professionnel', label: 'Professionnel / entreprise' },
  { value: 'entrepreneur', label: 'Entrepreneur / porteur de projet' },
  { value: 'investisseur', label: 'Investisseur' },
  { value: 'artiste', label: 'Artiste / créateur' },
  { value: 'etudiant', label: 'Étudiant / chercheur' },
  { value: 'presse', label: 'Presse / média' },
  { value: 'institution', label: 'Institution / collectivité' },
];

export const INTERETS = [
  ...PAVILLONS.map((p) => ({ value: p.slug, label: p.short })),
  { value: 'scene', label: 'La Scène ÉBËNA' },
];

export const SUJETS = [
  { value: 'information', label: 'Information générale' },
  { value: 'exposer', label: 'Exposer au salon' },
  { value: 'partenariat', label: 'Partenariat / sponsoring' },
  { value: 'presse', label: 'Presse / médias' },
  { value: 'benevolat', label: 'Bénévolat' },
  { value: 'autre', label: 'Autre' },
];

export const formatPrix = (prix) => `${prix.toLocaleString('fr-FR')} €`;
