/* ===== SUBJECTS ===== */
const SUBJECTS = [
  { id: 'anatomie', name: 'Anatomie', icon: '&#x2764;', color: 'indigo', description: 'Anatomie descriptive, topographique et fonctionnelle' },
  { id: 'chimie', name: 'Chimie / Biochimie', icon: '&#x2697;', color: 'primary', description: 'Chimie générale, organique et biochimie' },
  { id: 'biocell', name: 'Biologie cellulaire', icon: '&#x2728;', color: 'violet', description: 'Structure cellulaire et génétique moléculaire' },
  { id: 'biostats', name: 'Biostatistiques', icon: '&#x1F4CA;', color: 'cyan', description: 'Probabilités, stats et épidémiologie' },
  { id: 'biophysique', name: 'Biophysique', icon: '&#x26A1;', color: 'amber', description: 'Physique appliquée au vivant et imagerie' },
  { id: 'ssh', name: 'SSH / Éthique', icon: '&#x1F4A1;', color: 'rose', description: 'Sciences humaines, éthique et droit de la santé' },
];

/* ===== QUESTION BANK ===== */
const QUESTIONS = [
  // ===== ANATOMIE =====
  { id: 1, subject: 'anatomie', question: "Quel os ne fait PAS partie du carpe ?", options: [
    { text: "Scaphoïde", correct: false }, { text: "Lunatum", correct: false },
    { text: "Talus", correct: true }, { text: "Trapèze", correct: false }
  ], explanation: "Le talus (astragale) est un os du tarse (pied), pas du carpe (poignet). Les 8 os du carpe : scaphoïde, lunatum, triquétrum, pisiforme, trapèze, trapézoïde, capitatum et hamatum." },

  { id: 2, subject: 'anatomie', question: "Combien de vertèbres cervicales possède l'être humain ?", options: [
    { text: "5", correct: false }, { text: "7", correct: true },
    { text: "12", correct: false }, { text: "9", correct: false }
  ], explanation: "La colonne cervicale comporte 7 vertèbres (C1-C7). C1 est l'atlas et C2 l'axis. La colonne thoracique en possède 12 et la lombaire 5." },

  { id: 3, subject: 'anatomie', question: "Quel muscle est le principal fléchisseur de l'avant-bras sur le bras ?", options: [
    { text: "Triceps brachial", correct: false }, { text: "Deltoïde", correct: false },
    { text: "Biceps brachial", correct: true }, { text: "Brachioradial", correct: false }
  ], explanation: "Le biceps brachial est le principal fléchisseur de l'avant-bras. Le triceps est son antagoniste (extenseur). Le brachioradial assiste la flexion mais n'est pas le fléchisseur principal." },

  { id: 4, subject: 'anatomie', question: "Quelle artère irrigue principalement le cerveau ?", options: [
    { text: "Artère fémorale", correct: false }, { text: "Artère carotide interne", correct: true },
    { text: "Artère radiale", correct: false }, { text: "Artère mésentérique", correct: false }
  ], explanation: "L'artère carotide interne (avec l'artère vertébrale) constitue la vascularisation cérébrale principale via le polygone de Willis. L'artère fémorale irrigue le membre inférieur." },

  { id: 5, subject: 'anatomie', question: "Quel organe produit la bile ?", options: [
    { text: "L'estomac", correct: false }, { text: "Le pancréas", correct: false },
    { text: "Le foie", correct: true }, { text: "La vésicule biliaire", correct: false }
  ], explanation: "Le foie produit la bile (environ 1L/jour). La vésicule biliaire ne produit pas la bile, elle la stocke et la concentre entre les repas avant de la libérer dans le duodénum." },

  // ===== CHIMIE / BIOCHIMIE =====
  { id: 6, subject: 'chimie', question: "Quel est le pH d'une solution neutre à 25°C ?", options: [
    { text: "0", correct: false }, { text: "7", correct: true },
    { text: "14", correct: false }, { text: "1", correct: false }
  ], explanation: "À 25°C, le pH neutre est 7 car [H+] = [OH-] = 10⁻⁷ mol/L. Un pH < 7 est acide, un pH > 7 est basique. Le produit ionique de l'eau Ke = 10⁻¹⁴." },

  { id: 7, subject: 'chimie', question: "Quelle liaison chimique est la plus forte ?", options: [
    { text: "Liaison hydrogène", correct: false }, { text: "Liaison covalente", correct: true },
    { text: "Force de Van der Waals", correct: false }, { text: "Liaison ionique en solution", correct: false }
  ], explanation: "La liaison covalente (partage d'électrons) est la plus forte (~150-400 kJ/mol). La liaison ionique en cristal est forte mais affaiblie en solution. Les liaisons H (~10-40 kJ/mol) et Van der Waals (~1-10 kJ/mol) sont plus faibles." },

  { id: 8, subject: 'chimie', question: "Quel acide aminé est le seul à posséder un groupement thiol (-SH) ?", options: [
    { text: "Méthionine", correct: false }, { text: "Sérine", correct: false },
    { text: "Cystéine", correct: true }, { text: "Thréonine", correct: false }
  ], explanation: "La cystéine possède un groupement thiol (-SH) qui peut former des ponts disulfure (S-S) entre deux cystéines. La méthionine contient du soufre mais sous forme thioéther, pas thiol." },

  { id: 9, subject: 'chimie', question: "Quelle enzyme catalyse la première étape de la glycolyse ?", options: [
    { text: "Phosphofructokinase", correct: false }, { text: "Hexokinase", correct: true },
    { text: "Pyruvate kinase", correct: false }, { text: "Aldolase", correct: false }
  ], explanation: "L'hexokinase catalyse la phosphorylation du glucose en glucose-6-phosphate (1ère étape). La phosphofructokinase (3ème étape) est l'étape limitante. La pyruvate kinase catalyse la dernière étape." },

  { id: 10, subject: 'chimie', question: "Combien de molécules d'ATP produit la glycolyse (bilan net) ?", options: [
    { text: "4 ATP", correct: false }, { text: "2 ATP", correct: true },
    { text: "36 ATP", correct: false }, { text: "6 ATP", correct: false }
  ], explanation: "La glycolyse produit 4 ATP bruts mais en consomme 2 (hexokinase et PFK), soit un bilan net de 2 ATP + 2 NADH + 2 pyruvates. Les 36-38 ATP correspondent à l'oxydation complète du glucose." },

  // ===== BIOLOGIE CELLULAIRE =====
  { id: 11, subject: 'biocell', question: "Quelle organite est responsable de la synthèse des protéines ?", options: [
    { text: "Mitochondrie", correct: false }, { text: "Ribosome", correct: true },
    { text: "Lysosome", correct: false }, { text: "Appareil de Golgi", correct: false }
  ], explanation: "Les ribosomes (libres ou liés au RE rugueux) traduisent l'ARNm en protéines. L'appareil de Golgi modifie et trie les protéines. Les mitochondries produisent l'ATP. Les lysosomes dégradent les déchets." },

  { id: 12, subject: 'biocell', question: "Quelle phase du cycle cellulaire correspond à la réplication de l'ADN ?", options: [
    { text: "Phase G1", correct: false }, { text: "Phase S", correct: true },
    { text: "Phase G2", correct: false }, { text: "Phase M", correct: false }
  ], explanation: "La phase S (Synthèse) est la phase de réplication de l'ADN. G1 = croissance et préparation. G2 = vérification post-réplication. M = mitose (division cellulaire). G1-S-G2 = interphase." },

  { id: 13, subject: 'biocell', question: "Quel type de transport nécessite de l'énergie (ATP) ?", options: [
    { text: "Diffusion simple", correct: false }, { text: "Osmose", correct: false },
    { text: "Transport actif", correct: true }, { text: "Diffusion facilitée", correct: false }
  ], explanation: "Le transport actif utilise l'ATP pour déplacer des molécules contre leur gradient de concentration (ex: pompe Na+/K+). La diffusion (simple ou facilitée) et l'osmose sont des transports passifs." },

  { id: 14, subject: 'biocell', question: "Combien de chromosomes possède une cellule humaine somatique ?", options: [
    { text: "23", correct: false }, { text: "46", correct: true },
    { text: "44", correct: false }, { text: "48", correct: false }
  ], explanation: "Les cellules somatiques humaines sont diploïdes (2n = 46 chromosomes = 22 paires d'autosomes + 1 paire de chromosomes sexuels). Les gamètes sont haploïdes (n = 23)." },

  { id: 15, subject: 'biocell', question: "Quelle molécule porte l'information génétique ?", options: [
    { text: "ARN messager", correct: false }, { text: "Protéine", correct: false },
    { text: "ADN", correct: true }, { text: "Lipide", correct: false }
  ], explanation: "L'ADN (acide désoxyribonucléique) est le support de l'information génétique. L'ARNm est une copie temporaire utilisée pour la traduction. Les protéines sont le produit de l'expression des gènes." },

  // ===== BIOSTATISTIQUES =====
  { id: 16, subject: 'biostats', question: "Quelle mesure de tendance centrale est la plus robuste aux valeurs extrêmes ?", options: [
    { text: "La moyenne", correct: false }, { text: "La médiane", correct: true },
    { text: "Le mode", correct: false }, { text: "L'étendue", correct: false }
  ], explanation: "La médiane est robuste car elle représente la valeur centrale d'une distribution ordonnée, insensible aux valeurs extrêmes. La moyenne est sensible aux outliers. L'étendue n'est pas une mesure de tendance centrale." },

  { id: 17, subject: 'biostats', question: "Si p-value < 0.05, on dit que le résultat est :", options: [
    { text: "Cliniquement significatif", correct: false }, { text: "Statistiquement significatif", correct: true },
    { text: "Non significatif", correct: false }, { text: "Aléatoire", correct: false }
  ], explanation: "p < 0.05 signifie qu'on rejette H0 au seuil de 5% : le résultat est statistiquement significatif. Cela ne signifie pas nécessairement cliniquement pertinent. La significativité clinique dépend de l'ampleur de l'effet." },

  { id: 18, subject: 'biostats', question: "Quelle est la probabilité d'obtenir pile en lançant une pièce équilibrée ?", options: [
    { text: "0.25", correct: false }, { text: "0.50", correct: true },
    { text: "0.75", correct: false }, { text: "1.00", correct: false }
  ], explanation: "Une pièce équilibrée a deux faces équiprobables : P(Pile) = P(Face) = 1/2 = 0.50. C'est un exemple classique de loi de Bernoulli avec p = 0.5." },

  { id: 19, subject: 'biostats', question: "Quel test statistique compare les moyennes de deux groupes indépendants ?", options: [
    { text: "Test du Chi-2", correct: false }, { text: "Test t de Student", correct: true },
    { text: "Corrélation de Pearson", correct: false }, { text: "Régression linéaire", correct: false }
  ], explanation: "Le test t de Student compare les moyennes de 2 groupes indépendants (ou appariés). Le Chi-2 compare des proportions/variables qualitatives. Pearson mesure la corrélation linéaire entre 2 variables quantitatives." },

  { id: 20, subject: 'biostats', question: "Quelle est la sensibilité d'un test ?", options: [
    { text: "Proportion de vrais négatifs parmi les non-malades", correct: false },
    { text: "Proportion de vrais positifs parmi les malades", correct: true },
    { text: "Proportion de malades parmi les positifs", correct: false },
    { text: "Proportion de non-malades parmi les négatifs", correct: false }
  ], explanation: "Sensibilité = VP/(VP+FN) = capacité à détecter les malades. Spécificité = VN/(VN+FP) = capacité à identifier les non-malades. VPP = VP/(VP+FP). VPN = VN/(VN+FN)." },

  // ===== BIOPHYSIQUE =====
  { id: 21, subject: 'biophysique', question: "Quelle est l'unité du Système International pour la radioactivité ?", options: [
    { text: "Gray (Gy)", correct: false }, { text: "Sievert (Sv)", correct: false },
    { text: "Becquerel (Bq)", correct: true }, { text: "Curie (Ci)", correct: false }
  ], explanation: "Le Becquerel (Bq) = 1 désintégration/seconde mesure l'activité radioactive. Le Gray mesure la dose absorbée. Le Sievert mesure la dose efficace (effets biologiques). Le Curie est une ancienne unité." },

  { id: 22, subject: 'biophysique', question: "Quelle technique d'imagerie utilise des ultrasons ?", options: [
    { text: "IRM", correct: false }, { text: "Scanner (TDM)", correct: false },
    { text: "Échographie", correct: true }, { text: "Scintigraphie", correct: false }
  ], explanation: "L'échographie utilise des ultrasons (ondes mécaniques). L'IRM utilise des champs magnétiques. Le scanner utilise des rayons X. La scintigraphie utilise des traceurs radioactifs (médecine nucléaire)." },

  { id: 23, subject: 'biophysique', question: "Quelle est la vitesse de la lumière dans le vide ?", options: [
    { text: "3 × 10⁶ m/s", correct: false }, { text: "3 × 10⁸ m/s", correct: true },
    { text: "3 × 10¹⁰ m/s", correct: false }, { text: "3 × 10⁵ m/s", correct: false }
  ], explanation: "c = 3 × 10⁸ m/s (≈ 300 000 km/s). C'est une constante fondamentale en physique, utilisée notamment en imagerie médicale et en spectroscopie (E = hc/λ)." },

  { id: 24, subject: 'biophysique', question: "En optique, une lentille convergente a une vergence :", options: [
    { text: "Négative", correct: false }, { text: "Positive", correct: true },
    { text: "Nulle", correct: false }, { text: "Infinie", correct: false }
  ], explanation: "V = 1/f (en dioptries). Une lentille convergente a un foyer réel donc f > 0 et V > 0. Une lentille divergente a V < 0. En ophtalmologie, l'œil myope est corrigé par une lentille divergente (V < 0)." },

  { id: 25, subject: 'biophysique', question: "Quelle est la relation entre énergie et fréquence d'un photon ?", options: [
    { text: "E = mc²", correct: false }, { text: "E = hν", correct: true },
    { text: "E = ½mv²", correct: false }, { text: "E = kT", correct: false }
  ], explanation: "E = hν (relation de Planck) avec h = 6.63 × 10⁻³⁴ J·s (constante de Planck) et ν la fréquence. Plus la fréquence est élevée, plus le photon est énergétique (rayons X > visible > infrarouge)." },

  // ===== SSH / ÉTHIQUE =====
  { id: 26, subject: 'ssh', question: "Quel principe éthique consiste à ne pas nuire au patient ?", options: [
    { text: "Bienfaisance", correct: false }, { text: "Non-malfaisance", correct: true },
    { text: "Autonomie", correct: false }, { text: "Justice", correct: false }
  ], explanation: "La non-malfaisance (primum non nocere) oblige à ne pas nuire. La bienfaisance vise à faire le bien. L'autonomie respecte les choix du patient. La justice assure l'équité d'accès aux soins. Ce sont les 4 principes de Beauchamp et Childress." },

  { id: 27, subject: 'ssh', question: "Quelle loi française de 2002 consacre les droits des patients ?", options: [
    { text: "Loi Leonetti", correct: false }, { text: "Loi Kouchner", correct: true },
    { text: "Loi Claeys-Leonetti", correct: false }, { text: "Loi Touraine", correct: false }
  ], explanation: "La loi Kouchner du 4 mars 2002 consacre le droit à l'information, le consentement éclairé et l'accès au dossier médical. La loi Leonetti (2005) et Claeys-Leonetti (2016) concernent la fin de vie." },

  { id: 28, subject: 'ssh', question: "Qu'est-ce que le consentement éclairé ?", options: [
    { text: "Le patient signe un formulaire sans explication", correct: false },
    { text: "Le médecin décide seul pour le patient", correct: false },
    { text: "Le patient accepte un soin après information complète", correct: true },
    { text: "Le consentement des proches du patient", correct: false }
  ], explanation: "Le consentement éclairé implique que le patient reçoit une information loyale, claire et appropriée sur son état, les traitements proposés, les risques et alternatives, avant de donner son accord libre." },

  { id: 29, subject: 'ssh', question: "Quel concept désigne la capacité d'un patient à décider pour lui-même ?", options: [
    { text: "Paternalisme", correct: false }, { text: "Bienfaisance", correct: false },
    { text: "Autonomie", correct: true }, { text: "Solidarité", correct: false }
  ], explanation: "L'autonomie est le droit du patient à prendre des décisions éclairées concernant sa santé. Le paternalisme médical est son opposé (le médecin décide 'pour le bien' du patient sans le consulter)." },

  { id: 30, subject: 'ssh', question: "Quel philosophe est associé à l'impératif catégorique en éthique ?", options: [
    { text: "Aristote", correct: false }, { text: "Kant", correct: true },
    { text: "Bentham", correct: false }, { text: "Hippocrate", correct: false }
  ], explanation: "Kant (déontologisme) : agir selon des principes universalisables. Bentham (utilitarisme) : maximiser le bonheur global. Aristote (éthique des vertus) : développer le caractère vertueux. Hippocrate : serment médical fondateur." },
];

/* ===== PROGRAMME DATA ===== */
const PROGRAMME_DATA = [
  {
    id: 'anatomie', name: 'Anatomie', coeff: 5, hours: 80,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>',
    color: 'indigo',
    description: "L'anatomie étudie la structure du corps humain. En PASS/LAS, vous aborderez l'anatomie des grands appareils : locomoteur, cardiovasculaire, respiratoire, digestif, urogénital et nerveux.",
    topics: ['Ostéologie et arthrologie', 'Myologie', 'Angiologie (artères, veines, lymphatiques)', 'Neuroanatomie', 'Anatomie des organes (splanchnologie)', 'Anatomie de la tête et du cou'],
  },
  {
    id: 'chimie', name: 'Chimie / Biochimie', coeff: 5, hours: 90,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>',
    color: 'primary',
    description: "La chimie et la biochimie forment un pilier fondamental. Vous étudierez la structure atomique, les réactions chimiques, la chimie organique et le métabolisme cellulaire.",
    topics: ['Atomistique et liaisons chimiques', 'Thermodynamique chimique', 'Chimie organique fonctionnelle', 'Biochimie structurale (glucides, lipides, protéines)', 'Enzymologie', 'Métabolisme (glycolyse, cycle de Krebs, β-oxydation)'],
  },
  {
    id: 'biocell', name: 'Biologie cellulaire', coeff: 4, hours: 70,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>',
    color: 'violet',
    description: "La biologie cellulaire explore la cellule, unité fondamentale du vivant. Du génome aux organites, en passant par la signalisation et la division cellulaire.",
    topics: ['Membrane plasmique et transport', 'Organites cellulaires (RE, Golgi, mitochondries)', 'Cycle cellulaire et mitose', 'Méiose et gamétogenèse', 'Signalisation cellulaire', 'Biologie moléculaire (ADN, ARN, réplication, transcription, traduction)'],
  },
  {
    id: 'biostats', name: 'Biostatistiques', coeff: 3, hours: 50,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>',
    color: 'cyan',
    description: "Les biostatistiques fournissent les outils mathématiques essentiels pour la recherche médicale : probabilités, statistiques, tests d'hypothèse et lecture critique d'articles.",
    topics: ['Statistiques descriptives (moyenne, médiane, écart-type)', 'Probabilités et lois de distribution', 'Tests statistiques (t de Student, Chi-2, ANOVA)', 'Épidémiologie (incidence, prévalence, risque relatif)', 'Lecture critique d\'articles scientifiques', 'Sensibilité, spécificité, VPP, VPN'],
  },
  {
    id: 'biophysique', name: 'Biophysique', coeff: 3, hours: 50,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>',
    color: 'amber',
    description: "La biophysique applique les principes de la physique au vivant. Elle est fondamentale pour comprendre l'imagerie médicale, l'optique et la radioactivité.",
    topics: ['Optique géométrique et physiologique', 'Ondes et ultrasons', 'Radioactivité et radioprotection', 'Imagerie médicale (radiologie, IRM, échographie, scintigraphie)', 'Biophysique des solutions (osmose, diffusion)', 'Bases de la RMN'],
  },
  {
    id: 'ssh', name: 'SSH / Éthique', coeff: 4, hours: 60,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>',
    color: 'rose',
    description: "Les Sciences Humaines et Sociales en Santé abordent les dimensions éthiques, juridiques, psychologiques et sociologiques de la médecine et du soin.",
    topics: ['Éthique médicale (principes de Beauchamp & Childress)', 'Droit de la santé (loi Kouchner, Leonetti, Claeys-Leonetti)', 'Psychologie médicale', 'Sociologie de la santé', 'Histoire de la médecine', 'Philosophie du soin et relation médecin-patient'],
  },
];

/* ===== BLOG DATA ===== */
const BLOG_ARTICLES = [
  {
    id: 1, title: "PASS ou LAS : quel parcours choisir ?",
    category: "Orientation", date: "2026-02-15",
    summary: "Comprendre les différences entre les deux voies d'accès aux études de santé pour faire le bon choix sur Parcoursup.",
    content: `<h3 class="text-xl font-bold mb-4">Les deux voies d'accès aux études de santé</h3>
<p class="mb-4">Depuis la réforme de 2020, la PACES a été remplacée par deux parcours : le PASS et le LAS. Chacun a ses avantages et ses spécificités.</p>
<h4 class="text-lg font-bold mb-2">Le PASS (Parcours d'Accès Spécifique Santé)</h4>
<p class="mb-4">Le PASS est une année dédiée aux matières de santé avec une option mineure dans une autre discipline (droit, économie, sciences...). C'est le parcours privilégié pour ceux qui sont sûrs de vouloir faire santé. Attention : vous n'avez qu'une seule chance de candidater via le PASS.</p>
<h4 class="text-lg font-bold mb-2">Le LAS (Licence avec Accès Santé)</h4>
<p class="mb-4">Le LAS est une licence classique (biologie, droit, psychologie...) avec une option santé en complément. L'avantage majeur : vous pouvez candidater deux fois (en L1 et en L2/L3) et vous conservez votre licence en cas d'échec.</p>
<h4 class="text-lg font-bold mb-2">Notre conseil</h4>
<p>Si vous êtes déterminé et prêt à une année intensive, le PASS offre un volume de formation santé plus important. Si vous hésitez ou souhaitez un filet de sécurité, le LAS est une excellente option avec deux chances de candidater.</p>`,
  },
  {
    id: 2, title: "5 erreurs à éviter en première année de santé",
    category: "Méthodologie", date: "2026-01-20",
    summary: "Les pièges les plus courants qui font échouer les étudiants en PASS/LAS et comment les éviter dès le premier jour.",
    content: `<h3 class="text-xl font-bold mb-4">Les erreurs fatales en PASS/LAS</h3>
<p class="mb-4">La première année de santé est exigeante. Voici les 5 erreurs les plus fréquentes :</p>
<ol class="list-decimal pl-5 space-y-3 mb-4">
<li><strong>Ne pas travailler dès le premier jour.</strong> Le volume de cours est énorme. Chaque semaine de retard se paie cher.</li>
<li><strong>Apprendre par cœur sans comprendre.</strong> La compréhension des mécanismes est essentielle, surtout en biochimie et biophysique.</li>
<li><strong>Négliger les QCM d'entraînement.</strong> Le concours est un examen de QCM. S'entraîner régulièrement est indispensable pour gérer le temps et les pièges.</li>
<li><strong>S'isoler complètement.</strong> Travailler en groupe ponctuellement aide à rester motivé et à combler ses lacunes.</li>
<li><strong>Ignorer les annales.</strong> Les questions de concours suivent des patterns. Les annales sont votre meilleur allié pour les dernières semaines.</li>
</ol>
<p>La régularité et la méthode sont vos meilleurs atouts. Mieux vaut 8h de travail efficace que 12h de bachotage inefficace.</p>`,
  },
  {
    id: 3, title: "Comment organiser ses révisions en PASS",
    category: "Conseils", date: "2026-03-01",
    summary: "Un planning type pour optimiser vos semaines de révision et maximiser vos chances au concours PASS/LAS.",
    content: `<h3 class="text-xl font-bold mb-4">Planning de révision optimal</h3>
<p class="mb-4">Voici une organisation hebdomadaire qui a fait ses preuves :</p>
<h4 class="text-lg font-bold mb-2">En semaine (lundi-vendredi)</h4>
<ul class="list-disc pl-5 space-y-2 mb-4">
<li><strong>Matin (8h-12h)</strong> : Cours du jour + relecture immédiate</li>
<li><strong>Après-midi (14h-18h)</strong> : Reprise approfondie des cours de la veille + fiches</li>
<li><strong>Soir (19h-21h)</strong> : QCM d'entraînement sur les matières de la semaine</li>
</ul>
<h4 class="text-lg font-bold mb-2">Week-end</h4>
<ul class="list-disc pl-5 space-y-2 mb-4">
<li><strong>Samedi</strong> : Révision globale de la semaine + QCM par matière</li>
<li><strong>Dimanche matin</strong> : Annales en conditions réelles (chronomètre)</li>
<li><strong>Dimanche après-midi</strong> : Repos ! Le cerveau a besoin de consolider.</li>
</ul>
<p class="font-semibold">Règle d'or : revoir chaque cours 3 fois (le jour même, 3 jours après, 1 semaine après). C'est la répétition espacée, la méthode la plus efficace selon les neurosciences.</p>`,
  },
  {
    id: 4, title: "Les débouchés après PASS/LAS",
    category: "Orientation", date: "2025-12-10",
    summary: "Médecine, pharmacie, maïeutique, odontologie, kinésithérapie... toutes les filières accessibles après votre première année.",
    content: `<h3 class="text-xl font-bold mb-4">Les filières MMOPK</h3>
<p class="mb-4">La réussite au concours PASS/LAS ouvre la porte à 5 filières de santé :</p>
<ul class="list-disc pl-5 space-y-3 mb-4">
<li><strong>Médecine</strong> (6 ans + internat) : médecin généraliste ou spécialiste</li>
<li><strong>Maïeutique</strong> (5 ans) : sage-femme / maïeuticien</li>
<li><strong>Odontologie</strong> (6 ans) : chirurgien-dentiste</li>
<li><strong>Pharmacie</strong> (6 ans) : pharmacien d'officine, hospitalier ou industriel</li>
<li><strong>Kinésithérapie</strong> (4-5 ans) : masseur-kinésithérapeute</li>
</ul>
<p class="mb-4">Le nombre de places varie selon les universités et les filières. Depuis la réforme, chaque université fixe ses propres capacités d'accueil.</p>
<p>Conseil : renseignez-vous sur les capacités d'accueil de votre université avant de postuler. Les taux de réussite varient significativement d'un établissement à l'autre.</p>`,
  },
  {
    id: 5, title: "Bien gérer le stress du concours",
    category: "Bien-être", date: "2026-02-01",
    summary: "Techniques concrètes pour gérer le stress et préserver votre santé mentale tout au long de cette année intense.",
    content: `<h3 class="text-xl font-bold mb-4">Préserver sa santé mentale en PASS/LAS</h3>
<p class="mb-4">Le concours est stressant, mais le stress chronique est contre-productif. Voici des techniques éprouvées :</p>
<h4 class="text-lg font-bold mb-2">Techniques quotidiennes</h4>
<ul class="list-disc pl-5 space-y-2 mb-4">
<li><strong>Respiration 4-7-8</strong> : inspirer 4s, retenir 7s, expirer 8s. Calme le système nerveux en 2 minutes.</li>
<li><strong>Activité physique</strong> : 30 min de marche ou sport par jour améliorent la mémoire et réduisent le cortisol.</li>
<li><strong>Sommeil</strong> : minimum 7h. Le sommeil est essentiel pour la consolidation mémorielle.</li>
</ul>
<h4 class="text-lg font-bold mb-2">Mindset</h4>
<ul class="list-disc pl-5 space-y-2 mb-4">
<li>Ne vous comparez pas aux autres. Concentrez-vous sur votre progression.</li>
<li>Fixez-vous des objectifs quotidiens atteignables plutôt qu'un objectif final écrasant.</li>
<li>Gardez une activité plaisir par semaine (ciné, amis, lecture).</li>
</ul>
<p class="font-semibold">N'hésitez pas à consulter le service de santé universitaire si le stress devient ingérable. Vous n'êtes pas seul(e).</p>`,
  },
  {
    id: 6, title: "Réforme PASS/LAS : ce qui change en 2026",
    category: "Actualités", date: "2026-03-05",
    summary: "Les dernières évolutions réglementaires et leurs impacts sur les étudiants en première année de santé.",
    content: `<h3 class="text-xl font-bold mb-4">Les évolutions récentes</h3>
<p class="mb-4">Depuis la mise en place de la réforme en 2020, plusieurs ajustements ont été apportés :</p>
<ul class="list-disc pl-5 space-y-3 mb-4">
<li><strong>Augmentation des capacités d'accueil</strong> : le numerus apertus remplace le numerus clausus, avec une tendance à l'augmentation des places.</li>
<li><strong>Diversification des profils</strong> : les LAS permettent d'accueillir des profils plus variés en santé.</li>
<li><strong>Évaluation continue</strong> : certaines universités intègrent désormais une part de contrôle continu dans l'évaluation.</li>
<li><strong>Oral de motivation</strong> : de plus en plus de facultés ajoutent un entretien pour évaluer la motivation et le projet professionnel.</li>
</ul>
<p>Restez informé des spécificités de votre université. Les modalités peuvent varier significativement d'un établissement à l'autre.</p>`,
  },
];
