export const QUESTIONS = [
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

