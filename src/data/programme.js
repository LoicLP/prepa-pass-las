export const PROGRAMME_DATA = [
  {
    id: 'anatomie', name: 'Anatomie', coeff: 5, hours: 80,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>',
    color: 'indigo',
    description: "L'anatomie \u00e9tudie la structure du corps humain. En PASS/LAS, vous aborderez l'anatomie des grands appareils : locomoteur, cardiovasculaire, respiratoire, digestif, urog\u00e9nital et nerveux.",
    topics: ['Ost\u00e9ologie et arthrologie', 'Myologie', 'Angiologie (art\u00e8res, veines, lymphatiques)', 'Neuroanatomie', 'Anatomie des organes (splanchnologie)', 'Anatomie de la t\u00eate et du cou'],
  },
  {
    id: 'chimie', name: 'Chimie / Biochimie', coeff: 5, hours: 90,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>',
    color: 'emerald',
    description: "La chimie et la biochimie forment un pilier fondamental. Vous \u00e9tudierez la structure atomique, les r\u00e9actions chimiques, la chimie organique et le m\u00e9tabolisme cellulaire.",
    topics: ['Atomistique et liaisons chimiques', 'Thermodynamique chimique', 'Chimie organique fonctionnelle', 'Biochimie structurale (glucides, lipides, prot\u00e9ines)', 'Enzymologie', 'M\u00e9tabolisme (glycolyse, cycle de Krebs, \u03b2-oxydation)'],
  },
  {
    id: 'biocell', name: 'Biologie cellulaire', coeff: 4, hours: 70,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" /></svg>',
    color: 'violet',
    description: "La biologie cellulaire explore la cellule, unit\u00e9 fondamentale du vivant. Du g\u00e9nome aux organites, en passant par la signalisation et la division cellulaire.",
    topics: ['Membrane plasmique et transport', 'Organites cellulaires (RE, Golgi, mitochondries)', 'Cycle cellulaire et mitose', 'M\u00e9iose et gam\u00e9togen\u00e8se', 'Signalisation cellulaire', 'Biologie mol\u00e9culaire (ADN, ARN, r\u00e9plication, transcription, traduction)'],
  },
  {
    id: 'biostats', name: 'Biostatistiques', coeff: 3, hours: 50,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" /></svg>',
    color: 'cyan',
    description: "Les biostatistiques fournissent les outils math\u00e9matiques essentiels pour la recherche m\u00e9dicale : probabilit\u00e9s, statistiques, tests d\u2019hypoth\u00e8se et lecture critique d\u2019articles.",
    topics: ['Statistiques descriptives (moyenne, m\u00e9diane, \u00e9cart-type)', 'Probabilit\u00e9s et lois de distribution', 'Tests statistiques (t de Student, Chi-2, ANOVA)', '\u00c9pid\u00e9miologie (incidence, pr\u00e9valence, risque relatif)', 'Lecture critique d\'articles scientifiques', 'Sensibilit\u00e9, sp\u00e9cificit\u00e9, VPP, VPN'],
  },
  {
    id: 'biophysique', name: 'Biophysique', coeff: 3, hours: 50,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>',
    color: 'amber',
    description: "La biophysique applique les principes de la physique au vivant. Elle est fondamentale pour comprendre l\u2019imagerie m\u00e9dicale, l\u2019optique et la radioactivit\u00e9.",
    topics: ['Optique g\u00e9om\u00e9trique et physiologique', 'Ondes et ultrasons', 'Radioactivit\u00e9 et radioprotection', 'Imagerie m\u00e9dicale (radiologie, IRM, \u00e9chographie, scintigraphie)', 'Biophysique des solutions (osmose, diffusion)', 'Bases de la RMN'],
  },
  {
    id: 'ssh', name: 'SSH / \u00c9thique', coeff: 4, hours: 60,
    icon: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>',
    color: 'rose',
    description: "Les Sciences Humaines et Sociales en Sant\u00e9 abordent les dimensions \u00e9thiques, juridiques, psychologiques et sociologiques de la m\u00e9decine et du soin.",
    topics: ['\u00c9thique m\u00e9dicale (principes de Beauchamp & Childress)', 'Droit de la sant\u00e9 (loi Kouchner, Leonetti, Claeys-Leonetti)', 'Psychologie m\u00e9dicale', 'Sociologie de la sant\u00e9', 'Histoire de la m\u00e9decine', 'Philosophie du soin et relation m\u00e9decin-patient'],
  },
];
