/* ===== COURS DÉTAILLÉS — BIOPHYSIQUE ===== */
export const COURS_BIOPHYSIQUE = {

/* ───────────────────────────────────────────── */
/*  1. OPTIQUE                                   */
/* ───────────────────────────────────────────── */
"biophysique-optique": {
  introduction: "L'optique étudie la lumière et ses interactions avec la matière. En médecine, elle est essentielle pour comprendre la vision, les instruments d'observation et les techniques d'imagerie optique utilisées en clinique.",
  readTime: 18,
  sections: [
    {
      title: "Nature de la lumière et spectre électromagnétique",
      content: `<p class="mb-3">La lumière est une <strong>onde électromagnétique</strong> caractérisée par sa longueur d'onde λ, sa fréquence ν et sa vitesse de propagation c. La relation fondamentale est c = λν, avec c = 3×10⁸ m/s dans le vide.</p>
<p class="mb-3">Le spectre visible s'étend de 380 nm (violet) à 780 nm (rouge). Au-delà se trouvent les ultraviolets (UV : 10-380 nm) et les infrarouges (IR : 780 nm - 1 mm). Les rayons X (0,01-10 nm) et les rayons γ (< 0,01 nm) sont des rayonnements de très haute énergie utilisés en imagerie et en thérapie.</p>
<p class="mb-3">La dualité onde-corpuscule, établie par de Broglie et confirmée par Einstein (effet photoélectrique), montre que la lumière se comporte à la fois comme une onde et comme un flux de particules appelées <strong>photons</strong>. L'énergie d'un photon est E = hν = hc/λ, où h = 6,626×10⁻³⁴ J·s est la constante de Planck.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : E = hν = hc/λ. Plus la longueur d'onde est courte, plus l'énergie du photon est élevée. C'est pourquoi les UV, rayons X et γ sont ionisants alors que la lumière visible et les IR ne le sont pas.</p></div>`
    },
    {
      title: "Réflexion, réfraction et lois de Snell-Descartes",
      content: `<p class="mb-3">Lorsqu'un rayon lumineux rencontre une interface entre deux milieux d'indices de réfraction différents, il subit une <strong>réflexion</strong> (le rayon repart dans le même milieu) et une <strong>réfraction</strong> (le rayon pénètre dans le second milieu en changeant de direction).</p>
<p class="mb-3">Les lois de Snell-Descartes gouvernent ces phénomènes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Réflexion</strong> : l'angle de réflexion est égal à l'angle d'incidence (i₁ = i₁'). Le rayon réfléchi est dans le plan d'incidence.</li>
<li><strong>Réfraction</strong> : n₁ sin(i₁) = n₂ sin(i₂). Le rayon réfracté est dans le plan d'incidence.</li>
</ul>
<p class="mb-3">L'<strong>indice de réfraction</strong> n d'un milieu est le rapport n = c/v, où v est la vitesse de la lumière dans le milieu. Pour l'eau n ≈ 1,33, pour le verre n ≈ 1,5, pour l'humeur aqueuse n ≈ 1,336 et pour le cristallin n ≈ 1,42.</p>
<p class="mb-3">Lorsque n₁ > n₂, il existe un <strong>angle limite de réfraction</strong> au-delà duquel la lumière est totalement réfléchie (réflexion totale interne). Ce phénomène est utilisé dans les fibres optiques et les endoscopes médicaux.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : n₁ sin(i₁) = n₂ sin(i₂) est la loi fondamentale de la réfraction. La réflexion totale se produit quand i₁ > arcsin(n₂/n₁) et que n₁ > n₂.</p></div>`
    },
    {
      title: "Lentilles minces et formation des images",
      content: `<p class="mb-3">Les <strong>lentilles minces</strong> sont des systèmes optiques qui dévient les rayons lumineux pour former des images. On distingue les lentilles convergentes (bords minces, f' > 0) et divergentes (bords épais, f' < 0).</p>
<p class="mb-3">La <strong>relation de conjugaison</strong> d'une lentille mince est : 1/OA' - 1/OA = 1/f', où OA est la distance algébrique objet-lentille, OA' la distance lentille-image et f' la distance focale.</p>
<p class="mb-3">Le <strong>grandissement</strong> γ = OA'/OA = A'B'/AB donne le rapport de taille et l'orientation de l'image par rapport à l'objet. Si |γ| > 1 l'image est agrandie, si |γ| < 1 elle est réduite. Si γ < 0 l'image est renversée.</p>
<p class="mb-3">La <strong>vergence</strong> V = 1/f' s'exprime en dioptries (δ). Le cristallin humain a une vergence variable (accommodation) d'environ 60 δ au repos à 70 δ en accommodation maximale. La cornée contribue environ 42 δ au système optique de l'œil.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La vergence V = 1/f' en dioptries. L'œil est un système optique d'environ 60 δ au repos. La myopie (œil trop convergent) se corrige par une lentille divergente et l'hypermétropie par une lentille convergente.</p></div>`
    },
    {
      title: "L'œil et les défauts visuels",
      content: `<p class="mb-3">L'œil est un système optique composé de la <strong>cornée</strong> (principal élément réfractif, ~42 δ), de l'<strong>humeur aqueuse</strong>, du <strong>cristallin</strong> (lentille biconvexe déformable, ~20 δ au repos), du <strong>corps vitré</strong> et de la <strong>rétine</strong> (plan image où se forment les images).</p>
<p class="mb-3">L'<strong>accommodation</strong> est la capacité du cristallin à modifier sa courbure (et donc sa vergence) pour focaliser des objets situés à différentes distances. Le <strong>punctum remotum</strong> (PR) est le point le plus éloigné visible nettement sans accommodation (à l'infini pour l'œil normal). Le <strong>punctum proximum</strong> (PP) est le point le plus proche visible nettement avec accommodation maximale (~25 cm à 20 ans).</p>
<p class="mb-3">Les amétropies (défauts visuels) sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Myopie</strong> : l'image se forme en avant de la rétine. L'œil est trop convergent ou trop long. Correction par lentille divergente (V < 0).</li>
<li><strong>Hypermétropie</strong> : l'image se forme en arrière de la rétine. L'œil est trop peu convergent ou trop court. Correction par lentille convergente (V > 0).</li>
<li><strong>Astigmatisme</strong> : la cornée n'est pas sphérique mais torique, créant deux focales différentes. Correction par lentille cylindrique.</li>
<li><strong>Presbytie</strong> : perte d'accommodation liée au vieillissement du cristallin (dès ~45 ans). Correction par verres progressifs.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La cornée fournit ~2/3 de la puissance réfractive de l'œil. La myopie se corrige par lentille divergente (V < 0), l'hypermétropie par lentille convergente (V > 0). La presbytie est une perte d'accommodation, pas une amétropie au sens strict.</p></div>`
    },
    {
      title: "Instruments d'optique médicale",
      content: `<p class="mb-3">Les instruments d'optique sont largement utilisés en médecine. Le <strong>microscope optique</strong> utilise deux lentilles convergentes (objectif et oculaire) pour grossir des structures jusqu'à ~1500×. Sa résolution est limitée par la diffraction à environ 0,2 μm (critère de Rayleigh).</p>
<p class="mb-3">L'<strong>endoscope</strong> utilise des fibres optiques (réflexion totale interne) pour visualiser l'intérieur du corps. L'<strong>ophtalmoscope</strong> permet d'examiner le fond d'œil (rétine, papille, vaisseaux). Le <strong>biomicroscope</strong> (lampe à fente) examine les structures antérieures de l'œil.</p>
<p class="mb-3">Le <strong>pouvoir de résolution</strong> d'un instrument est sa capacité à séparer deux points proches. Pour un microscope, le critère de Rayleigh donne : d_min = 0,61λ/(n sin α), où n sin α est l'ouverture numérique de l'objectif. L'utilisation d'huile à immersion (n ≈ 1,5) améliore la résolution.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La résolution du microscope optique est limitée à ~0,2 μm par la diffraction. Le grossissement seul ne suffit pas : au-delà de la résolution maximale, on n'obtient que du « grossissement vide » sans détails supplémentaires.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  2. ONDES                                     */
/* ───────────────────────────────────────────── */
"biophysique-ondes": {
  introduction: "Les ondes sont des perturbations qui se propagent dans un milieu sans transport de matière. Ondes sonores, ultrasonores et électromagnétiques jouent un rôle central en diagnostic et en thérapie médicale.",
  readTime: 18,
  sections: [
    {
      title: "Caractéristiques générales des ondes",
      content: `<p class="mb-3">Une <strong>onde</strong> est la propagation d'une perturbation dans un milieu. On distingue les <strong>ondes mécaniques</strong> (son, ultrasons) qui nécessitent un milieu matériel et les <strong>ondes électromagnétiques</strong> (lumière, rayons X) qui se propagent aussi dans le vide.</p>
<p class="mb-3">Les ondes sont caractérisées par :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Longueur d'onde λ</strong> : distance entre deux points en phase successifs.</li>
<li><strong>Fréquence ν</strong> : nombre d'oscillations par seconde (en Hz).</li>
<li><strong>Période T = 1/ν</strong> : durée d'une oscillation complète.</li>
<li><strong>Vitesse de propagation v = λν</strong> : dépend du milieu.</li>
<li><strong>Amplitude A</strong> : déplacement maximal par rapport à l'équilibre.</li>
</ul>
<p class="mb-3">Les ondes <strong>transversales</strong> vibrent perpendiculairement à la direction de propagation (lumière, ondes sur une corde). Les ondes <strong>longitudinales</strong> vibrent parallèlement à la direction de propagation (son dans l'air, ultrasons dans les tissus).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : v = λν est la relation fondamentale. Le son est une onde mécanique longitudinale (~340 m/s dans l'air, ~1540 m/s dans les tissus mous). La lumière est une onde EM transversale (~3×10⁸ m/s dans le vide).</p></div>`
    },
    {
      title: "Ondes sonores et acoustique",
      content: `<p class="mb-3">Les <strong>ondes sonores</strong> sont des variations de pression qui se propagent dans un milieu. L'oreille humaine perçoit les fréquences entre 20 Hz et 20 kHz. Les infrasons (< 20 Hz) et les ultrasons (> 20 kHz) sont inaudibles.</p>
<p class="mb-3">L'<strong>intensité sonore</strong> I (W/m²) est la puissance transportée par l'onde par unité de surface. Le <strong>niveau sonore</strong> L en décibels est : L = 10 log(I/I₀), avec I₀ = 10⁻¹² W/m² (seuil d'audition). Le seuil de douleur est à ~120 dB (1 W/m²).</p>
<p class="mb-3">L'<strong>impédance acoustique</strong> Z = ρv (kg·m⁻²·s⁻¹ ou Rayl) caractérise la résistance du milieu à la propagation de l'onde. Lorsqu'une onde rencontre une interface entre deux milieux d'impédances Z₁ et Z₂, le coefficient de réflexion en intensité est R = [(Z₂-Z₁)/(Z₂+Z₁)]². Plus la différence d'impédance est grande, plus la réflexion est forte.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L = 10 log(I/I₀) en dB. L'impédance acoustique Z = ρv détermine la réflexion aux interfaces. C'est le principe fondamental de l'échographie : les échos sont produits aux interfaces d'impédance différente.</p></div>`
    },
    {
      title: "Effet Doppler",
      content: `<p class="mb-3">L'<strong>effet Doppler</strong> est le décalage de fréquence d'une onde lorsque la source et/ou le récepteur sont en mouvement relatif. Si la source se rapproche, la fréquence perçue augmente ; si elle s'éloigne, la fréquence diminue.</p>
<p class="mb-3">Pour une source se déplaçant à la vitesse v_s vers un récepteur fixe : f' = f × v/(v - v_s). En échographie Doppler, le décalage de fréquence Δf = 2f₀v cos(θ)/c, où v est la vitesse des globules rouges, θ l'angle entre le faisceau et le flux sanguin, et c la vitesse du son dans les tissus.</p>
<p class="mb-3">Le <strong>Doppler continu</strong> mesure la vitesse du flux sanguin en continu (bonne résolution en vitesse, pas de localisation en profondeur). Le <strong>Doppler pulsé</strong> envoie des trains d'impulsions et permet de mesurer la vitesse à une profondeur précise. Le <strong>Doppler couleur</strong> code en couleur la direction et la vitesse du flux (rouge = vers la sonde, bleu = s'éloigne).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Δf = 2f₀v cos(θ)/c. L'angle θ doit être < 60° pour une mesure fiable. À θ = 90°, cos(θ) = 0 et aucun signal Doppler n'est détecté.</p></div>`
    },
    {
      title: "Phénomènes ondulatoires : diffraction, interférences, atténuation",
      content: `<p class="mb-3">La <strong>diffraction</strong> se produit lorsqu'une onde rencontre un obstacle ou une ouverture de taille comparable à sa longueur d'onde. L'onde se courbe et se propage derrière l'obstacle. Ce phénomène limite la résolution des systèmes d'imagerie.</p>
<p class="mb-3">Les <strong>interférences</strong> résultent de la superposition de deux ondes cohérentes. Si les ondes sont en phase (différence de marche = nλ), elles s'ajoutent (interférences constructives). Si elles sont en opposition de phase (différence de marche = (n+1/2)λ), elles s'annulent (interférences destructives).</p>
<p class="mb-3">L'<strong>atténuation</strong> d'une onde en traversant un milieu suit une loi exponentielle : I(x) = I₀ e⁻ᵘˣ, où μ est le coefficient d'atténuation linéique. Pour les ultrasons dans les tissus mous, l'atténuation augmente avec la fréquence (~0,5 dB/cm/MHz). C'est pourquoi les sondes basse fréquence (2-5 MHz) sont utilisées pour explorer en profondeur et les hautes fréquences (7-15 MHz) pour les structures superficielles.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : I(x) = I₀ e⁻ᵘˣ. Plus la fréquence ultrasonore est élevée, meilleure est la résolution mais moindre est la pénétration. C'est le compromis résolution/profondeur en échographie.</p></div>`
    },
    {
      title: "Ultrasons en médecine : échographie et applications thérapeutiques",
      content: `<p class="mb-3">Les <strong>ultrasons médicaux</strong> sont des ondes mécaniques de fréquence supérieure à 20 kHz. En échographie diagnostique, les fréquences utilisées vont de 2 à 15 MHz. La sonde piézoélectrique émet de brèves impulsions ultrasonores et recueille les échos produits aux interfaces tissulaires.</p>
<p class="mb-3">Le <strong>principe de l'échographie</strong> repose sur la mesure du temps d'aller-retour de l'écho : d = v × t/2, avec v ≈ 1540 m/s dans les tissus mous. La résolution axiale est déterminée par la durée de l'impulsion (λ/2 en théorie), tandis que la résolution latérale dépend de la largeur du faisceau (focalisation).</p>
<p class="mb-3">Les ultrasons ont aussi des applications <strong>thérapeutiques</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>HIFU</strong> (High Intensity Focused Ultrasound) : focalisation d'ultrasons de haute intensité pour détruire des tumeurs par effet thermique (T > 60°C). Utilisé pour les fibromes utérins, le cancer de la prostate.</li>
<li><strong>Lithotripsie extracorporelle</strong> : ondes de choc focalisées pour fragmenter les calculs rénaux ou biliaires.</li>
<li><strong>Physiothérapie</strong> : ultrasons de faible intensité pour l'effet anti-inflammatoire et la cicatrisation tissulaire.</li>
<li><strong>Thrombolyse assistée</strong> : les ultrasons accélèrent l'action des agents thrombolytiques en augmentant la pénétration du médicament dans le thrombus.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : En échographie, d = v × t/2 permet de calculer la profondeur des structures. Les HIFU utilisent l'effet thermique focalisé pour la destruction tissulaire non invasive. La résolution axiale ≈ λ/2 impose un compromis fréquence/profondeur.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  3. RADIOACTIVITÉ                             */
/* ───────────────────────────────────────────── */
"biophysique-radioactivite": {
  introduction: "La radioactivité est la transformation spontanée de noyaux atomiques instables avec émission de rayonnements. Elle est à la base de la médecine nucléaire diagnostique et thérapeutique.",
  readTime: 20,
  sections: [
    {
      title: "Stabilité nucléaire et types de désintégration",
      content: `<p class="mb-3">Un noyau est caractérisé par son numéro atomique Z (protons) et son nombre de masse A (protons + neutrons). La <strong>stabilité nucléaire</strong> dépend du rapport N/Z. Pour les noyaux légers stables, N ≈ Z ; pour les noyaux lourds, N > Z (vallée de stabilité).</p>
<p class="mb-3">L'<strong>énergie de liaison</strong> B = [Z·m_p + N·m_n - m_noyau]c² représente l'énergie nécessaire pour dissocier le noyau. L'énergie de liaison par nucléon B/A est maximale pour le fer-56 (~8,8 MeV/nucléon), ce qui en fait le noyau le plus stable.</p>
<p class="mb-3">Les noyaux instables se désintègrent spontanément selon plusieurs modes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Désintégration α</strong> : émission d'un noyau d'hélium ⁴₂He. A diminue de 4, Z de 2. Concerne les noyaux lourds (Z > 82).</li>
<li><strong>Désintégration β⁻</strong> : un neutron se transforme en proton avec émission d'un électron et d'un antineutrino. Z augmente de 1, A est constant.</li>
<li><strong>Désintégration β⁺</strong> : un proton se transforme en neutron avec émission d'un positon et d'un neutrino. Z diminue de 1, A est constant.</li>
<li><strong>Capture électronique</strong> : le noyau capture un électron de la couche K, un proton se transforme en neutron.</li>
<li><strong>Émission γ</strong> : le noyau fils passe d'un état excité à un état fondamental en émettant un photon γ (pas de changement de A ni Z).</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : β⁻ pour les noyaux avec excès de neutrons (N/Z trop grand), β⁺ pour ceux avec excès de protons (N/Z trop petit). Le ⁹⁹ᵐTc (émetteur γ pur) et le ¹⁸F (émetteur β⁺) sont les deux radio-isotopes les plus utilisés en imagerie.</p></div>`
    },
    {
      title: "Loi de décroissance radioactive et période",
      content: `<p class="mb-3">La <strong>loi de décroissance radioactive</strong> est : N(t) = N₀ e⁻λt, où N₀ est le nombre initial de noyaux radioactifs, λ la constante de désintégration et t le temps. Cette loi est strictement exponentielle et traduit le caractère aléatoire de la désintégration.</p>
<p class="mb-3">La <strong>période radioactive</strong> (demi-vie) T₁/₂ est le temps au bout duquel la moitié des noyaux se sont désintégrés : T₁/₂ = ln(2)/λ ≈ 0,693/λ. Après n périodes, il reste N₀/2ⁿ noyaux.</p>
<p class="mb-3">L'<strong>activité</strong> A = λN = A₀ e⁻λt s'exprime en becquerels (Bq = 1 désintégration/s) ou en curies (1 Ci = 3,7×10¹⁰ Bq). L'activité massique est a = A/m.</p>
<p class="mb-3">Exemples de périodes : ⁹⁹ᵐTc (6,01 h), ¹⁸F (109,8 min), ¹³¹I (8,02 j), ¹²⁵I (59,4 j), ⁶⁰Co (5,27 ans), ²²⁶Ra (1600 ans), ²³⁸U (4,47×10⁹ ans).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : N(t) = N₀ e⁻λt et A(t) = A₀ e⁻λt avec T₁/₂ = ln2/λ. Savoir calculer l'activité restante après un nombre entier ou fractionnaire de périodes est un classique du concours.</p></div>`
    },
    {
      title: "Filiation radioactive et équilibre",
      content: `<p class="mb-3">Lorsqu'un noyau père se désintègre en un noyau fils lui-même radioactif, on parle de <strong>filiation radioactive</strong>. L'activité du fils A₂ évolue selon : A₂(t) = [λ₂/(λ₂-λ₁)] × A₁₀ × (e⁻λ₁t - e⁻λ₂t).</p>
<p class="mb-3">Si T₁ >> T₂ (le père vit beaucoup plus longtemps que le fils), on atteint l'<strong>équilibre séculaire</strong> : A₁ ≈ A₂. L'activité du fils devient égale à celle du père et décroît avec la même période. Exemple : ²²⁶Ra (T = 1600 ans) → ²²²Rn (T = 3,8 j).</p>
<p class="mb-3">Si T₁ > T₂ mais du même ordre de grandeur, on obtient un <strong>équilibre transitoire</strong> : A₂ > A₁. Exemple : ⁹⁹Mo (T = 66 h) → ⁹⁹ᵐTc (T = 6 h). Ce cas est à la base du <strong>générateur ⁹⁹Mo/⁹⁹ᵐTc</strong> utilisé quotidiennement en médecine nucléaire.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le générateur ⁹⁹Mo/⁹⁹ᵐTc fonctionne sur le principe de l'équilibre transitoire. On « trait » le générateur toutes les 24h pour récupérer le ⁹⁹ᵐTc pur utilisé en scintigraphie.</p></div>`
    },
    {
      title: "Applications médicales de la radioactivité",
      content: `<p class="mb-3">La radioactivité est utilisée en médecine dans deux grands domaines :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Diagnostic (imagerie)</strong> : scintigraphie (⁹⁹ᵐTc), TEP (¹⁸F-FDG), utilisent des émetteurs γ ou β⁺ à courte période et faible dose.</li>
<li><strong>Thérapie (radiothérapie interne)</strong> : destruction ciblée de cellules tumorales par des émetteurs β⁻ (¹³¹I pour le cancer thyroïdien), α (²²³Ra pour les métastases osseuses) ou par des sources scellées (curiethérapie avec ¹⁹²Ir).</li>
</ul>
<p class="mb-3">Le choix du radio-isotope dépend de plusieurs critères : type de rayonnement émis, période radioactive (suffisamment longue pour l'examen, suffisamment courte pour limiter l'irradiation), propriétés chimiques (fixation sur l'organe cible), disponibilité et coût.</p>
<p class="mb-3">En <strong>TEP</strong> (Tomographie par Émission de Positons), le positon émis s'annihile avec un électron du milieu, produisant 2 photons γ de 511 keV émis à 180° l'un de l'autre. La détection en coïncidence de ces photons permet de localiser le lieu d'annihilation.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Imagerie → émetteurs γ ou β⁺ à courte T₁/₂. Thérapie → émetteurs α ou β⁻ à parcours court pour irradier localement. Le ¹⁸F-FDG est le traceur TEP le plus utilisé (métabolisme glucidique tumoral).</p></div>`
    },
    {
      title: "Dosimétrie des rayonnements et radioprotection",
      content: `<p class="mb-3">La <strong>dosimétrie</strong> quantifie l'énergie déposée par les rayonnements ionisants dans les tissus biologiques. Trois grandeurs essentielles doivent être maîtrisées :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dose absorbée D</strong> (Gray, Gy) : énergie déposée par unité de masse, D = dE/dm. 1 Gy = 1 J/kg.</li>
<li><strong>Dose équivalente H</strong> (Sievert, Sv) : H = D × w_R. Le facteur de pondération w_R tient compte de la dangerosité biologique du rayonnement (w_R = 1 pour γ et β, 20 pour α).</li>
<li><strong>Dose efficace E</strong> (Sievert, Sv) : E = Σ(w_T × H_T). Le facteur w_T pondère la radiosensibilité de chaque organe (gonades, moelle rouge, poumon sont les plus sensibles).</li>
</ul>
<p class="mb-3">Les <strong>principes de radioprotection</strong> (CIPR) encadrent l'utilisation des rayonnements ionisants :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Justification</strong> : tout acte irradiant doit apporter un bénéfice net au patient.</li>
<li><strong>Optimisation (ALARA)</strong> : minimiser les doses tout en maintenant la qualité diagnostique ou thérapeutique.</li>
<li><strong>Limitation</strong> : limites annuelles pour les travailleurs (20 mSv/an en dose efficace) et le public (1 mSv/an). Pas de limite pour les patients (justification individuelle).</li>
</ul>
<p class="mb-3">Les moyens pratiques de protection sont : la <strong>distance</strong> (la dose varie en 1/d²), le <strong>temps</strong> (réduire la durée d'exposition), les <strong>écrans</strong> (plomb, béton) et la <strong>contamination</strong> (confinement des sources non scellées, ventilation, gestion des déchets radioactifs).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : D (Gy) = grandeur physique. H (Sv) = D × w_R intègre le type de rayonnement. E (Sv) = Σ(w_T × H_T) intègre la sensibilité des organes. Les trois principes CIPR sont : justification, optimisation (ALARA), limitation.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  4. IMAGERIE                                  */
/* ───────────────────────────────────────────── */
"biophysique-imagerie": {
  introduction: "L'imagerie médicale regroupe l'ensemble des techniques permettant de visualiser l'intérieur du corps humain. Elle repose sur différents principes physiques : rayons X, ultrasons, champs magnétiques, radioactivité.",
  readTime: 18,
  sections: [
    {
      title: "Panorama des techniques d'imagerie",
      content: `<p class="mb-3">Les principales techniques d'imagerie médicale se distinguent par le type de signal utilisé :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Radiographie / Scanner (TDM)</strong> : rayons X transmis à travers le corps. Image basée sur l'atténuation différentielle des tissus.</li>
<li><strong>Échographie</strong> : ultrasons réfléchis aux interfaces tissulaires. Image basée sur les échos.</li>
<li><strong>IRM</strong> : résonance magnétique nucléaire des protons de l'eau. Image basée sur les temps de relaxation T1 et T2.</li>
<li><strong>Scintigraphie / TEP</strong> : détection de rayonnements émis par un traceur radioactif injecté. Image fonctionnelle et métabolique.</li>
</ul>
<p class="mb-3">On distingue l'imagerie <strong>anatomique</strong> (radiographie, scanner, IRM, échographie) qui montre la structure, et l'imagerie <strong>fonctionnelle</strong> (TEP, scintigraphie, IRM fonctionnelle) qui renseigne sur le fonctionnement des organes.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Radiographie/Scanner = rayons X = imagerie irradiante. Échographie = ultrasons et IRM = champ magnétique = non irradiantes. Scintigraphie/TEP = radioactivité = irradiante (mais à faible dose).</p></div>`
    },
    {
      title: "Le scanner (tomodensitométrie)",
      content: `<p class="mb-3">Le <strong>scanner</strong> (TDM) utilise un tube à rayons X tournant autour du patient. Les détecteurs mesurent l'atténuation des rayons X pour chaque angle, et un algorithme de <strong>rétroprojection filtrée</strong> reconstruit une image en coupe.</p>
<p class="mb-3">Chaque pixel de l'image est associé à un <strong>nombre de Hounsfield</strong> (HU) : HU = 1000 × (μ - μ_eau)/(μ_eau - μ_air). Par convention : eau = 0 HU, air = -1000 HU, os cortical ≈ +1000 HU, graisse ≈ -100 HU, tissu mou ≈ +40 HU.</p>
<p class="mb-3">Le <strong>fenêtrage</strong> permet d'optimiser le contraste pour un type de tissu en sélectionnant la plage de HU affichée. Fenêtre osseuse (large, centrée haut), fenêtre pulmonaire (large, centrée bas), fenêtre tissus mous (étroite, centrée à +40).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'échelle de Hounsfield est normalisée sur l'eau (0 HU) et l'air (-1000 HU). Savoir attribuer les valeurs HU aux différents tissus est essentiel.</p></div>`
    },
    {
      title: "Échographie : principes et modes",
      content: `<p class="mb-3">L'<strong>échographie</strong> utilise des ultrasons (2-15 MHz) émis par une sonde piézoélectrique. Les échos produits aux interfaces d'impédance acoustique différente sont captés et analysés pour construire l'image.</p>
<p class="mb-3">Les différents modes sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Mode A</strong> (Amplitude) : affiche les échos en fonction de la profondeur sur une seule ligne. Utilisé en ophtalmologie.</li>
<li><strong>Mode B</strong> (Brillance) : chaque écho est représenté par un point dont la brillance dépend de l'amplitude. Balayage de multiples lignes → image 2D en temps réel.</li>
<li><strong>Mode TM</strong> (Temps-Mouvement) : enregistre le mouvement d'une structure le long d'une ligne en fonction du temps. Utilisé en cardiologie.</li>
<li><strong>Mode Doppler</strong> : mesure la vitesse des flux sanguins grâce à l'effet Doppler.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'échographie est non irradiante, temps réel et peu coûteuse. Ses limites : les os et l'air empêchent la propagation des ultrasons (fenêtres acoustiques nécessaires).</p></div>`
    },
    {
      title: "IRM : principes fondamentaux",
      content: `<p class="mb-3">L'<strong>IRM</strong> exploite la résonance magnétique nucléaire des noyaux d'hydrogène (¹H) présents dans l'eau et la graisse du corps. Placés dans un champ magnétique intense B₀ (1,5 ou 3 T), les protons s'alignent et précessent à la <strong>fréquence de Larmor</strong> : ν = γB₀/(2π), avec γ = 42,58 MHz/T pour ¹H.</p>
<p class="mb-3">Une impulsion radiofréquence (RF) à la fréquence de Larmor bascule l'aimantation. Après l'impulsion, deux phénomènes de <strong>relaxation</strong> se produisent :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Relaxation T1</strong> (longitudinale) : retour de l'aimantation selon l'axe du champ B₀. La graisse a un T1 court (apparaît brillante en T1), l'eau un T1 long (apparaît sombre).</li>
<li><strong>Relaxation T2</strong> (transversale) : perte de cohérence de phase des spins. L'eau a un T2 long (brillante en T2), la graisse un T2 court.</li>
</ul>
<p class="mb-3">Les <strong>gradients de champ magnétique</strong> permettent le codage spatial : sélection de coupe, codage en fréquence et codage en phase.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : T1 court = signal intense en pondération T1 (graisse brillante). T2 long = signal intense en pondération T2 (eau/liquides brillants). L'IRM n'utilise pas de rayonnements ionisants.</p></div>`
    },
    {
      title: "Produits de contraste et artéfacts en imagerie",
      content: `<p class="mb-3">Les <strong>produits de contraste</strong> améliorent la distinction entre les tissus en modifiant localement les propriétés physiques exploitées par chaque modalité :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Scanner (iode)</strong> : les produits iodés (Z = 53) augmentent fortement l'atténuation des rayons X par effet photoélectrique (τ ∝ Z⁴). Injection intraveineuse pour visualiser les vaisseaux, les tumeurs hypervascularisées et les organes parenchymateux.</li>
<li><strong>IRM (gadolinium)</strong> : les chélates de gadolinium (Gd³⁺, 7 électrons non appariés) raccourcissent le T1 des tissus voisins, les rendant hyperintenses en pondération T1. Utilisés pour détecter les ruptures de la barrière hémato-encéphalique et les tumeurs.</li>
<li><strong>Échographie (microbulles)</strong> : des microbulles de gaz encapsulées (2-5 μm) créent une forte réflexion ultrasonore. Utilisées pour l'échographie de contraste hépatique et cardiaque.</li>
</ul>
<p class="mb-3">Les <strong>artéfacts</strong> sont des anomalies de l'image ne correspondant pas à la réalité anatomique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Scanner</strong> : artéfacts métalliques (durcissement de faisceau), artéfacts de mouvement, artéfacts de volume partiel.</li>
<li><strong>IRM</strong> : artéfacts de susceptibilité magnétique (interfaces air/tissu), artéfacts de déplacement chimique (décalage graisse/eau), artéfacts de flux (vaisseaux).</li>
<li><strong>Échographie</strong> : cônes d'ombre postérieurs (calculs, os), renforcement postérieur (kystes liquidiens), artéfacts de réverbération.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Iode pour le scanner (Z élevé, effet photoélectrique), gadolinium pour l'IRM (raccourcit T1), microbulles pour l'échographie. Connaître les artéfacts permet d'éviter les erreurs diagnostiques.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  5. SOLUTIONS                                 */
/* ───────────────────────────────────────────── */
"biophysique-solutions": {
  introduction: "L'étude des solutions est fondamentale en biophysique et en pharmacologie. Les propriétés colligatives, l'osmose et la pression osmotique régissent les échanges hydriques dans l'organisme.",
  readTime: 18,
  sections: [
    {
      title: "Concentration et unités",
      content: `<p class="mb-3">Une <strong>solution</strong> est un mélange homogène d'un soluté dissous dans un solvant. Plusieurs façons d'exprimer la concentration existent :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Concentration molaire</strong> (molarité) C = n/V en mol/L.</li>
<li><strong>Concentration massique</strong> Cm = m/V en g/L.</li>
<li><strong>Molalité</strong> m = n/m_solvant en mol/kg (indépendante de la température).</li>
<li><strong>Fraction molaire</strong> x = n_i/n_total (sans unité).</li>
<li><strong>Osmolarité</strong> = C × i, où i est le coefficient de van't Hoff (nombre de particules en solution par molécule dissoute).</li>
</ul>
<p class="mb-3">Pour les électrolytes, i dépend du nombre d'ions produits : NaCl → Na⁺ + Cl⁻, donc i = 2. CaCl₂ → Ca²⁺ + 2Cl⁻, donc i = 3. Pour les non-électrolytes (glucose), i = 1.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'osmolarité plasmatique normale est ~300 mOsm/L. Elle est maintenue constante grâce à la régulation rénale et hormonale (ADH). NaCl 0,9 % (sérum physiologique) est isotonique au plasma.</p></div>`
    },
    {
      title: "Osmose et pression osmotique",
      content: `<p class="mb-3">L'<strong>osmose</strong> est le passage de solvant à travers une membrane semi-perméable du compartiment le moins concentré vers le plus concentré, tendant à égaliser les concentrations.</p>
<p class="mb-3">La <strong>pression osmotique</strong> π est la pression qu'il faut exercer sur la solution pour empêcher le flux osmotique. La loi de van't Hoff donne : π = iCRT, où i est le coefficient de van't Hoff, C la concentration molaire, R = 8,314 J·mol⁻¹·K⁻¹ et T la température en kelvins.</p>
<p class="mb-3">Les solutions sont classées par rapport au milieu intérieur :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Isotonique</strong> : même osmolarité que le plasma (~300 mOsm/L). Les cellules ne changent pas de volume.</li>
<li><strong>Hypotonique</strong> : osmolarité inférieure. L'eau entre dans les cellules → gonflement → lyse possible.</li>
<li><strong>Hypertonique</strong> : osmolarité supérieure. L'eau sort des cellules → crénelure (rétraction).</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : π = iCRT. En milieu hypotonique les globules rouges gonflent et hémolysent. En milieu hypertonique ils se crénèlent. Les perfusions IV doivent être isotoniques pour éviter ces accidents.</p></div>`
    },
    {
      title: "Propriétés colligatives",
      content: `<p class="mb-3">Les <strong>propriétés colligatives</strong> dépendent uniquement du nombre de particules de soluté en solution, pas de leur nature chimique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Abaissement de la tension de vapeur</strong> : ΔP = x₂ × P₀ (loi de Raoult), où x₂ est la fraction molaire du soluté.</li>
<li><strong>Élévation ébullioscopique</strong> : ΔT_eb = K_eb × m × i. L'eau bout à plus de 100°C quand on y dissout un soluté.</li>
<li><strong>Abaissement cryoscopique</strong> : ΔT_cr = K_cr × m × i. L'eau gèle en dessous de 0°C. K_cr(eau) = 1,86°C·kg/mol.</li>
<li><strong>Pression osmotique</strong> : π = iCRT (déjà vue).</li>
</ul>
<p class="mb-3">La <strong>cryométrie</strong> (mesure de l'abaissement cryoscopique) est utilisée en biologie pour déterminer l'osmolalité des liquides biologiques. Le sang gèle à -0,56°C, ce qui correspond à une osmolalité de ~300 mOsm/kg.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Les propriétés colligatives dépendent du NOMBRE de particules en solution. 1 mol de NaCl (i=2) a le même effet que 2 mol de glucose (i=1) sur l'abaissement cryoscopique.</p></div>`
    },
    {
      title: "Diffusion et dialyse",
      content: `<p class="mb-3">La <strong>diffusion</strong> est le déplacement de soluté d'une zone de forte concentration vers une zone de faible concentration. La <strong>première loi de Fick</strong> donne le flux : J = -D × dC/dx, où D est le coefficient de diffusion (m²/s) et dC/dx le gradient de concentration.</p>
<p class="mb-3">Le coefficient de diffusion D dépend de la température, de la viscosité du solvant et de la taille de la molécule (relation de Stokes-Einstein : D = kT/(6πηr)). Plus la molécule est grosse, plus D est petit et plus la diffusion est lente.</p>
<p class="mb-3">La <strong>dialyse</strong> utilise une membrane perméable aux petites molécules mais imperméable aux grosses (protéines). En <strong>hémodialyse</strong>, le sang du patient circule le long d'une membrane semi-perméable baignée par un dialysat. Les toxines urémiques (urée, créatinine) diffusent du sang vers le dialysat selon leur gradient de concentration.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La loi de Fick J = -D × dC/dx quantifie la diffusion. L'hémodialyse est l'application clinique majeure : elle épure le sang des petites molécules toxiques tout en retenant les protéines.</p></div>`
    },
    {
      title: "Équilibre de Donnan et potentiel de membrane",
      content: `<p class="mb-3">L'<strong>équilibre de Donnan</strong> se produit lorsqu'une membrane semi-perméable sépare deux compartiments dont l'un contient des macromolécules chargées non diffusibles (protéines plasmatiques). Les ions diffusibles (Na⁺, Cl⁻, K⁺) se répartissent de façon inégale pour satisfaire les conditions d'équilibre électrochimique.</p>
<p class="mb-3">À l'équilibre de Donnan, le produit des concentrations des ions diffusibles est égal de chaque côté de la membrane : [Na⁺]₁ × [Cl⁻]₁ = [Na⁺]₂ × [Cl⁻]₂. Les protéines anioniques attirent les cations et repoussent les anions du même côté, créant une <strong>dissymétrie de répartition ionique</strong>.</p>
<p class="mb-3">Cette dissymétrie a plusieurs conséquences physiologiques importantes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Pression oncotique</strong> : les protéines plasmatiques (albumine principalement, ~40 g/L) exercent une pression osmotique de ~25 mmHg (pression oncotique) qui retient l'eau dans le compartiment vasculaire. Une hypoalbuminémie entraîne des œdèmes.</li>
<li><strong>Différence de potentiel de Donnan</strong> : la dissymétrie ionique crée un potentiel transmembranaire de quelques mV, qui contribue au potentiel de membrane cellulaire.</li>
<li><strong>Équilibre de Starling</strong> : les échanges capillaires résultent de la balance entre la pression hydrostatique (pousse le liquide hors du capillaire) et la pression oncotique (retient le liquide dans le capillaire).</li>
</ul>
<p class="mb-3">L'équation de Starling s'écrit : J_v = L_p × [(P_c - P_i) - σ(π_c - π_i)], où L_p est la conductivité hydraulique, σ le coefficient de réflexion, P les pressions hydrostatiques et π les pressions oncotiques.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'équilibre de Donnan explique la répartition asymétrique des ions de part et d'autre d'une membrane en présence de protéines non diffusibles. La pression oncotique (~25 mmHg) est essentielle au maintien du volume plasmatique.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  6. RMN                                       */
/* ───────────────────────────────────────────── */
"biophysique-rmn": {
  introduction: "La Résonance Magnétique Nucléaire (RMN) est un phénomène physique fondamental qui exploite les propriétés magnétiques des noyaux atomiques. Elle est à la base de l'IRM en médecine et de la spectroscopie RMN en chimie.",
  readTime: 20,
  sections: [
    {
      title: "Bases physiques de la RMN",
      content: `<p class="mb-3">Les noyaux possédant un <strong>spin nucléaire</strong> non nul (I ≠ 0) se comportent comme de petits aimants. Le noyau ¹H (proton) a un spin I = 1/2 et possède un <strong>moment magnétique</strong> μ = γℏI, où γ est le rapport gyromagnétique.</p>
<p class="mb-3">Placés dans un champ magnétique externe B₀, les spins adoptent (2I+1) orientations quantifiées. Pour ¹H (I = 1/2) : deux états possibles (parallèle ↑ et antiparallèle ↓ à B₀). L'état parallèle est légèrement plus peuplé (excès de quelques ppm), créant une <strong>aimantation macroscopique</strong> M₀ alignée sur B₀.</p>
<p class="mb-3">Les spins précessent autour de B₀ à la <strong>fréquence de Larmor</strong> : ω₀ = γB₀ (en rad/s) ou ν₀ = γB₀/(2π) (en Hz). Pour ¹H : γ/(2π) = 42,58 MHz/T. À 1,5 T : ν₀ ≈ 63,87 MHz ; à 3 T : ν₀ ≈ 127,74 MHz.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Seuls les noyaux de spin I ≠ 0 sont observables en RMN. ¹H (I = 1/2) est le noyau le plus utilisé car très abondant dans le corps humain (eau, graisse). ν₀ = 42,58 × B₀ en MHz.</p></div>`
    },
    {
      title: "Excitation et signal RMN",
      content: `<p class="mb-3">Pour observer la RMN, on applique une impulsion de <strong>radiofréquence</strong> (champ B₁) à la fréquence de Larmor, perpendiculairement à B₀. Cette impulsion bascule l'aimantation M₀ d'un angle α dépendant de l'amplitude et de la durée de l'impulsion. Une impulsion à 90° bascule M dans le plan transversal.</p>
<p class="mb-3">L'aimantation transversale précesse à la fréquence de Larmor et induit un courant dans la bobine de réception : c'est le <strong>signal de précession libre</strong> (FID = Free Induction Decay). Ce signal décroît exponentiellement avec la constante de temps T2*.</p>
<p class="mb-3">La <strong>transformée de Fourier</strong> du signal temporel (FID) donne le <strong>spectre de fréquences</strong>, qui est la base de la spectroscopie RMN et du codage spatial en IRM.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'impulsion RF doit être exactement à la fréquence de Larmor pour que la résonance se produise. Le signal FID décroît avec T2* et contient toute l'information spectrale et spatiale.</p></div>`
    },
    {
      title: "Relaxation T1 et T2",
      content: `<p class="mb-3">Après l'impulsion RF, l'aimantation retourne à l'équilibre par deux processus indépendants :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Relaxation T1 (spin-réseau)</strong> : repousse de l'aimantation longitudinale Mz selon Mz(t) = M₀(1 - e⁻ᵗ/T₁). Transfert d'énergie des spins vers le réseau moléculaire environnant.</li>
<li><strong>Relaxation T2 (spin-spin)</strong> : décroissance de l'aimantation transversale Mxy selon Mxy(t) = M₀ e⁻ᵗ/T₂. Perte de cohérence de phase entre les spins due aux interactions mutuelles.</li>
</ul>
<p class="mb-3">Toujours T2 ≤ T1. Valeurs typiques à 1,5 T : graisse T1 ≈ 250 ms, T2 ≈ 70 ms ; muscle T1 ≈ 900 ms, T2 ≈ 50 ms ; LCR T1 ≈ 4000 ms, T2 ≈ 2000 ms.</p>
<p class="mb-3">T2* < T2 car il inclut les inhomogénéités locales du champ magnétique. La séquence <strong>écho de spin</strong> (impulsion 180° de refocalisation) permet de mesurer le vrai T2 en s'affranchissant de ces inhomogénéités.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : T1 = retour de Mz (spin-réseau). T2 = perte de Mxy (spin-spin). T2 ≤ T1 toujours. Les contrastes IRM exploitent les différences de T1 et T2 entre tissus.</p></div>`
    },
    {
      title: "Spectroscopie RMN et déplacement chimique",
      content: `<p class="mb-3">En spectroscopie RMN, les protons d'une molécule ne résonnent pas tous exactement à la même fréquence car ils sont « écrantés » par les électrons environnants. Le champ effectif ressenti est B_eff = B₀(1 - σ), où σ est la constante d'écran.</p>
<p class="mb-3">Le <strong>déplacement chimique</strong> δ = (ν - ν_réf)/ν_réf × 10⁶ s'exprime en ppm (parties par million). La référence est le tétraméthylsilane (TMS, δ = 0 ppm). Les protons déblindés (environnement pauvre en électrons) résonnent à δ élevé.</p>
<p class="mb-3">La spectroscopie RMN in vivo (SRM) permet de doser des métabolites cérébraux : N-acétylaspartate (NAA, marqueur neuronal), choline (Cho, marqueur de turnover membranaire), créatine (Cr, référence interne), lactate (marqueur d'anaérobiose). Les rapports NAA/Cr et Cho/Cr sont utilisés pour caractériser les tumeurs cérébrales.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le déplacement chimique δ en ppm est indépendant du champ B₀. En SRM cérébrale, une diminution du NAA et une augmentation de la Cho suggèrent un processus tumoral.</p></div>`
    },
    {
      title: "De la RMN à l'IRM : codage spatial et séquences",
      content: `<p class="mb-3">L'<strong>IRM</strong> (Imagerie par Résonance Magnétique) exploite les principes de la RMN pour construire des images anatomiques et fonctionnelles. Le passage du signal RMN à l'image nécessite un <strong>codage spatial</strong> réalisé par trois types de gradients de champ magnétique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Gradient de sélection de coupe (G_z)</strong> : appliqué pendant l'impulsion RF, il fait varier la fréquence de Larmor selon z. Seuls les protons de la coupe sélectionnée (épaisseur Δz) sont excités à la bonne fréquence.</li>
<li><strong>Gradient de codage en fréquence (G_x)</strong> : appliqué pendant l'acquisition du signal, il fait varier la fréquence de précession selon x. Chaque colonne de voxels émet à une fréquence différente.</li>
<li><strong>Gradient de codage en phase (G_y)</strong> : appliqué brièvement entre l'excitation et l'acquisition, il introduit un déphasage variable selon y. Plusieurs acquisitions avec des amplitudes de G_y différentes permettent le codage complet.</li>
</ul>
<p class="mb-3">Les principales <strong>séquences IRM</strong> sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Écho de spin (SE)</strong> : impulsion 90° puis 180° de refocalisation. TR court + TE court = pondération T1. TR long + TE long = pondération T2. C'est la séquence de référence.</li>
<li><strong>Écho de gradient (GRE)</strong> : utilise un angle de bascule réduit et un gradient de refocalisation (pas d'impulsion 180°). Plus rapide mais sensible aux inhomogénéités (pondération T2*).</li>
<li><strong>Inversion-récupération (IR)</strong> : impulsion 180° d'inversion puis séquence SE. Le TI (temps d'inversion) permet de supprimer sélectivement un tissu (FLAIR : suppression du LCR ; STIR : suppression de la graisse).</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Trois gradients assurent le codage spatial : sélection de coupe (z), codage en fréquence (x), codage en phase (y). TR et TE déterminent la pondération : TR court/TE court = T1, TR long/TE long = T2. La séquence FLAIR supprime le signal du LCR.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  7. POTENTIEL                                 */
/* ───────────────────────────────────────────── */
"biophysique-potentiel": {
  introduction: "Les phénomènes électriques sont fondamentaux en physiologie. Le potentiel de membrane, le potentiel d'action et les potentiels électrochimiques gouvernent la communication nerveuse et musculaire.",
  readTime: 18,
  sections: [
    {
      title: "Potentiel de membrane et équation de Nernst",
      content: `<p class="mb-3">Toute cellule vivante possède une différence de potentiel entre son intérieur (négatif) et son extérieur (positif), appelée <strong>potentiel de membrane</strong> (Vm). Au repos, Vm ≈ -70 mV pour un neurone, -90 mV pour une fibre musculaire squelettique.</p>
<p class="mb-3">Ce potentiel résulte de la distribution inégale des ions de part et d'autre de la membrane : K⁺ concentré en intracellulaire (~140 mM), Na⁺ concentré en extracellulaire (~145 mM), Cl⁻ extracellulaire (~105 mM).</p>
<p class="mb-3">L'<strong>équation de Nernst</strong> donne le potentiel d'équilibre d'un ion : E_ion = (RT/zF) × ln([ion]_ext/[ion]_int). À 37°C : E_ion = (61,5/z) × log([ion]_ext/[ion]_int) en mV. Pour K⁺ : E_K ≈ -90 mV. Pour Na⁺ : E_Na ≈ +60 mV.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : E = (61,5/z) × log([ext]/[int]) à 37°C. Le potentiel de repos est proche de E_K car la membrane est surtout perméable au K⁺ au repos. La pompe Na⁺/K⁺-ATPase maintient les gradients ioniques.</p></div>`
    },
    {
      title: "Équation de Goldman-Hodgkin-Katz",
      content: `<p class="mb-3">L'équation de Nernst ne s'applique qu'à un seul ion. L'<strong>équation de Goldman-Hodgkin-Katz</strong> (GHK) tient compte de la perméabilité relative de la membrane à plusieurs ions :</p>
<p class="mb-3 font-mono text-sm">Vm = (RT/F) × ln[(P_K[K⁺]_e + P_Na[Na⁺]_e + P_Cl[Cl⁻]_i) / (P_K[K⁺]_i + P_Na[Na⁺]_i + P_Cl[Cl⁻]_e)]</p>
<p class="mb-3">Au repos, P_K >> P_Na (rapport ~100:1), donc Vm est proche de E_K. Lors d'un potentiel d'action, les canaux Na⁺ s'ouvrent massivement : P_Na >> P_K et Vm se rapproche de E_Na (+60 mV).</p>
<p class="mb-3">Notez l'inversion du rapport pour Cl⁻ (anion) par rapport aux cations K⁺ et Na⁺ dans la formule de GHK : les concentrations intracellulaires de Cl⁻ sont au numérateur.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'équation de GHK pondère les potentiels d'équilibre de chaque ion par sa perméabilité relative. Modifier les perméabilités (ouverture/fermeture de canaux) modifie le potentiel de membrane.</p></div>`
    },
    {
      title: "Le potentiel d'action",
      content: `<p class="mb-3">Le <strong>potentiel d'action</strong> (PA) est une variation brève et stéréotypée du potentiel de membrane qui se propage le long de l'axone. Il obéit à la loi du <strong>tout ou rien</strong> : si le seuil d'excitation (~-55 mV) est atteint, le PA se déclenche avec toujours la même amplitude.</p>
<p class="mb-3">Les phases du PA neuronal sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dépolarisation</strong> : ouverture des canaux Na⁺ voltage-dépendants, entrée massive de Na⁺ → Vm passe de -70 mV à +30 mV en ~0,5 ms.</li>
<li><strong>Repolarisation</strong> : inactivation des canaux Na⁺ + ouverture des canaux K⁺ → sortie de K⁺ → retour vers le potentiel de repos.</li>
<li><strong>Hyperpolarisation transitoire</strong> : les canaux K⁺ se ferment lentement → Vm descend temporairement en dessous de -70 mV.</li>
</ul>
<p class="mb-3">La <strong>période réfractaire absolue</strong> (~1 ms) correspond à l'inactivation des canaux Na⁺ : aucun nouveau PA n'est possible. La <strong>période réfractaire relative</strong> permet un PA uniquement avec un stimulus plus intense. Cela limite la fréquence maximale de décharge (~1000 Hz) et assure la propagation unidirectionnelle.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le PA est tout-ou-rien. Dépolarisation = canaux Na⁺ (rapides), repolarisation = canaux K⁺ (lents). La période réfractaire absolue empêche la propagation rétrograde.</p></div>`
    },
    {
      title: "Propagation du potentiel d'action",
      content: `<p class="mb-3">Le PA se propage le long de l'axone grâce aux <strong>courants locaux</strong> : la zone dépolarisée crée un gradient de potentiel qui dépolarise la zone voisine au-delà du seuil, déclenchant un nouveau PA. La période réfractaire empêche la propagation rétrograde.</p>
<p class="mb-3">La <strong>vitesse de conduction</strong> dépend de deux facteurs :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Diamètre de l'axone</strong> : plus l'axone est gros, moindre est la résistance intracellulaire et plus la conduction est rapide (v ∝ √d pour les fibres amyéliniques).</li>
<li><strong>Myélinisation</strong> : la gaine de myéline isole l'axone et la conduction devient <strong>saltatoire</strong> (le PA saute de nœud de Ranvier en nœud de Ranvier). Vitesse : jusqu'à 120 m/s pour les fibres myélinisées Aα vs 0,5-2 m/s pour les fibres C amyéliniques.</li>
</ul>
<p class="mb-3">La <strong>constante de temps τ = R_m × C_m</strong> et la <strong>constante d'espace λ = √(R_m/R_i)</strong> caractérisent les propriétés passives de l'axone. La myéline augmente R_m et diminue C_m, augmentant ainsi λ et la vitesse de conduction.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La conduction saltatoire (fibres myélinisées) est ~50× plus rapide que la conduction continue (fibres amyéliniques). Les maladies démyélinisantes (SEP) ralentissent dramatiquement la conduction nerveuse.</p></div>`
    },
    {
      title: "Synapses et transmission synaptique",
      content: `<p class="mb-3">La <strong>synapse</strong> est la jonction fonctionnelle entre deux neurones ou entre un neurone et une cellule effectrice (musculaire, glandulaire). On distingue les synapses <strong>électriques</strong> (jonctions communicantes, transmission bidirectionnelle rapide) et les synapses <strong>chimiques</strong> (transmission unidirectionnelle par neurotransmetteurs).</p>
<p class="mb-3">La transmission synaptique chimique se déroule en plusieurs étapes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Arrivée du PA</strong> au bouton synaptique → ouverture des canaux Ca²⁺ voltage-dépendants → entrée de Ca²⁺.</li>
<li><strong>Exocytose</strong> : le Ca²⁺ provoque la fusion des vésicules synaptiques avec la membrane présynaptique et la libération du neurotransmetteur dans la fente synaptique (~20 nm).</li>
<li><strong>Fixation</strong> du neurotransmetteur sur les récepteurs postsynaptiques → ouverture de canaux ioniques → potentiel postsynaptique (PPS).</li>
<li><strong>Inactivation</strong> : le neurotransmetteur est dégradé enzymatiquement (acétylcholinestérase pour l'ACh), recapté ou diffuse hors de la fente.</li>
</ul>
<p class="mb-3">Les <strong>potentiels postsynaptiques</strong> sont graduels (non tout-ou-rien) et se somment :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>PPSE</strong> (excitateur) : dépolarisation locale (ouverture de canaux Na⁺/K⁺). Rapproche le potentiel du seuil.</li>
<li><strong>PPSI</strong> (inhibiteur) : hyperpolarisation locale (ouverture de canaux Cl⁻ ou K⁺). Éloigne du seuil.</li>
<li><strong>Sommation temporelle</strong> : addition de PPS successifs rapides au même site synaptique.</li>
<li><strong>Sommation spatiale</strong> : addition de PPS simultanés provenant de synapses différentes.</li>
</ul>
<p class="mb-3">Le PA est déclenché au <strong>segment initial de l'axone</strong> si la somme algébrique de tous les PPS atteint le seuil de dépolarisation.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La synapse chimique est unidirectionnelle et nécessite du Ca²⁺ pour l'exocytose des vésicules. Les PPS sont graduels et se somment (temporellement et spatialement). Le PA naît au segment initial si le seuil est atteint.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  8. THERMODYNAMIQUE BIOLOGIQUE                */
/* ───────────────────────────────────────────── */
"biophysique-thermo-bio": {
  introduction: "La thermodynamique biologique applique les principes de la thermodynamique aux systèmes vivants. Elle permet de comprendre les échanges énergétiques cellulaires, le métabolisme et les équilibres biologiques.",
  readTime: 20,
  sections: [
    {
      title: "Premier principe et enthalpie",
      content: `<p class="mb-3">Le <strong>premier principe de la thermodynamique</strong> affirme la conservation de l'énergie : ΔU = Q + W, où U est l'énergie interne du système, Q la chaleur échangée et W le travail. Pour les systèmes biologiques (pression constante), on utilise l'<strong>enthalpie</strong> H = U + PV.</p>
<p class="mb-3">La variation d'enthalpie ΔH d'une réaction mesure la chaleur échangée à pression constante. Si ΔH < 0, la réaction est <strong>exothermique</strong> (libère de la chaleur). Si ΔH > 0, elle est <strong>endothermique</strong> (absorbe de la chaleur).</p>
<p class="mb-3">La <strong>loi de Hess</strong> stipule que ΔH d'une réaction ne dépend que de l'état initial et final, pas du chemin suivi. Cela permet de calculer ΔH d'une réaction complexe en la décomposant en étapes élémentaires. Par exemple, l'oxydation complète du glucose : C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O, ΔH = -2808 kJ/mol.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'oxydation du glucose libère 2808 kJ/mol. Cette énergie est récupérée sous forme d'ATP (rendement ~40%). Le reste est dissipé sous forme de chaleur, maintenant la température corporelle.</p></div>`
    },
    {
      title: "Deuxième principe, entropie et énergie libre de Gibbs",
      content: `<p class="mb-3">Le <strong>deuxième principe</strong> affirme que l'entropie S de l'univers (système + environnement) ne peut qu'augmenter : ΔS_univers ≥ 0. L'<strong>entropie</strong> mesure le degré de désordre d'un système.</p>
<p class="mb-3">L'<strong>énergie libre de Gibbs</strong> G = H - TS est le critère de spontanéité à T et P constantes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>ΔG < 0</strong> : réaction spontanée, <strong>exergonique</strong> (libère de l'énergie libre).</li>
<li><strong>ΔG > 0</strong> : réaction non spontanée, <strong>endergonique</strong> (nécessite un apport d'énergie).</li>
<li><strong>ΔG = 0</strong> : équilibre thermodynamique.</li>
</ul>
<p class="mb-3">La relation ΔG = ΔG° + RT ln Q relie l'énergie libre aux conditions réelles (Q = quotient réactionnel). À l'équilibre (ΔG = 0) : ΔG° = -RT ln K_eq.</p>
<p class="mb-3">Les organismes vivants sont des systèmes <strong>thermodynamiquement ouverts</strong>, loin de l'équilibre. Ils maintiennent un ordre interne (entropie locale basse) en exportant de l'entropie vers l'environnement (chaleur, CO₂, déchets).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : ΔG < 0 = réaction spontanée. L'hydrolyse de l'ATP (ΔG° = -30,5 kJ/mol) est la « monnaie énergétique » qui couple les réactions exergoniques aux endergoniques dans la cellule.</p></div>`
    },
    {
      title: "Couplage énergétique et ATP",
      content: `<p class="mb-3">Le <strong>couplage énergétique</strong> est le principe par lequel une réaction exergonique (ΔG < 0) fournit l'énergie nécessaire à une réaction endergonique (ΔG > 0). La somme des ΔG doit être négative pour que le processus global soit spontané.</p>
<p class="mb-3">L'<strong>ATP</strong> (adénosine triphosphate) est le principal intermédiaire de couplage. Son hydrolyse ATP → ADP + Pi libère ΔG°' = -30,5 kJ/mol (en conditions standard biologiques, pH 7). In vivo, le ΔG réel est encore plus négatif (~-50 kJ/mol) car les concentrations cellulaires d'ATP sont maintenues élevées et celles d'ADP et Pi basses.</p>
<p class="mb-3">Exemple de couplage : la phosphorylation du glucose (ΔG° = +13,8 kJ/mol) est rendue spontanée en la couplant à l'hydrolyse de l'ATP. La réaction globale glucose + ATP → glucose-6-P + ADP a un ΔG° = +13,8 + (-30,5) = -16,7 kJ/mol < 0.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'ATP est la « monnaie énergétique universelle ». ΔG°' d'hydrolyse = -30,5 kJ/mol. Le couplage fonctionne car la réaction globale a un ΔG total < 0.</p></div>`
    },
    {
      title: "Thermorégulation et calorimétrie",
      content: `<p class="mb-3">L'être humain est un organisme <strong>homéotherme</strong> : il maintient sa température corporelle à ~37°C malgré les variations de l'environnement. Le bilan thermique est : Production de chaleur = Pertes de chaleur (à l'équilibre).</p>
<p class="mb-3">La <strong>production de chaleur</strong> provient du métabolisme basal (~80 W au repos), de l'activité musculaire (jusqu'à 1000 W en exercice intense), de l'action dynamique spécifique des aliments et des frissons (thermogenèse).</p>
<p class="mb-3">Les <strong>pertes de chaleur</strong> se font par quatre mécanismes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Radiation</strong> (~60%) : émission d'infrarouges (loi de Stefan-Boltzmann : P = εσA(T⁴_corps - T⁴_env)).</li>
<li><strong>Convection</strong> (~15%) : transfert à l'air ambiant en mouvement.</li>
<li><strong>Évaporation</strong> (~22%) : sudation et perspiration insensible. Chaque gramme d'eau évaporée dissipe ~2,4 kJ.</li>
<li><strong>Conduction</strong> (~3%) : transfert par contact direct.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La radiation est le mode principal de perte de chaleur au repos. L'évaporation devient prédominante quand T_env > T_corps (seul mécanisme efficace en ambiance chaude). Le métabolisme basal ≈ 80 W ≈ 7000 kJ/jour.</p></div>`
    },
    {
      title: "Cinétique enzymatique et équation de Michaelis-Menten",
      content: `<p class="mb-3">La <strong>cinétique enzymatique</strong> est une application directe de la thermodynamique aux réactions biologiques catalysées. Les enzymes sont des catalyseurs biologiques qui accélèrent les réactions en abaissant l'<strong>énergie d'activation</strong> E_a sans modifier l'équilibre thermodynamique (ΔG inchangé).</p>
<p class="mb-3">Le modèle de <strong>Michaelis-Menten</strong> décrit la cinétique d'une enzyme simple : E + S ⇌ ES → E + P. La vitesse initiale est donnée par :</p>
<p class="mb-3 font-mono text-sm">v₀ = V_max × [S] / (K_M + [S])</p>
<p class="mb-3">Les paramètres cinétiques fondamentaux sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>V_max</strong> : vitesse maximale atteinte quand toutes les enzymes sont saturées ([S] >> K_M). V_max = k_cat × [E]_total.</li>
<li><strong>K_M</strong> (constante de Michaelis) : concentration en substrat pour laquelle v₀ = V_max/2. Reflète l'affinité de l'enzyme pour le substrat : un K_M faible correspond à une forte affinité.</li>
<li><strong>k_cat</strong> (nombre de turnover) : nombre de molécules de substrat transformées par molécule d'enzyme par unité de temps à saturation.</li>
<li><strong>k_cat/K_M</strong> (efficacité catalytique) : critère d'efficacité global de l'enzyme. Limite théorique ~10⁸-10⁹ M⁻¹·s⁻¹ (diffusion contrôlée).</li>
</ul>
<p class="mb-3">La représentation en <strong>double inverse de Lineweaver-Burk</strong> (1/v₀ en fonction de 1/[S]) linéarise l'équation : 1/v₀ = (K_M/V_max) × 1/[S] + 1/V_max. L'ordonnée à l'origine donne 1/V_max, la pente K_M/V_max et l'intersection avec l'axe des abscisses -1/K_M.</p>
<p class="mb-3">Les <strong>inhibiteurs enzymatiques</strong> modifient les paramètres cinétiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Inhibiteur compétitif</strong> : se lie au site actif, augmente K_M apparent, V_max inchangé.</li>
<li><strong>Inhibiteur non compétitif</strong> : se lie à un site allostérique, K_M inchangé, V_max diminué.</li>
<li><strong>Inhibiteur incompétitif</strong> : se lie au complexe ES, K_M et V_max diminués proportionnellement.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : v₀ = V_max[S]/(K_M + [S]). K_M = [S] quand v₀ = V_max/2. Inhibiteur compétitif : K_M ↑, V_max inchangé. Inhibiteur non compétitif : K_M inchangé, V_max ↓. La représentation de Lineweaver-Burk permet de distinguer les types d'inhibition.</p></div>`
    }
  ]
},


/* ───────────────────────────────────────────── */
/*  9. SPECTROSCOPIE                             */
/* ───────────────────────────────────────────── */
"biophysique-spectro": {
  introduction: "La spectroscopie étudie l'interaction entre la matière et le rayonnement électromagnétique. Chaque technique spectroscopique sonde des transitions énergétiques différentes et fournit des informations complémentaires sur la structure moléculaire.",
  readTime: 18,
  sections: [
    {
      title: "Principes généraux et loi de Beer-Lambert",
      content: `<p class="mb-3">La spectroscopie d'absorption mesure l'atténuation d'un faisceau lumineux traversant un échantillon. La <strong>loi de Beer-Lambert</strong> relie l'absorbance A à la concentration : A = ε × l × C, où ε est le coefficient d'extinction molaire (L·mol⁻¹·cm⁻¹), l le trajet optique (cm) et C la concentration (mol/L).</p>
<p class="mb-3">La <strong>transmittance</strong> T = I/I₀ et l'absorbance A = -log(T) = log(I₀/I). A est additive : pour un mélange, A_total = Σ(εᵢ × l × Cᵢ). Cette propriété permet le dosage de mélanges par mesure à plusieurs longueurs d'onde.</p>
<p class="mb-3">Limites de la loi de Beer-Lambert : valide uniquement pour les solutions diluées (C < 0,01 mol/L en général), lumière monochromatique, et en l'absence de réactions chimiques ou de fluorescence.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : A = εlC est la formule fondamentale du dosage spectrophotométrique. L'absorbance est sans unité, additive et proportionnelle à la concentration (en solution diluée).</p></div>`
    },
    {
      title: "Spectroscopie UV-visible",
      content: `<p class="mb-3">La spectroscopie <strong>UV-visible</strong> (200-800 nm) sonde les transitions électroniques des molécules. Les chromophores (groupements absorbants) sont des systèmes à électrons π conjugués ou à paires libres.</p>
<p class="mb-3">Les principales transitions sont : n → π* (faible intensité, carbonyles ~280 nm), π → π* (forte intensité, doubles liaisons conjuguées ~200-400 nm), et les transitions de transfert de charge.</p>
<p class="mb-3">Applications biomédicales : dosage de protéines à 280 nm (absorption des acides aminés aromatiques Trp, Tyr, Phe), dosage des acides nucléiques à 260 nm, mesure de la saturation en O₂ de l'hémoglobine (oxymétrie de pouls) par la différence d'absorption entre HbO₂ et Hb à 660 nm (rouge) et 940 nm (infrarouge).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Protéines absorbent à 280 nm, ADN à 260 nm. Le rapport A260/A280 évalue la pureté d'un échantillon d'ADN (~1,8 pour de l'ADN pur). L'oxymètre de pouls utilise deux λ pour calculer la SpO₂.</p></div>`
    },
    {
      title: "Spectroscopie infrarouge et Raman",
      content: `<p class="mb-3">La spectroscopie <strong>infrarouge</strong> (IR, 2,5-25 μm soit 4000-400 cm⁻¹) sonde les vibrations moléculaires. Chaque liaison chimique vibre à une fréquence caractéristique qui dépend des masses des atomes et de la constante de force de la liaison.</p>
<p class="mb-3">Les principales bandes d'absorption : O-H (3200-3600 cm⁻¹, large), N-H (3300-3500 cm⁻¹), C-H (2800-3000 cm⁻¹), C=O (1680-1750 cm⁻¹, intense), C=C (1620-1680 cm⁻¹). La région 400-1500 cm⁻¹ est l'« empreinte digitale » de la molécule.</p>
<p class="mb-3">La spectroscopie <strong>Raman</strong> est complémentaire de l'IR : elle détecte les vibrations qui modifient la polarisabilité de la molécule (vs le moment dipolaire pour l'IR). L'avantage du Raman est qu'il est peu sensible à l'eau, permettant l'étude de systèmes biologiques en milieu aqueux.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'IR sonde les vibrations moléculaires. La bande C=O (~1700 cm⁻¹) est un marqueur de groupement carbonyle très utile. IR et Raman sont complémentaires (règles de sélection différentes).</p></div>`
    },
    {
      title: "Fluorescence et applications biomédicales",
      content: `<p class="mb-3">La <strong>fluorescence</strong> est l'émission de photons par une molécule excitée lors du retour à l'état fondamental. Le spectre d'émission est toujours décalé vers les grandes longueurs d'onde par rapport à l'excitation (<strong>déplacement de Stokes</strong>), car une partie de l'énergie est dissipée par relaxation vibrationnelle.</p>
<p class="mb-3">Le <strong>rendement quantique</strong> Φ = nombre de photons émis / nombre de photons absorbés. Les fluorophores biologiques naturels incluent le tryptophane (excitation 280 nm, émission 340 nm), le NADH (340/460 nm) et les flavines (450/520 nm).</p>
<p class="mb-3">Applications : <strong>microscopie de fluorescence</strong> (immunofluorescence, GFP), <strong>cytométrie en flux</strong> (tri cellulaire), <strong>FRET</strong> (transfert d'énergie entre fluorophores pour mesurer des distances moléculaires < 10 nm), dosages immunologiques (ELISA fluorescent).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Fluorescence : λ_émission > λ_excitation (déplacement de Stokes). Le FRET mesure des distances moléculaires de 1-10 nm et est un outil majeur en biologie structurale.</p></div>`
    },
    {
      title: "Spectrométrie de masse et dichroïsme circulaire",
      content: `<p class="mb-3">La <strong>spectrométrie de masse</strong> (MS) n'est pas une spectroscopie au sens strict (pas d'interaction avec un rayonnement EM), mais elle est souvent couplée aux techniques spectroscopiques. Elle mesure le rapport masse/charge (m/z) des ions en phase gazeuse.</p>
<p class="mb-3">Les étapes de la spectrométrie de masse sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Ionisation</strong> : conversion des molécules en ions gazeux. Méthodes douces pour les biomolécules : ESI (ElectroSpray Ionization) pour les protéines en solution, MALDI (Matrix-Assisted Laser Desorption/Ionization) pour les échantillons solides.</li>
<li><strong>Séparation</strong> : les ions sont séparés selon leur m/z par un analyseur (quadripôle, temps de vol TOF, trappe ionique, Orbitrap).</li>
<li><strong>Détection</strong> : mesure du courant ionique en fonction de m/z → spectre de masse.</li>
</ul>
<p class="mb-3">Applications en biologie : identification de protéines (protéomique), dosage de métabolites (métabolomique), diagnostic néonatal, toxicologie, dopage sportif. La MS en tandem (MS/MS) permet le séquençage peptidique.</p>
<p class="mb-3">Le <strong>dichroïsme circulaire</strong> (CD) mesure la différence d'absorption entre la lumière polarisée circulairement gauche et droite. Les biomolécules chirales (protéines, acides nucléiques) présentent un spectre CD caractéristique de leur structure secondaire :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Hélice α</strong> : deux minima à 208 et 222 nm, un maximum à 193 nm.</li>
<li><strong>Feuillet β</strong> : un minimum à 218 nm, un maximum à 195 nm.</li>
<li><strong>Pelote statistique</strong> : un minimum à ~200 nm, faible signal au-dessus de 210 nm.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La spectrométrie de masse mesure m/z et permet l'identification des biomolécules (protéomique). ESI et MALDI sont les méthodes d'ionisation douces pour les protéines. Le dichroïsme circulaire renseigne sur la structure secondaire des protéines.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  10. RAYONS X                                 */
/* ───────────────────────────────────────────── */
"biophysique-rayonsx": {
  introduction: "Les rayons X sont des rayonnements électromagnétiques ionisants utilisés en imagerie diagnostique (radiographie, scanner) et en radiothérapie. Leur production et leurs interactions avec la matière sont au cœur de la biophysique médicale.",
  readTime: 20,
  sections: [
    {
      title: "Production des rayons X",
      content: `<p class="mb-3">Les rayons X sont produits dans un <strong>tube de Coolidge</strong> : des électrons émis par une cathode chauffée (effet thermoélectronique) sont accélérés par une haute tension (40-150 kV pour le diagnostic) et frappent une anode métallique (tungstène, molybdène).</p>
<p class="mb-3">Deux mécanismes de production coexistent :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Rayonnement de freinage (Bremsstrahlung)</strong> : l'électron est décéléré dans le champ électrique des noyaux de l'anode. L'énergie perdue est émise sous forme de photons X. Le spectre est continu, avec une énergie maximale E_max = eU (U = tension appliquée).</li>
<li><strong>Rayonnement caractéristique</strong> : l'électron incident éjecte un électron d'une couche interne de l'atome de l'anode. Le réarrangement électronique produit des photons X d'énergie discrète, caractéristique de l'élément (raies Kα, Kβ du tungstène).</li>
</ul>
<p class="mb-3">Le rendement de production est très faible (~1 % pour le diagnostic) : la quasi-totalité de l'énergie cinétique des électrons est convertie en chaleur. D'où la nécessité d'un refroidissement efficace de l'anode (anode tournante, circulation d'huile).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le spectre de Bremsstrahlung est continu avec E_max = eU. Le spectre caractéristique est fait de raies discrètes. La tension kV détermine la qualité (pénétration) du faisceau, les mA sa quantité (débit de photons).</p></div>`
    },
    {
      title: "Interactions des rayons X avec la matière",
      content: `<p class="mb-3">Les photons X interagissent avec la matière par trois mécanismes principaux :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Effet photoélectrique</strong> : le photon X est totalement absorbé par un électron de la couche interne, qui est éjecté avec une énergie cinétique Ec = hν - E_liaison. Prédominant à basse énergie et pour les Z élevés. Responsable du contraste en radiographie (τ ∝ Z⁴/E³).</li>
<li><strong>Diffusion Compton</strong> : le photon X interagit avec un électron peu lié. Le photon est diffusé avec une énergie réduite et un changement de direction. Prédominant aux énergies diagnostiques (30-150 keV) dans les tissus mous. Responsable du rayonnement diffusé (bruit sur l'image).</li>
<li><strong>Création de paires</strong> : à très haute énergie (> 1,022 MeV), un photon se transforme en paire électron-positon au voisinage d'un noyau. Intervient en radiothérapie haute énergie.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Effet photoélectrique ∝ Z⁴/E³ → excellent contraste mais forte dose. Compton quasi indépendant de Z → pas de contraste, source de bruit. L'os (Z élevé du Ca) absorbe fortement par effet photoélectrique.</p></div>`
    },
    {
      title: "Atténuation et qualité de l'image radiologique",
      content: `<p class="mb-3">L'atténuation d'un faisceau de rayons X suit la loi exponentielle : I = I₀ e⁻ᵘˣ, où μ est le coefficient d'atténuation linéique (cm⁻¹) et x l'épaisseur traversée. La <strong>couche de demi-atténuation</strong> (CDA) est l'épaisseur qui réduit l'intensité de moitié : CDA = ln2/μ.</p>
<p class="mb-3">Le coefficient massique μ/ρ (cm²/g) est plus pratique car il ne dépend pas de la densité. Pour un faisceau polyénergétique, les photons de basse énergie sont préférentiellement absorbés (<strong>durcissement du faisceau</strong>), ce qui augmente l'énergie moyenne et la CDA avec la profondeur.</p>
<p class="mb-3">La qualité de l'image dépend de : la <strong>résolution spatiale</strong> (taille du foyer, distance foyer-film, flou cinétique), le <strong>contraste</strong> (différence d'atténuation entre tissus, kV, diffusé Compton) et le <strong>bruit</strong> (nombre de photons détectés, mAs). Le rapport signal/bruit ∝ √(nombre de photons).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : I = I₀ e⁻ᵘˣ et CDA = ln2/μ. Augmenter les kV augmente la pénétration mais diminue le contraste. Augmenter les mAs augmente le nombre de photons (meilleur rapport S/B) mais augmente la dose.</p></div>`
    },
    {
      title: "Radioprotection en imagerie X",
      content: `<p class="mb-3">Les rayons X sont <strong>ionisants</strong> et peuvent provoquer des dommages biologiques. La <strong>radioprotection</strong> repose sur trois principes (CIPR) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Justification</strong> : tout examen irradiant doit apporter un bénéfice médical supérieur au risque.</li>
<li><strong>Optimisation (ALARA)</strong> : maintenir les doses aussi basses que raisonnablement possible (As Low As Reasonably Achievable) tout en obtenant une image de qualité diagnostique.</li>
<li><strong>Limitation des doses</strong> : limites réglementaires pour les travailleurs (20 mSv/an en dose efficace) et le public (1 mSv/an). Pas de limite pour les patients (justification au cas par cas).</li>
</ul>
<p class="mb-3">Moyens de protection : distance (la dose diminue en 1/d²), écrans (tabliers de plomb, paravents), temps (réduire la durée d'exposition), et collimation (irradier uniquement la zone d'intérêt).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Principes de radioprotection = Justification + Optimisation (ALARA) + Limitation. La dose diminue en 1/d² avec la distance. Limite travailleurs : 20 mSv/an efficace.</p></div>`
    },
    {
      title: "Radiothérapie externe et accélérateurs",
      content: `<p class="mb-3">La <strong>radiothérapie externe</strong> utilise des faisceaux de rayonnements ionisants produits par des accélérateurs linéaires (LINAC) pour détruire les cellules tumorales. Les photons de haute énergie (4-25 MV) et les électrons (4-25 MeV) sont les rayonnements les plus couramment utilisés.</p>
<p class="mb-3">L'<strong>accélérateur linéaire</strong> (LINAC) produit des électrons par un canon à électrons, les accélère dans un guide d'ondes par des micro-ondes (magnétron ou klystron), puis les dirige soit directement vers le patient (faisceau d'électrons) soit vers une cible de tungstène pour produire des photons X de freinage (Bremsstrahlung).</p>
<p class="mb-3">Les <strong>rendements en profondeur</strong> diffèrent selon le type de rayonnement :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Photons MV</strong> : maximum de dose sous la surface (build-up), puis décroissance exponentielle. Plus l'énergie est élevée, plus le maximum est profond et la pénétration importante. Le build-up épargne la peau.</li>
<li><strong>Électrons</strong> : dose relativement constante jusqu'à une profondeur R_80, puis chute brutale. Idéaux pour les tumeurs superficielles (peau, paroi thoracique). La profondeur utile ≈ E(MeV)/3 en cm.</li>
</ul>
<p class="mb-3">La <strong>planification dosimétrique</strong> vise à maximiser la dose dans le volume tumoral tout en minimisant l'irradiation des organes à risque. Les techniques modernes incluent :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>RCMI</strong> (Radiothérapie Conformationnelle avec Modulation d'Intensité) : modulation du faisceau par un collimateur multilames pour conformer la dose à la tumeur.</li>
<li><strong>Stéréotaxie</strong> : irradiation focalisée en dose unique ou hypo-fractionnée (CyberKnife, Gamma Knife).</li>
<li><strong>Protonthérapie</strong> : utilisation de protons dont le pic de Bragg permet de déposer la dose en profondeur sans dose de sortie, épargnant les tissus distaux.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le LINAC produit photons MV et électrons. Les photons ont un build-up (épargne cutanée) et pénètrent en profondeur. Les électrons ont un parcours fini (tumeurs superficielles). Le pic de Bragg des protons permet une irradiation sans dose de sortie.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  11. pH ET TAMPONS                            */
/* ───────────────────────────────────────────── */
"biophysique-ph-tampons": {
  introduction: "Le pH et les systèmes tampons sont essentiels à l'homéostasie. Le maintien du pH sanguin dans une fourchette étroite (7,38-7,42) est vital pour le fonctionnement des enzymes et des protéines.",
  readTime: 18,
  sections: [
    {
      title: "Définitions et échelle de pH",
      content: `<p class="mb-3">Le <strong>pH</strong> est défini comme pH = -log[H⁺], où [H⁺] est la concentration en ions hydrogène en mol/L. L'échelle de pH va de 0 (très acide) à 14 (très basique) à 25°C. Un pH de 7 correspond à la neutralité.</p>
<p class="mb-3">Un <strong>acide</strong> est une espèce qui libère des protons H⁺ (définition de Brønsted). Une <strong>base</strong> accepte des protons. Le couple acide/base conjugué HA/A⁻ est relié par : HA ⇌ H⁺ + A⁻, avec Ka = [H⁺][A⁻]/[HA].</p>
<p class="mb-3">Le pKa = -log(Ka) caractérise la force de l'acide. Plus le pKa est bas, plus l'acide est fort. À pH = pKa, l'acide et sa base conjuguée sont en concentrations égales ([HA] = [A⁻]). Relation fondamentale : pH + pOH = pKe = 14 à 25°C.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : pH = -log[H⁺]. À pH = pKa, la forme acide et la forme basique sont en proportions égales. Le pH sanguin (7,40) correspond à [H⁺] = 40 nmol/L (10⁻⁷·⁴ mol/L).</p></div>`
    },
    {
      title: "Équation de Henderson-Hasselbalch et tampons",
      content: `<p class="mb-3">L'<strong>équation de Henderson-Hasselbalch</strong> relie le pH au pKa et aux concentrations : pH = pKa + log([A⁻]/[HA]). C'est l'outil fondamental pour calculer le pH des solutions tampons.</p>
<p class="mb-3">Un <strong>tampon</strong> est un mélange d'un acide faible et de sa base conjuguée (ou d'une base faible et de son acide conjugué) qui résiste aux variations de pH lors de l'ajout d'acide ou de base. Le tampon est le plus efficace quand pH ≈ pKa (zone tampon : pKa ± 1).</p>
<p class="mb-3">Le <strong>pouvoir tampon</strong> β = dC_b/dpH (mol/L par unité de pH) est maximal à pH = pKa et proportionnel à la concentration totale du tampon. Plus le tampon est concentré, plus il résiste aux variations de pH.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : pH = pKa + log([A⁻]/[HA]). Le pouvoir tampon est maximal à pH = pKa. Un bon tampon doit avoir un pKa proche du pH souhaité et être suffisamment concentré.</p></div>`
    },
    {
      title: "Tampons biologiques et équilibre acido-basique",
      content: `<p class="mb-3">Les principaux tampons biologiques sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Tampon bicarbonate/CO₂</strong> : CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. C'est le tampon principal du sang (pKa apparent = 6,1). Équation : pH = 6,1 + log([HCO₃⁻]/(0,03 × PCO₂)). Valeurs normales : [HCO₃⁻] = 24 mmol/L, PCO₂ = 40 mmHg → pH = 7,40.</li>
<li><strong>Tampon phosphate</strong> : H₂PO₄⁻/HPO₄²⁻ (pKa = 6,8). Important au niveau intracellulaire et urinaire.</li>
<li><strong>Protéines/Hémoglobine</strong> : les groupements imidazole de l'histidine (pKa ≈ 6,8) sont les principaux tampons protéiques. L'hémoglobine est le principal tampon intra-érythrocytaire.</li>
</ul>
<p class="mb-3">Le système bicarbonate est un <strong>tampon ouvert</strong> : le CO₂ est éliminé par les poumons et les HCO₃⁻ sont régulés par les reins. Cette régulation rend le tampon bicarbonate efficace malgré un pKa éloigné du pH sanguin.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : pH = 6,1 + log([HCO₃⁻]/(0,03 × PCO₂)). Le tampon bicarbonate est un système ouvert : les poumons contrôlent PCO₂ (régulation rapide) et les reins contrôlent [HCO₃⁻] (régulation lente, 24-48h).</p></div>`
    },
    {
      title: "Troubles acido-basiques",
      content: `<p class="mb-3">Les troubles acido-basiques sont classés en quatre catégories :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Acidose respiratoire</strong> : PCO₂ ↑ (hypoventilation) → pH ↓. Causes : BPCO, obstruction des voies aériennes. Compensation rénale : ↑ réabsorption HCO₃⁻.</li>
<li><strong>Alcalose respiratoire</strong> : PCO₂ ↓ (hyperventilation) → pH ↑. Causes : anxiété, altitude. Compensation rénale : ↓ réabsorption HCO₃⁻.</li>
<li><strong>Acidose métabolique</strong> : HCO₃⁻ ↓ → pH ↓. Causes : acidocétose diabétique, insuffisance rénale, diarrhée. Compensation respiratoire : hyperventilation (↓ PCO₂).</li>
<li><strong>Alcalose métabolique</strong> : HCO₃⁻ ↑ → pH ↑. Causes : vomissements, diurétiques. Compensation respiratoire : hypoventilation (↑ PCO₂).</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Acidose = pH < 7,38. Alcalose = pH > 7,42. Respiratoire = anomalie de PCO₂. Métabolique = anomalie de [HCO₃⁻]. La compensation ne normalise jamais complètement le pH (sinon c'est un trouble mixte).</p></div>`
    },
    {
      title: "Diagrammes de prédominance et calculs de pH",
      content: `<p class="mb-3">Les <strong>diagrammes de prédominance</strong> permettent de déterminer rapidement la forme majoritaire d'un couple acide/base en fonction du pH. Pour le couple HA/A⁻ :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Si pH < pKa : la forme acide HA prédomine ([HA] > [A⁻]).</li>
<li>Si pH = pKa : les deux formes sont en proportions égales ([HA] = [A⁻]).</li>
<li>Si pH > pKa : la forme basique A⁻ prédomine ([A⁻] > [HA]).</li>
</ul>
<p class="mb-3">Pour les <strong>acides aminés</strong>, qui possèdent au moins deux fonctions ionisables (α-COOH, pKa₁ ≈ 2 et α-NH₃⁺, pKa₂ ≈ 9), le diagramme fait apparaître trois formes : cation (pH < pKa₁), zwitterion (pKa₁ < pH < pKa₂) et anion (pH > pKa₂). Le <strong>point isoélectrique</strong> pI = (pKa₁ + pKa₂)/2 est le pH où la charge nette est nulle.</p>
<p class="mb-3">Les <strong>calculs de pH</strong> classiques du concours sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Acide fort</strong> (HCl, HNO₃) : pH = -log(C_a) si C_a > 10⁻⁶ M.</li>
<li><strong>Base forte</strong> (NaOH) : pH = 14 + log(C_b) si C_b > 10⁻⁶ M.</li>
<li><strong>Acide faible</strong> : pH = ½(pKa - log C_a), valable si C_a >> Ka et C_a >> Ke/Ka.</li>
<li><strong>Base faible</strong> : pH = ½(pKe + pKa + log C_b).</li>
<li><strong>Solution tampon</strong> : pH = pKa + log([A⁻]/[HA]) (Henderson-Hasselbalch).</li>
<li><strong>Mélange acide fort + acide faible</strong> : l'acide fort impose le pH si sa concentration est suffisante.</li>
</ul>
<p class="mb-3">Les <strong>titrages acido-basiques</strong> permettent de déterminer la concentration d'un acide ou d'une base par ajout progressif d'un réactif titrant de concentration connue. Le point d'équivalence correspond à la neutralisation complète. La courbe de titrage d'un acide faible présente un point d'inflexion à demi-équivalence où pH = pKa.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : pH < pKa → forme acide prédomine. pH > pKa → forme basique prédomine. Pour un acide faible : pH = ½(pKa - log C). À la demi-équivalence d'un titrage : pH = pKa. Le pI d'un acide aminé = (pKa₁ + pKa₂)/2.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  12. MÉDECINE NUCLÉAIRE                       */
/* ───────────────────────────────────────────── */
"biophysique-med-nucleaire": {
  introduction: "La médecine nucléaire utilise des traceurs radioactifs pour le diagnostic (scintigraphie, TEP) et le traitement (radiothérapie interne vectorisée) de nombreuses pathologies.",
  readTime: 18,
  sections: [
    {
      title: "Principes et traceurs radioactifs",
      content: `<p class="mb-3">La médecine nucléaire repose sur l'administration au patient d'un <strong>radiopharmaceutique</strong> (traceur radioactif) qui se fixe sur l'organe ou le tissu cible grâce à ses propriétés biologiques. Le rayonnement émis est détecté de l'extérieur pour former une image <strong>fonctionnelle</strong> (vs anatomique).</p>
<p class="mb-3">Le traceur idéal doit : émettre un rayonnement γ d'énergie adaptée à la détection (100-200 keV pour la scintigraphie), avoir une période assez courte pour limiter l'irradiation, se fixer spécifiquement sur la cible, et être disponible et peu coûteux.</p>
<p class="mb-3">Le <strong>⁹⁹ᵐTc</strong> (T₁/₂ = 6h, γ de 140 keV) est le radio-isotope le plus utilisé en scintigraphie. Il est produit par un <strong>générateur ⁹⁹Mo/⁹⁹ᵐTc</strong> (élution quotidienne). Le ⁹⁹ᵐTc est lié à différents vecteurs selon l'organe à explorer : HMDP (os), MIBI (cœur), DMSA (reins).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La médecine nucléaire donne une imagerie FONCTIONNELLE (métabolisme, perfusion, fixation) et non anatomique. Le ⁹⁹ᵐTc (6h, 140 keV) est le traceur roi de la scintigraphie.</p></div>`
    },
    {
      title: "Gamma-caméra et TEMP",
      content: `<p class="mb-3">La <strong>gamma-caméra</strong> (caméra d'Anger) détecte les photons γ émis par le patient. Ses composants sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Collimateur</strong> : grille de plomb à trous parallèles qui sélectionne la direction des photons. Détermine la résolution spatiale (mais élimine ~99 % des photons → faible sensibilité).</li>
<li><strong>Cristal scintillant</strong> : NaI(Tl), convertit les photons γ en photons lumineux (scintillation).</li>
<li><strong>Photomultiplicateurs</strong> : convertissent les photons lumineux en signal électrique amplifié.</li>
<li><strong>Électronique de localisation</strong> : calcule la position (x, y) et l'énergie du photon détecté.</li>
</ul>
<p class="mb-3">La <strong>TEMP</strong> (Tomographie d'Émission MonoPhotonique) utilise une gamma-caméra qui tourne autour du patient pour acquérir des projections sous différents angles, puis reconstruit des coupes tomographiques.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La gamma-caméra = collimateur + cristal NaI(Tl) + PM. Le collimateur est le facteur limitant : il assure la résolution directionnelle mais réduit énormément la sensibilité.</p></div>`
    },
    {
      title: "TEP (Tomographie par Émission de Positons)",
      content: `<p class="mb-3">La <strong>TEP</strong> détecte les émetteurs β⁺. Le positon émis parcourt quelques mm avant de s'annihiler avec un électron, produisant 2 photons γ de <strong>511 keV émis à 180°</strong>. La détection en <strong>coïncidence</strong> de ces deux photons permet de localiser l'annihilation sur une ligne (ligne de réponse) sans nécessiter de collimateur.</p>
<p class="mb-3">Le traceur TEP le plus utilisé est le <strong>¹⁸F-FDG</strong> (fluorodésoxyglucose, T₁/₂ = 110 min). Le FDG est un analogue du glucose capté par les cellules à métabolisme glucidique élevé (tumeurs, cerveau, inflammation). Il est phosphorylé en FDG-6-P mais ne peut pas poursuivre la glycolyse → il s'accumule dans les cellules.</p>
<p class="mb-3">La TEP a une meilleure <strong>résolution spatiale</strong> (~4 mm) et une meilleure <strong>sensibilité</strong> que la TEMP (pas de collimateur). La <strong>TEP-TDM</strong> combine l'imagerie fonctionnelle TEP et l'imagerie anatomique du scanner, permettant une localisation précise des anomalies métaboliques.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : TEP = détection en coïncidence de 2 photons de 511 keV à 180°. Le ¹⁸F-FDG s'accumule dans les cellules à fort métabolisme glucidique. La TEP-TDM est l'examen de référence en oncologie pour le bilan d'extension.</p></div>`
    },
    {
      title: "Radiothérapie interne vectorisée",
      content: `<p class="mb-3">La <strong>radiothérapie interne vectorisée</strong> (RIV) utilise des radio-isotopes émetteurs de particules (β⁻, α) couplés à un vecteur biologique pour irradier sélectivement les cellules tumorales.</p>
<p class="mb-3">L'exemple historique est le traitement du cancer thyroïdien par l'<strong>¹³¹I</strong> (T₁/₂ = 8 j, β⁻ + γ). L'iode est naturellement capté par la thyroïde, et les cellules tumorales thyroïdiennes conservent cette capacité. Les β⁻ détruisent les cellules sur quelques mm de parcours.</p>
<p class="mb-3">Les <strong>thérapies α</strong> (²²³Ra pour les métastases osseuses, ²¹²Pb pour les tumeurs) sont en développement. Les particules α ont un parcours très court (~50 μm) mais un TLE élevé (transfert linéique d'énergie), causant des dommages irréparables à l'ADN des cellules ciblées avec une irradiation minimale des tissus sains.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La RIV couple un radio-isotope thérapeutique (émetteur β⁻ ou α) à un vecteur biologique. Le ¹³¹I pour la thyroïde est le prototype. Les thérapies α (parcours court, TLE élevé) sont l'avenir de la RIV ciblée.</p></div>`
    },
    {
      title: "Radioprotection du patient et du personnel en médecine nucléaire",
      content: `<p class="mb-3">En médecine nucléaire, la <strong>source de rayonnement est le patient lui-même</strong> après injection du radiopharmaceutique. Cela impose des mesures de radioprotection spécifiques, différentes de celles de la radiologie conventionnelle.</p>
<p class="mb-3">La <strong>dosimétrie du patient</strong> en médecine nucléaire repose sur le formalisme du MIRD (Medical Internal Radiation Dose). La dose absorbée par un organe cible est : D_cible = Σ(Ã_source × S(cible ← source)), où Ã est l'activité cumulée dans l'organe source et S le facteur S qui dépend du type de rayonnement, de la géométrie et de la masse des organes.</p>
<p class="mb-3">Les <strong>niveaux de référence diagnostiques</strong> (NRD) fixent les activités injectées typiques pour chaque examen :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Scintigraphie osseuse</strong> (⁹⁹ᵐTc-HMDP) : ~700 MBq, dose efficace ~4 mSv.</li>
<li><strong>Scintigraphie myocardique</strong> (⁹⁹ᵐTc-MIBI) : ~700 MBq, dose efficace ~8 mSv.</li>
<li><strong>TEP-TDM au ¹⁸F-FDG</strong> : ~3 MBq/kg, dose efficace ~7-10 mSv (TEP + scanner).</li>
<li><strong>Scintigraphie thyroïdienne</strong> (⁹⁹ᵐTc) : ~100 MBq, dose efficace ~1 mSv.</li>
</ul>
<p class="mb-3">La <strong>radioprotection du personnel</strong> en service de médecine nucléaire comprend :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Distance</strong> : manipulation à l'aide de pinces longues, éloignement du patient injecté.</li>
<li><strong>Écrans</strong> : protège-seringues en plomb ou tungstène, écrans plombés de préparation, paravents mobiles.</li>
<li><strong>Temps</strong> : limiter la durée de contact avec les sources et les patients.</li>
<li><strong>Contamination</strong> : port de gants, blouses, dosimétrie individuelle (film badge, dosimètre thermoluminescent), contrôle des surfaces par frottis.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : En médecine nucléaire, le patient est la source irradiante. Le formalisme MIRD permet de calculer la dose interne. Les NRD fixent les activités de référence. La radioprotection du personnel repose sur distance, écrans, temps et gestion de la contamination.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  13. ECG                                      */
/* ───────────────────────────────────────────── */
"biophysique-ecg": {
  introduction: "L'électrocardiogramme (ECG) est l'enregistrement de l'activité électrique du cœur à la surface du corps. C'est l'examen le plus pratiqué en cardiologie, non invasif, rapide et riche en informations diagnostiques.",
  readTime: 18,
  sections: [
    {
      title: "Bases électrophysiologiques cardiaques",
      content: `<p class="mb-3">Le cœur possède un système de conduction électrique propre. L'impulsion naît dans le <strong>nœud sinusal</strong> (oreillette droite), se propage aux oreillettes, traverse le <strong>nœud auriculo-ventriculaire</strong> (NAV), puis emprunte le <strong>faisceau de His</strong> et les <strong>fibres de Purkinje</strong> pour dépolariser les ventricules.</p>
<p class="mb-3">Le <strong>potentiel d'action cardiaque</strong> ventriculaire est long (~300 ms) et comprend 5 phases : phase 0 (dépolarisation rapide, canaux Na⁺), phase 1 (repolarisation initiale), phase 2 (plateau, canaux Ca²⁺ de type L), phase 3 (repolarisation finale, canaux K⁺) et phase 4 (repos). Le plateau calcique est la particularité du PA cardiaque et empêche le tétanos musculaire.</p>
<p class="mb-3">Le nœud sinusal possède un <strong>automatisme</strong> (dépolarisation diastolique spontanée de la phase 4) qui impose sa fréquence (~70 bpm) à tout le cœur. Le NAV ralentit la conduction (~120 ms de délai) pour permettre le remplissage ventriculaire.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'automatisme sinusal impose le rythme cardiaque. Le plateau calcique (phase 2) est spécifique au PA cardiaque et couple excitation-contraction. Le délai au NAV assure la synchronisation auriculo-ventriculaire.</p></div>`
    },
    {
      title: "Dérivations et triangle d'Einthoven",
      content: `<p class="mb-3">L'ECG standard à 12 dérivations explore l'activité électrique cardiaque sous 12 angles différents :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>6 dérivations frontales</strong> : 3 bipolaires (DI, DII, DIII = triangle d'Einthoven) et 3 unipolaires augmentées (aVR, aVL, aVF).</li>
<li><strong>6 dérivations précordiales</strong> : V1 à V6 (plan horizontal), explorent la paroi antérieure du cœur de droite à gauche.</li>
</ul>
<p class="mb-3">Le <strong>triangle d'Einthoven</strong> est un triangle équilatéral formé par les trois dérivations bipolaires. La <strong>loi d'Einthoven</strong> stipule que DII = DI + DIII (les potentiels sont algébriques). Cette loi permet de vérifier la cohérence de l'enregistrement.</p>
<p class="mb-3">Chaque dérivation « voit » le cœur sous un angle particulier. Le <strong>vecteur cardiaque</strong> instantané est la résultante de tous les dipôles élémentaires actifs à un instant donné. Sa projection sur l'axe de chaque dérivation donne le voltage enregistré.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : DII = DI + DIII (loi d'Einthoven). L'ECG standard = 12 dérivations (6 frontales + 6 précordiales). Chaque dérivation est la projection du vecteur cardiaque sur un axe spécifique.</p></div>`
    },
    {
      title: "Tracé ECG normal : ondes, segments et intervalles",
      content: `<p class="mb-3">Un cycle cardiaque normal sur l'ECG comprend :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Onde P</strong> : dépolarisation auriculaire (durée < 120 ms, amplitude < 2,5 mm).</li>
<li><strong>Intervalle PR</strong> : du début de P au début de QRS. Reflète le temps de conduction auriculo-ventriculaire (120-200 ms). Un PR > 200 ms = bloc AV du 1er degré.</li>
<li><strong>Complexe QRS</strong> : dépolarisation ventriculaire (durée < 120 ms). Q = première déflexion négative, R = première positive, S = négative après R.</li>
<li><strong>Segment ST</strong> : entre la fin de QRS et le début de T. Normalement isoélectrique. Un sus-décalage = infarctus en phase aiguë. Un sous-décalage = ischémie.</li>
<li><strong>Onde T</strong> : repolarisation ventriculaire. Normalement positive dans la plupart des dérivations.</li>
<li><strong>Intervalle QT</strong> : de QRS à la fin de T. Représente la systole électrique ventriculaire. Le QTc (corrigé par la FC) doit être < 440 ms.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : P = oreillettes, QRS = ventricules (dépolarisation), T = ventricules (repolarisation). PR = 120-200 ms, QRS < 120 ms. Vitesse de défilement standard : 25 mm/s (1 mm = 40 ms).</p></div>`
    },
    {
      title: "Axe électrique et principales anomalies",
      content: `<p class="mb-3">L'<strong>axe électrique du cœur</strong> est la direction moyenne du vecteur de dépolarisation ventriculaire dans le plan frontal. L'axe normal est entre -30° et +90°. On le détermine en cherchant la dérivation frontale où QRS est le plus positif (l'axe pointe dans cette direction) ou isoélectrique (l'axe est perpendiculaire à cette dérivation).</p>
<p class="mb-3">Déviation axiale gauche (< -30°) : hypertrophie ventriculaire gauche, hémibloc antérieur gauche. Déviation axiale droite (> +90°) : hypertrophie ventriculaire droite, embolie pulmonaire.</p>
<p class="mb-3">Principales anomalies ECG :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Fibrillation auriculaire</strong> : absence d'ondes P, rythme irrégulier, ligne de base oscillante.</li>
<li><strong>Blocs de branche</strong> : QRS > 120 ms, retard d'activation d'un ventricule (aspect RSR' en V1 pour le bloc droit).</li>
<li><strong>Syndrome coronarien aigu</strong> : sus-décalage ST (infarctus transmural), sous-décalage ST (ischémie sous-endocardique), ondes T inversées.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Axe normal entre -30° et +90°. L'axe se détermine à partir des dérivations frontales (DI, DII, DIII, aVR, aVL, aVF). Un sus-décalage ST systématisé = urgence coronarienne (STEMI).</p></div>`
    },
    {
      title: "Vecteur cardiaque instantané et analyse vectorielle de l'ECG",
      content: `<p class="mb-3">À chaque instant du cycle cardiaque, l'ensemble des cellules myocardiques en cours de dépolarisation ou de repolarisation peut être représenté par un <strong>vecteur cardiaque instantané</strong> (VCI). Ce vecteur est la somme vectorielle de tous les dipôles élémentaires actifs à cet instant.</p>
<p class="mb-3">Au cours de la dépolarisation ventriculaire, le VCI suit une trajectoire caractéristique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Vecteur septal</strong> (premiers 20 ms) : dépolarisation du septum de gauche à droite → onde Q en DI et q en V5-V6.</li>
<li><strong>Vecteur pariétal</strong> (20-60 ms) : dépolarisation des parois libres → onde R ample, vecteur dirigé vers la gauche et en bas (QRS positif en DI, DII, V5-V6).</li>
<li><strong>Vecteur basal</strong> (60-80 ms) : dépolarisation des bases ventriculaires → onde S en V5-V6.</li>
</ul>
<p class="mb-3">La <strong>zone de transition</strong> précordiale est la dérivation où R = S (passage de QRS négatif en V1 à QRS positif en V6). Normalement entre V3 et V4. Un décalage de la transition traduit une rotation du cœur ou une hypertrophie ventriculaire. La <strong>boucle vectocardiographique</strong> QRS représente le trajet complet du VCI dans les trois plans de l'espace et contient plus d'informations que l'ECG standard.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le VCI tourne au cours du cycle cardiaque : septal (droite) → pariétal (gauche/bas) → basal. La zone de transition V3-V4 marque le passage de QRS négatif à positif dans les précordiales. L'ECG est une projection temporelle du vectocardiogramme.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  14. EEG                                      */
/* ───────────────────────────────────────────── */
"biophysique-eeg": {
  introduction: "L'électroencéphalogramme (EEG) enregistre l'activité électrique cérébrale à la surface du scalp. C'est un examen non invasif essentiel pour le diagnostic de l'épilepsie, l'étude du sommeil et la surveillance neurologique.",
  readTime: 18,
  sections: [
    {
      title: "Origine du signal EEG",
      content: `<p class="mb-3">Le signal EEG provient principalement des <strong>potentiels post-synaptiques</strong> (PPS) des neurones pyramidaux du cortex. Ces neurones sont orientés perpendiculairement à la surface corticale et créent des dipôles électriques lorsqu'ils sont activés.</p>
<p class="mb-3">Un neurone isolé génère un signal trop faible pour être détecté en surface. L'EEG capte l'activité <strong>synchrone</strong> de milliers de neurones pyramidaux d'une même zone. Les PPS excitateurs (PPSE) et inhibiteurs (PPSI) se superposent pour créer le signal mesuré.</p>
<p class="mb-3">L'amplitude du signal EEG est très faible (10-100 μV), bien inférieure à l'ECG (~1 mV), car les signaux sont atténués par les méninges, le LCR, l'os du crâne et le scalp. Le rapport signal/bruit est amélioré par le <strong>moyennage</strong> (potentiels évoqués) et le <strong>filtrage</strong> (0,5-30 Hz typiquement).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'EEG reflète les PPS (pas les PA) des neurones pyramidaux corticaux. L'amplitude est très faible (μV) car le signal est atténué par les structures intermédiaires. La synchronisation de milliers de neurones est nécessaire pour obtenir un signal détectable.</p></div>`
    },
    {
      title: "Système 10-20 et rythmes cérébraux",
      content: `<p class="mb-3">Le <strong>système international 10-20</strong> standardise le placement des électrodes. Les distances sont 10 % ou 20 % de la distance entre des repères anatomiques (nasion, inion, points pré-auriculaires). Les électrodes sont nommées par la région (F = frontal, C = central, P = pariétal, O = occipital, T = temporal) et un chiffre (impair = gauche, pair = droite, z = ligne médiane).</p>
<p class="mb-3">Les rythmes EEG normaux se classent par fréquence :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Delta (δ)</strong> : 0,5-4 Hz. Sommeil profond, pathologique à l'éveil chez l'adulte.</li>
<li><strong>Thêta (θ)</strong> : 4-8 Hz. Somnolence, endormissement, normal chez l'enfant.</li>
<li><strong>Alpha (α)</strong> : 8-13 Hz. Repos éveillé, yeux fermés, surtout occipital. Disparaît à l'ouverture des yeux (<strong>réaction d'arrêt</strong>).</li>
<li><strong>Bêta (β)</strong> : 13-30 Hz. Activité mentale, concentration, régions frontales. Faible amplitude.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le rythme alpha (8-13 Hz, occipital, yeux fermés) est le rythme de base de l'adulte éveillé au repos. Sa disparition à l'ouverture des yeux (réaction d'arrêt) est un signe de normalité.</p></div>`
    },
    {
      title: "Applications cliniques de l'EEG",
      content: `<p class="mb-3">Les principales indications de l'EEG sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Épilepsie</strong> : détection d'activités paroxystiques (pointes, pointes-ondes, ondes lentes) inter-critiques et critiques. Les décharges pointe-onde à 3 Hz sont caractéristiques des absences typiques.</li>
<li><strong>Étude du sommeil</strong> (polysomnographie) : distinction des stades de sommeil (N1, N2, N3, REM). Les fuseaux de sommeil (12-14 Hz) et les complexes K caractérisent le stade N2.</li>
<li><strong>Surveillance en réanimation</strong> : détection d'un état de mal épileptique non convulsif, encéphalopathies.</li>
<li><strong>Diagnostic de mort cérébrale</strong> : un tracé EEG plat (absence d'activité pendant 30 min) est l'un des critères de mort encéphalique.</li>
</ul>
<p class="mb-3">Les <strong>potentiels évoqués</strong> (PE) sont des modifications de l'EEG en réponse à une stimulation sensorielle (visuelle, auditive, somesthésique). Le moyennage de nombreux essais permet d'extraire le PE du bruit de fond EEG.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Pointes-ondes à 3 Hz = absences typiques. EEG plat = critère de mort cérébrale. Les potentiels évoqués utilisent le moyennage pour améliorer le rapport signal/bruit.</p></div>`
    },
    {
      title: "Traitement du signal EEG et analyse spectrale",
      content: `<p class="mb-3">Le signal EEG brut est un mélange complexe de plusieurs composantes fréquentielles. L'<strong>analyse spectrale</strong> par transformée de Fourier (FFT) décompose le signal temporel en ses composantes fréquentielles, produisant un <strong>spectre de puissance</strong> qui quantifie l'énergie dans chaque bande de fréquence.</p>
<p class="mb-3">Les paramètres spectraux cliniquement pertinents sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Fréquence médiane</strong> (SEF50) : fréquence en dessous de laquelle se trouve 50 % de la puissance totale. Diminue avec la profondeur d'anesthésie.</li>
<li><strong>Fréquence spectrale de bord</strong> (SEF95) : fréquence en dessous de laquelle se trouve 95 % de la puissance. Normalement ~25 Hz chez l'adulte éveillé.</li>
<li><strong>Rapport de puissance</strong> : le rapport alpha/delta ou thêta/alpha change avec l'état de vigilance et les pathologies.</li>
</ul>
<p class="mb-3">Le <strong>filtrage numérique</strong> est essentiel pour éliminer les artefacts : filtre passe-haut (> 0,5 Hz, élimine la dérive de ligne de base), filtre passe-bas (< 30-70 Hz, élimine le bruit musculaire haute fréquence), filtre coupe-bande (50 Hz, élimine le bruit secteur). Les artefacts musculaires (EMG), oculaires (EOG) et cardiaques (ECG) contaminent fréquemment l'EEG et nécessitent des techniques de rejet spécifiques comme l'<strong>analyse en composantes indépendantes</strong> (ICA).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La FFT décompose l'EEG en composantes fréquentielles. La SEF95 diminue avec l'anesthésie. Le filtre coupe-bande à 50 Hz élimine l'artefact du courant secteur. L'ICA permet de séparer les sources corticales des artefacts.</p></div>`
    },
    {
      title: "Magnétoencéphalographie et techniques avancées",
      content: `<p class="mb-3">La <strong>magnétoencéphalographie</strong> (MEG) mesure les champs magnétiques (10⁻¹³ à 10⁻¹² T, soit ~100 fT) produits par les courants ioniques intracellulaires des neurones pyramidaux. Ces champs sont détectés par des <strong>SQUIDs</strong> (Superconducting Quantum Interference Devices) refroidis à l'hélium liquide (4 K).</p>
<p class="mb-3">Avantages de la MEG par rapport à l'EEG :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Résolution spatiale supérieure</strong> (~2-3 mm vs ~10 mm) : les champs magnétiques ne sont pas déformés par le crâne et le scalp, contrairement aux potentiels électriques.</li>
<li><strong>Sensibilité aux sources tangentielles</strong> : la MEG détecte préférentiellement les dipôles tangentiels (sillons corticaux), complémentaire de l'EEG qui détecte mieux les dipôles radiaux (gyri).</li>
<li><strong>Résolution temporelle identique</strong> : ~1 ms, bien supérieure à l'IRMf (~1 s).</li>
</ul>
<p class="mb-3">Le <strong>problème inverse</strong> en EEG/MEG consiste à localiser les sources cérébrales à partir des signaux de surface. Ce problème est mathématiquement mal posé (solutions multiples). Les méthodes de résolution utilisent des modèles de sources (dipôle équivalent, distributions de courant) et des contraintes anatomiques issues de l'IRM. L'<strong>EEG haute densité</strong> (64-256 électrodes) améliore la résolution spatiale et la précision de la localisation de source.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La MEG mesure les champs magnétiques cérébraux (~100 fT) avec des SQUIDs. Elle a une meilleure résolution spatiale que l'EEG car les champs magnétiques ne sont pas déformés par le crâne. Le problème inverse est mal posé : il n'a pas de solution unique.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  15. LASER                                    */
/* ───────────────────────────────────────────── */
"biophysique-laser": {
  introduction: "Le LASER (Light Amplification by Stimulated Emission of Radiation) est un dispositif produisant un faisceau de lumière cohérente, monochromatique et directif. Ses applications médicales vont de la chirurgie à la thérapie photodynamique.",
  readTime: 18,
  sections: [
    {
      title: "Principes physiques du laser",
      content: `<p class="mb-3">Le laser repose sur trois phénomènes d'interaction photon-matière :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Absorption</strong> : un photon excite un atome du niveau fondamental E₁ vers un niveau excité E₂ (E₂ - E₁ = hν).</li>
<li><strong>Émission spontanée</strong> : l'atome excité retourne spontanément au niveau fondamental en émettant un photon dans une direction aléatoire.</li>
<li><strong>Émission stimulée</strong> : un photon incident provoque la désexcitation d'un atome excité, produisant un second photon <strong>identique</strong> (même fréquence, phase, direction et polarisation). C'est le mécanisme clé du laser.</li>
</ul>
<p class="mb-3">Pour que l'émission stimulée prédomine sur l'absorption, il faut réaliser une <strong>inversion de population</strong> (plus d'atomes dans l'état excité que dans l'état fondamental). Ceci est obtenu par un <strong>pompage</strong> (optique, électrique ou chimique) du milieu actif. La cavité résonante (deux miroirs) assure l'amplification par aller-retour des photons.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'émission stimulée produit un photon identique au photon incident → cohérence. L'inversion de population est la condition nécessaire au fonctionnement du laser. Le pompage maintient cette inversion.</p></div>`
    },
    {
      title: "Propriétés du faisceau laser",
      content: `<p class="mb-3">Le faisceau laser possède des propriétés uniques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Monochromaticité</strong> : une seule longueur d'onde (vs spectre large pour les sources classiques). Permet de cibler des chromophores spécifiques.</li>
<li><strong>Cohérence spatiale et temporelle</strong> : tous les photons sont en phase. Permet les interférences (holographie) et la focalisation extrême.</li>
<li><strong>Directivité</strong> : faible divergence du faisceau. Permet le transport par fibres optiques et la focalisation sur des spots très petits (quelques μm).</li>
<li><strong>Puissance élevée</strong> : la focalisation concentre l'énergie sur une très petite surface → densités de puissance considérables (MW/cm²).</li>
</ul>
<p class="mb-3">Les principaux types de lasers médicaux sont : CO₂ (10,6 μm, IR, chirurgie), Nd:YAG (1064 nm, IR, coagulation profonde), argon (488/514 nm, visible, rétine), excimère (193 nm, UV, chirurgie réfractive cornéenne), diode (800-980 nm, IR).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Monochromatique + cohérent + directif = les 3 propriétés distinctives du laser. La longueur d'onde détermine l'interaction avec les tissus (absorption sélective par les chromophores).</p></div>`
    },
    {
      title: "Interactions laser-tissus et applications médicales",
      content: `<p class="mb-3">L'effet du laser sur les tissus dépend de la <strong>longueur d'onde</strong> (absorption par les chromophores), de la <strong>densité de puissance</strong> et de la <strong>durée d'exposition</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Effet photochimique</strong> (faible puissance, longue durée) : réactions chimiques induites par la lumière. Thérapie photodynamique (PDT) : un photosensibilisateur injecté s'accumule dans la tumeur et, activé par le laser, produit des radicaux libres cytotoxiques.</li>
<li><strong>Effet thermique</strong> (puissance modérée) : échauffement des tissus. Selon la température : coagulation (60-100°C), vaporisation (> 100°C), carbonisation (> 300°C). Utilisé en chirurgie, ophtalmologie (photocoagulation rétinienne).</li>
<li><strong>Effet photoablatif</strong> (UV, excimère) : rupture directe des liaisons moléculaires sans effet thermique. Chirurgie réfractive LASIK.</li>
<li><strong>Effet photomécanique</strong> (impulsions ultra-courtes, ns-ps) : onde de choc par expansion plasma. Lithotripsie laser (calculs urinaires), capsulotomie YAG.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'effet dépend de la puissance et de la durée : photochimique (faible/long) → thermique → ablatif → mécanique (fort/court). Les chromophores tissulaires (eau, mélanine, hémoglobine) déterminent l'absorption à chaque λ.</p></div>`
    },
    {
      title: "Sécurité laser et classification des risques",
      content: `<p class="mb-3">Les lasers présentent des risques spécifiques qui ont conduit à une <strong>classification internationale</strong> (norme IEC 60825) en fonction de la puissance émise et du risque pour les yeux et la peau :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Classe 1</strong> : sans danger dans toutes les conditions d'utilisation (lecteurs CD, imprimantes laser).</li>
<li><strong>Classe 2</strong> : visible (400-700 nm), puissance < 1 mW. Le réflexe de clignement (0,25 s) protège l'œil.</li>
<li><strong>Classe 3R</strong> : danger modéré pour l'œil en vision directe. Puissance 1-5 mW (pointeurs laser).</li>
<li><strong>Classe 3B</strong> : dangereux pour l'œil, même par réflexion diffuse à courte distance. Puissance 5-500 mW.</li>
<li><strong>Classe 4</strong> : dangereux pour l'œil et la peau, même par réflexion diffuse. Puissance > 500 mW. Tous les lasers chirurgicaux sont de classe 4.</li>
</ul>
<p class="mb-3">L'œil est l'organe le plus vulnérable car le système optique oculaire concentre le faisceau sur la rétine (facteur de concentration ~10⁵). Un laser visible de 1 mW produit une irradiance rétinienne ~100 W/cm². Les mesures de protection comprennent : lunettes spécifiques (filtrant la λ du laser utilisé), signalisation, accès contrôlé, formation du personnel et <strong>Laser Safety Officer</strong> (personne compétente en radioprotection laser).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Les lasers médicaux sont de classe 4 (les plus dangereux). L'œil est l'organe le plus à risque car il concentre le faisceau ×10⁵ sur la rétine. Les lunettes de protection doivent être spécifiques à la longueur d'onde du laser utilisé.</p></div>`
    },
    {
      title: "Applications spécialisées : thérapie photodynamique et laser en ophtalmologie",
      content: `<p class="mb-3">La <strong>thérapie photodynamique</strong> (PDT) est une technique anticancéreuse combinant trois éléments : un <strong>photosensibilisateur</strong> (PS), la <strong>lumière laser</strong> à une longueur d'onde spécifique et l'<strong>oxygène</strong> tissulaire. Le PS (porphyrines, chlorines, phtalocyanines) est injecté par voie IV et s'accumule préférentiellement dans les cellules tumorales (24-72 h).</p>
<p class="mb-3">L'activation du PS par le laser produit des <strong>espèces réactives de l'oxygène</strong> (ERO), notamment l'oxygène singulet (¹O₂), hautement cytotoxique. Le mécanisme photochimique suit deux voies :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Type I</strong> : transfert d'électron → radicaux libres (O₂⁻•, OH•) → dommages oxydatifs.</li>
<li><strong>Type II</strong> (majoritaire) : transfert d'énergie au O₂ → oxygène singulet ¹O₂ → oxydation des lipides, protéines et ADN.</li>
</ul>
<p class="mb-3">En <strong>ophtalmologie</strong>, les lasers sont omniprésents : le laser argon (514 nm) réalise la <strong>photocoagulation rétinienne</strong> dans la rétinopathie diabétique (coagulation des néovaisseaux). Le laser YAG (1064 nm) réalise la <strong>capsulotomie postérieure</strong> après chirurgie de la cataracte (effet photomécanique). Le laser excimère ArF (193 nm) sculpte la cornée en <strong>chirurgie réfractive LASIK</strong> (effet photoablatif, ablation de 0,25 μm par impulsion). Le laser femtoseconde est utilisé pour la découpe du volet cornéen avec une précision micrométrique.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La PDT utilise un photosensibilisateur + lumière + O₂ pour produire de l'oxygène singulet ¹O₂ (type II). En ophtalmologie : argon = photocoagulation rétinienne, excimère = LASIK (photoablatif), YAG = capsulotomie (photomécanique).</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  16. DOSIMÉTRIE ET RADIOBIOLOGIE              */
/* ───────────────────────────────────────────── */
"biophysique-dosimetrie-radiobio": {
  introduction: "La dosimétrie quantifie l'énergie déposée par les rayonnements ionisants dans la matière vivante. La radiobiologie étudie les effets biologiques de ces rayonnements et fonde les principes de la radioprotection et de la radiothérapie.",
  readTime: 20,
  sections: [
    {
      title: "Grandeurs dosimétriques fondamentales",
      content: `<p class="mb-3">Les principales grandeurs dosimétriques sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dose absorbée D</strong> (Gray, Gy) : énergie déposée par unité de masse. D = dE/dm. 1 Gy = 1 J/kg.</li>
<li><strong>Dose équivalente H</strong> (Sievert, Sv) : H = D × w_R, où w_R est le facteur de pondération du rayonnement. w_R = 1 pour les photons et électrons, 20 pour les α, 2-20 pour les neutrons.</li>
<li><strong>Dose efficace E</strong> (Sievert, Sv) : E = Σ(w_T × H_T), où w_T est le facteur de pondération tissulaire. Les gonades (w_T = 0,08), le sein (0,12), la moelle rouge (0,12) et le poumon (0,12) sont les organes les plus sensibles.</li>
<li><strong>Kerma K</strong> (Gy) : énergie cinétique des particules chargées libérées par les photons par unité de masse. Pour les photons de basse énergie, K ≈ D.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : D (Gy) = énergie physique. H (Sv) = D × w_R prend en compte le type de rayonnement. E (Sv) = Σ(w_T × H_T) prend en compte la sensibilité des organes. 1 Gy de rayons α = 20 Sv (car w_R = 20).</p></div>`
    },
    {
      title: "Transfert linéique d'énergie et efficacité biologique",
      content: `<p class="mb-3">Le <strong>TEL</strong> (Transfert Linéique d'Énergie) ou LET est l'énergie déposée par unité de longueur de parcours (keV/μm). Il caractérise la « densité d'ionisation » le long de la trajectoire.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Faible TEL</strong> (< 10 keV/μm) : photons, électrons. Ionisations dispersées. Dommages ADN réparables.</li>
<li><strong>TEL élevé</strong> (> 10 keV/μm) : α, neutrons, ions lourds. Ionisations denses. Dommages ADN complexes, souvent irréparables (cassures double-brin regroupées).</li>
</ul>
<p class="mb-3">L'<strong>Efficacité Biologique Relative</strong> (EBR) compare l'effet biologique d'un rayonnement testé à celui d'un rayonnement de référence (photons γ du ⁶⁰Co) : EBR = D_réf/D_test pour un même effet biologique. L'EBR augmente avec le TEL jusqu'à un optimum (~100 keV/μm) puis diminue (effet de « gaspillage » d'énergie).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : TEL élevé → ionisations denses → dommages ADN complexes → EBR élevée. Les particules α (TEL ~100 keV/μm) ont une EBR maximale. C'est pourquoi w_R = 20 pour les α.</p></div>`
    },
    {
      title: "Effets biologiques des rayonnements ionisants",
      content: `<p class="mb-3">Les rayonnements ionisants agissent sur les cellules par deux mécanismes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Effet direct</strong> (~30 %) : le rayonnement endommage directement la cible biologique (ADN).</li>
<li><strong>Effet indirect</strong> (~70 %) : le rayonnement ionise l'eau, produisant des radicaux libres (OH•, H•, e⁻ₐq) qui diffusent et endommagent l'ADN. Cet effet est réduit en hypoxie (effet oxygène).</li>
</ul>
<p class="mb-3">Les lésions de l'ADN incluent : cassures simple-brin (facilement réparées), cassures double-brin (potentiellement létales), lésions de bases, pontages ADN-protéines. La cellule répond par la réparation (fidèle ou fautive), l'apoptose, ou la sénescence.</p>
<p class="mb-3">On distingue les <strong>effets déterministes</strong> (dose-seuil, gravité proportionnelle à la dose : érythème, cataracte, stérilité) et les <strong>effets stochastiques</strong> (sans seuil, probabilité proportionnelle à la dose : cancers, effets héréditaires). Le modèle linéaire sans seuil (LNT) est utilisé en radioprotection pour les effets stochastiques.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'effet indirect (radicalaire) est majoritaire. L'oxygène potentialise les lésions (OER ≈ 3 pour les photons). Les effets déterministes ont un seuil, les stochastiques sont modélisés sans seuil (LNT).</p></div>`
    },
    {
      title: "Courbes de survie cellulaire et modèle linéaire-quadratique",
      content: `<p class="mb-3">La <strong>courbe de survie cellulaire</strong> représente la fraction de cellules survivantes S en fonction de la dose D. Le modèle <strong>linéaire-quadratique</strong> (LQ) est le plus utilisé : S = e⁻(αD + βD²).</p>
<p class="mb-3">Le terme αD (linéaire) domine à faible dose et représente les lésions létales par un seul événement (cassures double-brin directes). Le terme βD² (quadratique) domine à forte dose et représente l'accumulation de deux lésions sublétales qui se combinent.</p>
<p class="mb-3">Le rapport <strong>α/β</strong> (en Gy) est l'inverse de la dose où les composantes linéaire et quadratique contribuent également. Tissus à réponse précoce (tumeurs, muqueuses) : α/β ≈ 10 Gy. Tissus à réponse tardive (moelle, cerveau) : α/β ≈ 3 Gy. Le fractionnement de la dose protège les tissus tardifs (faible α/β) plus que les tumeurs (fort α/β).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : S = e⁻(αD + βD²). α/β élevé (tumeurs) = peu sensible au fractionnement. α/β bas (tissus tardifs) = très sensible au fractionnement. Le fractionnement en radiothérapie exploite cette différence pour protéger les tissus sains.</p></div>`
    },
    {
      title: "Fractionnement en radiothérapie et les 5 R de la radiobiologie",
      content: `<p class="mb-3">Le <strong>fractionnement</strong> de la dose en radiothérapie consiste à délivrer la dose totale en plusieurs séances (fractions) espacées dans le temps. Le schéma conventionnel est de 2 Gy par fraction, 5 fractions par semaine, pendant 5-7 semaines (dose totale 50-70 Gy).</p>
<p class="mb-3">L'intérêt du fractionnement repose sur les <strong>5 R de la radiobiologie</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Réparation</strong> : les cellules normales réparent mieux les lésions sublétales entre les fractions que les cellules tumorales (surtout les tissus à faible α/β). La réparation est quasi complète en 6-8 h.</li>
<li><strong>Redistribution (Reassortiment)</strong> : les cellules survivantes se redistribuent dans le cycle cellulaire. Les phases S (synthèse ADN) et G2 tardive sont les plus radiorésistantes, G2/M et G1 tardive les plus radiosensibles.</li>
<li><strong>Réoxygénation</strong> : entre les fractions, les cellules hypoxiques tumorales se réoxygènent (nécrose des cellules périphériques → meilleure vascularisation). L'oxygène augmente la radiosensibilité (OER ≈ 2,5-3 pour les photons).</li>
<li><strong>Repopulation</strong> : les cellules prolifèrent entre les fractions. Pour les tumeurs à croissance rapide, un traitement trop long permet la repopulation tumorale (effet négatif). Pour les tissus sains, la repopulation aide à la récupération.</li>
<li><strong>Radiosensibilité intrinsèque</strong> : variable selon le type cellulaire. Loi de Bergonié-Tribondeau : les cellules les plus radiosensibles sont celles qui se divisent le plus vite et sont les moins différenciées.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Les 5 R expliquent l'avantage du fractionnement : Réparation (tissus sains favorisés), Redistribution (resensibilisation cyclique), Réoxygénation (radiosensibilisation tumorale), Repopulation (double tranchant), Radiosensibilité intrinsèque. Schéma classique : 2 Gy/fraction, 5 fr/semaine.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  17. FLUIDES                                  */
/* ───────────────────────────────────────────── */
"biophysique-fluides": {
  introduction: "La mécanique des fluides étudie le comportement des liquides et des gaz. En biophysique, elle permet de comprendre la circulation sanguine, la ventilation pulmonaire et les échanges à travers les membranes.",
  readTime: 18,
  sections: [
    {
      title: "Statique des fluides et pression",
      content: `<p class="mb-3">La <strong>pression</strong> P = F/S est la force exercée par unité de surface (Pa = N/m²). Autres unités : 1 atm = 101 325 Pa = 760 mmHg = 1013 hPa. La pression artérielle systolique normale est ~120 mmHg ≈ 16 kPa.</p>
<p class="mb-3">Le <strong>théorème fondamental de l'hydrostatique</strong> stipule que dans un fluide au repos, la pression augmente avec la profondeur : P₂ - P₁ = ρgh, où ρ est la masse volumique du fluide, g l'accélération de la pesanteur et h la différence de hauteur.</p>
<p class="mb-3">Conséquence clinique : en position debout, la pression veineuse est plus élevée aux pieds (+90 mmHg) qu'au cœur. Cette pression hydrostatique contribue aux varices et aux œdèmes des membres inférieurs. Le <strong>principe de Pascal</strong> : toute variation de pression en un point d'un fluide est transmise intégralement à tous les points (base du brassard tensionnel).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : ΔP = ρgh. En position debout, la pression veineuse aux pieds ≈ 90 mmHg + pression veineuse centrale. Le retour veineux est assuré par les valvules, la pompe musculaire et la pression thoracique négative.</p></div>`
    },
    {
      title: "Dynamique des fluides parfaits : Bernoulli",
      content: `<p class="mb-3">Pour un fluide parfait (non visqueux, incompressible) en écoulement stationnaire, le <strong>théorème de Bernoulli</strong> s'applique : P + ½ρv² + ρgh = constante le long d'une ligne de courant.</p>
<p class="mb-3">Ce théorème exprime la conservation de l'énergie : pression (énergie potentielle de pression) + énergie cinétique + énergie potentielle de gravité = constante. Si la vitesse augmente (rétrécissement), la pression diminue et inversement.</p>
<p class="mb-3">Application : <strong>effet Venturi</strong> dans une sténose artérielle — la vitesse augmente dans le rétrécissement, la pression latérale diminue. En aval, la turbulence dissipe de l'énergie, d'où une chute de pression permanente. L'<strong>équation de continuité</strong> A₁v₁ = A₂v₂ lie la vitesse à la section du vaisseau : le sang accélère dans les sténoses et ralentit dans les capillaires (section totale maximale).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Bernoulli : P + ½ρv² + ρgh = constante. L'équation de continuité Av = constante explique que la vitesse du sang est minimale dans les capillaires (section totale ~3000 cm² vs 4 cm² pour l'aorte).</p></div>`
    },
    {
      title: "Fluides visqueux et loi de Poiseuille",
      content: `<p class="mb-3">La <strong>viscosité</strong> η (Pa·s) caractérise la résistance d'un fluide à l'écoulement. L'eau a η ≈ 10⁻³ Pa·s, le sang η ≈ 3-4 × 10⁻³ Pa·s (viscosité apparente, variable car le sang est non-newtonien).</p>
<p class="mb-3">La <strong>loi de Poiseuille</strong> donne le débit Q d'un fluide newtonien en écoulement laminaire dans un tube cylindrique : Q = πr⁴ΔP/(8ηL), où r est le rayon du tube, ΔP la différence de pression, η la viscosité et L la longueur.</p>
<p class="mb-3">La <strong>résistance vasculaire</strong> R = ΔP/Q = 8ηL/(πr⁴) est analogue à la résistance électrique (loi d'Ohm). Le rayon r intervient à la puissance 4 : une réduction de 50 % du rayon multiplie la résistance par 16. C'est pourquoi la vasoconstriction est le principal mécanisme de régulation de la pression artérielle.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Q = πr⁴ΔP/(8ηL). Le débit dépend de r⁴ : une petite variation de rayon a un effet considérable sur le débit. Halver le rayon divise le débit par 16 (multiplie la résistance par 16).</p></div>`
    },
    {
      title: "Nombre de Reynolds et régimes d'écoulement",
      content: `<p class="mb-3">Le <strong>nombre de Reynolds</strong> Re = ρvd/η est un nombre sans dimension qui détermine le régime d'écoulement :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Re < 2000</strong> : écoulement <strong>laminaire</strong>. Les lignes de courant sont parallèles, le profil de vitesse est parabolique (vitesse maximale au centre, nulle aux parois).</li>
<li><strong>Re > 3000</strong> : écoulement <strong>turbulent</strong>. Mouvements chaotiques, profil de vitesse aplati, dissipation d'énergie accrue, bruits (souffles).</li>
<li><strong>2000 < Re < 3000</strong> : régime de transition.</li>
</ul>
<p class="mb-3">Dans l'aorte, Re ≈ 2000-3000 au repos et peut dépasser 4000 à l'effort. Les turbulences au niveau d'une sténose ou d'une insuffisance valvulaire produisent des <strong>souffles</strong> audibles au stéthoscope. L'anémie (viscosité diminuée) et la fièvre (vasodilatation) favorisent aussi les turbulences.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Re = ρvd/η. Re > 3000 = turbulences = souffles audibles. Les sténoses augmentent v localement et diminuent d, ce qui peut créer des turbulences. L'anémie diminue η et augmente Re.</p></div>`
    },
    {
      title: "Rhéologie du sang et tension de surface",
      content: `<p class="mb-3">Le sang est un <strong>fluide non-newtonien</strong> : sa viscosité apparente varie avec le taux de cisaillement γ̇ (gradient de vitesse). À faible γ̇ (< 10 s⁻¹), les globules rouges forment des rouleaux (agrégation) et la viscosité augmente fortement. À γ̇ élevé (> 100 s⁻¹), les GR se déforment et s'alignent dans le flux, la viscosité diminue et tend vers une valeur plateau (~3-4 mPa·s). Ce comportement est dit <strong>rhéofluidifiant</strong> (shear-thinning).</p>
<p class="mb-3">La viscosité sanguine dépend de plusieurs facteurs :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Hématocrite</strong> : principal déterminant. La viscosité augmente exponentiellement avec l'hématocrite. Polyglobulie (Ht > 55 %) → hyperviscosité → risque thrombotique.</li>
<li><strong>Déformabilité des GR</strong> : les GR normaux se déforment pour passer dans les capillaires (∅ 5-8 μm). Les drépanocytes (GR falciformes) sont rigides → augmentation de la viscosité.</li>
<li><strong>Effet Fåhraeus-Lindqvist</strong> : dans les petits vaisseaux (∅ < 300 μm), la viscosité apparente diminue car les GR migrent vers le centre, laissant une couche marginale de plasma moins visqueux.</li>
</ul>
<p class="mb-3">La <strong>tension de surface</strong> σ (N/m) est la force par unité de longueur à l'interface liquide-gaz. Dans les alvéoles pulmonaires, le <strong>surfactant</strong> réduit la tension de surface de 70 mN/m (eau pure) à ~25 mN/m, empêchant le collapsus alvéolaire. La loi de Laplace ΔP = 2σ/r montre que sans surfactant, les petites alvéoles (rayon r petit) auraient une pression interne trop élevée et se videraient dans les grandes.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le sang est rhéofluidifiant (viscosité diminue quand le cisaillement augmente). L'hématocrite est le principal déterminant de la viscosité sanguine. Le surfactant pulmonaire réduit la tension de surface et prévient le collapsus alvéolaire (loi de Laplace : ΔP = 2σ/r).</p></div>`
    }
  ]
},


/* ───────────────────────────────────────────── */
/*  18. BIOÉNERGÉTIQUE                           */
/* ───────────────────────────────────────────── */
"biophysique-bioenergetique": {
  introduction: "La bioénergétique étudie les transformations d'énergie dans les systèmes biologiques. Elle analyse le métabolisme énergétique cellulaire, la phosphorylation oxydative et les bilans énergétiques de l'organisme.",
  readTime: 18,
  sections: [
    {
      title: "Métabolisme énergétique et rendement",
      content: `<p class="mb-3">Le <strong>métabolisme</strong> est l'ensemble des réactions chimiques qui se déroulent dans l'organisme. Le <strong>catabolisme</strong> dégrade les molécules (libère de l'énergie) et l'<strong>anabolisme</strong> les synthétise (consomme de l'énergie).</p>
<p class="mb-3">Les substrats énergétiques ont des valeurs caloriques différentes : glucides ~17 kJ/g (4 kcal/g), lipides ~38 kJ/g (9 kcal/g), protéines ~17 kJ/g (4 kcal/g). Les lipides sont les plus énergétiques car ils sont plus réduits (plus d'hydrogène par carbone).</p>
<p class="mb-3">Le <strong>quotient respiratoire</strong> QR = VCO₂/VO₂ renseigne sur le substrat oxydé : QR = 1 pour les glucides, QR = 0,7 pour les lipides, QR = 0,8 pour les protéines. En pratique, le QR mixte est ~0,85 pour un régime alimentaire équilibré.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Les lipides fournissent ~38 kJ/g (2× plus que glucides/protéines). Le QR permet d'identifier le substrat utilisé : QR = 1 → glucides purs, QR = 0,7 → lipides purs.</p></div>`
    },
    {
      title: "Phosphorylation oxydative et chaîne respiratoire",
      content: `<p class="mb-3">La <strong>chaîne respiratoire mitochondriale</strong> est constituée de 4 complexes (I à IV) et de 2 transporteurs mobiles (ubiquinone et cytochrome c) localisés dans la membrane interne mitochondriale. Les électrons du NADH et du FADH₂ sont transférés le long de la chaîne jusqu'à l'O₂ (accepteur final), qui est réduit en H₂O.</p>
<p class="mb-3">Le transfert d'électrons libère de l'énergie utilisée pour pomper des protons H⁺ de la matrice vers l'espace intermembranaire (complexes I, III et IV), créant un <strong>gradient électrochimique de protons</strong> (force proton-motrice Δp = ΔΨ - 2,3 RT/F × ΔpH).</p>
<p class="mb-3">L'<strong>ATP synthase</strong> (complexe V) utilise le flux de protons retournant dans la matrice pour catalyser la synthèse d'ATP à partir d'ADP + Pi. Le bilan théorique est ~30-32 ATP par glucose (vs 2 ATP par glycolyse anaérobie). Le rendement thermodynamique est ~40 %, le reste étant dissipé en chaleur.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : NADH → complexe I → Q → complexe III → cyt c → complexe IV → O₂. Le gradient de H⁺ est la force motrice de l'ATP synthase (théorie chimiosmotique de Mitchell). ~30 ATP/glucose en aérobiose vs 2 en anaérobiose.</p></div>`
    },
    {
      title: "Métabolisme basal et dépense énergétique",
      content: `<p class="mb-3">Le <strong>métabolisme basal</strong> (MB) est la dépense énergétique minimale de l'organisme au repos complet, à jeun, à neutralité thermique. Il correspond à l'énergie nécessaire aux fonctions vitales (respiration, circulation, activité cérébrale, synthèses cellulaires).</p>
<p class="mb-3">Le MB est ~80 W (~7000 kJ/jour) pour un adulte de 70 kg. Il dépend de la masse maigre, de l'âge (diminue avec l'âge), du sexe (plus élevé chez l'homme), de la température corporelle (+13 % par °C de fièvre) et du statut thyroïdien.</p>
<p class="mb-3">La <strong>dépense énergétique totale</strong> (DET) comprend : le MB (~60-70 %), la thermogenèse alimentaire (~10 %, énergie nécessaire à la digestion et au métabolisme des nutriments) et la thermogenèse liée à l'activité physique (~20-30 %, très variable). La <strong>calorimétrie indirecte</strong> mesure la DET à partir de la consommation d'O₂ et de la production de CO₂.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le MB représente ~60-70 % de la DET. Il est mesuré par calorimétrie indirecte (VO₂, VCO₂). La formule de Harris-Benedict permet une estimation du MB à partir du poids, de la taille, de l'âge et du sexe.</p></div>`
    },
    {
      title: "Thermodynamique des réactions biochimiques",
      content: `<p class="mb-3">Les réactions biochimiques obéissent aux lois de la <strong>thermodynamique</strong>. L'<strong>enthalpie libre de Gibbs</strong> ΔG détermine la spontanéité d'une réaction : si ΔG < 0 la réaction est <strong>exergonique</strong> (spontanée), si ΔG > 0 elle est <strong>endergonique</strong> (non spontanée, nécessite un apport d'énergie).</p>
<p class="mb-3">La relation fondamentale est ΔG = ΔG° + RT ln(Q), où ΔG° est l'enthalpie libre standard, R la constante des gaz (8,314 J/mol/K), T la température absolue et Q le quotient réactionnel. À l'équilibre, ΔG = 0 et Q = K_eq, d'où <strong>ΔG° = -RT ln(K_eq)</strong>.</p>
<p class="mb-3">En conditions biologiques standard (ΔG°', pH 7, 37°C, 1 atm), l'hydrolyse de l'<strong>ATP</strong> libère ΔG°' ≈ -30,5 kJ/mol. L'ATP est le « monnaie énergétique » de la cellule : les réactions endergoniques sont <strong>couplées</strong> à l'hydrolyse de l'ATP. Le couplage est réalisé par des enzymes qui catalysent les deux réactions simultanément, rendant le ΔG global négatif.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : ΔG < 0 = réaction spontanée. ΔG° = -RT ln(K_eq). L'hydrolyse de l'ATP (ΔG°' ≈ -30,5 kJ/mol) fournit l'énergie pour les réactions endergoniques par couplage énergétique.</p></div>`
    },
    {
      title: "Thermorégulation et échanges thermiques",
      content: `<p class="mb-3">L'être humain est un organisme <strong>homéotherme</strong> : sa température centrale est maintenue à ~37°C indépendamment de la température extérieure. La thermorégulation met en jeu un système de contrôle à rétroaction négative centré sur l'<strong>hypothalamus</strong> (thermostat biologique).</p>
<p class="mb-3">Les échanges thermiques entre le corps et l'environnement se font par quatre mécanismes physiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Radiation</strong> (rayonnement IR) : transfert d'énergie par ondes EM. Loi de Stefan-Boltzmann : P = εσA(T⁴_corps - T⁴_env). Représente ~60 % des pertes thermiques au repos dans un environnement tempéré.</li>
<li><strong>Convection</strong> : transfert par mouvement d'air ou de liquide au contact de la peau. Augmente avec le vent (wind chill). La vasodilatation cutanée augmente le transfert convectif interne (sang → peau).</li>
<li><strong>Conduction</strong> : transfert par contact direct. Négligeable sauf en immersion dans l'eau froide (conductivité thermique de l'eau ~25× celle de l'air).</li>
<li><strong>Évaporation</strong> : la vaporisation de la sueur absorbe 2,4 kJ/g d'eau évaporée (chaleur latente de vaporisation). Seul mécanisme efficace quand T_env > T_corps. Un litre de sueur évaporé dissipe ~2400 kJ.</li>
</ul>
<p class="mb-3">En cas de fièvre, le thermostat hypothalamique est relevé par les pyrogènes (prostaglandines, IL-1, TNF). La température de consigne augmente, déclenchant des frissons (thermogenèse musculaire) et une vasoconstriction périphérique jusqu'à atteindre le nouveau point de consigne. Les antipyrétiques (paracétamol, ibuprofène) abaissent le point de consigne en inhibant les prostaglandines.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : 4 mécanismes de perte thermique : radiation (~60 % au repos), convection, conduction, évaporation. L'évaporation est le seul mécanisme efficace quand T_env > T_corps. La fièvre est un relèvement du thermostat hypothalamique par les pyrogènes.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  19. SÉPARATION                               */
/* ───────────────────────────────────────────── */
"biophysique-separation": {
  introduction: "Les techniques de séparation permettent d'isoler et de caractériser les composants d'un mélange biologique. Centrifugation, électrophorèse et chromatographie sont les trois piliers de la biochimie analytique.",
  readTime: 18,
  sections: [
    {
      title: "Centrifugation et sédimentation",
      content: `<p class="mb-3">La <strong>centrifugation</strong> sépare les particules en suspension en fonction de leur masse, taille et densité grâce à la force centrifuge. La vitesse de sédimentation d'une particule dépend de la différence de densité avec le milieu, du rayon de la particule et de la viscosité du milieu.</p>
<p class="mb-3">Le <strong>coefficient de sédimentation s</strong> (en Svedberg, 1 S = 10⁻¹³ s) caractérise la vitesse de sédimentation : s = v/(ω²r), où v est la vitesse de sédimentation, ω la vitesse angulaire et r la distance à l'axe de rotation. Les ribosomes eucaryotes ont un coefficient de 80 S (sous-unités 40 S et 60 S — les valeurs de s ne sont pas additives).</p>
<p class="mb-3">Types de centrifugation :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Centrifugation différentielle</strong> : séparations successives à vitesses croissantes pour isoler les organites cellulaires (noyaux 600 g, mitochondries 10 000 g, microsomes 100 000 g).</li>
<li><strong>Centrifugation en gradient de densité</strong> : les particules migrent dans un gradient de saccharose ou de CsCl jusqu'à leur position d'équilibre isopycnique (densité = densité du milieu).</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le coefficient de sédimentation s (Svedberg) n'est pas additif : les sous-unités 40S + 60S donnent un ribosome 80S. La centrifugation différentielle isole les organites par taille et densité décroissantes.</p></div>`
    },
    {
      title: "Électrophorèse",
      content: `<p class="mb-3">L'<strong>électrophorèse</strong> sépare les molécules chargées dans un champ électrique. La mobilité électrophorétique μ = v/E = q/(6πηr) dépend de la charge nette q, de la taille r et de la viscosité du milieu η.</p>
<p class="mb-3">L'<strong>électrophorèse SDS-PAGE</strong> dénature les protéines avec du SDS (dodécylsulfate de sodium) qui confère une charge négative uniforme proportionnelle à la masse. La migration ne dépend donc plus que de la taille : les petites protéines migrent plus vite. La masse moléculaire est estimée par comparaison avec des marqueurs de taille.</p>
<p class="mb-3">L'<strong>isoélectrofocalisation</strong> (IEF) sépare les protéines selon leur <strong>point isoélectrique</strong> pI (pH où la charge nette est nulle). Les protéines migrent dans un gradient de pH jusqu'à atteindre le pH = pI. L'<strong>électrophorèse bidimensionnelle</strong> (2D-PAGE) combine IEF (1re dimension) et SDS-PAGE (2e dimension) pour une séparation très résolutive.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : SDS-PAGE sépare par MASSE (le SDS uniformise la charge). IEF sépare par pI (charge). La 2D-PAGE combine les deux pour résoudre des milliers de protéines sur un seul gel.</p></div>`
    },
    {
      title: "Chromatographie",
      content: `<p class="mb-3">La <strong>chromatographie</strong> sépare les composants d'un mélange par leur distribution différentielle entre une phase stationnaire et une phase mobile. Les principales techniques sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Exclusion stérique</strong> (gel-filtration) : sépare par taille moléculaire. Les grosses molécules sont exclues des pores du gel et éluées en premier. Les petites pénètrent dans les pores et sont retardées.</li>
<li><strong>Échange d'ions</strong> : sépare par charge. Les molécules chargées se fixent sur la résine et sont éluées par un gradient de sel ou de pH.</li>
<li><strong>Affinité</strong> : sépare par interaction spécifique. Un ligand immobilisé retient spécifiquement la molécule d'intérêt (anticorps-antigène, enzyme-substrat). Très haute sélectivité.</li>
<li><strong>Phase inverse</strong> (HPLC) : sépare par hydrophobicité. Phase stationnaire apolaire, phase mobile polaire. Les molécules les plus hydrophobes sont les plus retenues.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Exclusion = taille (grosses molécules sortent EN PREMIER). Échange d'ions = charge. Affinité = interaction spécifique (la plus sélective). HPLC phase inverse = hydrophobicité.</p></div>`
    },
    {
      title: "Ultracentrifugation analytique et spectrométrie de masse",
      content: `<p class="mb-3">L'<strong>ultracentrifugation analytique</strong> (AUC) est à la fois une technique de séparation et de caractérisation. Elle permet de déterminer la masse moléculaire, le coefficient de sédimentation et la forme des macromolécules en solution. Deux modes : sédimentation de vitesse (mesure de s) et sédimentation d'équilibre (mesure de la masse moléculaire).</p>
<p class="mb-3">La <strong>spectrométrie de masse</strong> mesure le rapport masse/charge (m/z) des molécules ionisées. Les principales méthodes d'ionisation en biologie sont l'<strong>ESI</strong> (electrospray ionization, pour les protéines) et le <strong>MALDI</strong> (matrix-assisted laser desorption ionization, pour les grandes molécules). Les analyseurs courants sont le temps de vol (TOF), le quadripôle et l'Orbitrap.</p>
<p class="mb-3">La spectrométrie de masse en tandem (MS/MS) permet le séquençage de peptides et l'identification de protéines. Couplée à la chromatographie liquide (LC-MS/MS), elle est la technique de référence en protéomique.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La spectrométrie de masse mesure m/z. ESI est adapté aux protéines en solution, MALDI aux grands complexes. LC-MS/MS est la technique clé en protéomique et en pharmacocinétique.</p></div>`
    },
    {
      title: "Dialyse, osmose et filtration membranaire",
      content: `<p class="mb-3">Les techniques de séparation membranaire exploitent des membranes semi-perméables pour séparer les solutés en fonction de leur taille ou de leur charge. Ces principes physiques sont à la base de la <strong>dialyse rénale</strong> et de nombreuses applications biotechnologiques.</p>
<p class="mb-3">L'<strong>osmose</strong> est le passage d'eau à travers une membrane semi-perméable du compartiment le moins concentré vers le plus concentré. La <strong>pression osmotique</strong> π = nRT/V = cRT (loi de van't Hoff pour les solutions diluées) s'oppose à ce flux. Pour les solutions ioniques : π = i·c·R·T, où i est le coefficient de van't Hoff (i = 2 pour NaCl). L'osmolarité plasmatique est ~290 mOsm/L.</p>
<p class="mb-3">Les principales techniques membranaires sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dialyse</strong> : diffusion des petits solutés à travers une membrane selon leur gradient de concentration. En hémodialyse, l'urée et la créatinine diffusent du sang vers le dialysat. Le seuil de coupure de la membrane détermine la taille maximale des molécules éliminées.</li>
<li><strong>Ultrafiltration</strong> : séparation sous pression à travers une membrane avec un seuil de coupure défini (1-300 kDa). Utilisée pour concentrer les protéines et éliminer les solvants.</li>
<li><strong>Osmose inverse</strong> : application d'une pression > π pour forcer le passage de l'eau du compartiment concentré vers le dilué. Utilisée pour la purification de l'eau.</li>
</ul>
<p class="mb-3">La <strong>filtration glomérulaire</strong> rénale est un exemple biologique d'ultrafiltration : la membrane glomérulaire (seuil ~68 kDa, taille de l'albumine) filtre le plasma sous l'effet de la pression hydrostatique glomérulaire (~55 mmHg), opposée par la pression oncotique (~25 mmHg) et la pression hydrostatique capsulaire (~15 mmHg). Le débit de filtration glomérulaire (DFG) est ~120 mL/min.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : π = icRT (pression osmotique). L'hémodialyse utilise la diffusion à travers une membrane semi-perméable. La filtration glomérulaire est une ultrafiltration physiologique (DFG ~120 mL/min, seuil ~68 kDa).</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  20. ÉCHOGRAPHIE AVANCÉE                      */
/* ───────────────────────────────────────────── */
"biophysique-echo-avancee": {
  introduction: "L'échographie avancée regroupe les techniques ultrasonores sophistiquées : échographie 3D/4D, élastographie, produits de contraste ultrasonores et échographie interventionnelle, étendant considérablement les capacités diagnostiques.",
  readTime: 18,
  sections: [
    {
      title: "Échographie 3D et 4D",
      content: `<p class="mb-3">L'<strong>échographie 3D</strong> acquiert un volume de données par balayage mécanique ou électronique de la sonde. Les coupes 2D successives sont reconstruites en un volume tridimensionnel. Le rendu de surface permet de visualiser les structures anatomiques en relief.</p>
<p class="mb-3">L'<strong>échographie 4D</strong> est une échographie 3D en temps réel. Elle est largement utilisée en obstétrique pour visualiser le fœtus en mouvement. Les sondes matricielles (matrice 2D de transducteurs) permettent un balayage volumique électronique rapide.</p>
<p class="mb-3">Applications principales : obstétrique (malformations fœtales, diagnostic prénatal), cardiologie (échocardiographie 3D des valves), et chirurgie guidée par l'image. La résolution spatiale reste inférieure à celle du scanner ou de l'IRM mais l'avantage est l'absence d'irradiation et le temps réel.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'échographie 3D reconstruit un volume à partir de coupes 2D. L'échographie 4D = 3D en temps réel. Les sondes matricielles permettent le balayage volumique sans mouvement mécanique.</p></div>`
    },
    {
      title: "Élastographie ultrasonore",
      content: `<p class="mb-3">L'<strong>élastographie</strong> mesure l'élasticité (dureté) des tissus. Le principe repose sur le fait que les tissus pathologiques (tumeurs, fibrose) sont généralement plus rigides que les tissus normaux.</p>
<p class="mb-3">Deux approches principales :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Élastographie par compression</strong> (strain) : le praticien comprime le tissu avec la sonde et compare la déformation relative des structures. Qualitative (carte couleur de déformation).</li>
<li><strong>Élastographie par onde de cisaillement</strong> (shear wave) : une impulsion ultrasonore focalisée crée une onde de cisaillement dont la vitesse de propagation est proportionnelle à la rigidité du tissu. Quantitative (mesure du module de Young E = 3ρv² en kPa).</li>
</ul>
<p class="mb-3">Applications : caractérisation des nodules thyroïdiens et mammaires (distinction bénin/malin), évaluation de la fibrose hépatique (<strong>FibroScan</strong> par élastographie transitoire, alternative à la biopsie hépatique).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'élastographie mesure la rigidité tissulaire. Les tumeurs malignes sont généralement plus rigides. Le FibroScan mesure la fibrose hépatique de façon non invasive par élastographie transitoire.</p></div>`
    },
    {
      title: "Produits de contraste ultrasonores et échographie interventionnelle",
      content: `<p class="mb-3">Les <strong>produits de contraste ultrasonores</strong> (PCUS) sont des microbulles de gaz (2-10 μm de diamètre) encapsulées dans une coque lipidique ou protéique. Injectées par voie intraveineuse, elles restent dans le compartiment vasculaire et augmentent considérablement le signal ultrasonore par résonance acoustique.</p>
<p class="mb-3">En imagerie harmonique de contraste, on détecte les harmoniques émises par les microbulles (fréquence double de la fréquence d'émission) qui sont spécifiques des bulles et non des tissus. Cela améliore considérablement le contraste. Applications : caractérisation des lésions hépatiques (hémangiome vs métastase), perfusion myocardique.</p>
<p class="mb-3">L'<strong>échographie interventionnelle</strong> utilise l'échographie en temps réel pour guider des gestes invasifs : ponctions (biopsies, drainages), injections (infiltrations articulaires), et pose de cathéters. L'avantage majeur est la visualisation en temps réel de l'aiguille sans irradiation.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Les microbulles sont des traceurs vasculaires ultrasonores. L'imagerie harmonique détecte spécifiquement les microbulles. L'échographie interventionnelle guide les gestes en temps réel sans irradiation.</p></div>`
    },
    {
      title: "Imagerie harmonique tissulaire et modes d'acquisition",
      content: `<p class="mb-3">L'<strong>imagerie harmonique tissulaire</strong> exploite les harmoniques générées par la propagation non linéaire des ultrasons dans les tissus. Lorsqu'une onde ultrasonore de fréquence fondamentale f₀ traverse un tissu, la non-linéarité du milieu génère des harmoniques à 2f₀, 3f₀, etc. Le récepteur filtre et ne conserve que la <strong>seconde harmonique</strong> (2f₀).</p>
<p class="mb-3">Avantages de l'imagerie harmonique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Réduction des artefacts</strong> : les harmoniques se forment dans les tissus profonds, pas dans la paroi superficielle (graisse sous-cutanée) → diminution des artefacts de réverbération.</li>
<li><strong>Meilleure résolution latérale</strong> : le faisceau harmonique est plus étroit (les harmoniques sont générées préférentiellement au centre du faisceau où l'intensité est maximale).</li>
<li><strong>Meilleur contraste</strong> : réduction du bruit de fond et des lobes latéraux.</li>
</ul>
<p class="mb-3">Les différents <strong>modes d'acquisition</strong> échographiques sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Mode A</strong> (Amplitude) : un seul faisceau, échos représentés en amplitude en fonction de la profondeur. Utilisé en ophtalmologie (biométrie oculaire).</li>
<li><strong>Mode B</strong> (Brillance) : image 2D en niveaux de gris. Chaque écho est représenté par un point dont la brillance correspond à l'amplitude. Mode standard.</li>
<li><strong>Mode TM</strong> (Temps-Mouvement) : un seul faisceau fixe, les échos sont enregistrés en fonction du temps → mouvement des structures. Utilisé en cardiologie (cinétique valvulaire).</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'imagerie harmonique tissulaire utilise la 2e harmonique (2f₀) générée par la non-linéarité des tissus → meilleure image. Mode B = image 2D standard, mode TM = mouvement dans le temps (cardiologie), mode A = amplitude (ophtalmologie).</p></div>`
    },
    {
      title: "Artefacts échographiques et optimisation de l'image",
      content: `<p class="mb-3">Les <strong>artefacts échographiques</strong> sont des informations erronées sur l'image qui résultent des hypothèses simplificatrices du système (vitesse constante, propagation rectiligne, atténuation uniforme). Leur connaissance est essentielle pour éviter les erreurs diagnostiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Ombre acoustique</strong> : zone anéchogène en arrière d'une structure très réfléchissante ou absorbante (calculs, os, calcifications). Le faisceau ne peut pas pénétrer au-delà → absence d'information.</li>
<li><strong>Renforcement postérieur</strong> : zone hyperéchogène en arrière d'une structure liquidienne (kyste, vessie). Le liquide atténue moins que les tissus environnants → les échos profonds sont plus intenses.</li>
<li><strong>Réverbérations</strong> : réflexions multiples entre deux interfaces parallèles très réfléchissantes (aiguille, air). Produisent des échos répétés à intervalles réguliers en profondeur (image « en queue de comète »).</li>
<li><strong>Image en miroir</strong> : un réflecteur puissant (diaphragme) crée une image fantôme symétrique en profondeur. Le foie peut apparaître « dupliqué » au-dessus du diaphragme.</li>
<li><strong>Artefact de vitesse</strong> : si la vitesse réelle diffère de 1540 m/s (hypothèse du système), les structures sont mal positionnées en profondeur.</li>
</ul>
<p class="mb-3">L'<strong>optimisation de l'image</strong> passe par le réglage du <strong>gain</strong> (amplification globale du signal), de la <strong>TGC</strong> (Time Gain Compensation, compensation de l'atténuation en profondeur), de la <strong>fréquence</strong> (compromis résolution/pénétration), de la <strong>focalisation</strong> (zone focale positionnée à la profondeur d'intérêt) et de la <strong>dynamique</strong> (nombre de niveaux de gris affichés).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Ombre acoustique = en arrière d'un calcul. Renforcement postérieur = en arrière d'un kyste. Ces artefacts ont une valeur diagnostique. La TGC compense l'atténuation en profondeur pour obtenir une image homogène.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  21. INTERACTIONS RAYONNEMENTS                */
/* ───────────────────────────────────────────── */
"biophysique-interactions-rayonnements": {
  introduction: "Les interactions des rayonnements avec la matière sont à la base de toute l'imagerie médicale et de la radiothérapie. Comprendre les mécanismes d'interaction permet de maîtriser la formation de l'image et le dépôt de dose.",
  readTime: 20,
  sections: [
    {
      title: "Classification des rayonnements",
      content: `<p class="mb-3">Les rayonnements sont classés en deux grandes catégories :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Rayonnements directement ionisants</strong> : particules chargées (électrons, positons, protons, particules α, ions lourds). Ils ionisent la matière par interactions coulombiennes directes le long de leur trajectoire.</li>
<li><strong>Rayonnements indirectement ionisants</strong> : particules neutres (photons X/γ, neutrons). Ils transfèrent d'abord leur énergie à des particules chargées secondaires qui ionisent ensuite la matière.</li>
</ul>
<p class="mb-3">On distingue aussi les rayonnements <strong>ionisants</strong> (énergie suffisante pour arracher des électrons : UV-C, X, γ, α, β, neutrons) et <strong>non ionisants</strong> (UV-A/B, visible, IR, micro-ondes, radiofréquences). La frontière se situe autour de 13,6 eV (énergie d'ionisation de l'hydrogène).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Photons X/γ = indirectement ionisants (ils produisent des électrons secondaires). Particules α, β = directement ionisants. Le seuil d'ionisation est ~13,6 eV.</p></div>`
    },
    {
      title: "Interactions des particules chargées",
      content: `<p class="mb-3">Les <strong>particules chargées lourdes</strong> (protons, α) interagissent principalement par excitation et ionisation des atomes du milieu via la force de Coulomb. Elles ont un parcours défini (quelques cm pour les protons, quelques μm pour les α dans les tissus) avec un dépôt d'énergie maximal en fin de parcours (<strong>pic de Bragg</strong>).</p>
<p class="mb-3">Les <strong>électrons</strong> ont un parcours plus sinueux (diffusions multiples) et un TEL plus faible que les particules lourdes. Ils perdent aussi de l'énergie par <strong>rayonnement de freinage</strong> (Bremsstrahlung) lorsqu'ils sont déviés par les noyaux, surtout à haute énergie et dans les matériaux de Z élevé.</p>
<p class="mb-3">Le <strong>pic de Bragg</strong> des protons est exploité en <strong>protonthérapie</strong> : le dépôt de dose maximal est concentré dans la tumeur en fin de parcours, épargnant les tissus sains en amont et en aval. Le <strong>pic de Bragg étalé</strong> (SOBP) est obtenu en superposant des faisceaux de protons d'énergies différentes pour couvrir le volume tumoral.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le pic de Bragg = dépôt maximal de dose en fin de parcours. C'est l'avantage dosimétrique majeur de la protonthérapie par rapport à la radiothérapie par photons (qui déposent le maximum en entrée).</p></div>`
    },
    {
      title: "Interactions des photons (rappel approfondi)",
      content: `<p class="mb-3">Les trois interactions principales des photons avec la matière ont été vues dans le chapitre « Rayons X ». Approfondissons :</p>
<p class="mb-3"><strong>Effet photoélectrique</strong> : le photon disparaît totalement. L'électron éjecté a une énergie cinétique Ec = hν - E_liaison. Le réarrangement du cortège électronique produit des rayons X de fluorescence ou des électrons Auger. La section efficace varie en Z⁴-⁵/E³·⁵. C'est l'interaction dominante à basse énergie (< 50 keV pour les tissus mous).</p>
<p class="mb-3"><strong>Diffusion Compton</strong> : le photon est diffusé avec un changement de longueur d'onde Δλ = (h/m_e c)(1 - cos θ). L'énergie transférée augmente avec l'angle de diffusion. Dominante entre 50 keV et 10 MeV pour les tissus. Quasi indépendante de Z (dépend de la densité électronique ρ_e).</p>
<p class="mb-3"><strong>Création de paires</strong> : seuil à 1,022 MeV (2 × 511 keV = 2 × m_e c²). La section efficace augmente avec Z² et avec l'énergie du photon. Dominante au-dessus de 10 MeV pour les tissus.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Photoélectrique ∝ Z⁴/E³ (contraste, basse énergie). Compton ∝ ρ_e (pas de contraste, énergie intermédiaire). Création de paires ∝ Z² (haute énergie > 1,022 MeV).</p></div>`
    },
    {
      title: "Interactions des neutrons",
      content: `<p class="mb-3">Les <strong>neutrons</strong> sont des particules neutres qui n'interagissent pas par force de Coulomb mais par <strong>force nucléaire forte</strong> avec les noyaux. Leurs interactions dépendent fortement de leur énergie :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Neutrons rapides</strong> (> 100 keV) : diffusion élastique avec les noyaux légers (surtout H). Le proton de recul est directement ionisant et dépose de l'énergie. Les matériaux riches en hydrogène (eau, paraffine) sont les meilleurs modérateurs/blindages.</li>
<li><strong>Neutrons thermiques</strong> (~0,025 eV) : capture radiative (n + noyau → noyau excité + γ). Certains noyaux ont une section efficace de capture très élevée (¹⁰B, ¹⁵⁷Gd). Base de la <strong>BNCT</strong> (Boron Neutron Capture Therapy).</li>
</ul>
<p class="mb-3">Les neutrons ont un <strong>TEL élevé</strong> (via les protons de recul) et un <strong>w_R de 2 à 20</strong> selon leur énergie. Ils sont particulièrement dangereux car difficiles à blinder (il faut des matériaux hydrogénés épais).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Les neutrons interagissent avec les noyaux (force nucléaire). Les matériaux hydrogénés (eau, béton humide) sont les meilleurs blindages. La BNCT utilise la capture des neutrons thermiques par le ¹⁰B pour irradier les cellules tumorales.</p></div>`
    },
    {
      title: "Atténuation des photons et couche de demi-atténuation",
      content: `<p class="mb-3">Un faisceau de photons monoénergétiques traversant un milieu homogène est atténué selon une <strong>loi exponentielle</strong> : I(x) = I₀ e⁻μx, où μ est le <strong>coefficient d'atténuation linéique</strong> (cm⁻¹) et x l'épaisseur traversée. Ce coefficient regroupe les contributions des trois interactions : μ = τ (photoélectrique) + σ (Compton) + κ (création de paires).</p>
<p class="mb-3">Le <strong>coefficient d'atténuation massique</strong> μ/ρ (cm²/g) est indépendant de la densité physique du matériau et ne dépend que de la composition chimique et de l'énergie du photon. Il permet de comparer les matériaux entre eux. Les tables de μ/ρ (NIST) sont utilisées pour les calculs de dosimétrie et de radioprotection.</p>
<p class="mb-3">La <strong>couche de demi-atténuation</strong> (CDA) est l'épaisseur qui réduit l'intensité de moitié : CDA = ln(2)/μ ≈ 0,693/μ. Exemples pour les photons de 100 keV : CDA_eau ≈ 4 cm, CDA_os ≈ 2 cm, CDA_plomb ≈ 0,01 cm. Pour les photons du ⁶⁰Co (1,25 MeV) : CDA_plomb ≈ 1,1 cm.</p>
<p class="mb-3">Pour un faisceau polychromatique (rayons X), l'atténuation n'est plus strictement exponentielle car les photons de basse énergie sont préférentiellement absorbés (durcissement du faisceau). Le spectre se décale vers les hautes énergies en profondeur. Les <strong>filtres métalliques</strong> (aluminium, cuivre) placés en sortie du tube X éliminent les photons de basse énergie inutiles pour l'image mais irradiants pour le patient.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : I(x) = I₀ e⁻μx. CDA = ln2/μ = épaisseur divisant l'intensité par 2. Après n CDA, il reste I₀/2ⁿ. Le durcissement du faisceau polychromatique X dévie de la loi exponentielle pure et améliore la qualité du faisceau en profondeur.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  22. DÉTECTEURS                               */
/* ───────────────────────────────────────────── */
"biophysique-detecteurs": {
  introduction: "Les détecteurs de rayonnements ionisants sont les instruments de mesure fondamentaux en dosimétrie, radioprotection et imagerie nucléaire. Leur choix dépend du type de rayonnement, de l'énergie et de l'application visée.",
  readTime: 18,
  sections: [
    {
      title: "Détecteurs à gaz",
      content: `<p class="mb-3">Les <strong>détecteurs à gaz</strong> sont constitués d'une enceinte remplie de gaz (air, argon) avec deux électrodes soumises à une tension. Le rayonnement ionise le gaz, créant des paires ion-électron qui migrent vers les électrodes et génèrent un courant mesurable.</p>
<p class="mb-3">Selon la tension appliquée, on distingue trois régimes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Chambre d'ionisation</strong> (tension modérée) : toutes les charges sont collectées sans multiplication. Mesure le courant proportionnel à la dose. Utilisée en dosimétrie (étalon de dose) et dans les stylos dosimètres.</li>
<li><strong>Compteur proportionnel</strong> (tension plus élevée) : multiplication des charges par avalanche près de l'anode. Le signal est proportionnel à l'énergie déposée → spectrométrie possible.</li>
<li><strong>Compteur Geiger-Müller</strong> (haute tension) : avalanche totale, signal indépendant de l'énergie. Ne compte que les événements (pas de spectrométrie). Simple, robuste, utilisé en radioprotection pour la détection de contamination.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Chambre d'ionisation = dosimétrie (mesure de dose). Geiger-Müller = détection/comptage (pas d'info spectrale). Le compteur proportionnel fait les deux mais est plus complexe.</p></div>`
    },
    {
      title: "Détecteurs à scintillation",
      content: `<p class="mb-3">Les <strong>scintillateurs</strong> convertissent l'énergie des rayonnements en photons lumineux. La quantité de lumière émise est proportionnelle à l'énergie déposée, permettant la spectrométrie.</p>
<p class="mb-3">Principaux scintillateurs :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>NaI(Tl)</strong> (iodure de sodium dopé au thallium) : excellent rendement lumineux, bonne efficacité de détection pour les γ, mais résolution en énergie médiocre (~7 % à 662 keV). C'est le cristal de la gamma-caméra.</li>
<li><strong>BGO, LSO, LYSO</strong> : cristaux denses à temps de scintillation court, utilisés en TEP. Le LYSO a largement remplacé le BGO grâce à son meilleur rendement et sa rapidité.</li>
<li><strong>Scintillateurs liquides</strong> : pour la mesure des émetteurs β purs (³H, ¹⁴C) à très basse énergie (pas de photon γ détectable).</li>
</ul>
<p class="mb-3">Le photon lumineux du scintillateur est converti en signal électrique par un <strong>photomultiplicateur</strong> (PM) ou un <strong>photodétecteur à semi-conducteur</strong> (SiPM). Le PM amplifie le signal par émission secondaire d'électrons (gain ~10⁶).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : NaI(Tl) = gamma-caméra (scintigraphie). LYSO = TEP. Le scintillateur convertit γ → lumière, le photomultiplicateur convertit lumière → signal électrique. L'énergie mesurée permet la spectrométrie γ.</p></div>`
    },
    {
      title: "Détecteurs à semi-conducteurs et dosimètres passifs",
      content: `<p class="mb-3">Les <strong>détecteurs à semi-conducteurs</strong> (Si, Ge, CdTe, CZT) fonctionnent comme des chambres d'ionisation solides. L'énergie nécessaire pour créer une paire électron-trou (~3 eV dans le Si) est beaucoup plus faible que pour ioniser un gaz (~30 eV), d'où une bien meilleure <strong>résolution en énergie</strong> (~1 % vs ~7 % pour NaI).</p>
<p class="mb-3">Le <strong>Ge(Li)</strong> (germanium au lithium) est le détecteur de référence pour la spectrométrie γ haute résolution mais nécessite un refroidissement à l'azote liquide. Les détecteurs CZT fonctionnent à température ambiante et sont utilisés dans les nouvelles gamma-caméras compactes.</p>
<p class="mb-3"><strong>Dosimètres passifs</strong> pour la radioprotection :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Films photographiques</strong> : noircissement proportionnel à la dose. Historiquement les plus utilisés.</li>
<li><strong>Dosimètres thermoluminescents</strong> (TLD, LiF) : les charges piégées sont libérées par chauffage, émettant une lumière proportionnelle à la dose accumulée.</li>
<li><strong>Dosimètres OSL</strong> (luminescence stimulée optiquement, Al₂O₃:C) : lecture par stimulation lumineuse, réutilisables, remplacent progressivement les TLD.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Semi-conducteurs = meilleure résolution en énergie que les scintillateurs. TLD = dosimètre passif classique en radioprotection. OSL remplace progressivement le TLD grâce à sa lecture non destructive.</p></div>`
    },
    {
      title: "Gamma-caméra et principes de la scintigraphie",
      content: `<p class="mb-3">La <strong>gamma-caméra</strong> (caméra d'Anger) est le détecteur utilisé en scintigraphie pour former des images de la distribution d'un radiopharmaceutique émetteur γ dans l'organisme. Ses composants principaux sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Collimateur</strong> : grille de plomb percée de canaux parallèles (collimateur parallèle) ou convergents/divergents. Il sélectionne les photons γ perpendiculaires au cristal et rejette les photons diffusés. C'est le facteur limitant de la résolution spatiale (~8-12 mm) et de la sensibilité.</li>
<li><strong>Cristal scintillant NaI(Tl)</strong> : convertit les photons γ en photons lumineux. Épaisseur ~9,5 mm, optimisée pour les γ de 140 keV (⁹⁹ᵐTc). Le rendement de détection est ~90 % à 140 keV.</li>
<li><strong>Réseau de photomultiplicateurs</strong> (30-100 PM) : convertissent les photons lumineux en signaux électriques. La position du scintillement est calculée par barycentrage (logique d'Anger) à partir des signaux de tous les PM.</li>
<li><strong>Analyseur de hauteur d'impulsion</strong> : sélectionne uniquement les événements dans la fenêtre en énergie centrée sur le pic photoélectrique (ex : 140 keV ± 10 %). Rejette les photons Compton diffusés.</li>
</ul>
<p class="mb-3">La <strong>TEMP</strong> (Tomographie d'Émission MonoPhotonique) ou SPECT acquiert des projections sous de multiples angles (rotation de la gamma-caméra autour du patient) et reconstruit des coupes tomographiques par rétroprojection filtrée ou reconstruction itérative.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La gamma-caméra = collimateur + NaI(Tl) + PM + électronique. Le collimateur est le facteur limitant (compromis résolution/sensibilité). La TEMP reconstruit des coupes 3D à partir de projections multiples de la gamma-caméra.</p></div>`
    },
    {
      title: "Détecteurs TEP et spectrométrie gamma",
      content: `<p class="mb-3">Le détecteur TEP (Tomographe par Émission de Positons) est fondamentalement différent de la gamma-caméra. Il détecte les deux photons de 511 keV émis à 180° lors de l'<strong>annihilation</strong> d'un positon avec un électron du milieu. La <strong>détection en coïncidence</strong> (fenêtre temporelle ~5-10 ns) définit une <strong>ligne de réponse</strong> (LOR) sans nécessiter de collimateur matériel.</p>
<p class="mb-3">L'absence de collimateur confère au TEP une <strong>sensibilité</strong> bien supérieure à la TEMP (~10-100×). Les cristaux utilisés sont le <strong>LYSO</strong> (Lu₂SiO₅:Ce) ou le <strong>BGO</strong> (Bi₄Ge₃O₁₂), choisis pour leur densité élevée (efficacité de détection à 511 keV), leur rapidité (résolution temporelle) et leur rendement lumineux.</p>
<p class="mb-3">Le <strong>TEP-TDM</strong> (PET-CT) combine l'information fonctionnelle du TEP avec l'information anatomique du scanner X. Le <strong>TEP temps-de-vol</strong> (TOF-PET) mesure la différence de temps d'arrivée des deux photons pour localiser le point d'annihilation sur la LOR, améliorant le rapport signal/bruit proportionnellement à la résolution temporelle (~200-300 ps actuellement).</p>
<p class="mb-3">La <strong>spectrométrie gamma</strong> utilise un détecteur (NaI, Ge) couplé à un analyseur multicanaux pour mesurer le spectre en énergie des photons γ. Le spectre typique comprend : le <strong>pic photoélectrique</strong> (énergie totale du γ), le <strong>front Compton</strong> (énergie partielle), le <strong>pic de rétrodiffusion</strong> (γ diffusé à 180°) et éventuellement un <strong>pic d'échappement</strong> (perte d'un rayon X caractéristique du cristal).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le TEP détecte en coïncidence 2 photons de 511 keV → pas de collimateur → meilleure sensibilité que la TEMP. Le TOF-PET améliore le rapport signal/bruit en localisant l'annihilation sur la LOR. Le spectre gamma comprend le pic photoélectrique et le front Compton.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  23. IRM AVANCÉE                              */
/* ───────────────────────────────────────────── */
"biophysique-irm-avancee": {
  introduction: "L'IRM avancée regroupe les techniques qui étendent les capacités de l'IRM classique : diffusion, perfusion, IRM fonctionnelle, spectroscopie et séquences spéciales, offrant des informations anatomiques, fonctionnelles et métaboliques.",
  readTime: 20,
  sections: [
    {
      title: "IRM de diffusion et tenseur de diffusion",
      content: `<p class="mb-3">L'<strong>IRM de diffusion</strong> mesure le mouvement brownien des molécules d'eau dans les tissus. Des gradients de diffusion sont appliqués : les molécules d'eau mobiles subissent un déphasage de leur signal, entraînant une perte de signal proportionnelle à leur mobilité.</p>
<p class="mb-3">Le <strong>coefficient de diffusion apparent</strong> (ADC) quantifie la diffusibilité de l'eau dans un tissu. Un ADC bas signifie une diffusion restreinte (cellularité élevée, œdème cytotoxique). L'<strong>AVC ischémique</strong> est détecté en diffusion dès les premières minutes (ADC diminué dans la zone infarcie), bien avant le scanner ou l'IRM conventionnelle.</p>
<p class="mb-3">Le <strong>tenseur de diffusion</strong> (DTI) mesure la diffusion dans 6+ directions et reconstruit l'anisotropie de la diffusion. Dans la substance blanche, l'eau diffuse préférentiellement le long des fibres (anisotropie élevée, FA proche de 1). La <strong>tractographie</strong> reconstruit les faisceaux de fibres nerveuses en 3D à partir du DTI.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'IRM de diffusion détecte l'AVC ischémique en quelques minutes (hypersignal en diffusion, ADC bas). Le DTI cartographie les fibres de la substance blanche grâce à l'anisotropie de diffusion de l'eau.</p></div>`
    },
    {
      title: "IRM de perfusion",
      content: `<p class="mb-3">L'<strong>IRM de perfusion</strong> évalue la microvascularisation tissulaire. Deux approches principales :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Perfusion par premier passage</strong> (DSC = Dynamic Susceptibility Contrast) : injection IV rapide de gadolinium. Le passage du Gd dans les capillaires crée un effet de susceptibilité magnétique qui diminue le signal T2*. L'analyse de la courbe signal-temps fournit le volume sanguin cérébral (VSC), le débit sanguin (DSC) et le temps de transit moyen (TTM).</li>
<li><strong>ASL</strong> (Arterial Spin Labeling) : marquage magnétique du sang artériel en amont par une impulsion RF. Pas d'injection de produit de contraste. Quantifie le débit sanguin cérébral en mL/100g/min.</li>
</ul>
<p class="mb-3">Applications : caractérisation des tumeurs cérébrales (le VSC élevé indique une néoangiogenèse = haute grade), évaluation de la pénombre ischémique (tissue at risk) dans l'AVC, étude de la maladie d'Alzheimer.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : DSC-MRI évalue la perfusion après injection de Gd. ASL évalue la perfusion SANS injection. Un VSC élevé en tumeur cérébrale suggère un haut grade (glioblastome).</p></div>`
    },
    {
      title: "IRM fonctionnelle (IRMf)",
      content: `<p class="mb-3">L'<strong>IRM fonctionnelle</strong> (IRMf) détecte les variations d'activité cérébrale en temps réel. Elle repose sur l'effet <strong>BOLD</strong> (Blood Oxygen Level Dependent) : lorsqu'une zone cérébrale s'active, le flux sanguin local augmente davantage que la consommation d'O₂, entraînant une augmentation de l'oxyhémoglobine (diamagnétique) relative à la désoxyhémoglobine (paramagnétique).</p>
<p class="mb-3">Cette variation du rapport oxy/désoxy-Hb modifie localement le T2* et donc le signal IRM en pondération T2* (séquence EPI). L'augmentation de signal est faible (~1-5 %) et nécessite des analyses statistiques sophistiquées pour être détectée (modèle linéaire général, SPM).</p>
<p class="mb-3">Applications : cartographie préchirurgicale des aires fonctionnelles (motricité, langage, vision), recherche en neurosciences cognitives, étude de la connectivité cérébrale (IRMf au repos = resting state fMRI, qui identifie les réseaux cérébraux fonctionnels).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'effet BOLD est basé sur les propriétés magnétiques différentes de l'oxy-Hb (diamagnétique) et de la désoxy-Hb (paramagnétique). L'IRMf ne mesure PAS directement l'activité neuronale mais son reflet hémodynamique.</p></div>`
    },
    {
      title: "Agents de contraste IRM",
      content: `<p class="mb-3">Les <strong>agents de contraste IRM</strong> modifient les temps de relaxation des tissus voisins. Le plus utilisé est le <strong>gadolinium</strong> (Gd³⁺), un ion paramagnétique chélaté (complexé pour éviter sa toxicité) qui raccourcit le T1 des tissus adjacents → <strong>hypersignal en T1</strong> après injection.</p>
<p class="mb-3">Le Gd reste dans le compartiment vasculaire et diffuse rapidement dans l'espace interstitiel. Il est éliminé par voie rénale. Contre-indication majeure : <strong>insuffisance rénale sévère</strong> (risque de fibrose néphrogénique systémique). Les chélates macrocycliques (gadobutrol, gadotérate) sont plus stables que les linéaires.</p>
<p class="mb-3">Les <strong>agents superparamagnétiques</strong> (USPIO, nanoparticules d'oxyde de fer) raccourcissent le T2 → <strong>hyposignal en T2</strong>. Ils sont captés par le système réticulo-endothélial (foie, rate, ganglions). Les ganglions lymphatiques métastatiques ne captent pas les USPIO et restent en hypersignal.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Gadolinium = raccourcit T1 → hypersignal T1. USPIO = raccourcit T2 → hyposignal T2. Le Gd est contre-indiqué en insuffisance rénale sévère (risque de fibrose néphrogénique systémique).</p></div>`
    },
    {
      title: "Spectroscopie RMN et séquences IRM spéciales",
      content: `<p class="mb-3">La <strong>spectroscopie par résonance magnétique</strong> (SRM ou MRS) mesure la concentration de métabolites cérébraux in vivo. Elle exploite le <strong>déplacement chimique</strong> : les protons d'un même noyau résonnent à des fréquences légèrement différentes selon leur environnement chimique (exprimé en ppm par rapport à une référence).</p>
<p class="mb-3">Les principaux métabolites cérébraux détectés en SRM du proton (¹H) sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>NAA</strong> (N-acétyl-aspartate, 2,02 ppm) : marqueur neuronal. Diminué dans les processus de destruction neuronale (tumeurs, AVC, maladies neurodégénératives).</li>
<li><strong>Cho</strong> (choline, 3,22 ppm) : marqueur du turnover membranaire. Augmenté dans les tumeurs (prolifération cellulaire) et la démyélinisation.</li>
<li><strong>Cr</strong> (créatine, 3,03 ppm) : marqueur du métabolisme énergétique. Relativement stable, souvent utilisé comme référence interne.</li>
<li><strong>Lactate</strong> (1,33 ppm, doublet) : marqueur de la glycolyse anaérobie. Augmenté dans l'ischémie, les tumeurs de haut grade et les abcès.</li>
<li><strong>mI</strong> (myo-inositol, 3,56 ppm) : marqueur glial. Augmenté dans les gliomes de bas grade et la maladie d'Alzheimer.</li>
</ul>
<p class="mb-3">Parmi les <strong>séquences IRM spéciales</strong>, la séquence <strong>FLAIR</strong> (Fluid-Attenuated Inversion Recovery) annule le signal du LCR (TI choisi pour annuler le liquide) → les lésions périventriculaires sont mieux visibles (sclérose en plaques). La séquence <strong>STIR</strong> (Short TI Inversion Recovery) annule le signal de la graisse → utile en imagerie ostéo-articulaire et en oncologie. L'angio-IRM (ARM) par temps de vol (TOF) ou par injection de gadolinium visualise les vaisseaux sans rayonnement ionisant.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : En SRM, le ratio Cho/NAA augmenté suggère une tumeur (prolifération + destruction neuronale). Le FLAIR annule le LCR (détection des lésions de SEP). Le STIR annule la graisse. La spectroscopie mesure les métabolites via le déplacement chimique (ppm).</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  24. RADIOLOGIE INTERVENTIONNELLE             */
/* ───────────────────────────────────────────── */
"biophysique-radio-interventionnelle": {
  introduction: "La radiologie interventionnelle utilise le guidage par l'image (fluoroscopie, scanner, échographie, IRM) pour réaliser des actes diagnostiques et thérapeutiques mini-invasifs, offrant une alternative à la chirurgie conventionnelle.",
  readTime: 18,
  sections: [
    {
      title: "Principes et techniques de guidage",
      content: `<p class="mb-3">La <strong>radiologie interventionnelle</strong> repose sur le guidage par l'image pour accéder à des structures profondes par voie percutanée (à travers la peau) ou endovasculaire (via les vaisseaux). Les modalités de guidage sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Fluoroscopie</strong> (rayons X en temps réel) : cathétérismes vasculaires, artériographies, pose de stents. Inconvénient : irradiation du patient et de l'opérateur.</li>
<li><strong>Scanner (TDM)</strong> : biopsies profondes (poumon, foie, os), drainages d'abcès. Précision millimétrique mais irradiation.</li>
<li><strong>Échographie</strong> : biopsies superficielles (thyroïde, sein, foie), ponctions articulaires. Temps réel, pas d'irradiation.</li>
<li><strong>IRM</strong> : biopsies de certaines lésions visibles uniquement en IRM (prostate, sein). Pas d'irradiation mais contraintes logistiques.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La fluoroscopie est le guidage de référence pour les gestes vasculaires (cathétérisme). L'échographie est privilégiée pour les gestes superficiels (pas d'irradiation, temps réel). Le scanner pour les cibles profondes.</p></div>`
    },
    {
      title: "Angioplastie et endoprothèses vasculaires",
      content: `<p class="mb-3">L'<strong>angioplastie</strong> est la dilatation d'une artère rétrécie (sténosée) par un ballonnet gonflé sous contrôle fluoroscopique. Un cathéter portant le ballonnet est introduit par voie fémorale ou radiale et guidé jusqu'à la sténose sous fluoroscopie.</p>
<p class="mb-3">Le <strong>stent</strong> (endoprothèse vasculaire) est un treillis métallique déployé dans l'artère pour maintenir sa perméabilité après angioplastie. Les stents actifs (drug-eluting stents) sont recouverts d'un médicament antiprolifératif qui réduit le risque de resténose.</p>
<p class="mb-3">Applications : <strong>angioplastie coronaire</strong> (syndrome coronarien aigu, angor stable résistant au traitement médical), angioplastie des artères des membres inférieurs (artériopathie oblitérante), angioplastie carotidienne, angioplastie rénale.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'angioplastie + stent est le traitement de référence de l'infarctus du myocarde en phase aiguë (angioplastie primaire). Les stents actifs réduisent le risque de resténose par rapport aux stents nus.</p></div>`
    },
    {
      title: "Embolisation et techniques ablatives",
      content: `<p class="mb-3">L'<strong>embolisation</strong> consiste à obstruer volontairement un vaisseau pour arrêter une hémorragie ou priver une tumeur de sa vascularisation. Les agents d'embolisation sont : les particules (microsphères), les coils (spires métalliques), la colle biologique, et les plugs vasculaires.</p>
<p class="mb-3">Applications : <strong>chimio-embolisation hépatique</strong> (TACE) pour les carcinomes hépatocellulaires (injection d'une chimiothérapie directement dans la tumeur puis embolisation), embolisation d'anévrismes cérébraux (coiling), embolisation des fibromes utérins, traitement des hémorragies post-partum.</p>
<p class="mb-3">Les <strong>techniques ablatives percutanées</strong> détruisent les tumeurs par la chaleur ou le froid : <strong>radiofréquence</strong> (courant alternatif → chaleur → nécrose à 60-100°C), <strong>micro-ondes</strong> (agitation moléculaire → chaleur), <strong>cryoablation</strong> (destruction par le froid à -40°C). Guidées par scanner ou échographie.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'embolisation bloque la vascularisation (hémorragies, tumeurs). La chimio-embolisation (TACE) combine chimiothérapie locale et embolisation pour le cancer du foie. La radiofréquence détruit les petites tumeurs par la chaleur.</p></div>`
    },
    {
      title: "Biopsies percutanées et drainages guidés par l'image",
      content: `<p class="mb-3">Les <strong>biopsies percutanées</strong> guidées par l'image permettent d'obtenir un prélèvement tissulaire d'une lésion profonde sans chirurgie. Le guidage (échographie, scanner, IRM) permet de positionner l'aiguille avec précision au sein de la cible.</p>
<p class="mb-3">On distingue deux types de biopsies :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Cytoponction</strong> (aiguille fine, 20-25 G) : aspiration de cellules pour analyse cytologique. Rapide, peu traumatique, mais ne fournit pas d'architecture tissulaire. Utilisée pour la thyroïde, les ganglions.</li>
<li><strong>Biopsie au trocart</strong> (aiguille à guillotine, 14-18 G) : prélèvement d'une carotte de tissu pour analyse histologique. Fournit l'architecture tissulaire et permet l'immunohistochimie. Utilisée pour le foie, le rein, la prostate, le sein.</li>
</ul>
<p class="mb-3">Les <strong>drainages percutanés</strong> évacuent les collections liquidiennes pathologiques (abcès, épanchements, bilomes) par mise en place d'un cathéter sous guidage image. La technique de Seldinger est la plus utilisée : ponction de la collection → passage d'un guide métallique → dilatation du trajet → insertion du cathéter de drainage. Les collections sont aspirées et le cathéter est laissé en place jusqu'à tarissement.</p>
<p class="mb-3">Les <strong>complications</strong> des gestes percutanés sont rares mais doivent être connues : hémorragie (risque principal, d'où le contrôle de la coagulation avant le geste), pneumothorax (biopsies pulmonaires, ~15-20 %), infection, essaimage tumoral sur le trajet de ponction (exceptionnel).</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Cytoponction = cellules (cytologie), trocart = carotte tissulaire (histologie). La technique de Seldinger (guide + dilatateur + cathéter) est la base de tous les gestes percutanés. Le contrôle de la coagulation est obligatoire avant tout geste invasif.</p></div>`
    },
    {
      title: "Radioprotection en radiologie interventionnelle",
      content: `<p class="mb-3">La radiologie interventionnelle sous fluoroscopie expose le patient et l'opérateur à des doses de rayonnements X significatives. L'opérateur reçoit une irradiation continue par le <strong>rayonnement diffusé</strong> (principalement Compton) provenant du patient. La dose à l'opérateur est proportionnelle au <strong>produit dose-surface</strong> (PDS) du patient.</p>
<p class="mb-3">Les mesures de <strong>radioprotection de l'opérateur</strong> comprennent :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Écrans de protection</strong> : tablier plombé (0,25-0,5 mm Pb, atténue ~90-95 % du rayonnement diffusé), protège-thyroïde, lunettes plombées, écran suspendu au plafond et bas-volet sous la table.</li>
<li><strong>Distance</strong> : la dose varie en 1/d². Doubler la distance divise la dose par 4. L'opérateur doit se tenir aussi loin que possible de la source de diffusion (le patient).</li>
<li><strong>Optimisation du faisceau</strong> : utilisation de la scopie pulsée (plutôt que continue), dernier cycle d'image (last image hold), collimation serrée, filtration additionnelle (cuivre).</li>
<li><strong>Dosimétrie personnelle</strong> : deux dosimètres (un sous le tablier au niveau poitrine, un au-dessus au niveau du cou) pour estimer la dose efficace et la dose au cristallin.</li>
</ul>
<p class="mb-3">Pour le <strong>patient</strong>, les doses cutanées en procédures longues (coronarographies complexes, embolisations) peuvent atteindre le seuil d'effets déterministes : érythème transitoire dès 2 Gy, épilation temporaire dès 3 Gy, nécrose cutanée au-delà de 12 Gy. Le <strong>niveau de référence diagnostique</strong> (NRD) et le suivi du PDS permettent de surveiller et d'optimiser les doses délivrées.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : En radiologie interventionnelle, l'opérateur est irradié par le rayonnement diffusé (Compton) du patient. Le tablier plombé atténue ~90-95 %. La dose cutanée patient peut dépasser les seuils d'effets déterministes (érythème > 2 Gy). La nouvelle limite cristallin est 20 mSv/an.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  25. ÉLECTRICITÉ CARDIAQUE                    */
/* ───────────────────────────────────────────── */
"biophysique-electricite-cardiaque": {
  introduction: "L'électricité cardiaque couvre la biophysique approfondie de l'activité électrique du cœur : les bases ioniques des potentiels d'action cardiaques, la modélisation dipolaire, les troubles du rythme et les dispositifs de stimulation cardiaque.",
  readTime: 20,
  sections: [
    {
      title: "Potentiel d'action cardiaque et canaux ioniques",
      content: `<p class="mb-3">Le <strong>potentiel d'action</strong> (PA) des cardiomyocytes ventriculaires dure ~300 ms (vs ~2 ms pour le PA neuronal) et comprend 5 phases distinctes impliquant des canaux ioniques spécifiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Phase 0</strong> (dépolarisation rapide) : ouverture des canaux Na⁺ rapides (I_Na). Vm passe de -90 mV à +20 mV en ~1 ms. dV/dt_max ≈ 200 V/s dans le ventricule.</li>
<li><strong>Phase 1</strong> (repolarisation initiale) : inactivation de I_Na + courant sortant transitoire I_to (K⁺).</li>
<li><strong>Phase 2</strong> (plateau) : équilibre entre courant entrant I_Ca,L (Ca²⁺ de type L) et courants sortants K⁺ (I_Kr, I_Ks). Durée ~200 ms. Le Ca²⁺ entrant déclenche la contraction.</li>
<li><strong>Phase 3</strong> (repolarisation) : inactivation de I_Ca,L + augmentation de I_Kr et I_K1 (K⁺). Vm revient à -90 mV.</li>
<li><strong>Phase 4</strong> (repos) : potentiel de repos stable maintenu par I_K1 dans les cellules contractiles. Dépolarisation diastolique spontanée (I_f = HCN) dans les cellules pacemakeraires.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : Le plateau calcique (phase 2) est la caractéristique distinctive du PA cardiaque. I_Ca,L couple l'excitation à la contraction (couplage excitation-contraction). Le courant I_f est responsable de l'automatisme sinusal.</p></div>`
    },
    {
      title: "Automatisme et conduction cardiaque",
      content: `<p class="mb-3">Les cellules <strong>pacemakeraires</strong> du nœud sinusal possèdent un automatisme intrinsèque : leur potentiel de repos est instable et se dépolarise spontanément pendant la diastole (phase 4). Cette <strong>dépolarisation diastolique</strong> est principalement due au courant I_f (« funny current », canaux HCN activés par l'hyperpolarisation).</p>
<p class="mb-3">Le PA des cellules nodales (sinusal, AV) diffère de celui des cellules contractiles :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Pas de phase 0 sodique rapide : la dépolarisation est due à I_Ca,L (lente) → vitesse de conduction faible (~0,05 m/s dans le NAV vs ~2 m/s dans les fibres de Purkinje).</li>
<li>Pas de plateau (phase 2) marqué.</li>
<li>Phase 4 instable (dépolarisation diastolique spontanée).</li>
</ul>
<p class="mb-3">La <strong>hiérarchie des pacemakers</strong> : le nœud sinusal (60-100 bpm) impose son rythme car sa fréquence de décharge est la plus élevée. Si le nœud sinusal défaille, le NAV (40-60 bpm) prend le relais, puis le faisceau de His et les fibres de Purkinje (20-40 bpm) comme derniers recours.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'automatisme sinusal est dû au courant I_f (HCN). Le PA nodal est « lent » (I_Ca,L, pas de I_Na rapide). Le nœud sinusal domine car il a la fréquence intrinsèque la plus élevée.</p></div>`
    },
    {
      title: "Modélisation dipolaire et théorie de l'ECG",
      content: `<p class="mb-3">Le cœur en activité peut être modélisé comme un <strong>dipôle électrique</strong> dont le moment dipolaire (vecteur cardiaque) varie au cours du cycle cardiaque. Ce dipôle crée un champ de potentiel dans le thorax qui est mesuré par les électrodes de l'ECG.</p>
<p class="mb-3">Le potentiel mesuré V en un point est proportionnel à la projection du moment dipolaire sur l'axe de la dérivation : V = k × (d⃗ · û), où d⃗ est le vecteur dipolaire et û l'axe de la dérivation. C'est pourquoi chaque dérivation « voit » une composante différente du même vecteur.</p>
<p class="mb-3">Le <strong>vectocardiogramme</strong> (VCG) représente l'évolution du vecteur cardiaque dans le temps en 3D. Les boucles P (oreillettes), QRS (ventricules) et T (repolarisation) résument l'activité électrique dans les trois plans : frontal, horizontal et sagittal. L'ECG standard est une projection simplifiée du VCG.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : L'ECG enregistre la PROJECTION du vecteur cardiaque sur l'axe de chaque dérivation. Un QRS positif signifie que le vecteur pointe VERS l'électrode exploratrice. Un QRS négatif = il s'en éloigne.</p></div>`
    },
    {
      title: "Troubles du rythme et stimulation cardiaque",
      content: `<p class="mb-3">Les <strong>troubles du rythme</strong> (arythmies) résultent de trois mécanismes biophysiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Anomalies de l'automatisme</strong> : accélération (tachycardie sinusale) ou ralentissement (bradycardie sinusale) du nœud sinusal, ou émergence d'un foyer ectopique d'automatisme.</li>
<li><strong>Anomalies de la conduction</strong> : blocs (ralentissement ou interruption) au niveau du NAV (blocs AV) ou des branches du His (blocs de branche).</li>
<li><strong>Réentrées</strong> : un circuit anormal permet à l'influx de tourner en boucle. Conditions : voie lente + voie rapide + bloc unidirectionnel. La fibrillation auriculaire et la tachycardie ventriculaire par réentrée sont les exemples les plus fréquents.</li>
</ul>
<p class="mb-3">Le <strong>pacemaker</strong> (stimulateur cardiaque) est un dispositif implantable qui délivre des impulsions électriques au myocarde pour traiter les bradycardies. Le <strong>défibrillateur automatique implantable</strong> (DAI) détecte et traite les tachycardies/fibrillations ventriculaires par un choc électrique interne. La <strong>défibrillation</strong> externe (DEA) délivre un choc de 150-360 J qui dépolarise simultanément l'ensemble du myocarde pour « réinitialiser » le rythme.</p>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La réentrée nécessite 3 conditions : 2 voies de conduction + bloc unidirectionnel + vitesse de conduction lente dans une voie. La défibrillation dépolarise tout le myocarde simultanément pour interrompre les circuits de réentrée.</p></div>`
    },
    {
      title: "Périodes réfractaires, vulnérabilité et effets des médicaments antiarythmiques",
      content: `<p class="mb-3">La <strong>période réfractaire</strong> est l'intervalle pendant lequel la cellule cardiaque ne peut pas être réexcitée. Elle est fondamentale pour la protection contre les arythmies :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Période réfractaire absolue</strong> (PRA) : aucun stimulus, même intense, ne peut déclencher un nouveau PA. Correspond aux phases 0-2 et au début de la phase 3. Empêche la tétanisation du muscle cardiaque.</li>
<li><strong>Période réfractaire relative</strong> (PRR) : un stimulus supranormal peut déclencher un PA, mais de moindre amplitude et de propagation ralentie. Correspond à la fin de la phase 3.</li>
<li><strong>Période réfractaire effective</strong> (PRE) : période cliniquement pertinente pendant laquelle aucun PA propagé ne peut être engendré (PRA + début PRR).</li>
</ul>
<p class="mb-3">La <strong>période vulnérable</strong> correspond à la fin de la repolarisation (sommet de l'onde T sur l'ECG). Un stimulus survenant pendant cette période peut déclencher une <strong>fibrillation ventriculaire</strong> (phénomène R/T). C'est pourquoi un choc électrique externe (cardioversion) est toujours synchronisé sur l'onde R pour éviter la période vulnérable.</p>
<p class="mb-3">Les <strong>antiarythmiques</strong> sont classés selon Vaughan-Williams :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Classe I</strong> : bloqueurs des canaux Na⁺ (Ia : quinidine ; Ib : lidocaïne ; Ic : flécaïnide). Ralentissent la phase 0.</li>
<li><strong>Classe II</strong> : bêta-bloquants (propranolol, aténolol). Réduisent l'automatisme sinusal et la conduction AV.</li>
<li><strong>Classe III</strong> : bloqueurs des canaux K⁺ (amiodarone, sotalol). Allongent le PA et la PRE.</li>
<li><strong>Classe IV</strong> : bloqueurs des canaux Ca²⁺ (vérapamil, diltiazem). Ralentissent la conduction dans le NAV.</li>
</ul>
<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-amber-800">Point clé PASS/LAS : La PRA empêche le tétanos cardiaque. La période vulnérable (onde T) → risque de FV si stimulus (phénomène R/T). La cardioversion est synchronisée sur l'onde R. Les antiarythmiques de classe III allongent la PRE (bloquent K⁺).</p></div>`
    }
  ]
},

};
