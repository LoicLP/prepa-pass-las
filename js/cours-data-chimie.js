/* ===== COURS DÉTAILLÉS — CHIMIE / BIOCHIMIE ===== */
const COURS_CHIMIE = {

/* ───────────────────────────────────────────── */
/*  1. ATOMISTIQUE                               */
/* ───────────────────────────────────────────── */
"chimie-atomistique": {
  introduction: "L'atomistique est l'étude de la structure de l'atome, de ses constituants et des règles qui régissent la répartition des électrons. Elle constitue le socle de toute la chimie et permet de comprendre la formation des liaisons, la géométrie des molécules et la réactivité chimique.",
  readTime: 20,
  sections: [
    {
      title: "Structure de l'atome et particules subatomiques",
      content: `<p class="mb-3">L'atome est constitué d'un <strong>noyau</strong> central contenant des protons (charge +e) et des neutrons (charge nulle), entouré d'un <strong>cortège électronique</strong> formé d'électrons (charge -e). Le numéro atomique Z correspond au nombre de protons, le nombre de masse A = Z + N (N = nombre de neutrons).</p>
<p class="mb-3">Les <strong>isotopes</strong> sont des atomes ayant le même Z mais un N différent. Par exemple, le carbone possède trois isotopes naturels : ¹²C (98,9 %), ¹³C (1,1 %) et ¹⁴C (traces, radioactif). La masse atomique indiquée dans la classification périodique est une moyenne pondérée des masses isotopiques.</p>
<p class="mb-3">Les dimensions caractéristiques sont : rayon du noyau ≈ 10⁻¹⁵ m (femtomètre), rayon de l'atome ≈ 10⁻¹⁰ m (angström). Le noyau concentre plus de 99,97 % de la masse de l'atome malgré un volume 10¹⁵ fois plus petit.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Le numéro atomique Z définit l'élément chimique. Deux atomes ayant le même Z mais un A différent sont des isotopes. La masse atomique du tableau périodique est une moyenne pondérée.</p></div>`
    },
    {
      title: "Modèle quantique et nombres quantiques",
      content: `<p class="mb-3">Le modèle quantique de l'atome, développé par Schrödinger (1926), décrit l'électron non plus comme une particule sur une orbite mais comme une <strong>fonction d'onde ψ</strong> dont le carré |ψ|² représente la densité de probabilité de présence de l'électron.</p>
<p class="mb-3">Chaque électron est caractérisé par quatre <strong>nombres quantiques</strong> :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>n</strong> (principal) : n = 1, 2, 3... Définit la couche et l'énergie principale de l'électron.</li>
<li><strong>l</strong> (secondaire ou azimutal) : 0 ≤ l ≤ n-1. Définit la sous-couche (s, p, d, f pour l = 0, 1, 2, 3).</li>
<li><strong>ml</strong> (magnétique) : -l ≤ ml ≤ +l. Définit l'orientation de l'orbitale dans l'espace.</li>
<li><strong>ms</strong> (spin) : +1/2 ou -1/2. Définit le moment cinétique intrinsèque de l'électron.</li>
</ul>
<p class="mb-3">Le <strong>principe d'exclusion de Pauli</strong> stipule que deux électrons d'un même atome ne peuvent avoir les quatre mêmes nombres quantiques. Chaque orbitale (définie par n, l, ml) contient donc au maximum 2 électrons de spins opposés.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Les 4 nombres quantiques (n, l, ml, ms) décrivent entièrement l'état d'un électron. Le principe de Pauli interdit à deux électrons d'un même atome d'avoir le même jeu de 4 nombres quantiques.</p></div>`
    },
    {
      title: "Configuration électronique et règles de remplissage",
      content: `<p class="mb-3">La <strong>configuration électronique</strong> décrit la répartition des électrons dans les différentes sous-couches. Elle suit trois règles fondamentales :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Règle de Klechkowski</strong> : les sous-couches se remplissent par ordre croissant de (n + l), et à (n + l) égal, par n croissant. Ordre : 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d...</li>
<li><strong>Règle de Hund</strong> : dans une sous-couche donnée, les électrons occupent le maximum d'orbitales avec des spins parallèles avant de s'apparier.</li>
<li><strong>Principe de Pauli</strong> : maximum 2 électrons par orbitale, de spins opposés.</li>
</ul>
<p class="mb-3">Exemple : le fer (Z = 26) a pour configuration 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶. Attention aux exceptions notables : le chrome (Z = 24) adopte la configuration [Ar] 3d⁵ 4s¹ et le cuivre (Z = 29) adopte [Ar] 3d¹⁰ 4s¹, car les sous-couches d à moitié ou totalement remplies sont particulièrement stables.</p>
<p class="mb-3">Les <strong>électrons de valence</strong> sont ceux de la couche de plus grand n et de la sous-couche d en cours de remplissage. Ce sont eux qui participent aux liaisons chimiques.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : L'ordre de remplissage suit la règle de Klechkowski (n+l croissant). Les exceptions du chrome et du cuivre s'expliquent par la stabilité particulière des sous-couches d⁵ et d¹⁰.</p></div>`
    },
    {
      title: "Orbitales atomiques et formes",
      content: `<p class="mb-3">Les <strong>orbitales atomiques</strong> (OA) sont les régions de l'espace où la probabilité de trouver l'électron est significative (généralement > 90 %). Leur forme dépend du nombre quantique l :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Orbitale s</strong> (l = 0) : symétrie sphérique, une seule orientation possible.</li>
<li><strong>Orbitale p</strong> (l = 1) : forme bilobée (deux lobes de signes opposés), 3 orientations (px, py, pz).</li>
<li><strong>Orbitale d</strong> (l = 2) : formes quadrilobées complexes, 5 orientations.</li>
<li><strong>Orbitale f</strong> (l = 3) : formes encore plus complexes, 7 orientations.</li>
</ul>
<p class="mb-3">La notion de <strong>noeuds</strong> est importante : un noeud est une surface où ψ = 0. Il existe (n - l - 1) noeuds radiaux et l noeuds angulaires, soit (n - 1) noeuds au total. Plus n augmente, plus l'orbitale est étendue et possède de noeuds.</p>
<p class="mb-3">L'énergie d'une OA dépend de n dans l'atome d'hydrogène (En = -13,6/n² eV), mais de n et l dans les atomes polyélectroniques en raison de l'effet d'écran.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : La forme des OA dépend de l (sphérique pour s, bilobée pour p, quadrilobée pour d). Dans les atomes polyélectroniques, l'énergie dépend de n ET de l à cause de l'écrantage.</p></div>`
    },
    {
      title: "Propriétés périodiques des atomes",
      content: `<p class="mb-3">Les propriétés atomiques varient de façon périodique avec Z, ce qui est directement lié à la configuration électronique :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Rayon atomique</strong> : augmente de haut en bas (ajout de couches) et diminue de gauche à droite (augmentation de Zeff) dans la classification périodique.</li>
<li><strong>Énergie d'ionisation (EI)</strong> : énergie minimale pour arracher un électron. Augmente de gauche à droite et de bas en haut. L'EI1 la plus élevée est celle des gaz nobles.</li>
<li><strong>Affinité électronique (AE)</strong> : énergie libérée lors de la capture d'un électron. Les halogènes possèdent les AE les plus élevées en valeur absolue.</li>
<li><strong>Électronégativité (χ)</strong> : capacité d'un atome à attirer les électrons d'une liaison. Échelle de Pauling : le fluor (χ = 4,0) est le plus électronégatif.</li>
</ul>
<p class="mb-3">La <strong>charge nucléaire effective</strong> Zeff = Z - σ (où σ est la constante d'écran) explique ces tendances. Les règles de Slater permettent de calculer σ en tenant compte de l'écrantage par les autres électrons.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Les propriétés atomiques (rayon, EI, AE, χ) suivent des tendances périodiques explicables par la variation de Zeff. Le fluor est l'élément le plus électronégatif (χ = 4,0 sur l'échelle de Pauling).</p></div>`
    },
    {
      title: "Liaisons chimiques et orbitales moléculaires",
      content: `<p class="mb-3">La <strong>liaison covalente</strong> résulte de la mise en commun d'électrons entre deux atomes. Selon la théorie LCAO (Linear Combination of Atomic Orbitals), les OA se combinent pour former des <strong>orbitales moléculaires</strong> (OM) liantes (σ, π) et antiliantes (σ*, π*).</p>
<p class="mb-3">L'<strong>indice de liaison</strong> IL = (nb e⁻ liants - nb e⁻ antiliants) / 2 indique la force de la liaison. Pour O₂ : IL = (8 - 4)/2 = 2, soit une double liaison. Le diagramme d'OM de O₂ montre deux électrons célibataires dans les OM π*, expliquant son paramagnétisme.</p>
<p class="mb-3">La <strong>théorie VSEPR</strong> (Gillespie) prédit la géométrie des molécules à partir du nombre de doublets liants et non liants autour de l'atome central. Les géométries principales sont :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li>AX₂ : linéaire (180°) — ex. CO₂</li>
<li>AX₃ : trigonale plane (120°) — ex. BF₃</li>
<li>AX₄ : tétraédrique (109,5°) — ex. CH₄</li>
<li>AX₂E₂ : coudée — ex. H₂O (104,5°)</li>
</ul>
<p class="mb-3">L'<strong>hybridation</strong> des OA (sp, sp², sp³) permet d'expliquer les géométries observées. Le carbone tétravalent en hybridation sp³ forme quatre liaisons équivalentes dirigées vers les sommets d'un tétraèdre.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : La théorie VSEPR prédit la géométrie moléculaire à partir des doublets autour de l'atome central. L'hybridation (sp, sp², sp³) explique la géométrie réelle des liaisons du carbone et d'autres atomes.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  2. THERMODYNAMIQUE CHIMIQUE                  */
/* ───────────────────────────────────────────── */
"chimie-thermo": {
  introduction: "La thermodynamique chimique étudie les échanges d'énergie lors des réactions chimiques et permet de prédire le sens spontané d'une réaction, sa position d'équilibre et les conditions de température et pression qui la favorisent. Elle repose sur trois principes fondamentaux.",
  readTime: 20,
  sections: [
    {
      title: "Premier principe et enthalpie",
      content: `<p class="mb-3">Le <strong>premier principe</strong> de la thermodynamique est le principe de conservation de l'énergie : l'énergie totale d'un système isolé reste constante. Pour un système fermé : ΔU = W + Q (variation d'énergie interne = travail + chaleur).</p>
<p class="mb-3">À pression constante (conditions habituelles en biologie), on utilise l'<strong>enthalpie</strong> H = U + PV. La variation d'enthalpie ΔH représente la chaleur échangée à pression constante : ΔH = Qp.</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Réaction exothermique</strong> : ΔH < 0, le système libère de la chaleur (ex. combustion du glucose : C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O, ΔH = -2808 kJ/mol).</li>
<li><strong>Réaction endothermique</strong> : ΔH > 0, le système absorbe de la chaleur (ex. décomposition du CaCO₃).</li>
</ul>
<p class="mb-3">La <strong>loi de Hess</strong> stipule que ΔH d'une réaction ne dépend que des états initial et final, pas du chemin suivi. On peut donc calculer ΔH° en utilisant les enthalpies standard de formation : ΔrH° = Σ ΔfH°(produits) - Σ ΔfH°(réactifs).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : L'enthalpie de réaction ΔrH° se calcule par la loi de Hess à partir des enthalpies standard de formation. ΔH < 0 signifie réaction exothermique, ΔH > 0 réaction endothermique.</p></div>`
    },
    {
      title: "Deuxième principe et entropie",
      content: `<p class="mb-3">Le <strong>deuxième principe</strong> introduit l'<strong>entropie S</strong>, grandeur qui mesure le désordre d'un système. Pour une transformation irréversible : ΔSunivers = ΔSsystème + ΔSextérieur > 0. L'entropie de l'univers ne peut qu'augmenter.</p>
<p class="mb-3">L'entropie est une fonction d'état extensive, mesurée en J/(mol·K). Elle augmente avec la température, le volume et le nombre de moles de gaz. Quelques règles qualitatives :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li>S(gaz) > S(liquide) > S(solide) pour une même substance.</li>
<li>L'entropie augmente avec la complexité moléculaire (plus d'atomes = plus de modes de vibration).</li>
<li>Une réaction produisant plus de moles de gaz a un ΔS > 0.</li>
</ul>
<p class="mb-3">Le <strong>troisième principe</strong> (Nernst) énonce que l'entropie d'un cristal parfait est nulle à 0 K, ce qui permet de définir des entropies absolues S° pour chaque substance.</p>
<p class="mb-3">Le calcul de ΔrS° suit la même logique que pour l'enthalpie : ΔrS° = Σ S°(produits) - Σ S°(réactifs).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : L'entropie mesure le désordre moléculaire. Le deuxième principe impose ΔSunivers > 0 pour toute transformation spontanée irréversible. S(gaz) > S(liquide) > S(solide).</p></div>`
    },
    {
      title: "Enthalpie libre de Gibbs et spontanéité",
      content: `<p class="mb-3">L'<strong>enthalpie libre de Gibbs</strong> G = H - TS est le critère de spontanéité à T et P constantes (conditions biologiques). Une réaction est spontanée si <strong>ΔG < 0</strong> (exergonique) et non spontanée si ΔG > 0 (endergonique).</p>
<p class="mb-3">La relation fondamentale est : <strong>ΔG = ΔH - TΔS</strong>. Quatre cas se présentent :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li>ΔH < 0 et ΔS > 0 : ΔG < 0 à toute température (toujours spontanée).</li>
<li>ΔH > 0 et ΔS < 0 : ΔG > 0 à toute température (jamais spontanée).</li>
<li>ΔH < 0 et ΔS < 0 : spontanée à basse température (T < ΔH/ΔS).</li>
<li>ΔH > 0 et ΔS > 0 : spontanée à haute température (T > ΔH/ΔS).</li>
</ul>
<p class="mb-3">À l'<strong>équilibre</strong>, ΔG = 0 et la température d'inversion est T = ΔH/ΔS. La relation avec la constante d'équilibre K est : ΔG° = -RT ln K, soit K = e^(-ΔG°/RT).</p>
<p class="mb-3">En conditions non standard : ΔG = ΔG° + RT ln Q, où Q est le quotient réactionnel. La réaction évolue spontanément tant que Q < K.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : ΔG = ΔH - TΔS est le critère de spontanéité à T et P constantes. ΔG° = -RT ln K relie l'enthalpie libre standard à la constante d'équilibre. À l'équilibre, ΔG = 0.</p></div>`
    },
    {
      title: "Équilibres chimiques et loi de Le Chatelier",
      content: `<p class="mb-3">Un <strong>équilibre chimique</strong> est un état dynamique où les vitesses des réactions directe et inverse sont égales. La constante d'équilibre K est définie par l'expression : K = Π(activités des produits) / Π(activités des réactifs), chaque activité étant élevée à la puissance de son coefficient stoechiométrique.</p>
<p class="mb-3">La <strong>loi de Le Chatelier</strong> prédit l'effet d'une perturbation sur l'équilibre : le système évolue de façon à s'opposer à la modification imposée :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Ajout de réactif</strong> : déplacement vers la droite (formation de produits).</li>
<li><strong>Augmentation de température</strong> : déplacement dans le sens endothermique.</li>
<li><strong>Augmentation de pression</strong> : déplacement vers le côté ayant le moins de moles de gaz.</li>
<li><strong>Ajout d'un catalyseur</strong> : aucun déplacement (il accélère les deux sens de façon égale).</li>
</ul>
<p class="mb-3">La relation de <strong>Van't Hoff</strong> décrit l'influence de la température sur K : d(ln K)/dT = ΔrH°/(RT²). Pour une réaction exothermique, K diminue quand T augmente.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : La loi de Le Chatelier permet de prédire qualitativement le déplacement d'un équilibre. Un catalyseur accélère l'atteinte de l'équilibre mais ne le déplace pas.</p></div>`
    },
    {
      title: "Potentiel chimique et équilibres de phases",
      content: `<p class="mb-3">Le <strong>potentiel chimique</strong> μi d'un constituant i est défini comme la dérivée partielle de G par rapport à ni (à T, P et nj constants) : μi = (∂G/∂ni). À l'équilibre, le potentiel chimique de chaque espèce est identique dans toutes les phases.</p>
<p class="mb-3">Pour un gaz parfait : μi = μi° + RT ln(Pi/P°). Pour un soluté en solution idéale : μi = μi° + RT ln(Ci/C°). L'activité ai est le rapport de la concentration (ou pression) à la valeur de référence.</p>
<p class="mb-3">Les <strong>diagrammes de phases</strong> représentent les domaines d'existence des différents états physiques en fonction de T et P. Le point triple est l'unique couple (T, P) où les trois phases coexistent. Le point critique marque la disparition de la distinction liquide/gaz.</p>
<p class="mb-3">La <strong>relation de Clapeyron</strong> décrit la pente des courbes d'équilibre : dP/dT = ΔH/(TΔV). Pour la vaporisation de l'eau, ΔH > 0 et ΔV > 0, donc la pression de vapeur augmente avec la température.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Le potentiel chimique μ est le critère d'équilibre entre phases. Au point triple, les trois phases coexistent. La relation de Clapeyron relie la pente des courbes de changement d'état à ΔH et ΔV.</p></div>`
    },
    {
      title: "Applications biologiques de la thermodynamique",
      content: `<p class="mb-3">En biochimie, l'<strong>ATP</strong> (adénosine triphosphate) joue un rôle central de monnaie énergétique. L'hydrolyse de l'ATP en ADP + Pi a un ΔG°' = -30,5 kJ/mol (conditions standard biochimiques, pH 7). In vivo, le ΔG est encore plus négatif (≈ -50 kJ/mol) en raison des concentrations cellulaires réelles.</p>
<p class="mb-3">Le <strong>couplage énergétique</strong> permet de rendre spontanée une réaction endergonique en la couplant à l'hydrolyse de l'ATP. Par exemple, la phosphorylation du glucose (ΔG°' = +13,8 kJ/mol) couplée à l'hydrolyse de l'ATP donne un ΔG°' global = -16,7 kJ/mol.</p>
<p class="mb-3">Les réactions biochimiques fonctionnent souvent loin de l'équilibre, ce qui permet une régulation fine du métabolisme. Les étapes irréversibles (ΔG très négatif) constituent les points de régulation clés des voies métaboliques.</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li>Les composés riches en énergie (ATP, phosphoénolpyruvate, créatine-phosphate) possèdent un potentiel de transfert de groupement phosphoryle élevé.</li>
<li>Le gradient de protons à travers la membrane mitochondriale constitue une forme de stockage d'énergie libre (force proton-motrice).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : L'ATP est la monnaie énergétique universelle. Le couplage énergétique permet de coupler une réaction endergonique à l'hydrolyse de l'ATP pour la rendre thermodynamiquement favorable.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  3. CHIMIE ORGANIQUE                          */
/* ───────────────────────────────────────────── */
"chimie-organique": {
  introduction: "La chimie organique étudie les composés du carbone et leurs réactions. Discipline essentielle en PASS/LAS, elle permet de comprendre la structure des biomolécules, le mécanisme d'action des médicaments et les transformations chimiques fondamentales du vivant.",
  readTime: 22,
  sections: [
    {
      title: "Hybridation du carbone et liaisons",
      content: `<p class="mb-3">Le carbone (Z = 6, configuration 1s² 2s² 2p²) est tétravalent grâce à l'<strong>hybridation</strong> de ses orbitales de valence. Trois types d'hybridation sont possibles :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>sp³</strong> : 4 orbitales hybrides équivalentes dirigées vers les sommets d'un tétraèdre (angles de 109,5°). Liaison σ uniquement. Ex. : CH₄, éthane C₂H₆.</li>
<li><strong>sp²</strong> : 3 orbitales hybrides dans un plan (120°) + 1 orbitale p non hybridée perpendiculaire, formant une liaison π. Ex. : éthylène C₂H₄, benzène C₆H₆.</li>
<li><strong>sp</strong> : 2 orbitales hybrides linéaires (180°) + 2 orbitales p pour former deux liaisons π. Ex. : acétylène C₂H₂, CO₂.</li>
</ul>
<p class="mb-3">La <strong>liaison σ</strong> résulte d'un recouvrement axial (libre rotation possible). La <strong>liaison π</strong> résulte d'un recouvrement latéral (bloque la rotation, à l'origine de l'isomérie Z/E). L'énergie de la liaison C=C (614 kJ/mol) est inférieure au double de C-C (348 kJ/mol), ce qui rend la liaison π plus réactive.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : L'hybridation sp³ → tétraèdre (109,5°), sp² → plan (120°), sp → linéaire (180°). La liaison π (recouvrement latéral) empêche la rotation et est plus réactive que la liaison σ.</p></div>`
    },
    {
      title: "Nomenclature et groupes fonctionnels",
      content: `<p class="mb-3">La nomenclature IUPAC suit des règles systématiques. La chaîne principale est la plus longue chaîne carbonée contenant le groupe fonctionnel prioritaire. Les substituants sont nommés en préfixe, le groupe fonctionnel en suffixe :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Alcool</strong> (-OH) : suffixe -ol. Ex. : éthanol CH₃CH₂OH.</li>
<li><strong>Aldéhyde</strong> (-CHO) : suffixe -al. Ex. : éthanal CH₃CHO.</li>
<li><strong>Cétone</strong> (C=O) : suffixe -one. Ex. : propanone (acétone) CH₃COCH₃.</li>
<li><strong>Acide carboxylique</strong> (-COOH) : suffixe -oïque. Ex. : acide éthanoïque CH₃COOH.</li>
<li><strong>Amine</strong> (-NH₂) : suffixe -amine. Ex. : éthanamine CH₃CH₂NH₂.</li>
<li><strong>Ester</strong> (-COOR) : suffixe -oate d'alkyle. Ex. : éthanoate de méthyle CH₃COOCH₃.</li>
<li><strong>Amide</strong> (-CONH₂) : suffixe -amide. Ex. : éthanamide CH₃CONH₂.</li>
</ul>
<p class="mb-3">L'ordre de priorité des groupes fonctionnels est : acide carboxylique > ester > amide > aldéhyde > cétone > alcool > amine. Les groupes de plus basse priorité sont cités en préfixe (oxo-, hydroxy-, amino-).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : En nomenclature IUPAC, identifier la chaîne principale la plus longue contenant le groupe fonctionnel prioritaire. Retenir l'ordre de priorité : COOH > COOR > CONH₂ > CHO > CO > OH > NH₂.</p></div>`
    },
    {
      title: "Effets électroniques : inductif et mésomère",
      content: `<p class="mb-3">Les <strong>effets électroniques</strong> expliquent la répartition de la densité électronique dans une molécule et déterminent sa réactivité :</p>
<p class="mb-3"><strong>Effet inductif (I)</strong> : déplacement de la densité électronique le long des liaisons σ dû à une différence d'électronégativité. Il s'atténue rapidement avec la distance (négligeable au-delà de 3 liaisons).</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Effet -I</strong> (attracteur) : halogènes (F, Cl, Br), -OH, -NH₂, -NO₂, -COOH. Ils attirent les électrons vers eux.</li>
<li><strong>Effet +I</strong> (donneur) : groupes alkyles (méthyle, éthyle...). Plus la chaîne est ramifiée, plus l'effet +I est important.</li>
</ul>
<p class="mb-3"><strong>Effet mésomère (M)</strong> : délocalisation des électrons π ou des doublets non liants à travers un système conjugué. Il se propage sans atténuation sur tout le système conjugué.</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Effet +M</strong> (donneur) : -OH, -OR, -NH₂, -NR₂, halogènes. Ils injectent un doublet dans le système π.</li>
<li><strong>Effet -M</strong> (attracteur) : -NO₂, -COOH, -COR, -CN, -SO₃H. Ils retirent de la densité électronique.</li>
</ul>
<p class="mb-3">Les halogènes présentent une dualité : effet -I (attracteur par électronégativité) mais effet +M (donneur par mésomérie). Globalement, ils sont faiblement désactivants en substitution électrophile aromatique mais orienteurs en ortho/para.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : L'effet inductif (σ) s'atténue avec la distance, l'effet mésomère (π) se propage sans atténuation. Les halogènes sont -I et +M. Ces effets déterminent la réactivité et la sélectivité des réactions.</p></div>`
    },
    {
      title: "Réactions de substitution et d'élimination",
      content: `<p class="mb-3">Les <strong>substitutions nucléophiles</strong> impliquent le remplacement d'un groupe partant par un nucléophile. Deux mécanismes principaux :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>SN2</strong> (bimoléculaire) : mécanisme concerté en une seule étape avec inversion de Walden. Favorisée par : substrat primaire peu encombré, bon nucléophile, solvant aprotique polaire. Cinétique d'ordre 2 : v = k[substrat][nucléophile].</li>
<li><strong>SN1</strong> (unimoléculaire) : mécanisme en deux étapes avec formation d'un carbocation intermédiaire. Favorisée par : substrat tertiaire (carbocation stabilisé), solvant protique polaire. Cinétique d'ordre 1 : v = k[substrat]. Racémisation partielle.</li>
</ul>
<p class="mb-3">Les <strong>réactions d'élimination</strong> forment une double liaison par départ d'un groupe partant et d'un proton :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>E2</strong> : mécanisme concerté, anti-périplanaire. Favorisée par les bases fortes et encombrées (tBuOK).</li>
<li><strong>E1</strong> : via un carbocation, souvent en compétition avec SN1. Règle de Zaïtsev : l'alcène le plus substitué est majoritaire.</li>
</ul>
<p class="mb-3">La compétition SN/E dépend de la nature du substrat (primaire → SN2, tertiaire → SN1/E1), de la force et de l'encombrement de la base/nucléophile, et du solvant.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : SN2 = concertée, inversion de Walden, substrat primaire. SN1 = carbocation, racémisation, substrat tertiaire. E2 = anti-périplanaire, base forte. La compétition SN/E est un classique du PASS.</p></div>`
    },
    {
      title: "Réactions d'addition et aromaticité",
      content: `<p class="mb-3">Les <strong>additions électrophiles</strong> sur les alcènes sont parmi les réactions les plus importantes en chimie organique. La double liaison C=C, riche en électrons, réagit avec les électrophiles :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Hydratation</strong> (H₂O/H⁺) : addition de H et OH selon la règle de Markovnikov (H se fixe sur le carbone le plus hydrogéné).</li>
<li><strong>Halogénation</strong> (Br₂, Cl₂) : addition anti via un intermédiaire ponté (ion bromonium). Stéréochimie anti.</li>
<li><strong>Hydrogénation</strong> (H₂/catalyseur) : addition syn sur la même face. Réaction exothermique.</li>
<li><strong>Hydroboration</strong> (BH₃ puis H₂O₂/OH⁻) : addition anti-Markovnikov et syn.</li>
</ul>
<p class="mb-3">Le <strong>benzène</strong> (C₆H₆) possède une stabilité particulière due à l'<strong>aromaticité</strong>. Selon la règle de Hückel, un composé cyclique plan est aromatique s'il possède (4n + 2) électrons π délocalisés. Le benzène (6 e⁻ π, n = 1) subit préférentiellement des <strong>substitutions électrophiles aromatiques</strong> (SEAr) plutôt que des additions, afin de conserver l'aromaticité.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : La règle de Markovnikov oriente l'addition électrophile. L'aromaticité (règle de Hückel : 4n+2 e⁻ π) explique pourquoi le benzène préfère la substitution à l'addition.</p></div>`
    },
    {
      title: "Réactivité des groupes carbonylés",
      content: `<p class="mb-3">Le groupe <strong>carbonyle</strong> (C=O) est un site réactif majeur en chimie organique et en biochimie. La polarisation de la liaison C=O (δ+ sur C, δ- sur O) rend le carbone électrophile et l'oxygène nucléophile.</p>
<p class="mb-3">L'<strong>addition nucléophile</strong> sur les aldéhydes et cétones produit :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li>Avec H₂O : hydrate (gem-diol). Réversible, favorisée pour les aldéhydes.</li>
<li>Avec ROH : hémiacétal puis acétal (en milieu acide). Réaction importante en chimie des glucides (formes cycliques).</li>
<li>Avec RNH₂ : imine (base de Schiff) après élimination d'eau. Réaction clé en biochimie (vitamine B6, rétinal).</li>
<li>Avec RMgX (organomagnésien) : alcool secondaire (aldéhyde) ou tertiaire (cétone).</li>
</ul>
<p class="mb-3">La <strong>substitution nucléophile sur les acyles</strong> (dérivés d'acides : esters, amides, anhydrides, halogénures d'acyle) suit un mécanisme addition-élimination. L'ordre de réactivité est : halogénure d'acyle > anhydride > ester > amide (lié à la qualité du groupe partant).</p>
<p class="mb-3">La <strong>condensation aldolique</strong> implique l'attaque de l'énolate d'un composé carbonylé sur le carbonyle d'un autre, formant un β-hydroxy-carbonylé (aldol). En milieu biologique, l'aldolase catalyse la coupure rétro-aldolique du fructose-1,6-bisphosphate dans la glycolyse.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Le carbonyle subit l'addition nucléophile (aldéhydes/cétones) ou la substitution nucléophile d'acyle (esters, amides). La formation d'hémiacétals est fondamentale pour les structures cycliques des glucides.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  4. BIOCHIMIE STRUCTURALE                     */
/* ───────────────────────────────────────────── */
"chimie-biochimie-struct": {
  introduction: "La biochimie structurale étudie la structure et les propriétés des biomolécules fondamentales : acides aminés, protéines, glucides, lipides et acides nucléiques. La compréhension de leur architecture moléculaire est indispensable pour appréhender leurs fonctions biologiques.",
  readTime: 20,
  sections: [
    {
      title: "Les acides aminés : structure et propriétés",
      content: `<p class="mb-3">Les <strong>acides aminés</strong> sont les monomères des protéines. Les 20 acides aminés protéinogènes standard possèdent tous un carbone α portant un groupe amine (-NH₂), un groupe carboxyle (-COOH), un hydrogène et une chaîne latérale R qui confère les propriétés spécifiques.</p>
<p class="mb-3">À pH physiologique (7,4), les acides aminés existent sous forme de <strong>zwitterion</strong> : NH₃⁺-CHR-COO⁻. Le <strong>point isoélectrique (pI)</strong> est le pH auquel la charge nette est nulle. Pour un AA sans chaîne latérale ionisable : pI = (pKa1 + pKa2)/2.</p>
<p class="mb-3">Classification des chaînes latérales :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Apolaires aliphatiques</strong> : Gly, Ala, Val, Leu, Ile, Pro, Met. Hydrophobes, enfouis dans les protéines.</li>
<li><strong>Aromatiques</strong> : Phe, Tyr, Trp. Absorbent dans l'UV (280 nm pour Trp et Tyr).</li>
<li><strong>Polaires non chargés</strong> : Ser, Thr, Cys, Asn, Gln. La Cys forme des ponts disulfure (S-S).</li>
<li><strong>Chargés positivement (basiques)</strong> : Lys (pKa ≈ 10,5), Arg (pKa ≈ 12,5), His (pKa ≈ 6,0).</li>
<li><strong>Chargés négativement (acides)</strong> : Asp (pKa ≈ 3,9), Glu (pKa ≈ 4,1).</li>
</ul>
<p class="mb-3">Tous les acides aminés protéinogènes (sauf la glycine) sont de configuration <strong>L</strong> (S en nomenclature CIP, sauf la cystéine qui est R).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Les 20 AA protéinogènes sont de configuration L. Le pI détermine le pH de charge nette nulle. La cystéine forme des ponts disulfure essentiels à la structure des protéines.</p></div>`
    },
    {
      title: "La liaison peptidique et structure primaire",
      content: `<p class="mb-3">La <strong>liaison peptidique</strong> est une liaison amide formée par condensation entre le groupe -COOH d'un AA et le -NH₂ de l'AA suivant, avec libération d'une molécule d'eau. Elle possède un caractère partiel de double liaison dû à la mésomérie : C-N mesure 1,33 Å (entre simple 1,47 Å et double 1,27 Å).</p>
<p class="mb-3">Conséquences de ce caractère de double liaison :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li>La liaison peptidique est <strong>plane</strong> : les 6 atomes (Cα-CO-NH-Cα) sont coplanaires.</li>
<li>La configuration est <strong>trans</strong> dans la grande majorité des cas (sauf devant la proline où le cis est possible à ≈ 10 %).</li>
<li>Les seules rotations possibles se font autour des liaisons Cα-N (angle φ) et Cα-C (angle ψ), définissant les angles de Ramachandran.</li>
</ul>
<p class="mb-3">La <strong>structure primaire</strong> est la séquence linéaire des acides aminés, écrite par convention du N-terminal (NH₃⁺) vers le C-terminal (COO⁻). Elle est codée par l'ADN et détermine toutes les structures d'ordre supérieur.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : La liaison peptidique est plane et trans (mésomérie C=N partielle). Le diagramme de Ramachandran représente les couples (φ, ψ) autorisés. La structure primaire conditionne le repliement de la protéine.</p></div>`
    },
    {
      title: "Structures secondaire et tertiaire des protéines",
      content: `<p class="mb-3">La <strong>structure secondaire</strong> correspond aux motifs locaux de repliement stabilisés par des liaisons hydrogène entre les groupes C=O et N-H du squelette peptidique :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Hélice α</strong> : hélice droite avec 3,6 résidus par tour, pas de 5,4 Å. Liaisons H entre C=O(i) et N-H(i+4). Chaînes latérales orientées vers l'extérieur. Favorisée par Ala, Leu, Met, Glu.</li>
<li><strong>Feuillet β</strong> : brins étendus reliés par des liaisons H latérales. Parallèle (même sens N→C) ou antiparallèle (sens alternés, plus stable). Favorisé par Val, Ile, Tyr.</li>
<li><strong>Coudes β</strong> : inversions de direction impliquant 4 résidus. Souvent stabilisés par une liaison H entre résidus i et i+3. La proline et la glycine y sont fréquentes.</li>
</ul>
<p class="mb-3">La <strong>structure tertiaire</strong> est l'arrangement tridimensionnel global d'une chaîne polypeptidique, stabilisée par :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li>Interactions hydrophobes (force motrice principale du repliement).</li>
<li>Liaisons hydrogène entre chaînes latérales.</li>
<li>Ponts disulfure (Cys-Cys) : liaisons covalentes stabilisatrices.</li>
<li>Interactions ioniques (ponts salins) entre résidus chargés.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Hélice α (3,6 résidus/tour, liaison H i→i+4) et feuillet β sont les structures secondaires principales. L'effet hydrophobe est la force motrice majeure du repliement tertiaire.</p></div>`
    },
    {
      title: "Structure quaternaire et protéines fibreuses",
      content: `<p class="mb-3">La <strong>structure quaternaire</strong> décrit l'association de plusieurs chaînes polypeptidiques (sous-unités ou protomères) en un complexe fonctionnel. L'hémoglobine (α₂β₂) est l'exemple classique : 4 sous-unités, chacune portant un hème.</p>
<p class="mb-3">La structure quaternaire est stabilisée par les mêmes interactions non covalentes que la structure tertiaire (hydrophobes, H, ioniques) et permet la <strong>coopérativité</strong>. Dans l'hémoglobine, la fixation du premier O₂ facilite la fixation des suivants (courbe sigmoïde de saturation vs courbe hyperbolique de la myoglobine).</p>
<p class="mb-3">Les <strong>protéines fibreuses</strong> sont des protéines structurales à motif répétitif :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Collagène</strong> : triple hélice gauche (Gly-X-Pro/Hyp), protéine la plus abondante chez les mammifères. Chaque 3e résidu est une glycine (seul AA assez petit pour l'intérieur de la triple hélice).</li>
<li><strong>Kératine α</strong> : superhélice (coiled-coil) de deux hélices α, constituant cheveux et ongles.</li>
<li><strong>Fibroïne de soie</strong> : empilement de feuillets β antiparallèles (Gly-Ala-Gly-Ala).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : La structure quaternaire permet la coopérativité (hémoglobine). Le collagène est une triple hélice avec Gly tous les 3 résidus. L'hydroxyproline (modifiée par la vitamine C) stabilise le collagène.</p></div>`
    },
    {
      title: "Méthodes d'étude des protéines",
      content: `<p class="mb-3">Plusieurs techniques permettent de caractériser les protéines :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Électrophorèse SDS-PAGE</strong> : sépare les protéines selon leur masse moléculaire. Le SDS dénature les protéines et leur confère une charge négative proportionnelle à leur masse. Migration vers l'anode, les plus petites migrant plus loin.</li>
<li><strong>Chromatographie d'exclusion</strong> (gel filtration) : sépare selon la taille. Les grosses molécules sont exclues des pores du gel et éluent en premier.</li>
<li><strong>Chromatographie d'échange d'ions</strong> : sépare selon la charge. Résine échangeuse de cations (charge -) retient les protéines chargées +, et inversement.</li>
<li><strong>Chromatographie d'affinité</strong> : exploite une interaction spécifique (ex. anticorps-antigène, enzyme-substrat).</li>
<li><strong>Spectrophotométrie UV</strong> : dosage à 280 nm (absorption du Trp et Tyr) ou par méthode de Bradford (595 nm, liaison au bleu de Coomassie).</li>
</ul>
<p class="mb-3">La <strong>cristallographie aux rayons X</strong> et la <strong>cryo-microscopie électronique</strong> (cryo-EM) permettent de déterminer la structure 3D à résolution atomique. La RMN est utilisée pour les petites protéines en solution.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : SDS-PAGE sépare par masse, l'échange d'ions par charge, l'exclusion par taille, l'affinité par interaction spécifique. Le dosage UV à 280 nm repose sur l'absorption du Trp et de la Tyr.</p></div>`
    },
    {
      title: "Dénaturation et repliement",
      content: `<p class="mb-3">La <strong>dénaturation</strong> est la perte de la structure tridimensionnelle native sans rupture des liaisons peptidiques. Les agents dénaturants incluent :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Chaleur</strong> : agite les molécules et rompt les interactions faibles. La température de dénaturation (Tm) est caractéristique de chaque protéine.</li>
<li><strong>pH extrêmes</strong> : modifient l'état d'ionisation des chaînes latérales, rompant les interactions ioniques et H.</li>
<li><strong>Urée / chlorure de guanidinium</strong> : agents chaotropiques qui perturbent l'effet hydrophobe.</li>
<li><strong>SDS</strong> (dodécyl sulfate de sodium) : détergent qui déplie les protéines et masque leur charge propre.</li>
<li><strong>β-mercaptoéthanol / DTT</strong> : agents réducteurs qui rompent les ponts disulfure.</li>
</ul>
<p class="mb-3">L'expérience d'<strong>Anfinsen</strong> (1973, prix Nobel) a montré que la ribonucléase A dénaturée par l'urée et le β-mercaptoéthanol peut se replier spontanément en conditions natives, démontrant que la séquence (structure primaire) contient toute l'information nécessaire au repliement correct. Ce dogme est nuancé par le rôle des <strong>chaperonnes</strong> (GroEL/GroES, Hsp70) qui empêchent l'agrégation et facilitent le repliement in vivo.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : L'expérience d'Anfinsen démontre que la structure primaire détermine le repliement. In vivo, les protéines chaperonnes (Hsp70, GroEL/ES) assistent le repliement et préviennent l'agrégation.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  5. ENZYMOLOGIE                               */
/* ───────────────────────────────────────────── */
"chimie-enzymologie": {
  introduction: "L'enzymologie étudie les enzymes, catalyseurs biologiques de nature protéique qui accélèrent les réactions biochimiques en abaissant leur énergie d'activation. Leur compréhension est essentielle pour appréhender le métabolisme, la pharmacologie et les pathologies associées.",
  readTime: 20,
  sections: [
    {
      title: "Propriétés générales des enzymes",
      content: `<p class="mb-3">Les <strong>enzymes</strong> sont des catalyseurs biologiques remarquablement efficaces : elles accélèrent les réactions d'un facteur 10⁶ à 10¹⁷ sans être consommées. Elles abaissent l'<strong>énergie d'activation</strong> (Ea) de la réaction sans modifier le ΔG (thermodynamique inchangée).</p>
<p class="mb-3">Caractéristiques fondamentales des enzymes :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Spécificité de substrat</strong> : chaque enzyme reconnaît un ou un nombre limité de substrats grâce à la complémentarité du site actif.</li>
<li><strong>Spécificité de réaction</strong> : une enzyme catalyse un seul type de réaction chimique.</li>
<li><strong>Conditions douces</strong> : fonctionnent à T ≈ 37°C, pH neutre, pression atmosphérique.</li>
<li><strong>Régulation</strong> : leur activité est finement régulée (allostérie, modifications post-traductionnelles).</li>
</ul>
<p class="mb-3">Le <strong>site actif</strong> est une cavité tridimensionnelle formée par le repliement de la protéine. Il comprend le site de fixation du substrat et le site catalytique. Le modèle de l'<strong>ajustement induit</strong> (Koshland, 1958) a remplacé le modèle clé-serrure de Fischer : l'enzyme se déforme pour s'adapter au substrat, optimisant les interactions.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Les enzymes abaissent l'Ea sans modifier le ΔG. Le modèle de l'ajustement induit (Koshland) stipule que l'enzyme se déforme pour accueillir le substrat, contrairement au modèle rigide clé-serrure de Fischer.</p></div>`
    },
    {
      title: "Cinétique de Michaelis-Menten",
      content: `<p class="mb-3">Le modèle de <strong>Michaelis-Menten</strong> (1913) décrit la cinétique des enzymes à un substrat : E + S ⇌ ES → E + P. L'hypothèse du quasi-équilibre ou de l'état stationnaire (d[ES]/dt = 0, Briggs-Haldane) mène à l'équation :</p>
<h4 class="text-lg font-semibold text-gray-800 mb-2">v = Vmax × [S] / (Km + [S])</h4>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Vmax</strong> = kcat × [E]t : vitesse maximale atteinte quand l'enzyme est saturée en substrat.</li>
<li><strong>Km</strong> (constante de Michaelis) : concentration en substrat pour laquelle v = Vmax/2. Un Km faible indique une forte affinité de l'enzyme pour son substrat.</li>
<li><strong>kcat</strong> (nombre de turnover) : nombre de molécules de substrat transformées par molécule d'enzyme par seconde. Mesure l'efficacité catalytique.</li>
<li><strong>kcat/Km</strong> (efficacité catalytique) : critère d'efficacité global. Les enzymes parfaites atteignent la limite de diffusion (≈ 10⁸-10⁹ M⁻¹·s⁻¹).</li>
</ul>
<p class="mb-3">La représentation en <strong>double inverse de Lineweaver-Burk</strong> (1/v en fonction de 1/[S]) linéarise l'équation : 1/v = (Km/Vmax)(1/[S]) + 1/Vmax. L'ordonnée à l'origine donne 1/Vmax, la pente Km/Vmax.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : v = Vmax[S]/(Km+[S]). Km = [S] quand v = Vmax/2 (mesure d'affinité). kcat/Km est l'efficacité catalytique. La représentation de Lineweaver-Burk (1/v vs 1/[S]) permet de déterminer graphiquement Km et Vmax.</p></div>`
    },
    {
      title: "Inhibition enzymatique",
      content: `<p class="mb-3">L'<strong>inhibition</strong> enzymatique est fondamentale en pharmacologie. Trois types principaux d'inhibition réversible :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Inhibition compétitive</strong> : l'inhibiteur se fixe au site actif à la place du substrat. Km apparent augmente (Km' = Km(1 + [I]/Ki)), Vmax inchangée. L'inhibition est levée par un excès de substrat. En Lineweaver-Burk : droites de même ordonnée à l'origine, pente augmentée.</li>
<li><strong>Inhibition incompétitive</strong> : l'inhibiteur se fixe uniquement sur le complexe ES. Km et Vmax apparents diminuent dans le même rapport. En Lineweaver-Burk : droites parallèles.</li>
<li><strong>Inhibition non compétitive</strong> (mixte) : l'inhibiteur se fixe sur un site différent du site actif, que le substrat soit fixé ou non. Vmax diminue, Km inchangé (cas pur). En Lineweaver-Burk : droites de même abscisse à l'origine.</li>
</ul>
<p class="mb-3">L'<strong>inhibition irréversible</strong> implique une liaison covalente avec l'enzyme (ex. : aspirine qui acétyle irréversiblement la cyclooxygénase COX, inhibiteurs suicide comme la pénicilline qui se lie à la transpeptidase bactérienne).</p>
<p class="mb-3">Les <strong>analogues d'état de transition</strong> sont des inhibiteurs qui miment la géométrie du substrat à l'état de transition et se lient plus fortement que le substrat (Ki << Km). Principe utilisé en conception rationnelle de médicaments.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Inhibition compétitive → Km↑, Vmax identique (levée par excès de substrat). Incompétitive → Km↓, Vmax↓ (parallèles en Lineweaver-Burk). Non compétitive → Km identique, Vmax↓.</p></div>`
    },
    {
      title: "Régulation allostérique",
      content: `<p class="mb-3">Les <strong>enzymes allostériques</strong> possèdent un ou plusieurs sites de régulation (sites allostériques) distincts du site actif. La fixation d'un effecteur allostérique modifie la conformation de l'enzyme et donc son activité catalytique.</p>
<p class="mb-3">Caractéristiques des enzymes allostériques :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li>Structure oligomérique (plusieurs sous-unités).</li>
<li>Cinétique <strong>sigmoïde</strong> (non michaélienne) : coopérativité entre sous-unités.</li>
<li>Régulées par des <strong>effecteurs positifs</strong> (activateurs, déplacent la courbe vers la gauche) et des <strong>effecteurs négatifs</strong> (inhibiteurs, vers la droite).</li>
</ul>
<p class="mb-3">Deux modèles décrivent l'allostérie :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Modèle concerté (MWC)</strong> de Monod, Wyman et Changeux (1965) : toutes les sous-unités sont dans le même état (T = tendu, faible affinité, ou R = relâché, forte affinité). La transition T↔R est concertée. L'activateur stabilise R, l'inhibiteur stabilise T.</li>
<li><strong>Modèle séquentiel (KNF)</strong> de Koshland : chaque sous-unité change de conformation indépendamment lors de la fixation du ligand. Permet l'existence de formes hybrides.</li>
</ul>
<p class="mb-3">Exemple majeur : la <strong>phosphofructokinase-1</strong> (PFK-1), enzyme clé de la glycolyse, est activée allostériquement par l'AMP et le fructose-2,6-bisphosphate, et inhibée par l'ATP et le citrate.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : Les enzymes allostériques ont une cinétique sigmoïde (coopérative). Le modèle MWC (transition concertée T↔R) est le plus utilisé. La PFK-1 est l'exemple classique d'enzyme allostérique en métabolisme.</p></div>`
    },
    {
      title: "Classification des enzymes et cofacteurs",
      content: `<p class="mb-3">La classification internationale (EC, Enzyme Commission) distingue <strong>7 classes</strong> d'enzymes selon le type de réaction catalysée :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>EC 1 - Oxydoréductases</strong> : catalysent les réactions d'oxydoréduction (déshydrogénases, oxydases, peroxydases).</li>
<li><strong>EC 2 - Transférases</strong> : transfèrent un groupe fonctionnel (kinases = transfert de phosphate, aminotransférases).</li>
<li><strong>EC 3 - Hydrolases</strong> : catalysent l'hydrolyse (protéases, lipases, phosphatases).</li>
<li><strong>EC 4 - Lyases</strong> : coupent des liaisons sans hydrolyse ni oxydation (aldolases, décarboxylases).</li>
<li><strong>EC 5 - Isomérases</strong> : réarrangements intramoléculaires (racémases, mutases, épimérases).</li>
<li><strong>EC 6 - Ligases</strong> : forment des liaisons covalentes couplées à l'hydrolyse d'ATP (synthétases).</li>
<li><strong>EC 7 - Translocases</strong> : catalysent le transport de substances à travers les membranes.</li>
</ul>
<p class="mb-3">De nombreuses enzymes nécessitent des <strong>cofacteurs</strong> pour fonctionner : ions métalliques (Zn²⁺, Mg²⁺, Fe²⁺) ou <strong>coenzymes</strong> organiques (NAD⁺/NADH, FAD/FADH₂, coenzyme A, pyridoxal phosphate). L'enzyme sans son cofacteur est l'<strong>apoenzyme</strong>, l'ensemble actif est l'<strong>holoenzyme</strong>.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : 7 classes EC (oxydoréductases, transférases, hydrolases, lyases, isomérases, ligases, translocases). Holoenzyme = apoenzyme + cofacteur. Les coenzymes (NAD⁺, FAD, CoA) dérivent souvent de vitamines.</p></div>`
    },
    {
      title: "Mécanismes catalytiques",
      content: `<p class="mb-3">Les enzymes utilisent plusieurs <strong>mécanismes catalytiques</strong>, souvent combinés :</p>
<ul class="list-disc pl-5 space-y-1 mb-4 text-gray-700">
<li><strong>Catalyse acide-base générale</strong> : des résidus du site actif (His, Glu, Asp) servent de donneurs ou accepteurs de protons pour stabiliser les charges dans l'état de transition.</li>
<li><strong>Catalyse covalente</strong> : formation d'un intermédiaire covalent entre l'enzyme et le substrat (ex. : les protéases à sérine forment un acyl-enzyme transitoire avec Ser).</li>
<li><strong>Catalyse par ions métalliques</strong> : les métaux (Zn²⁺, Mg²⁺) stabilisent les charges négatives, activent les nucléophiles ou participent directement à la réaction redox.</li>
<li><strong>Catalyse par proximité et orientation</strong> : l'enzyme rapproche et oriente correctement les substrats, augmentant leur concentration effective locale.</li>
<li><strong>Stabilisation de l'état de transition</strong> : l'enzyme se lie plus fortement à l'état de transition qu'au substrat ou au produit (concept de Pauling).</li>
</ul>
<p class="mb-3">Exemple : les <strong>protéases à sérine</strong> (trypsine, chymotrypsine, élastase) utilisent la triade catalytique Ser-His-Asp. La sérine effectue une attaque nucléophile sur la liaison peptidique, assistée par l'histidine (catalyse acide-base) et stabilisée par le trou oxyanion.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé : La stabilisation de l'état de transition est le mécanisme catalytique fondamental (concept de Pauling). La triade Ser-His-Asp des protéases à sérine illustre la combinaison de catalyse covalente et acide-base.</p></div>`
    }
  ]
},

"chimie-stereochimie": {
  introduction: "La stéréochimie étudie l'arrangement spatial des atomes dans les molécules. Elle est essentielle en pharmacologie car deux énantiomères peuvent avoir des activités biologiques radicalement différentes.",
  readTime: 20,
  sections: [
    {
      title: "Chiralité et carbone asymétrique",
      content: `<p class="mb-3">Un <strong>carbone asymétrique</strong> (noté C*) est un atome de carbone lié à quatre substituants tous différents. Une molécule possédant au moins un C* sans plan de symétrie interne est <strong>chirale</strong> : elle n'est pas superposable à son image dans un miroir. Les deux formes non superposables constituent un couple d'<strong>énantiomères</strong>.</p>
<p class="mb-3">La chiralité n'est pas limitée aux carbones asymétriques. Il existe une <strong>chiralité axiale</strong> (allènes, biaryles à rotation restreinte comme le BINAP), une <strong>chiralité planaire</strong> (ferrocènes substitués) et une <strong>chiralité hélicoïdale</strong> (hélicènes). Cependant, en PASS/LAS, le carbone asymétrique reste de loin le cas le plus fréquent.</p>
<p class="mb-3">Les conditions de chiralité sont strictes : la molécule ne doit posséder <strong>aucun élément de symétrie impropre</strong> (plan de symétrie σ, centre d'inversion i, axe impropre Sn). En pratique, on vérifie surtout l'absence de plan de symétrie. Une molécule avec un C* mais possédant un plan de symétrie interne est dite <strong>méso</strong> et est achirale malgré la présence de C*.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Une molécule est chirale si elle n'est pas superposable à son image spéculaire. La présence d'un C* est une condition suffisante (sauf composé méso) mais pas nécessaire (chiralité axiale).</p></div>`
    },
    {
      title: "Nomenclature R/S (Cahn-Ingold-Prelog) et D/L",
      content: `<p class="mb-3">La nomenclature <strong>R/S</strong> de Cahn, Ingold et Prelog attribue une <strong>configuration absolue</strong> à chaque centre stéréogène. Les règles de priorité classent les substituants selon le numéro atomique Z décroissant. En cas d'égalité, on explore les atomes suivants le long de la chaîne jusqu'à trouver une différence.</p>
<p class="mb-3">Règles particulières :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Liaisons multiples</strong> : une double liaison C=O est traitée comme si le carbone portait deux atomes d'oxygène et l'oxygène deux atomes de carbone (atomes fantômes).</li>
<li><strong>Isotopes</strong> : priorité par masse atomique (D > H, ¹⁴C > ¹²C).</li>
<li><strong>Doublets non liants</strong> : priorité la plus faible (numéro atomique = 0).</li>
</ul>
<p class="mb-3">On oriente le substituant de priorité la plus faible (4) vers l'arrière (en projection de Newman ou de Fischer). Le sens de parcours 1→2→3 horaire donne <strong>R</strong> (rectus), antihoraire donne <strong>S</strong> (sinister).</p>
<p class="mb-3">La nomenclature <strong>D/L</strong> est historique et basée sur la projection de Fischer du glycéraldéhyde. Si le groupe -OH (ou -NH₂ pour les acides aminés) du C* le plus éloigné de la fonction la plus oxydée est à droite → D, à gauche → L. Les acides aminés naturels sont <strong>L</strong> (et majoritairement S, sauf la cystéine qui est R à cause de la priorité du soufre). Les oses naturels sont <strong>D</strong>.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : R/S = configuration absolue (CIP, basée sur Z). D/L = convention historique (Fischer). Tous les AA protéinogènes sont L. Attention : L ne signifie pas toujours S (la cystéine est L mais R).</p></div>`
    },
    {
      title: "Relations stéréochimiques : énantiomères, diastéréoisomères, méso",
      content: `<p class="mb-3">Les <strong>énantiomères</strong> sont des stéréoisomères images l'un de l'autre dans un miroir. Ils possèdent les mêmes propriétés physico-chimiques (Tf, Teb, solubilité, spectre IR/UV) sauf deux : le <strong>pouvoir rotatoire</strong> (opposé en signe, égal en valeur absolue) et la réactivité avec d'autres molécules chirales (enzymes, récepteurs).</p>
<p class="mb-3">Les <strong>diastéréoisomères</strong> sont des stéréoisomères non images dans un miroir. Ils ont des propriétés physico-chimiques <strong>différentes</strong> (Tf, solubilité, chromatographie différentes), ce qui permet de les séparer par des méthodes classiques. Quand une molécule possède n centres stéréogènes, le nombre maximal de stéréoisomères est <strong>2ⁿ</strong>.</p>
<p class="mb-3">Un composé <strong>méso</strong> possède des centres stéréogènes mais un plan de symétrie interne qui rend la molécule globalement achirale. Exemple classique : l'acide tartrique méso (2R,3S) possède 2 C* mais est achiral. L'acide tartrique a donc 3 stéréoisomères (pas 2² = 4) : (2R,3R), (2S,3S) et méso.</p>
<p class="mb-3">Un <strong>mélange racémique</strong> (noté ±) contient des quantités égales des deux énantiomères. Son pouvoir rotatoire est nul. La séparation des énantiomères (résolution) nécessite un agent chiral : chromatographie chirale, formation de diastéréoisomères avec un réactif chiral, ou résolution enzymatique.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Énantiomères = mêmes propriétés sauf pouvoir rotatoire et interactions chirales. Diastéréoisomères = propriétés différentes, séparables. Composé méso = achiral malgré la présence de C*.</p></div>`
    },
    {
      title: "Isomérie géométrique Z/E et analyse conformationnelle",
      content: `<p class="mb-3">L'isomérie <strong>Z/E</strong> concerne les doubles liaisons C=C (et les cycles rigides). La liaison π empêche la rotation, ce qui fige deux configurations possibles. On utilise les règles CIP pour classer les substituants sur chaque carbone : si les deux substituants prioritaires sont du même côté → <strong>Z</strong> (zusammen), de part et d'autre → <strong>E</strong> (entgegen).</p>
<p class="mb-3">Les isomères Z et E sont des <strong>diastéréoisomères</strong> (propriétés physiques différentes). Exemple : l'acide fumarique (E) a un Tf de 287 °C tandis que l'acide maléique (Z) fond à 130 °C. En biochimie, les acides gras insaturés naturels sont généralement de configuration <strong>Z</strong> (cis), ce qui introduit un coude dans la chaîne et augmente la fluidité membranaire.</p>
<p class="mb-3">L'<strong>analyse conformationnelle</strong> concerne les rotations libres autour des liaisons simples. Les conformations sont interconvertibles sans rupture de liaison (à la différence des configurations). Pour l'éthane : conformations décalées (plus stables) vs éclipsées (moins stables, tension torsionnelle). Pour le butane : la conformation anti est la plus stable, la syn-périplanaire la moins stable (tension stérique).</p>
<p class="mb-3">Le <strong>cyclohexane</strong> adopte préférentiellement la conformation <strong>chaise</strong> (sans tension angulaire ni torsionnelle). Les substituants sont axiaux (parallèles à l'axe) ou équatoriaux (dans le plan moyen). Les gros substituants préfèrent la position équatoriale pour minimiser les interactions 1,3-diaxiales. L'interconversion chaise-chaise transforme tous les axiaux en équatoriaux et réciproquement.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Z/E = diastéréoisomérie autour d'une double liaison (non interconvertible). Conformation chaise du cyclohexane : les gros substituants préfèrent la position équatoriale. Les AG naturels insaturés sont Z (cis).</p></div>`
    },
    {
      title: "Stéréochimie et pharmacologie : importance biologique",
      content: `<p class="mb-3">La stéréochimie est capitale en pharmacologie car les <strong>récepteurs biologiques sont chiraux</strong> (protéines constituées d'acides aminés L). Deux énantiomères d'un médicament peuvent avoir des activités radicalement différentes. Le cas emblématique est la <strong>thalidomide</strong> : l'énantiomère R est sédatif tandis que le S est tératogène (malformations des membres chez le foetus).</p>
<p class="mb-3">Exemples cliniques importants :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Ibuprofène</strong> : seul l'énantiomère S est anti-inflammatoire actif (le R est converti in vivo en S).</li>
<li><strong>Oméprazole/Ésoméprazole</strong> : l'ésoméprazole (S-oméprazole) est commercialisé comme énantiomère pur avec une meilleure biodisponibilité.</li>
<li><strong>L-DOPA</strong> : seule la forme L est active dans le traitement du Parkinson ; la D-DOPA est inactive et toxique.</li>
<li><strong>Propranolol</strong> : le S(-) est 100 fois plus actif comme bêta-bloquant que le R(+).</li>
</ul>
<p class="mb-3">La notion d'<strong>eutomère</strong> (énantiomère actif) et de <strong>distomère</strong> (énantiomère inactif ou toxique) est essentielle. Le <strong>rapport eudismique</strong> (activité eutomère / activité distomère) quantifie la stéréosélectivité du récepteur. La tendance actuelle est au développement de médicaments <strong>énantiopurs</strong> pour améliorer l'efficacité et réduire les effets secondaires.</p>
<p class="mb-3">En biochimie, la stéréospécificité enzymatique est absolue : les enzymes ne reconnaissent qu'un seul énantiomère de leur substrat. La <strong>L-lactate déshydrogénase</strong> ne métabolise que le L-lactate, la <strong>D-amino acide oxydase</strong> n'agit que sur les D-acides aminés.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : La thalidomide illustre l'importance vitale de la stéréochimie en pharmacologie. Les enzymes et récepteurs biologiques sont stéréospécifiques car constitués de molécules chirales (AA de configuration L).</p></div>`
    }
  ]
},

"chimie-classification": {
  introduction: "La classification périodique des éléments organise les 118 éléments connus selon leur numéro atomique et révèle la périodicité de leurs propriétés chimiques. Elle constitue l'outil fondamental du chimiste pour prédire le comportement des éléments.",
  readTime: 18,
  sections: [
    {
      title: "Construction et structure du tableau périodique",
      content: `<p class="mb-3">Le tableau périodique actuel est organisé par <strong>numéro atomique Z croissant</strong> (et non par masse atomique comme dans le tableau originel de Mendeleïev). Il comprend 7 <strong>périodes</strong> (lignes horizontales, correspondant au nombre quantique principal n de la couche en cours de remplissage) et 18 <strong>groupes</strong> (colonnes verticales, éléments de même configuration de valence).</p>
<p class="mb-3">Le tableau se divise en quatre <strong>blocs</strong> selon la sous-couche en cours de remplissage :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Bloc s</strong> (groupes 1-2) : remplissage de la sous-couche ns. Métaux alcalins (groupe 1) et alcalino-terreux (groupe 2).</li>
<li><strong>Bloc p</strong> (groupes 13-18) : remplissage de np. Contient les non-métaux, métalloïdes et gaz nobles.</li>
<li><strong>Bloc d</strong> (groupes 3-12) : remplissage de (n-1)d. Métaux de transition (Fe, Cu, Zn...).</li>
<li><strong>Bloc f</strong> (lanthanides et actinides) : remplissage de (n-2)f.</li>
</ul>
<p class="mb-3">Le nombre d'<strong>électrons de valence</strong> correspond au numéro du groupe pour les blocs s et p (ex. : groupe 17 = 7 e- de valence). Pour le bloc d, les électrons de valence incluent les e- ns et (n-1)d.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le bloc détermine la sous-couche en cours de remplissage : s (groupes 1-2), p (13-18), d (3-12), f (lanthanides/actinides). Le numéro du groupe donne le nombre d'e- de valence pour les blocs s et p.</p></div>`
    },
    {
      title: "Évolution du rayon atomique et du rayon ionique",
      content: `<p class="mb-3">Le <strong>rayon atomique</strong> varie de façon prévisible dans le tableau :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dans une période</strong> (de gauche à droite) : le rayon <strong>diminue</strong>. Z augmente mais les e- sont ajoutés dans la même couche ; la charge nucléaire effective Zeff augmente, attirant plus fortement le cortège électronique.</li>
<li><strong>Dans un groupe</strong> (de haut en bas) : le rayon <strong>augmente</strong>. Chaque période ajoute une nouvelle couche électronique, plus éloignée du noyau.</li>
</ul>
<p class="mb-3">Le <strong>rayon ionique</strong> diffère du rayon atomique : un <strong>cation</strong> est toujours plus petit que l'atome neutre (perte d'e-, parfois perte d'une couche entière : Na 186 pm → Na⁺ 102 pm). Un <strong>anion</strong> est toujours plus grand (ajout d'e-, répulsion accrue : Cl 99 pm → Cl⁻ 181 pm).</p>
<p class="mb-3">Les <strong>espèces isoélectroniques</strong> (même nombre d'e-) ont des rayons décroissant avec Z croissant. Exemple : O²⁻ > F⁻ > Ne > Na⁺ > Mg²⁺ > Al³⁺ (tous 10 e-). Cette notion est fréquemment posée en PASS.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le rayon diminue de gauche à droite (Zeff augmente) et augmente de haut en bas (couches supplémentaires). Cation < atome < anion. Pour les isoélectroniques, le rayon diminue quand Z augmente.</p></div>`
    },
    {
      title: "Énergie d'ionisation et affinité électronique",
      content: `<p class="mb-3">L'<strong>énergie de première ionisation</strong> (EI₁) est l'énergie minimale pour arracher l'électron le plus faiblement lié d'un atome gazeux : A(g) → A⁺(g) + e⁻. L'EI est toujours positive (processus endothermique).</p>
<p class="mb-3">Tendances générales :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dans une période</strong> : EI augmente de gauche à droite (Zeff croissant, rayon décroissant).</li>
<li><strong>Dans un groupe</strong> : EI diminue de haut en bas (e- de valence plus éloignés du noyau).</li>
</ul>
<p class="mb-3"><strong>Anomalies importantes</strong> (très souvent posées en QCM) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>EI(Be) > EI(B)</strong> : le Be a une sous-couche 2s² complète (stabilité particulière). L'e- arraché du B est dans la sous-couche 2p, plus haute en énergie.</li>
<li><strong>EI(N) > EI(O)</strong> : le N a une sous-couche 2p³ à moitié remplie (stabilité de Hund). L'O a un e- apparié dans 2p⁴, plus facile à arracher (répulsion interélectronique).</li>
</ul>
<p class="mb-3">L'<strong>affinité électronique</strong> (AE) est l'énergie libérée lors de la fixation d'un e- : A(g) + e⁻ → A⁻(g). Les halogènes ont les AE les plus élevées en valeur absolue (Cl > F > Br > I). L'AE du fluor est inférieure à celle du chlore à cause de la forte répulsion interélectronique dans le petit atome de F.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Les anomalies d'EI (Be > B, N > O) s'expliquent par la stabilité des sous-couches remplies (s²) ou à moitié remplies (p³). L'AE du Cl est supérieure à celle du F (répulsion dans le petit atome de F).</p></div>`
    },
    {
      title: "Électronégativité et caractère métallique",
      content: `<p class="mb-3">L'<strong>électronégativité</strong> (χ) mesure la capacité d'un atome engagé dans une liaison à attirer vers lui les électrons de cette liaison. Plusieurs échelles existent :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Échelle de Pauling</strong> (la plus utilisée) : basée sur les énergies de dissociation des liaisons. χ(F) = 4,0 (le plus élevé).</li>
<li><strong>Échelle de Mulliken</strong> : χ = (EI + AE)/2. Moyenne de la capacité à céder et à capter un e-.</li>
<li><strong>Échelle d'Allred-Rochow</strong> : basée sur la force électrostatique exercée par le noyau sur les e- de valence.</li>
</ul>
<p class="mb-3">Ordre d'électronégativité des éléments biologiques importants : <strong>F (4,0) > O (3,5) > N (3,0) > Cl (3,0) > Br (2,8) > S (2,5) > C (2,5) > H (2,1)</strong>. La différence d'électronégativité Δχ entre deux atomes détermine la polarité de la liaison : Δχ = 0 → liaison covalente pure, Δχ > 1,7 → liaison à caractère ionique dominant.</p>
<p class="mb-3">Le <strong>caractère métallique</strong> suit la tendance inverse de l'électronégativité : il augmente de droite à gauche et de haut en bas. La ligne diagonale B-Si-As-Te-At sépare approximativement métaux (à gauche, 80% des éléments) et non-métaux (à droite). Les éléments le long de cette diagonale sont les <strong>métalloïdes</strong> (semi-conducteurs : Si, Ge).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : χ de Pauling : F > O > N = Cl > Br > S = C > H. Δχ > 1,7 → liaison ionique. Le caractère métallique suit la tendance inverse de l'électronégativité.</p></div>`
    },
    {
      title: "Familles chimiques et éléments d'intérêt biologique",
      content: `<p class="mb-3">Les éléments d'une même colonne forment une <strong>famille chimique</strong> avec des propriétés similaires :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Alcalins</strong> (groupe 1 : Li, Na, K...) : ns¹, forment des cations M⁺, très réactifs avec l'eau. Na⁺/K⁺ essentiels pour le potentiel de membrane et l'équilibre osmotique.</li>
<li><strong>Alcalino-terreux</strong> (groupe 2 : Mg, Ca...) : ns², cations M²⁺. Ca²⁺ = signalisation, os, coagulation. Mg²⁺ = cofacteur enzymatique (ATP-Mg²⁺).</li>
<li><strong>Halogènes</strong> (groupe 17 : F, Cl, Br, I) : ns²np⁵, forment X⁻. Cl⁻ = principal anion extracellulaire. I = hormones thyroïdiennes.</li>
<li><strong>Gaz nobles</strong> (groupe 18 : He, Ne, Ar...) : couche de valence complète ns²np⁶, très stables et inertes chimiquement.</li>
</ul>
<p class="mb-3">Les <strong>éléments de la vie</strong> sont dominés par 4 éléments (CHON) représentant 96% de la masse corporelle. Les <strong>oligoéléments</strong> essentiels incluent le fer (hémoglobine, cytochromes), le zinc (doigts de zinc, anhydrase carbonique), le cuivre (cytochrome c oxydase), le sélénium (glutathion peroxydase), le cobalt (vitamine B12) et le manganèse (SOD mitochondriale).</p>
<p class="mb-3">Les <strong>relations diagonales</strong> (ex. Li/Mg, Be/Al, B/Si) montrent des similitudes entre éléments voisins en diagonale, car le rayon ionique et le rapport charge/rayon sont similaires. Cette notion explique pourquoi le lithium (médicament du trouble bipolaire) peut se substituer au sodium et au magnésium dans certains processus biologiques.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : CHON = 96% masse corporelle. Na⁺/K⁺ = potentiel de membrane, Ca²⁺ = signalisation/os, Fe = hémoglobine/cytochromes, Zn = cofacteur enzymatique. Les éléments d'un même groupe ont des propriétés chimiques similaires.</p></div>`
    }
  ]
},

"chimie-acido-basique": {
  introduction: "Les réactions acido-basiques sont omniprésentes en chimie et en biochimie. La maîtrise des équilibres acide-base est essentielle pour comprendre le pH sanguin, le comportement des acides aminés et la pharmacocinétique des médicaments ionisables.",
  readTime: 18,
  sections: [
    {
      title: "Définitions et couples acide-base",
      content: `<p class="mb-3">Trois définitions complémentaires de l'acidité sont utilisées :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Arrhenius</strong> : un acide libère H⁺ en solution aqueuse, une base libère OH⁻. Limité aux solutions aqueuses.</li>
<li><strong>Brønsted-Lowry</strong> : un acide est un donneur de proton H⁺, une base est un accepteur de proton. Chaque acide est associé à sa base conjuguée : HA ⇌ A⁻ + H⁺. C'est la définition la plus utilisée en PASS.</li>
<li><strong>Lewis</strong> : un acide accepte un doublet d'électrons, une base donne un doublet. Plus générale, elle englobe les métaux de transition (acides de Lewis) et les réactions sans transfert de proton.</li>
</ul>
<p class="mb-3">La <strong>constante d'acidité</strong> Ka = [H₃O⁺][A⁻]/[HA] quantifie la force de l'acide. Le pKa = -log Ka est plus commode : plus le pKa est faible, plus l'acide est fort. Les <strong>acides forts</strong> (pKa < 0) sont totalement dissociés en solution aqueuse : HCl (pKa = -7), H₂SO₄ (pKa₁ = -3), HNO₃ (pKa = -1,4).</p>
<p class="mb-3">Le produit ionique de l'eau : Ke = [H₃O⁺][OH⁻] = 10⁻¹⁴ à 25 °C, d'où pH + pOH = 14. L'eau est <strong>amphotère</strong> (amphiprotique) : elle peut jouer le rôle d'acide ou de base selon le partenaire.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Brønsted : acide = donneur H⁺, base = accepteur H⁺. pKa faible = acide fort. Ke = 10⁻¹⁴ à 25 °C. L'eau est amphotère.</p></div>`
    },
    {
      title: "Calculs de pH : acides forts, faibles et bases",
      content: `<p class="mb-3">Le pH mesure l'activité en protons : pH = -log[H₃O⁺]. Les formules de calcul dépendent de la nature de l'espèce en solution :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Acide fort</strong> (dissociation totale) : pH = -log C. Exemple : HCl 0,01 M → pH = 2.</li>
<li><strong>Base forte</strong> : pOH = -log C, puis pH = 14 - pOH. Exemple : NaOH 0,01 M → pH = 12.</li>
<li><strong>Acide faible</strong> : pH = ½(pKa - log C), valable si C >> Ka et Ka >> Ke.</li>
<li><strong>Base faible</strong> : pH = 7 + ½(pKa + log C).</li>
<li><strong>Ampholyte</strong> (espèce intermédiaire) : pH = ½(pKa₁ + pKa₂), indépendant de la concentration.</li>
</ul>
<p class="mb-3">Ces formules approchées sont valables sous certaines conditions. Il faut vérifier que la concentration C est suffisamment grande devant Ka (sinon résoudre l'équation du second degré) et que le pH calculé est cohérent (entre 0 et 14, et dans le bon domaine de prédominance).</p>
<p class="mb-3">Pour les <strong>polyacides</strong> (H₂SO₄, H₃PO₄, acides aminés), chaque proton se dissocie avec son propre pKa. Si les pKa sont suffisamment espacés (ΔpKa > 2), on peut traiter chaque dissociation indépendamment.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Acide fort : pH = -log C. Acide faible : pH = ½(pKa - log C). Ampholyte : pH = ½(pKa₁ + pKa₂). Toujours vérifier la cohérence du résultat.</p></div>`
    },
    {
      title: "Équation de Henderson-Hasselbalch et solutions tampons",
      content: `<p class="mb-3">L'équation de <strong>Henderson-Hasselbalch</strong> est la formule la plus importante des équilibres acido-basiques : <strong>pH = pKa + log([A⁻]/[HA])</strong>. Elle relie le pH à la composition du mélange acide faible / base conjuguée.</p>
<p class="mb-3">Interprétation graphique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Si pH < pKa → [HA] > [A⁻] : la forme acide prédomine.</li>
<li>Si pH = pKa → [HA] = [A⁻] : les deux formes sont en quantités égales (point de demi-équivalence).</li>
<li>Si pH > pKa → [A⁻] > [HA] : la forme basique prédomine.</li>
</ul>
<p class="mb-3">Une <strong>solution tampon</strong> est un mélange d'un acide faible et de sa base conjuguée en proportions comparables. Elle résiste aux variations de pH lors de l'ajout d'un acide ou d'une base. Le <strong>pouvoir tampon</strong> est maximal quand pH = pKa (ratio 1:1) et est significatif dans l'intervalle pKa ± 1.</p>
<p class="mb-3">Le principal tampon biologique est le système <strong>bicarbonate/CO₂</strong> : CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺ (pKa apparent = 6,1). L'équation de Henderson-Hasselbalch appliquée donne : pH = 6,1 + log([HCO₃⁻] / (0,03 × PaCO₂)). Avec [HCO₃⁻] = 24 mmol/L et PaCO₂ = 40 mmHg : pH = 6,1 + log(24/1,2) = 6,1 + 1,3 = 7,40. Autres tampons biologiques : phosphate (pKa₂ = 6,8), protéines (histidine, pKa ≈ 6,0).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : pH = pKa + log([A⁻]/[HA]) est LA formule fondamentale. Le tampon bicarbonate maintient le pH sanguin à 7,40 : pH = 6,1 + log([HCO₃⁻]/(0,03 × PaCO₂)).</p></div>`
    },
    {
      title: "Titrages acido-basiques et courbes de titrage",
      content: `<p class="mb-3">Le <strong>titrage</strong> consiste à déterminer la concentration d'un acide (ou d'une base) en ajoutant progressivement une base forte (ou un acide fort) de concentration connue. Le point d'<strong>équivalence</strong> est atteint quand la quantité de titrant ajouté est stoechiométriquement égale à celle de l'analyte : n(acide) = n(base).</p>
<p class="mb-3">Courbe de titrage d'un <strong>acide faible par une base forte</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Point initial</strong> : pH = ½(pKa - log C).</li>
<li><strong>Zone tampon</strong> : le pH varie peu (pouvoir tampon). Au point de demi-équivalence : pH = pKa.</li>
<li><strong>Point d'équivalence</strong> : tout l'acide est converti en base conjuguée → pH > 7 (basique).</li>
<li><strong>Après l'équivalence</strong> : excès de base forte → pH ≈ 14 + log(Cexcès).</li>
</ul>
<p class="mb-3">Les <strong>indicateurs colorés</strong> changent de couleur quand pH ≈ pKa de l'indicateur. On choisit un indicateur dont le pKa est proche du pH à l'équivalence : phénolphtaléine (pKa = 9,4) pour acide faible/base forte, hélianthine (pKa = 3,7) pour acide fort/base forte.</p>
<p class="mb-3">Le titrage des <strong>acides aminés</strong> présente 2 ou 3 points de demi-équivalence (correspondant à chaque pKa). Le <strong>point isoélectrique</strong> pI correspond au pH où la charge nette est nulle : pI = ½(pKa₁ + pKa₂) pour un AA neutre, pI = ½(pKa₂ + pKa₃) pour un AA basique (Lys, Arg, His).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Au point de demi-équivalence pH = pKa. Le pI d'un AA neutre = ½(pKa1 + pKa2). Pour un AA basique comme la lysine : pI = ½(pKa2 + pKa3).</p></div>`
    },
    {
      title: "Troubles acido-basiques et applications cliniques",
      content: `<p class="mb-3">Le pH sanguin est maintenu entre <strong>7,38 et 7,42</strong>. Un pH < 7,35 définit une <strong>acidose</strong>, un pH > 7,45 une <strong>alcalose</strong>. Les troubles sont classés selon leur origine :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Acidose respiratoire</strong> : hypoventilation → PaCO₂ ↑ → pH ↓. Causes : BPCO, dépression respiratoire. Compensation rénale : réabsorption HCO₃⁻.</li>
<li><strong>Alcalose respiratoire</strong> : hyperventilation → PaCO₂ ↓ → pH ↑. Causes : anxiété, altitude. Compensation rénale : excrétion HCO₃⁻.</li>
<li><strong>Acidose métabolique</strong> : accumulation d'acides (lactique, cétonique) ou perte de HCO₃⁻ → pH ↓. Compensation respiratoire : hyperventilation (Kussmaul).</li>
<li><strong>Alcalose métabolique</strong> : perte d'H⁺ (vomissements) ou excès de HCO₃⁻ → pH ↑. Compensation respiratoire : hypoventilation.</li>
</ul>
<p class="mb-3">Le <strong>trou anionique</strong> = [Na⁺] - ([Cl⁻] + [HCO₃⁻]) ≈ 12 ± 4 mEq/L. Un trou anionique élevé indique une acidose métabolique par accumulation d'anions non mesurés (lactate, corps cétoniques, toxiques). Un trou anionique normal avec acidose métabolique oriente vers une perte de bicarbonates (diarrhée, acidose tubulaire rénale).</p>
<p class="mb-3">En pharmacologie, le pH influence l'<strong>ionisation des médicaments</strong>. Un médicament acide faible (aspirine, pKa = 3,5) est non ionisé (et donc absorbé) dans l'estomac (pH ≈ 2) mais ionisé dans le sang (pH 7,4). Ce principe explique le piégeage ionique et la distribution tissulaire des médicaments.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : pH sanguin = 7,40 ± 0,02. Le trou anionique oriente le diagnostic d'acidose métabolique. Les médicaments acides faibles sont absorbés dans l'estomac (forme non ionisée).</p></div>`
    }
  ]
},

"chimie-solutions": {
  introduction: "L'étude des solutions couvre les notions de concentration, dissolution, solubilité et propriétés colligatives. Ces concepts sont fondamentaux en pharmacologie pour la préparation des solutés et en biochimie clinique pour l'interprétation des analyses.",
  readTime: 18,
  sections: [
    {
      title: "Concentrations et unités d'expression",
      content: `<p class="mb-3">Plusieurs façons d'exprimer la <strong>concentration</strong> d'un soluté :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Molarité</strong> (C ou M) : nombre de moles de soluté par litre de solution (mol/L). C'est l'unité la plus utilisée en chimie.</li>
<li><strong>Molalité</strong> (m) : nombre de moles de soluté par kilogramme de solvant (mol/kg). Indépendante de la température (contrairement à la molarité).</li>
<li><strong>Fraction molaire</strong> (x) : nombre de moles de soluté / nombre total de moles. Sans unité, Σxi = 1.</li>
<li><strong>Pourcentage massique</strong> (% m/m) : masse de soluté / masse totale × 100.</li>
<li><strong>Osmolarité</strong> : nombre total de particules osmotiquement actives par litre (mOsm/L). NaCl 0,15 M → 300 mOsm/L (2 ions). Plasma = 285-295 mOsm/L.</li>
</ul>
<p class="mb-3">Les <strong>dilutions</strong> obéissent à la loi C₁V₁ = C₂V₂ (conservation de la quantité de matière). Les dilutions en cascade (facteur 1/10 successifs) permettent de préparer des solutions très diluées à partir d'une solution mère concentrée.</p>
<p class="mb-3">En biologie clinique, on utilise souvent le g/L (glycémie normale = 1 g/L ≈ 5,5 mmol/L) ou le mEq/L pour les ions (Na⁺ = 140 mEq/L). La conversion mEq/L = mmol/L × valence de l'ion.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : C₁V₁ = C₂V₂ pour les dilutions. Osmolarité plasmatique ≈ 290 mOsm/L. NaCl 0,9% (sérum physiologique) = 154 mmol/L = 308 mOsm/L (isotonique).</p></div>`
    },
    {
      title: "Dissolution et solubilité",
      content: `<p class="mb-3">La <strong>dissolution</strong> est le processus par lequel un soluté se disperse dans un solvant pour former une solution homogène. Le principe « le semblable dissout le semblable » signifie que les solutés polaires se dissolvent dans les solvants polaires (eau) et les solutés apolaires dans les solvants apolaires (hexane, éther).</p>
<p class="mb-3">La dissolution résulte d'un bilan énergétique entre trois étapes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Rupture des interactions soluté-soluté</strong> (endothermique).</li>
<li><strong>Rupture des interactions solvant-solvant</strong> (endothermique).</li>
<li><strong>Formation des interactions soluté-solvant</strong> (exothermique, solvatation/hydratation).</li>
</ul>
<p class="mb-3">La dissolution est favorisée si ΔG(dissolution) < 0. L'enthalpie de dissolution peut être positive (dissolution endothermique, ex. NH₄NO₃ → refroidissement) ou négative (exothermique, ex. NaOH → échauffement). Même avec ΔH > 0, la dissolution peut être spontanée grâce au gain entropique (ΔS > 0).</p>
<p class="mb-3">La <strong>solubilité</strong> est la concentration maximale de soluté dans un solvant à une température donnée. Elle dépend de la température (généralement croissante pour les solides, décroissante pour les gaz selon la loi de Henry : P = kH × x).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : « Le semblable dissout le semblable ». La dissolution est spontanée si ΔG < 0. La solubilité des gaz diminue avec la température (loi de Henry).</p></div>`
    },
    {
      title: "Produit de solubilité et équilibres de précipitation",
      content: `<p class="mb-3">Pour un sel peu soluble AₘBₙ en équilibre avec sa solution saturée : AₘBₙ(s) ⇌ mA^(n+)(aq) + nB^(m-)(aq). Le <strong>produit de solubilité</strong> Ks = [A^(n+)]^m × [B^(m-)]^n est une constante à température fixée.</p>
<p class="mb-3">La solubilité s (en mol/L) se déduit de Ks. Pour un sel AB (1:1) : Ks = s², donc s = √Ks. Pour un sel A₂B (2:1) : Ks = 4s³, donc s = (Ks/4)^(1/3). Attention à ne pas confondre Ks et s.</p>
<p class="mb-3">Le <strong>quotient réactionnel</strong> Q = [A^(n+)]^m × [B^(m-)]^n permet de prédire la précipitation :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Q < Ks : solution non saturée, pas de précipité.</li>
<li>Q = Ks : solution saturée, équilibre.</li>
<li>Q > Ks : <strong>précipitation</strong> jusqu'à ce que Q = Ks.</li>
</ul>
<p class="mb-3">L'<strong>effet d'ion commun</strong> diminue la solubilité : ajouter du NaCl à une solution saturée de AgCl augmente [Cl⁻] et déplace l'équilibre vers la précipitation (s diminue). Cet effet est utilisé en chimie analytique pour les précipitations sélectives.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Ks = produit de solubilité (constante). Q > Ks → précipitation. L'effet d'ion commun diminue la solubilité. Ne pas confondre Ks (constante) et s (solubilité calculée).</p></div>`
    },
    {
      title: "Propriétés colligatives des solutions",
      content: `<p class="mb-3">Les <strong>propriétés colligatives</strong> dépendent uniquement du nombre de particules de soluté en solution, pas de leur nature chimique. Elles sont essentielles en physiologie :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Abaissement de la pression de vapeur</strong> (loi de Raoult) : P = x(solvant) × P°. L'ajout de soluté diminue la pression de vapeur du solvant.</li>
<li><strong>Élévation ébullioscopique</strong> : ΔTeb = Kb × m × i (i = facteur de Van't Hoff = nombre de particules par unité de formule). Constante ébullioscopique de l'eau : Kb = 0,512 °C/m.</li>
<li><strong>Abaissement cryoscopique</strong> : ΔTf = Kf × m × i. Constante cryoscopique de l'eau : Kf = 1,86 °C/m. L'osmolalité plasmatique peut être estimée par la cryoscopie (ΔTf du plasma = -0,56 °C).</li>
<li><strong>Pression osmotique</strong> : π = n × R × T / V = C × R × T (soluté non ionique). Pour une solution ionique : π = i × C × R × T.</li>
</ul>
<p class="mb-3">L'<strong>osmose</strong> est le passage du solvant à travers une membrane semi-perméable du compartiment le moins concentré vers le plus concentré. La pression osmotique s'oppose à ce flux. En physiologie : solutions isotoniques (290 mOsm/L), hypotoniques (hémolyse des GR) et hypertoniques (crénation des GR).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : π = iCRT. Les propriétés colligatives dépendent du nombre de particules. Solution isotonique = même osmolarité que le plasma (290 mOsm/L). NaCl 0,9% est isotonique.</p></div>`
    },
    {
      title: "Applications pharmaceutiques et cliniques",
      content: `<p class="mb-3">La <strong>solubilité des médicaments</strong> est un paramètre critique pour leur biodisponibilité. Un médicament doit être suffisamment soluble pour être absorbé au niveau gastro-intestinal mais suffisamment lipophile pour traverser les membranes cellulaires. Le <strong>coefficient de partage</strong> log P (octanol/eau) quantifie la lipophilie : log P optimal pour l'absorption orale ≈ 1-3.</p>
<p class="mb-3">Le pH influence la solubilité des médicaments ionisables :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Acides faibles</strong> (aspirine, ibuprofène) : plus solubles à pH élevé (forme ionisée A⁻ prédomine). Mieux absorbés dans l'estomac (pH 2, forme non ionisée HA traverse la membrane).</li>
<li><strong>Bases faibles</strong> (morphine, diazépam) : plus solubles à pH faible (forme ionisée BH⁺ prédomine). Mieux absorbées dans l'intestin (pH 6-8, forme non ionisée B traverse la membrane).</li>
</ul>
<p class="mb-3">Le <strong>piégeage ionique</strong> explique l'accumulation d'un médicament ionisable dans un compartiment où il est ionisé (et donc « piégé »). Exemple : l'aspirine (pKa 3,5) ingérée passe dans le sang (pH 7,4) où elle est ionisée à 99,99% → ne peut plus retourner dans l'estomac.</p>
<p class="mb-3">En clinique, la <strong>perfusion intraveineuse</strong> utilise des solutions isotoniques (NaCl 0,9% ou glucose 5%) pour éviter les troubles osmotiques. Les solutions de remplissage vasculaire (colloïdes) exercent une pression oncotique grâce aux macromolécules qu'elles contiennent (albumine, gélatines, HEA).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le pH module la solubilité et l'absorption des médicaments ionisables. Acides faibles absorbés dans l'estomac, bases faibles dans l'intestin. Le piégeage ionique détermine la distribution tissulaire.</p></div>`
    }
  ]
},

"chimie-oxydoreduction": {
  introduction: "Les réactions d'oxydoréduction impliquent un transfert d'électrons. Elles sont centrales dans le métabolisme énergétique et la chaîne respiratoire mitochondriale.",
  readTime: 20,
  sections: [
    { title: "Couples redox et équation de Nernst", content: `<p class="mb-3">Couple redox Ox/Red : Ox + ne⁻ ⇌ Red. <strong>Potentiel standard E°</strong> mesure la tendance à capter les e⁻. <strong>Nernst</strong> : E = E° + (0,059/n) × log([Ox]/[Red]) à 25°C.</p><p class="mb-3">En biochimie, E°' (pH 7) : NAD⁺/NADH = -0,32 V, FAD/FADH₂ = -0,22 V, O₂/H₂O = +0,82 V. Les e⁻ vont du potentiel le plus négatif vers le plus positif dans la chaîne respiratoire. <strong>ΔG°' = -nFΔE°'</strong> : le transfert NADH → O₂ libère ~220 kJ/mol.</p><div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : ΔG°' = -nFΔE°'. La chaîne respiratoire transfère les e⁻ du NADH (-0,32 V) vers O₂ (+0,82 V), libérant l'énergie pour synthétiser l'ATP.</p></div>` },
    { title: "Équilibrage des réactions redox et nombre d'oxydation", content: `<p class="mb-3">Le <strong>nombre d'oxydation</strong> (n.o.) est la charge fictive portée par un atome si toutes les liaisons étaient ioniques. Règles de détermination : n.o.(élément pur) = 0, n.o.(H) = +I (sauf hydrures = -I), n.o.(O) = -II (sauf peroxydes = -I), la somme des n.o. = charge de l'espèce.</p>
<p class="mb-3">L'<strong>oxydation</strong> correspond à une augmentation du n.o. (perte d'électrons) et la <strong>réduction</strong> à une diminution (gain d'électrons). L'oxydant est réduit, le réducteur est oxydé. Moyen mnémotechnique : « L'oxydant capte, le réducteur cède ».</p>
<p class="mb-3">Méthode d'équilibrage des demi-équations en milieu acide :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Équilibrer les atomes autres que O et H.</li>
<li>Équilibrer O en ajoutant H₂O.</li>
<li>Équilibrer H en ajoutant H⁺.</li>
<li>Équilibrer les charges en ajoutant des e⁻.</li>
</ul>
<p class="mb-3">En milieu basique, on ajoute des OH⁻ pour neutraliser les H⁺. L'équation globale s'obtient en multipliant chaque demi-équation pour égaliser le nombre d'électrons échangés, puis en les additionnant.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le nombre d'oxydation permet d'identifier oxydant et réducteur. Oxydation = perte d'e⁻ (n.o. augmente), réduction = gain d'e⁻ (n.o. diminue). Toujours équilibrer les e⁻ avant d'additionner les demi-équations.</p></div>` },
    { title: "La chaîne respiratoire mitochondriale", content: `<p class="mb-3">La <strong>chaîne respiratoire</strong> est située dans la membrane interne mitochondriale. Elle comprend quatre complexes protéiques (I à IV) et deux transporteurs mobiles (ubiquinone/CoQ et cytochrome c) qui assurent le transfert séquentiel des électrons du NADH et du FADH₂ vers l'O₂.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Complexe I</strong> (NADH-ubiquinone oxydoréductase) : NADH → CoQ, pompe 4 H⁺.</li>
<li><strong>Complexe II</strong> (succinate déshydrogénase) : FADH₂ → CoQ, ne pompe pas de H⁺.</li>
<li><strong>Complexe III</strong> (ubiquinol-cytochrome c oxydoréductase) : CoQH₂ → cytochrome c, pompe 4 H⁺ (cycle Q).</li>
<li><strong>Complexe IV</strong> (cytochrome c oxydase) : cytochrome c → O₂, pompe 2 H⁺. Réduit O₂ en H₂O (accepteur final).</li>
</ul>
<p class="mb-3">Au total, le NADH permet de pomper <strong>10 H⁺</strong> (complexes I + III + IV) et le FADH₂ seulement <strong>6 H⁺</strong> (complexes II + III + IV). Ce gradient de protons (force proton-motrice) est constitué d'un gradient de pH (ΔpH) et d'un potentiel de membrane (Δψ).</p>
<p class="mb-3">Les <strong>inhibiteurs</strong> de la chaîne : roténone (complexe I), antimycine A (complexe III), cyanure/CO (complexe IV). Les <strong>découplants</strong> (DNP, thermogénine/UCP1) dissipent le gradient sans synthèse d'ATP → production de chaleur (thermogenèse du tissu adipeux brun).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : NADH → 10 H⁺ pompés (via I, III, IV), FADH₂ → 6 H⁺ (via II, III, IV). Le cyanure bloque le complexe IV. Les découplants dissipent le gradient en chaleur sans ATP.</p></div>` },
    { title: "Phosphorylation oxydative et ATP synthase", content: `<p class="mb-3">L'<strong>ATP synthase</strong> (complexe V) utilise le gradient de protons (force proton-motrice) pour synthétiser l'ATP à partir d'ADP + Pi selon la théorie chimiosmotique de <strong>Peter Mitchell</strong> (Prix Nobel 1978).</p>
<p class="mb-3">L'ATP synthase est un moteur moléculaire rotatif constitué de deux parties :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>F₀</strong> : partie membranaire (canal à protons), constituée d'un anneau de sous-unités c. Le passage des H⁺ fait tourner l'anneau.</li>
<li><strong>F₁</strong> : partie matricielle (catalyse), contient les sous-unités α₃β₃ (sites catalytiques) et la tige γ. La rotation de γ induit des changements conformationnels cycliques dans les sous-unités β.</li>
</ul>
<p class="mb-3">Chaque sous-unité β passe par trois conformations : O (open, libère ATP), L (loose, fixe ADP + Pi) et T (tight, synthétise ATP). Un tour complet = 3 ATP. Il faut environ <strong>4 H⁺ par ATP</strong> synthétisé.</p>
<p class="mb-3">Bilan énergétique de l'oxydation complète du glucose : 1 NADH ≈ 2,5 ATP, 1 FADH₂ ≈ 1,5 ATP. Total : <strong>30 à 32 ATP</strong> par glucose (10 NADH + 2 FADH₂ + 2 GTP + 2 ATP de la glycolyse). L'<strong>oligomycine</strong> inhibe l'ATP synthase en bloquant le canal F₀.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : L'ATP synthase (modèle de Boyer) est un moteur rotatif. 1 NADH ≈ 2,5 ATP, 1 FADH₂ ≈ 1,5 ATP. Bilan total : 30-32 ATP/glucose. L'oligomycine bloque l'ATP synthase.</p></div>` },
    { title: "Applications biomédicales de l'oxydoréduction", content: `<p class="mb-3">De nombreuses pathologies sont liées à des dysfonctionnements de l'oxydoréduction :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Maladies mitochondriales</strong> : mutations de l'ADN mitochondrial affectant les complexes de la chaîne respiratoire → myopathies, encéphalopathies (syndrome de Leigh, MELAS).</li>
<li><strong>Intoxications</strong> : le cyanure (CN⁻) et le monoxyde de carbone (CO) bloquent le complexe IV → arrêt de la respiration cellulaire. Antidote du cyanure : hydroxocobalamine (fixe le CN⁻).</li>
<li><strong>Méthémoglobinémie</strong> : oxydation du Fe²⁺ de l'hémoglobine en Fe³⁺ → incapacité à transporter l'O₂. Traitement : bleu de méthylène (agent réducteur).</li>
</ul>
<p class="mb-3">En biochimie clinique, de nombreux dosages reposent sur des réactions d'oxydoréduction couplées à la mesure spectrophotométrique du NAD(P)H à 340 nm. La <strong>glucose oxydase</strong> est utilisée pour le dosage enzymatique de la glycémie (glucose + O₂ → gluconolactone + H₂O₂, puis détection colorimétrique du H₂O₂).</p>
<p class="mb-3">Le <strong>potentiel redox cellulaire</strong> (rapport NAD⁺/NADH) est un indicateur de l'état métabolique : un rapport élevé favorise les réactions cataboliques (oxydations), un rapport bas les réactions anaboliques (réductions). L'alcool déshydrogénase (ADH) convertit l'éthanol en acétaldéhyde en réduisant NAD⁺ → NADH, ce qui perturbe ce rapport.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le cyanure bloque la chaîne respiratoire (complexe IV). Le rapport NAD⁺/NADH reflète l'état redox cellulaire. Le dosage de la glycémie par glucose oxydase repose sur une réaction d'oxydoréduction.</p></div>` }
  ]
},

"chimie-cinetique": {
  introduction: "La cinétique chimique étudie la vitesse des réactions. En biochimie, elle s'applique à la cinétique enzymatique de Michaelis-Menten et à la pharmacocinétique.",
  readTime: 20,
  sections: [
    { title: "Ordres de réaction et énergie d'activation", content: `<p class="mb-3">v = k[A]ⁿ. <strong>Ordre 0</strong> : v = k, T₁/₂ = [A]₀/2k (élimination éthanol). <strong>Ordre 1</strong> : v = k[A], [A] = [A]₀e⁻ᵏᵗ, T₁/₂ = ln2/k indépendant de [A]₀ (radioactivité, élimination médicaments). <strong>Ordre 2</strong> : T₁/₂ = 1/(k[A]₀).</p><p class="mb-3">Loi d'<strong>Arrhenius</strong> : k = A × e⁻ᴱᵃ/ᴿᵀ. L'énergie d'activation Ea est abaissée par les catalyseurs. Les enzymes abaissent Ea sans modifier ΔG (l'équilibre est inchangé). La température augmente k (~doublement tous les 10°C).</p><div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Ordre 1 : T₁/₂ = ln2/k (indépendant de la concentration). Les enzymes abaissent Ea mais ne changent pas l'équilibre (ΔG identique).</p></div>` },
    { title: "Cinétique enzymatique de Michaelis-Menten", content: `<p class="mb-3">Le modèle de <strong>Michaelis-Menten</strong> décrit la cinétique des enzymes à un substrat. Le mécanisme comporte deux étapes : E + S ⇌ ES → E + P. L'équation de vitesse est :</p>
<p class="mb-3"><strong>v = Vmax × [S] / (Km + [S])</strong></p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Vmax</strong> = kcat × [E]t : vitesse maximale quand toutes les enzymes sont saturées par le substrat.</li>
<li><strong>Km</strong> (constante de Michaelis) : concentration en substrat pour laquelle v = Vmax/2. Un Km faible indique une forte affinité de l'enzyme pour son substrat.</li>
<li><strong>kcat</strong> (nombre de turnover) : nombre de molécules de substrat transformées par molécule d'enzyme par seconde. kcat/Km mesure l'<strong>efficacité catalytique</strong>.</li>
</ul>
<p class="mb-3">La représentation de <strong>Lineweaver-Burk</strong> (double inverse) : 1/v = (Km/Vmax) × 1/[S] + 1/Vmax. Le graphe 1/v vs 1/[S] est une droite de pente Km/Vmax, d'ordonnée à l'origine 1/Vmax et d'abscisse à l'origine -1/Km.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : v = Vmax[S]/(Km+[S]). Km = [S] quand v = Vmax/2 (affinité). Lineweaver-Burk : 1/v vs 1/[S] permet de déterminer Km et Vmax graphiquement.</p></div>` },
    { title: "Inhibitions enzymatiques réversibles", content: `<p class="mb-3">Trois types d'<strong>inhibition réversible</strong> modifient la cinétique enzymatique de façon caractéristique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Inhibition compétitive</strong> : l'inhibiteur se fixe au site actif, en compétition avec le substrat. Km apparent augmente, Vmax inchangée. Levée par excès de substrat. Exemple : malonate vs succinate pour la succinate déshydrogénase.</li>
<li><strong>Inhibition incompétitive</strong> : l'inhibiteur se fixe uniquement au complexe ES. Km apparent et Vmax diminuent proportionnellement. En Lineweaver-Burk : droites parallèles.</li>
<li><strong>Inhibition non compétitive</strong> : l'inhibiteur se fixe à un site allostérique, indépendamment du substrat (sur E ou ES). Km inchangé, Vmax diminuée. Non levée par excès de substrat.</li>
</ul>
<p class="mb-3">L'<strong>inhibition irréversible</strong> implique une liaison covalente avec l'enzyme (inactivation définitive). Exemples : les organophosphorés (insecticides, gaz neurotoxiques) inhibent irréversiblement l'acétylcholinestérase ; l'aspirine acétyle irréversiblement la COX.</p>
<p class="mb-3">La constante d'inhibition <strong>Ki</strong> quantifie l'affinité de l'inhibiteur pour l'enzyme. Plus Ki est faible, plus l'inhibiteur est puissant. De nombreux médicaments sont des inhibiteurs enzymatiques (statines → HMG-CoA réductase, IECA → enzyme de conversion).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Compétitive → Km↑, Vmax identique (levée par excès de substrat). Non compétitive → Km identique, Vmax↓. Incompétitive → Km↓, Vmax↓ (droites parallèles en Lineweaver-Burk).</p></div>` },
    { title: "Catalyse et état de transition", content: `<p class="mb-3">Le <strong>catalyseur</strong> accélère une réaction en abaissant l'énergie d'activation Ea sans être consommé ni modifier l'équilibre thermodynamique (ΔG identique). Il augmente la vitesse des réactions directe ET inverse de façon identique.</p>
<p class="mb-3">Les enzymes sont des catalyseurs biologiques extraordinairement efficaces. Elles stabilisent l'<strong>état de transition</strong> (complexe activé ‡) par différents mécanismes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Catalyse acide-base générale</strong> : transfert de protons par des résidus His, Glu, Asp (ex. RNase A).</li>
<li><strong>Catalyse covalente</strong> : formation d'un intermédiaire covalent enzyme-substrat (ex. triade catalytique Ser-His-Asp des protéases à sérine comme la trypsine et la chymotrypsine).</li>
<li><strong>Catalyse par les ions métalliques</strong> : stabilisation des charges négatives, activation de l'eau (ex. anhydrase carbonique avec Zn²⁺, carboxypeptidase A).</li>
<li><strong>Effet de proximité et d'orientation</strong> : le site actif rapproche et oriente correctement les substrats, augmentant la concentration locale effective.</li>
</ul>
<p class="mb-3">La théorie de l'<strong>état de transition</strong> (Eyring) : k = (kB × T / h) × e^(-ΔG‡/RT). L'enzyme abaisse ΔG‡ (énergie libre d'activation) en stabilisant l'état de transition. Les analogues de l'état de transition sont des inhibiteurs très puissants.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Les enzymes stabilisent l'état de transition (concept de Pauling). La triade Ser-His-Asp des protéases à sérine est un exemple classique de catalyse covalente + acide-base.</p></div>` },
    { title: "Pharmacocinétique et applications cliniques", content: `<p class="mb-3">La <strong>pharmacocinétique</strong> applique les principes de la cinétique chimique à l'évolution des médicaments dans l'organisme. La plupart des médicaments suivent une cinétique d'ordre 1 pour leur élimination :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Demi-vie (T₁/₂)</strong> = ln2/ke : temps pour que la concentration plasmatique diminue de moitié. Indépendante de la dose (ordre 1).</li>
<li><strong>État d'équilibre</strong> (steady state) : atteint après ~5 T₁/₂ lors d'administrations répétées. La concentration oscille autour de Css = Dose/(Vd × ke × τ).</li>
<li><strong>Clairance (Cl)</strong> = ke × Vd : volume de plasma épuré par unité de temps. Cl totale = Cl rénale + Cl hépatique + Cl autres.</li>
</ul>
<p class="mb-3">Exceptions à l'ordre 1 : l'<strong>éthanol</strong> suit une cinétique d'ordre 0 (saturation de l'ADH) → élimination constante ~0,15 g/L/h, indépendante de la concentration. La <strong>phénytoïne</strong> suit une cinétique de Michaelis-Menten (saturable) → risque de toxicité en cas de faible augmentation de dose.</p>
<p class="mb-3">La <strong>biodisponibilité (F)</strong> est la fraction de la dose administrée qui atteint la circulation systémique sous forme inchangée. F = AUC(orale) / AUC(IV). L'effet de premier passage hépatique réduit F pour les médicaments administrés par voie orale.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : T₁/₂ = ln2/ke (ordre 1). État d'équilibre atteint après 5 T₁/₂. L'éthanol suit une cinétique d'ordre 0 (élimination constante). La biodisponibilité F mesure la fraction absorbée.</p></div>` }
  ]
},

"chimie-lipides": {
  introduction: "Les lipides sont des biomolécules hydrophobes essentielles : membranes, réserves énergétiques, hormones et messagers intracellulaires.",
  readTime: 18,
  sections: [
    { title: "Acides gras : structure et classification", content: `<p class="mb-3">Les <strong>acides gras</strong> (AG) sont des acides carboxyliques à longue chaîne hydrocarbonée. On distingue :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>AG saturés</strong> : palmitate (C16:0), stéarate (C18:0). Chaîne linéaire → point de fusion élevé.</li>
<li><strong>AG mono-insaturés</strong> : oléate (C18:1 ω9). Une double liaison cis → coude.</li>
<li><strong>AG polyinsaturés</strong> : linoléate (C18:2 ω6), α-linolénate (C18:3 ω3), arachidonique (C20:4 ω6).</li>
</ul>
<p class="mb-3">AG <strong>essentiels</strong> = linoléique (ω6) + α-linolénique (ω3), non synthétisables par l'homme. Les doubles liaisons naturelles sont en configuration <strong>cis (Z)</strong>. Les AG trans (hydrogénation industrielle) sont athérogènes. La nomenclature ω indique la position de la première double liaison à partir du carbone méthyle terminal.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : AG essentiels = linoléique (ω6) et α-linolénique (ω3). Les doubles liaisons cis diminuent le point de fusion. Les AG trans sont athérogènes.</p></div>` },
    { title: "Classification des lipides", content: `<p class="mb-3">Trois grandes catégories de lipides :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Lipides simples</strong> : <strong>triglycérides</strong> (glycérol + 3 AG) = principale réserve énergétique (9 kcal/g). Cires (AG + alcool à longue chaîne).</li>
<li><strong>Lipides complexes</strong> (amphiphiles) : <strong>glycérophospholipides</strong> (glycérol + 2 AG + phosphate + tête polaire : choline → PC/lécithine, éthanolamine → PE, sérine → PS, inositol → PI). <strong>Sphingolipides</strong> = sphingosine + AG (= céramide) + tête polaire : sphingomyéline (myéline), cérébrosides (un sucre), gangliosides (oligosaccharide + acide sialique).</li>
<li><strong>Lipides isopréniques</strong> : dérivés de l'isoprène. Cholestérol, hormones stéroïdiennes, vitamines A/D/E/K, ubiquinone (CoQ).</li>
</ul>
<p class="mb-3">Les <strong>éicosanoïdes</strong> dérivent de l'acide arachidonique (C20:4 ω6) : prostaglandines et thromboxanes (via COX, cible de l'aspirine/AINS), leucotriènes (via LOX). Rôles : inflammation, agrégation plaquettaire, bronchoconstriction.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : TG = réserve (9 kcal/g). Phospholipides = membranes. Sphingolipides = myéline. Les éicosanoïdes (COX/LOX) dérivent de l'acide arachidonique → cible de l'aspirine.</p></div>` },
    { title: "Membranes biologiques et fluidité", content: `<p class="mb-3">Les membranes biologiques sont organisées en <strong>bicouche lipidique</strong> (modèle de la mosaïque fluide, Singer et Nicolson 1972). Les phospholipides s'orientent : têtes polaires vers l'eau, queues hydrophobes vers l'intérieur.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Fluidité</strong> : augmentée par les AG insaturés (coude cis), diminuée par les AG saturés. Le <strong>cholestérol</strong> module la fluidité : rigidifie les membranes fluides et fluidifie les membranes rigides (effet tampon).</li>
<li><strong>Asymétrie</strong> : PS et PE sur le feuillet interne, PC et sphingomyéline sur le feuillet externe. L'exposition de PS sur le feuillet externe = signal d'<strong>apoptose</strong>.</li>
<li><strong>Perméabilité sélective</strong> : O₂, CO₂, N₂ traversent librement. Les molécules polaires et les ions nécessitent des transporteurs ou canaux.</li>
</ul>
<p class="mb-3">Les <strong>radeaux lipidiques</strong> (lipid rafts) sont des microdomaines enrichis en cholestérol et sphingolipides qui concentrent certaines protéines de signalisation. Les glycolipides du feuillet externe participent à la reconnaissance cellulaire (groupes sanguins ABO).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Mosaïque fluide = modèle de membrane. Le cholestérol module la fluidité. L'exposition de PS = signal d'apoptose. Les AG insaturés augmentent la fluidité.</p></div>` },
    { title: "β-oxydation des acides gras", content: `<p class="mb-3">La <strong>β-oxydation</strong> dégrade les AG en acétyl-CoA dans la matrice mitochondriale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Activation</strong> : AG + CoA → acyl-CoA (acyl-CoA synthétase, coût 2 ATP).</li>
<li><strong>Transport</strong> : la <strong>navette carnitine</strong> (CPT-I / translocase / CPT-II) transfère l'acyl dans la matrice. CPT-I = étape limitante, inhibée par le malonyl-CoA.</li>
</ul>
<p class="mb-3">Chaque tour de β-oxydation : oxydation (FAD → FADH₂), hydratation, oxydation (NAD⁺ → NADH), thiolyse (libération d'un acétyl-CoA). Un AG à n C subit (n/2 - 1) tours → n/2 acétyl-CoA.</p>
<p class="mb-3"><strong>Bilan du palmitate (C16:0)</strong> : 7 tours → 8 acétyl-CoA + 7 FADH₂ + 7 NADH = 108 - 2 (activation) = <strong>106 ATP</strong> net (vs 30-32 pour le glucose). Les AG insaturés nécessitent une énoyl-CoA isomérase et une réductase supplémentaires.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : β-oxydation du palmitate → 106 ATP net. CPT-I = étape limitante (inhibée par malonyl-CoA). Chaque tour : 1 FADH₂ + 1 NADH + 1 acétyl-CoA.</p></div>` },
    { title: "Lipogenèse et corps cétoniques", content: `<p class="mb-3">La <strong>lipogenèse</strong> (synthèse des AG) a lieu dans le cytoplasme (foie, tissu adipeux). L'acétyl-CoA est exporté de la mitochondrie via le citrate.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Acétyl-CoA carboxylase (ACC)</strong> : acétyl-CoA → malonyl-CoA (étape limitante, coenzyme biotine/B8). Activée par insuline et citrate, inhibée par glucagon (phosphorylation par AMPK) et AG à longue chaîne.</li>
<li><strong>Acide gras synthase (FAS)</strong> : complexe multi-enzymatique, allonge la chaîne de 2C/cycle. Produit final = palmitate (C16:0). Utilise du NADPH (voie des pentoses phosphates).</li>
</ul>
<p class="mb-3">Les <strong>corps cétoniques</strong> (acétoacétate, β-hydroxybutyrate, acétone) sont synthétisés dans le foie à partir de l'excès d'acétyl-CoA en situation de jeûne prolongé ou diabète décompensé :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>2 acétyl-CoA → acétoacétyl-CoA → HMG-CoA → acétoacétate → β-hydroxybutyrate.</li>
<li>Le cerveau et le cœur peuvent les utiliser comme carburant (thiophorase, absente du foie).</li>
<li>L'<strong>acidocétose diabétique</strong> = production excessive → acidose métabolique à trou anionique élevé.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : ACC = étape limitante de la lipogenèse (activée par insuline, inhibée par glucagon). Les corps cétoniques sont produits par le foie en jeûne/diabète. L'acidocétose = urgence métabolique.</p></div>` }
  ]
},

"chimie-glucides": {
  introduction: "Les glucides sont des biomolécules fondamentales jouant des rôles énergétiques, structuraux et de signalisation. Oses, osides et polysaccharides participent à de nombreux processus biologiques.",
  readTime: 18,
  sections: [
    { title: "Classification et structure des oses", content: `<p class="mb-3">Les <strong>oses (monosaccharides)</strong> sont classés selon leur fonction carbonyle et leur nombre de carbones :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Aldoses vs cétoses</strong> : les aldoses portent un aldéhyde (C1), les cétoses une cétone (C2). Le glucose est un aldohexose, le fructose un cétohexose.</li>
<li><strong>Stéréochimie</strong> : chaque carbone asymétrique (C*) donne lieu à des stéréoisomères. Les énantiomères D et L sont définis par la configuration du C* le plus éloigné du C=O. En biologie, les oses naturels sont de série D.</li>
<li><strong>Épimères</strong> : oses ne différant que par la configuration d'un seul C*. Le glucose et le galactose sont épimères en C4. Le glucose et le mannose sont épimères en C2.</li>
</ul>
<p class="mb-3">Les oses importants en biochimie : glucose (énergie), fructose (alimentation), galactose (lait), ribose (ARN), désoxyribose (ADN).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Les oses biologiques sont de série D. Le glucose et le galactose sont épimères en C4. Le ribose (pentose) est le sucre de l'ARN.</p></div>` },
    { title: "Cyclisation et anomérie", content: `<p class="mb-3">En solution, les oses à 5 carbones ou plus se <strong>cyclisent</strong> par réaction intramoléculaire entre le carbonyle et un hydroxyle :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Pyranose</strong> : cycle à 6 atomes (5C + 1O). Forme majoritaire du glucose en solution (glucopyranose).</li>
<li><strong>Furanose</strong> : cycle à 5 atomes (4C + 1O). Forme privilégiée du fructose (fructofuranose) et du ribose.</li>
<li><strong>Anomérie</strong> : la cyclisation crée un nouveau C* (C anomérique). L'anomère α a le OH anomérique axial (trans par rapport au CH₂OH), l'anomère β l'a équatorial (cis). En solution, il y a mutarotation entre les deux anomères.</li>
</ul>
<p class="mb-3">Les <strong>projections de Haworth</strong> représentent la forme cyclique en perspective. La conformation <strong>chaise</strong> est plus réaliste et montre les positions axiales et équatoriales des substituants.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : L'anomère α a le OH en position axiale, le β en équatorial. La mutarotation = équilibre α ⇌ β en solution. Le glucose existe majoritairement sous forme pyranose.</p></div>` },
    { title: "Diholosides et liaison osidique", content: `<p class="mb-3">Les <strong>diholosides (disaccharides)</strong> résultent de la condensation de deux oses par une <strong>liaison osidique</strong> (O-glycosidique) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Maltose</strong> : Glc α(1→4) Glc. Réducteur (un C anomérique libre). Produit de l'hydrolyse de l'amidon.</li>
<li><strong>Lactose</strong> : Gal β(1→4) Glc. Réducteur. Sucre du lait. L'intolérance au lactose = déficit en lactase.</li>
<li><strong>Saccharose</strong> : Glc α(1→2)β Fru. <strong>Non réducteur</strong> car les deux C anomériques sont engagés dans la liaison. Sucre de table.</li>
</ul>
<p class="mb-3">Le caractère <strong>réducteur</strong> d'un ose dépend de la présence d'un C anomérique libre pouvant s'ouvrir et réduire des agents oxydants (liqueur de Fehling, réactif de Tollens).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le saccharose est non réducteur (les 2 C anomériques sont engagés). Le lactose est réducteur. L'intolérance au lactose = déficit en lactase intestinale.</p></div>` },
    { title: "Polysaccharides de réserve et structuraux", content: `<p class="mb-3">Les <strong>polysaccharides</strong> sont des polymères d'oses aux fonctions biologiques variées :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Amidon</strong> : réserve glucidique végétale. Deux fractions : amylose (α1→4, linéaire, hélice) et amylopectine (α1→4 + ramifications α1→6 tous les 20-25 résidus).</li>
<li><strong>Glycogène</strong> : réserve glucidique animale (foie, muscles). Structure similaire à l'amylopectine mais beaucoup plus ramifié (α1→6 tous les 8-12 résidus). Permet une mobilisation rapide du glucose.</li>
<li><strong>Cellulose</strong> : polymère de glucose en liaison β(1→4). Non digestible par l'Homme (pas de cellulase). Constitue la paroi des cellules végétales.</li>
<li><strong>Glycosaminoglycanes (GAG)</strong> : polysaccharides de la matrice extracellulaire (acide hyaluronique, chondroïtine sulfate, héparine). Unité de base = diholoside répétitif avec un acide uronique et un osamino.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le glycogène est plus ramifié que l'amylopectine (α1→6 tous les 8-12 vs 20-25 résidus). La cellulose (β1→4) n'est pas digestible. L'héparine est un GAG anticoagulant.</p></div>` },
    { title: "Glycoconjugués et groupes sanguins", content: `<p class="mb-3">Les glucides se lient fréquemment aux protéines et lipides pour former des <strong>glycoconjugués</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Glycoprotéines</strong> : protéines portant des chaînes oligosaccharidiques. N-glycosylation (sur Asn-X-Ser/Thr, dans le RE) et O-glycosylation (sur Ser/Thr, dans le Golgi).</li>
<li><strong>Protéoglycanes</strong> : protéines associées à des GAG. Composants majeurs de la matrice extracellulaire (aggrécane du cartilage).</li>
<li><strong>Glycolipides</strong> : lipides membranaires portant des oligosaccharides (cérébrosides, gangliosides). Rôle dans la signalisation et la reconnaissance cellulaire.</li>
<li><strong>Groupes sanguins ABO</strong> : déterminés par les sucres terminaux des glycoprotéines et glycolipides membranaires. A = N-acétylgalactosamine, B = galactose, O = pas de sucre terminal (antigène H).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Les groupes sanguins ABO sont déterminés par les sucres terminaux. A = GalNAc, B = Gal, O = antigène H seul. La N-glycosylation se fait dans le RE, la O-glycosylation dans le Golgi.</p></div>` }
  ]
},

"chimie-proteines-structure": {
  introduction: "Les protéines sont des macromolécules dont la structure tridimensionnelle détermine l'activité biologique. Quatre niveaux d'organisation structurale définissent l'architecture protéique.",
  readTime: 18,
  sections: [
    { title: "Acides aminés et liaison peptidique", content: `<p class="mb-3">Les <strong>20 acides aminés protéinogènes</strong> partagent une structure commune (Cα portant NH₂, COOH, H et chaîne latérale R) mais diffèrent par leur chaîne latérale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>AA apolaires</strong> : Gly, Ala, Val, Leu, Ile, Pro, Met, Phe, Trp — cœur hydrophobe des protéines.</li>
<li><strong>AA polaires non chargés</strong> : Ser, Thr, Cys, Tyr, Asn, Gln — liaisons H et sites de modifications post-traductionnelles.</li>
<li><strong>AA chargés positivement (basiques)</strong> : Lys, Arg, His — interactions ioniques.</li>
<li><strong>AA chargés négativement (acides)</strong> : Asp, Glu — sites catalytiques et interactions ioniques.</li>
</ul>
<p class="mb-3">La <strong>liaison peptidique</strong> (C-N) a un caractère partiel de double liaison : elle est <strong>plane et rigide</strong>, en configuration trans. Les angles φ (N-Cα) et ψ (Cα-C) sont libres et définissent la conformation du squelette.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : 9 AA essentiels : His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val. La liaison peptidique est plane et rigide (caractère de double liaison partiel C-N).</p></div>` },
    { title: "Structure secondaire : hélice α et feuillet β", content: `<p class="mb-3">La <strong>structure secondaire</strong> décrit l'arrangement local régulier du squelette peptidique, stabilisé par des liaisons hydrogène :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Hélice α</strong> : structure hélicoïdale droite avec 3,6 résidus par tour. Liaison H entre le C=O du résidu i et le NH du résidu i+4 (intra-chaîne). Le pas de l'hélice = 0,54 nm. La proline est un briseur d'hélice.</li>
<li><strong>Feuillet β</strong> : chaînes étendues en zigzag reliées latéralement par des liaisons H inter-brins. Parallèle (même direction N→C) ou antiparallèle (directions opposées, plus stable).</li>
<li><strong>Coudes (turns)</strong> : changements de direction du squelette, souvent impliquant Pro et Gly. Les boucles connectent les éléments de structure secondaire.</li>
</ul>
<p class="mb-3">Le <strong>diagramme de Ramachandran</strong> représente les combinaisons d'angles φ/ψ stériquement permises. Il montre des zones autorisées correspondant aux structures secondaires régulières.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Hélice α = liaison H i→i+4 (intra-chaîne, 3,6 AA/tour). Feuillet β = liaison H inter-brins. Le diagramme de Ramachandran montre les conformations permises.</p></div>` },
    { title: "Structures tertiaire et quaternaire", content: `<p class="mb-3">La <strong>structure tertiaire</strong> est le repliement tridimensionnel global de la chaîne polypeptidique, stabilisé par des interactions non covalentes et covalentes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Interactions hydrophobes</strong> : force motrice principale du repliement. Les chaînes latérales apolaires s'enfouissent au cœur de la protéine.</li>
<li><strong>Liaisons hydrogène</strong> : entre chaînes latérales polaires et avec l'eau en surface.</li>
<li><strong>Interactions ioniques (salines)</strong> : entre AA chargés de signes opposés (ex. Lys⁺/Glu⁻).</li>
<li><strong>Ponts disulfure</strong> : liaison covalente S-S entre deux cystéines. Stabilisent la structure (surtout protéines sécrétées).</li>
</ul>
<p class="mb-3">La <strong>structure quaternaire</strong> correspond à l'association de plusieurs sous-unités (protomères). L'hémoglobine (α₂β₂) en est l'exemple classique.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : L'effet hydrophobe est la force motrice principale du repliement. Les ponts disulfure (Cys-Cys) sont les seules liaisons covalentes de la structure tertiaire.</p></div>` },
    { title: "Hémoglobine et coopérativité", content: `<p class="mb-3">L'<strong>hémoglobine</strong> illustre parfaitement la relation structure-fonction et le concept de coopérativité :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Structure</strong> : tétramère α₂β₂, chaque sous-unité porte un hème (Fe²⁺ + protoporphyrine IX) fixant une molécule d'O₂.</li>
<li><strong>Coopérativité</strong> : la fixation d'O₂ sur une sous-unité facilite la fixation sur les suivantes. Courbe de saturation <strong>sigmoïde</strong> (vs myoglobine hyperbolique).</li>
<li><strong>Effet Bohr</strong> : une diminution du pH (↑ CO₂, ↑ H⁺) diminue l'affinité de l'Hb pour l'O₂ → libération au niveau des tissus actifs.</li>
<li><strong>2,3-BPG</strong> : métabolite érythrocytaire qui se fixe dans la cavité centrale de la déoxy-Hb et diminue l'affinité pour l'O₂.</li>
</ul>
<p class="mb-3">Les <strong>hémoglobinopathies</strong> : drépanocytose (HbS, Glu6→Val sur la chaîne β, polymérisation en désoxy), thalassémies (défaut de synthèse des chaînes α ou β).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Hémoglobine = sigmoïde (coopérativité), myoglobine = hyperbole. L'effet Bohr favorise la libération d'O₂ dans les tissus actifs (pH bas). Drépanocytose = mutation Glu6Val.</p></div>` },
    { title: "Dénaturation et repliement des protéines", content: `<p class="mb-3">La <strong>dénaturation</strong> est la perte des structures secondaire, tertiaire et quaternaire sans rupture des liaisons peptidiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Agents dénaturants</strong> : chaleur, pH extrêmes, détergents (SDS), agents chaotropiques (urée, guanidine), solvants organiques, agitation mécanique.</li>
<li><strong>Conséquences</strong> : perte d'activité biologique, exposition du cœur hydrophobe → agrégation et précipitation.</li>
<li><strong>Renaturation</strong> : possible in vitro dans certains cas (expérience d'Anfinsen sur la RNase A → le prix Nobel 1972 montre que la séquence contient toute l'information pour le repliement).</li>
</ul>
<p class="mb-3">In vivo, les <strong>chaperons moléculaires</strong> (HSP70, HSP60/chaperonines) assistent le repliement correct des protéines. Les erreurs de repliement (misfolding) sont impliquées dans des maladies : Alzheimer (peptide Aβ), Parkinson (α-synucléine), prions (PrPSc).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : La dénaturation détruit les structures II-IV mais pas la séquence (I). Anfinsen (Nobel 1972) : la séquence dicte le repliement. Les maladies à prions = erreur de repliement.</p></div>` }
  ]
},

"chimie-acides-nucleiques": {
  introduction: "Les acides nucléiques (ADN et ARN) sont les supports de l'information génétique. Leur structure chimique détermine les mécanismes de réplication, transcription et traduction.",
  readTime: 16,
  sections: [
    { title: "Nucléotides : unités de base", content: `<p class="mb-3">Les <strong>nucléotides</strong> sont les monomères des acides nucléiques, composés de trois éléments :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Base azotée</strong> : purines (adénine A, guanine G — 2 cycles) et pyrimidines (cytosine C, thymine T, uracile U — 1 cycle).</li>
<li><strong>Pentose</strong> : désoxyribose (ADN) ou ribose (ARN). La différence : absence du OH en 2' sur le désoxyribose.</li>
<li><strong>Groupement phosphate</strong> : relié au C5' du pentose. Les nucléosides n'ont pas de phosphate.</li>
</ul>
<p class="mb-3">La liaison entre les nucléotides est une <strong>liaison phosphodiester</strong> 3'→5' qui forme le squelette sucre-phosphate. Les nucléotides libres (ATP, GTP, NAD⁺) jouent aussi des rôles métaboliques essentiels.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : ADN = désoxyribose + T. ARN = ribose + U. Purines (A, G) = 2 cycles. Pyrimidines (C, T, U) = 1 cycle. L'ATP est un nucléotide à 3 phosphates.</p></div>` },
    { title: "Double hélice de l'ADN", content: `<p class="mb-3">Le modèle de <strong>Watson et Crick</strong> (1953, Nobel 1962) décrit l'ADN comme une double hélice :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Brins antiparallèles</strong> : un brin 5'→3' apparié à un brin 3'→5'. Le squelette sucre-phosphate est à l'extérieur, les bases à l'intérieur.</li>
<li><strong>Appariement complémentaire</strong> : A=T (2 liaisons H) et G≡C (3 liaisons H). Règles de Chargaff : %A = %T, %G = %C.</li>
<li><strong>Forme B</strong> (physiologique) : hélice droite, 10 pb/tour, pas de 3,4 nm, diamètre 2 nm. Sillon majeur et sillon mineur.</li>
<li><strong>Tm (température de fusion)</strong> : température à laquelle 50 % de l'ADN est dénaturé. Augmente avec le %GC (3 liaisons H vs 2).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : A=T (2 liaisons H), G≡C (3 liaisons H). Brins antiparallèles 5'→3' / 3'→5'. La Tm augmente avec le %GC. Forme B = 10 pb/tour.</p></div>` },
    { title: "ARN : types et structures", content: `<p class="mb-3">L'<strong>ARN</strong> est généralement simple brin mais forme des structures secondaires par appariement intramoléculaire :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>ARNm</strong> (messager) : copie de l'ADN, porte l'information pour la synthèse protéique. Coiffe 5', queue poly-A 3', codons (triplets).</li>
<li><strong>ARNt</strong> (transfert) : structure en trèfle, porte l'AA correspondant à son anticodon. L'aminoacyl-ARNt synthétase charge l'AA correct.</li>
<li><strong>ARNr</strong> (ribosomal) : composant structural et catalytique des ribosomes (28S, 18S, 5,8S, 5S chez les eucaryotes).</li>
<li><strong>ARN non codants</strong> : miARN (régulation post-transcriptionnelle), siARN (interférence ARN), lncARN (régulation épigénétique).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : L'ARNm porte l'information (codons), l'ARNt porte l'AA (anticodon), l'ARNr forme les ribosomes. Les miARN régulent l'expression génique.</p></div>` },
    { title: "Réplication de l'ADN", content: `<p class="mb-3">La <strong>réplication</strong> est semi-conservative (chaque brin sert de matrice) et se déroule pendant la phase S du cycle cellulaire :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Origines de réplication</strong> : multiples chez les eucaryotes. Ouverture de la double hélice par les hélicases → fourche de réplication bidirectionnelle.</li>
<li><strong>ADN polymérase</strong> : synthèse 5'→3' uniquement. Nécessite une amorce ARN (primase). Brin continu (leading) et brin discontinu (lagging, fragments d'Okazaki).</li>
<li><strong>Fidélité</strong> : activité correctrice 3'→5' (proofreading) de l'ADN pol. Taux d'erreur final ≈ 10⁻⁹ par nucléotide par réplication.</li>
<li><strong>Télomères</strong> : séquences répétitives (TTAGGG)n aux extrémités des chromosomes. Raccourcissent à chaque division. La télomérase les maintient dans les cellules souches et cancéreuses.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Réplication semi-conservative, 5'→3' uniquement. Fragments d'Okazaki sur le brin discontinu. La télomérase est active dans les cellules cancéreuses.</p></div>` },
    { title: "Mutations et réparation de l'ADN", content: `<p class="mb-3">Les <strong>mutations</strong> sont des modifications de la séquence d'ADN, spontanées ou induites :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Substitutions</strong> : transition (purine↔purine ou pyrimidine↔pyrimidine), transversion (purine↔pyrimidine). Conséquences : silencieuse, faux-sens, non-sens (codon STOP).</li>
<li><strong>Insertions/délétions</strong> : si non multiples de 3, provoquent un décalage du cadre de lecture (frameshift) → protéine aberrante.</li>
<li><strong>Agents mutagènes</strong> : UV (dimères de thymine), agents alkylants, espèces réactives de l'oxygène, intercalants (BET).</li>
</ul>
<p class="mb-3">Les <strong>systèmes de réparation</strong> : BER (excision de base, 8-oxoG), NER (excision de nucléotide, dimères UV → xeroderma pigmentosum si déficience), MMR (mésappariements → syndrome de Lynch si déficience).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Les UV causent des dimères de thymine (réparés par NER). Le déficit en NER = xeroderma pigmentosum. Le décalage du cadre de lecture = mutation la plus grave.</p></div>` }
  ]
},

"chimie-metabolisme": {
  introduction: "Le métabolisme cellulaire regroupe les voies cataboliques (dégradation) et anaboliques (synthèse) assurant la production d'énergie et la biosynthèse des molécules nécessaires à la vie.",
  readTime: 18,
  sections: [
    { title: "Glycolyse : dégradation du glucose", content: `<p class="mb-3">La <strong>glycolyse</strong> se déroule dans le cytoplasme et transforme 1 glucose en 2 pyruvates :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Phase d'investissement</strong> (5 étapes) : consomme 2 ATP. Étapes irréversibles : hexokinase (→G-6-P) et PFK-1 (→F-1,6-bisP).</li>
<li><strong>Phase de retour</strong> (5 étapes) : produit 4 ATP + 2 NADH. Étape irréversible : pyruvate kinase (PEP→pyruvate).</li>
<li><strong>Bilan net</strong> : Glucose → 2 Pyruvate + 2 ATP + 2 NADH.</li>
</ul>
<p class="mb-3"><strong>PFK-1</strong> est l'enzyme limitante : activée par AMP, F-2,6-bisP (produit par PFK-2, stimulé par insuline) ; inhibée par ATP, citrate. En anaérobiose : pyruvate → lactate (LDH) pour régénérer le NAD⁺.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : PFK-1 = enzyme limitante de la glycolyse (activée par AMP et F-2,6-bisP, inhibée par ATP et citrate). Bilan net : 2 ATP + 2 NADH par glucose.</p></div>` },
    { title: "Cycle de Krebs et chaîne respiratoire", content: `<p class="mb-3">Le <strong>cycle de Krebs</strong> (cycle de l'acide citrique) se déroule dans la matrice mitochondriale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Entrée</strong> : pyruvate → acétyl-CoA par la pyruvate déshydrogénase (PDH) — complexe multienzymatique irréversible (coenzymes : TPP, lipoamide, CoA, FAD, NAD⁺).</li>
<li><strong>Bilan par acétyl-CoA</strong> : 2 CO₂ + 3 NADH + 1 FADH₂ + 1 GTP.</li>
<li><strong>Enzymes régulatrices</strong> : isocitrate déshydrogénase et α-cétoglutarate déshydrogénase (activées par ADP, inhibées par ATP et NADH).</li>
</ul>
<p class="mb-3">La <strong>chaîne respiratoire</strong> (membrane interne mitochondriale) : complexes I-IV transfèrent les électrons de NADH et FADH₂ vers O₂. Le gradient de H⁺ généré alimente l'ATP synthase (complexe V) : c'est la <strong>phosphorylation oxydative</strong>. NADH → ~2,5 ATP, FADH₂ → ~1,5 ATP.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Bilan total aérobie : ~30-32 ATP/glucose. La PDH est irréversible (les AG ne peuvent pas donner du glucose). Le découplage (thermogénine) produit de la chaleur sans ATP.</p></div>` },
    { title: "β-oxydation des acides gras", content: `<p class="mb-3">La <strong>β-oxydation</strong> se déroule dans la matrice mitochondriale et dégrade les AG en acétyl-CoA :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Activation</strong> : AG → acyl-CoA (acyl-CoA synthétase, coût 2 ATP). Entrée dans la mitochondrie via la <strong>navette de la carnitine</strong> (CPT-I en membrane externe, enzyme limitante).</li>
<li><strong>Hélice de Lynen</strong> : 4 réactions par tour — oxydation (FAD), hydratation, oxydation (NAD⁺), thiolyse — libérant 1 acétyl-CoA, 1 NADH, 1 FADH₂ par tour.</li>
<li><strong>Bilan</strong> : palmitate (C16) → 8 acétyl-CoA + 7 NADH + 7 FADH₂ → 106 ATP (− 2 activation = 104 ATP net).</li>
</ul>
<p class="mb-3"><strong>CPT-I</strong> est inhibée par le malonyl-CoA (produit par l'ACC en lipogenèse). Ainsi, lipogenèse et β-oxydation ne fonctionnent jamais simultanément.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : CPT-I = étape limitante de la β-oxydation (inhibée par malonyl-CoA). Le palmitate produit 104 ATP net. Les AG ne peuvent pas donner de glucose (PDH irréversible).</p></div>` },
    { title: "Voie des pentoses phosphates et glycogène", content: `<p class="mb-3">La <strong>voie des pentoses phosphates</strong> est une voie alternative du métabolisme du glucose :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Phase oxydative</strong> : G-6-P → ribose-5-P + 2 NADPH + CO₂. Le NADPH sert aux biosynthèses réductrices (AG, cholestérol) et à la défense antioxydante (glutathion). La G6PD (glucose-6-phosphate déshydrogénase) est l'enzyme clé.</li>
<li><strong>Phase non oxydative</strong> : interconversions de sucres (transcétolase, transaldolase) produisant du ribose-5-P (nucléotides) ou recyclant vers la glycolyse.</li>
</ul>
<p class="mb-3">Le <strong>métabolisme du glycogène</strong> : glycogénogenèse (glycogène synthase, insuline) et glycogénolyse (glycogène phosphorylase, glucagon/adrénaline). La <strong>glycogénose de McArdle</strong> = déficit en phosphorylase musculaire.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le NADPH de la voie des pentoses phosphates sert à la lipogenèse et à la défense antioxydante. Le déficit en G6PD = favisme (hémolyse aux oxydants).</p></div>` },
    { title: "Régulation hormonale du métabolisme", content: `<p class="mb-3">Le métabolisme est finement régulé par deux hormones antagonistes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Insuline</strong> (état nourri) : stimule glycolyse (PFK-2 → F-2,6-bisP), lipogenèse (ACC), glycogénogenèse, captation du glucose (GLUT4). Inhibe néoglucogenèse, glycogénolyse, lipolyse.</li>
<li><strong>Glucagon</strong> (jeûne) : stimule glycogénolyse, néoglucogenèse, β-oxydation, cétogenèse. Inhibe glycolyse, lipogenèse, glycogénogenèse.</li>
</ul>
<p class="mb-3">Le mécanisme passe par la <strong>phosphorylation/déphosphorylation</strong> des enzymes clés via la cascade AMPc → PKA. Exemple : la glycogène phosphorylase est active sous forme phosphorylée (glucagon), la glycogène synthase sous forme déphosphorylée (insuline).</p>
<p class="mb-3">En <strong>jeûne prolongé</strong> (> 3 jours) : le cerveau s'adapte à utiliser les corps cétoniques (produits par le foie à partir des AG), épargnant les protéines musculaires.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Insuline = anabolisme (stockage). Glucagon = catabolisme (mobilisation). La cascade AMPc/PKA phosphoryle les enzymes clés. En jeûne prolongé, le cerveau utilise les corps cétoniques.</p></div>` }
  ]
},

"chimie-metabolisme-aa": {
  introduction: "Le métabolisme des acides aminés comprend la transamination, la désamination oxydative et l'élimination de l'azote sous forme d'urée via le cycle hépatique de l'urée.",
  readTime: 16,
  sections: [
    { title: "Transamination et rôle du glutamate", content: `<p class="mb-3">La <strong>transamination</strong> est la première étape du catabolisme des AA. Elle transfère le groupement NH₂ d'un AA vers un α-céto-acide :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Réaction</strong> : AA + α-cétoglutarate ⇌ α-céto-acide + glutamate. La réaction est réversible et catalysée par les transaminases.</li>
<li><strong>Coenzyme</strong> : PLP (phosphate de pyridoxal, dérivé de la vitamine B6). Le PLP est le coenzyme des transaminases.</li>
<li><strong>ALAT (GPT)</strong> : alanine + α-cétoglutarate ⇌ pyruvate + glutamate. Spécifique du foie.</li>
<li><strong>ASAT (GOT)</strong> : aspartate + α-cétoglutarate ⇌ oxaloacétate + glutamate. Foie et muscle cardiaque.</li>
</ul>
<p class="mb-3">Le <strong>glutamate</strong> est le collecteur central de l'azote aminé. Toutes les transaminations convergent vers lui.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le glutamate est le collecteur central de l'azote. ALAT ↑↑ = cytolyse hépatique. ASAT = foie + cœur. Le PLP (B6) est le coenzyme des transaminases.</p></div>` },
    { title: "Désamination et transport de l'ammoniac", content: `<p class="mb-3">La <strong>désamination oxydative</strong> du glutamate libère l'ammoniac (NH₄⁺) pour son élimination :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Glutamate déshydrogénase</strong> (mitochondrie hépatique) : glutamate → α-cétoglutarate + NH₄⁺ + NADH. Enzyme allostérique (activée par ADP, inhibée par GTP).</li>
<li><strong>Transport de l'NH₃</strong> vers le foie : sous forme de <strong>glutamine</strong> (glutamine synthétase, depuis la plupart des tissus) ou sous forme d'<strong>alanine</strong> (cycle alanine-glucose, depuis le muscle).</li>
</ul>
<p class="mb-3">L'<strong>ammoniac libre est toxique</strong> pour le cerveau (encéphalopathie hépatique en cas d'insuffisance hépatique). La concentration plasmatique normale de NH₃ est très faible (< 50 µmol/L).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : La glutamine est la forme de transport non toxique de l'NH₃ dans le sang. L'hyperammoniémie cause l'encéphalopathie hépatique. Le cycle alanine-glucose relie le muscle au foie.</p></div>` },
    { title: "Cycle de l'urée", content: `<p class="mb-3">Le <strong>cycle de l'urée</strong> (Krebs-Henseleit) convertit l'ammoniac toxique en urée dans le foie :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Entrée 1</strong> : NH₄⁺ + CO₂ → carbamoyl-phosphate (CPS-I, mitochondrie, enzyme limitante, activée par le N-acétylglutamate).</li>
<li><strong>5 étapes</strong> : CPS-I → ornithine transcarbamylase (mitochondrie) → argininosuccinate synthétase → argininosuccinate lyase → arginase (cytoplasme) → urée + ornithine.</li>
<li><strong>Entrée 2</strong> : l'aspartate fournit le 2e azote de l'urée via l'argininosuccinate synthétase.</li>
<li><strong>Coût énergétique</strong> : 3 ATP (4 liaisons phosphate riches en énergie) par molécule d'urée.</li>
</ul>
<p class="mb-3">L'urée est excrétée par les reins (urémie normale = 2,5-7,5 mmol/L). L'<strong>urée élevée</strong> peut indiquer une insuffisance rénale.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le cycle de l'urée est exclusivement hépatique. CPS-I = enzyme limitante. L'urée contient 2 azotes (NH₄⁺ + aspartate). Coût : 3 ATP par urée.</p></div>` },
    { title: "AA glucoformateurs et cétoformateurs", content: `<p class="mb-3">Le squelette carboné des AA est orienté vers des intermédiaires métaboliques selon leur nature :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>AA glucoformateurs</strong> : leur squelette carboné rejoint le pyruvate, l'oxaloacétate ou d'autres intermédiaires du cycle de Krebs → glucose via la néoglucogenèse. La majorité des AA sont glucoformateurs.</li>
<li><strong>AA cétoformateurs</strong> : leur squelette donne de l'acétyl-CoA ou de l'acétoacétate → corps cétoniques ou AG. Ils ne peuvent PAS donner du glucose (PDH irréversible).</li>
<li><strong>AA strictement cétoformateurs</strong> : leucine et lysine uniquement.</li>
<li><strong>AA mixtes</strong> (gluco- et cétoformateurs) : Ile, Phe, Trp, Tyr.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Leucine et lysine sont les seuls AA strictement cétoformateurs. La plupart des AA sont glucoformateurs. Les AA mixtes (Ile, Phe, Trp, Tyr) donnent à la fois du glucose et des corps cétoniques.</p></div>` },
    { title: "Métabolisme des AA à chaîne ramifiée et anomalies", content: `<p class="mb-3">Les <strong>AA à chaîne ramifiée (BCAA)</strong> — leucine, isoleucine, valine — ont un métabolisme particulier :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Leur catabolisme commence dans le <strong>muscle</strong> (et non le foie) par transamination puis décarboxylation oxydative par le complexe BCKDH.</li>
<li><strong>Leucinose (maladie du sirop d'érable)</strong> : déficit en BCKDH → accumulation des α-céto-acides ramifiés → odeur de sirop d'érable des urines, encéphalopathie néonatale.</li>
</ul>
<p class="mb-3">Autres anomalies du métabolisme des AA :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Phénylcétonurie (PCU)</strong> : déficit en phénylalanine hydroxylase → accumulation de Phe → retard mental si non traité. Dépistage néonatal systématique (test de Guthrie).</li>
<li><strong>Homocystinurie</strong> : déficit en cystathionine β-synthétase → accumulation d'homocystéine → risque thrombo-embolique.</li>
<li><strong>Alcaptonurie</strong> : déficit en homogentisate oxydase → accumulation d'acide homogentisique → coloration des urines.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : La phénylcétonurie est dépistée par le test de Guthrie à la naissance. La leucinose = déficit BCKDH. Ces maladies illustrent le concept « un gène, une enzyme ».</p></div>` }
  ]
},

"chimie-neoglucogenese": {
  introduction: "La néoglucogenèse synthétise du glucose à partir de précurseurs non glucidiques. Elle est essentielle au maintien de la glycémie lors du jeûne, principalement dans le foie et accessoirement les reins.",
  readTime: 16,
  sections: [
    { title: "Voie de la néoglucogenèse", content: `<p class="mb-3">La néoglucogenèse utilise la glycolyse en sens inverse sauf <strong>3 étapes irréversibles</strong> contournées par des enzymes spécifiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Pyruvate carboxylase + PEPCK</strong> : pyruvate → oxaloacétate (mitochondrie, biotine/B8) → PEP (cytoplasme). Contourne la pyruvate kinase.</li>
<li><strong>Fructose-1,6-bisphosphatase</strong> : F-1,6-bisP → F-6-P. Contourne la PFK-1.</li>
<li><strong>Glucose-6-phosphatase</strong> : G-6-P → glucose libre. Présente uniquement dans le foie et les reins — le muscle ne peut pas libérer de glucose.</li>
</ul>
<p class="mb-3"><strong>Précurseurs</strong> : lactate (cycle de Cori), alanine (cycle alanine-glucose), glycérol (lipolyse), AA glucoformateurs. Les AG ne sont PAS des précurseurs (PDH irréversible).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : 3 contournements : pyruvate carboxylase/PEPCK, F-1,6-bisphosphatase, G-6-phosphatase. Le muscle n'a pas de G-6-phosphatase → ne libère pas de glucose.</p></div>` },
    { title: "Cycle de Cori et cycle alanine-glucose", content: `<p class="mb-3">Deux cycles inter-organes lient le muscle au foie :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Cycle de Cori</strong> : muscle → glycolyse anaérobie → lactate → sang → foie → néoglucogenèse → glucose → sang → muscle. Coût net : 4 ATP au foie (6 consommés − 2 produits au muscle).</li>
<li><strong>Cycle alanine-glucose</strong> : muscle → transamination du pyruvate en alanine → sang → foie → transamination inverse → pyruvate → glucose. Permet aussi le transport de l'azote aminé vers le foie pour l'uréogenèse.</li>
</ul>
<p class="mb-3">Ces cycles assurent le recyclage du lactate et de l'alanine produits par le muscle en glucose, au prix d'une dépense énergétique hépatique.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le cycle de Cori coûte 4 ATP net au foie. Le cycle alanine-glucose transporte aussi l'azote aminé vers le foie pour le cycle de l'urée.</p></div>` },
    { title: "Régulation de la néoglucogenèse", content: `<p class="mb-3">La néoglucogenèse est régulée de manière <strong>réciproque</strong> avec la glycolyse :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Glucagon</strong> (jeûne) : stimule la néoglucogenèse — ↓ F-2,6-bisP (inhibe PFK-1, active F-1,6-bisphosphatase), ↑ expression de PEPCK et G-6-phosphatase.</li>
<li><strong>Insuline</strong> (état nourri) : inhibe la néoglucogenèse — ↑ F-2,6-bisP (active PFK-1, inhibe F-1,6-bisphosphatase), ↓ expression de PEPCK.</li>
<li><strong>Cortisol</strong> : stimule la néoglucogenèse (induction de PEPCK) et la protéolyse musculaire → AA glucoformateurs.</li>
<li><strong>Régulation allostérique</strong> : la pyruvate carboxylase est activée par l'acétyl-CoA (signal que la β-oxydation fournit de l'énergie).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le F-2,6-bisP est le régulateur clé réciproque : active la glycolyse ET inhibe la néoglucogenèse. Insuline ↑ F-2,6-bisP, glucagon ↓ F-2,6-bisP.</p></div>` },
    { title: "Cétogenèse et corps cétoniques", content: `<p class="mb-3">La <strong>cétogenèse</strong> est la synthèse des corps cétoniques dans le foie à partir de l'acétyl-CoA :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Corps cétoniques</strong> : acétoacétate, β-hydroxybutyrate (le plus abondant), acétone (volatil, odeur fruitée de l'haleine).</li>
<li><strong>Conditions</strong> : jeûne prolongé, diabète non contrôlé — quand l'oxaloacétate est drainé vers la néoglucogenèse et que l'acétyl-CoA s'accumule (excès de β-oxydation).</li>
<li><strong>Utilisation</strong> : les tissus extrahépatiques (cerveau après adaptation, muscle, cœur) oxydent les corps cétoniques en acétyl-CoA → cycle de Krebs.</li>
<li><strong>Le foie produit mais n'utilise pas</strong> les corps cétoniques (absence de succinyl-CoA transférase hépatique).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le foie produit les corps cétoniques mais ne les utilise pas. L'acidocétose diabétique = accumulation de corps cétoniques → pH sanguin ↓ → urgence métabolique.</p></div>` },
    { title: "Métabolisme du jeûne : adaptation temporelle", content: `<p class="mb-3">L'organisme s'adapte progressivement au <strong>jeûne</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Post-prandial (0-4h)</strong> : glucose alimentaire, insuline ↑, stockage (glycogène, lipogenèse).</li>
<li><strong>Jeûne court (4-16h)</strong> : glycogénolyse hépatique, glucagon ↑. Les réserves de glycogène hépatique (~100g) s'épuisent en 12-24h.</li>
<li><strong>Jeûne moyen (1-3 jours)</strong> : néoglucogenèse hépatique (à partir des AA musculaires, lactate, glycérol). Lipolyse → β-oxydation → corps cétoniques.</li>
<li><strong>Jeûne prolongé (> 3 jours)</strong> : adaptation cérébrale aux corps cétoniques (de 100 % glucose à 60 % corps cétoniques). Épargne protéique musculaire. Le cortisol et les hormones thyroïdiennes ↓ réduisent la dépense énergétique.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : En jeûne prolongé, le cerveau utilise 60 % de corps cétoniques, épargnant les protéines musculaires. Les réserves de glycogène hépatique s'épuisent en 12-24h.</p></div>` }
  ]
},

"chimie-cholesterol": {
  introduction: "Le cholestérol est un lipide stéroïdien essentiel aux membranes cellulaires et précurseur des hormones stéroïdiennes, des acides biliaires et de la vitamine D.",
  readTime: 16,
  sections: [
    { title: "Biosynthèse du cholestérol", content: `<p class="mb-3">La <strong>biosynthèse du cholestérol</strong> se déroule dans le cytoplasme et le RE des hépatocytes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Étape limitante</strong> : acétyl-CoA → HMG-CoA → mévalonate par l'<strong>HMG-CoA réductase</strong>. C'est la cible des <strong>statines</strong> (inhibiteurs compétitifs).</li>
<li>Mévalonate → isopentényl pyrophosphate → squalène (30C) → lanostérol → cholestérol (27C, 4 cycles stéroïdiens).</li>
<li>La biosynthèse hépatique fournit environ 70 % du cholestérol de l'organisme, l'alimentation 30 %.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : HMG-CoA réductase = enzyme limitante = cible des statines. Le cholestérol a 27 carbones et 4 cycles. 70 % est d'origine endogène (foie).</p></div>` },
    { title: "Transport du cholestérol : lipoprotéines", content: `<p class="mb-3">Le cholestérol circule dans le sang sous forme de <strong>lipoprotéines</strong> (lipides + apolipoprotéines) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Chylomicrons</strong> : transportent les lipides alimentaires de l'intestin vers les tissus (apoB-48).</li>
<li><strong>VLDL</strong> : transportent les triglycérides du foie vers les tissus (apoB-100). Se transforment en IDL puis LDL.</li>
<li><strong>LDL (« mauvais cholestérol »)</strong> : transportent le cholestérol du foie vers les tissus. Captées par le récepteur LDL (apoB-100). Leur excès favorise l'athérosclérose.</li>
<li><strong>HDL (« bon cholestérol »)</strong> : assurent le <strong>transport reverse</strong> du cholestérol des tissus vers le foie (apoA-I). L'enzyme LCAT estérifie le cholestérol dans les HDL.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : LDL = « mauvais cholestérol » (foie → tissus). HDL = « bon cholestérol » (transport reverse). L'apoB-100 est le ligand du récepteur LDL.</p></div>` },
    { title: "Régulation et hypercholestérolémie familiale", content: `<p class="mb-3">La régulation du cholestérol est finement contrôlée :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>SREBP (Sterol Regulatory Element-Binding Protein)</strong> : facteur de transcription activé quand le cholestérol intracellulaire est bas → ↑ HMG-CoA réductase et ↑ récepteur LDL.</li>
<li>Quand le cholestérol est élevé : SREBP est retenu dans le RE → ↓ biosynthèse et ↓ captation des LDL.</li>
<li>La dégradation de l'HMG-CoA réductase est accélérée par le cholestérol (protéolyse INSIG-dépendante).</li>
</ul>
<p class="mb-3"><strong>L'hypercholestérolémie familiale</strong> (Nobel Brown & Goldstein, 1985) : mutation du récepteur LDL → LDL circulant ↑↑ → athérosclérose précoce. Forme hétérozygote : 1/500, xanthomes tendineux. Forme homozygote : 1/1 000 000, infarctus avant 20 ans.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : SREBP régule la synthèse du cholestérol et du récepteur LDL. L'hypercholestérolémie familiale = mutation du récepteur LDL (1/500, athérosclérose précoce).</p></div>` },
    { title: "Dérivés du cholestérol", content: `<p class="mb-3">Le cholestérol est le précurseur de molécules biologiques essentielles :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Acides biliaires</strong> : synthétisés au foie (7α-hydroxylase, étape limitante). Solubilisent les lipides alimentaires dans l'intestin. Cycle entéro-hépatique (95 % réabsorbés).</li>
<li><strong>Hormones stéroïdiennes</strong> : cortisol, aldostérone (surrénales), testostérone, estradiol, progestérone (gonades). Toutes via la prégnénolone.</li>
<li><strong>Vitamine D</strong> : 7-déhydrocholestérol → cholécalciférol (UV cutanés) → 25-OH-D₃ (foie) → 1,25-(OH)₂-D₃ (rein, forme active, régule Ca²⁺).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Les acides biliaires, les hormones stéroïdiennes et la vitamine D dérivent tous du cholestérol. La 7α-hydroxylase est l'étape limitante de la synthèse des acides biliaires.</p></div>` },
    { title: "Athérosclérose et traitements", content: `<p class="mb-3">L'<strong>athérosclérose</strong> est la conséquence pathologique majeure du déséquilibre du métabolisme du cholestérol :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Mécanisme</strong> : les LDL oxydées s'accumulent dans l'intima artérielle → captation par les macrophages → cellules spumeuses → plaque d'athérome → sténose → complications (infarctus, AVC).</li>
<li><strong>Statines</strong> : inhibiteurs de l'HMG-CoA réductase. ↓ synthèse cholestérol → ↑ récepteur LDL → ↓ LDL circulant. Traitement de référence.</li>
<li><strong>Ézétimibe</strong> : inhibe l'absorption intestinale du cholestérol (transporteur NPC1L1).</li>
<li><strong>Anti-PCSK9</strong> (anticorps monoclonaux) : empêchent la dégradation du récepteur LDL → ↑↑ captation des LDL. Réservés aux hypercholestérolémies sévères.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : L'athérosclérose résulte de l'oxydation des LDL dans la paroi artérielle. Les statines ↓ le LDL de 30-50 %. Les anti-PCSK9 sont les hypolipémiants les plus puissants.</p></div>` }
  ]
},

"chimie-vitamines": {
  introduction: "Les vitamines sont des molécules organiques essentielles, non synthétisables par l'organisme (sauf D et K), jouant des rôles de coenzymes, d'antioxydants et de régulateurs métaboliques.",
  readTime: 16,
  sections: [
    { title: "Vitamines hydrosolubles du groupe B", content: `<p class="mb-3">Les <strong>vitamines B</strong> agissent principalement comme coenzymes dans le métabolisme :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>B1 (thiamine) → TPP</strong> : coenzyme des décarboxylases (PDH, α-KGDH, transcétolase). Carence : béribéri (polynévrite, insuffisance cardiaque), encéphalopathie de Wernicke (alcoolisme).</li>
<li><strong>B2 (riboflavine) → FMN, FAD</strong> : coenzymes d'oxydoréduction (chaîne respiratoire, β-oxydation).</li>
<li><strong>B3 (niacine) → NAD⁺, NADP⁺</strong> : coenzymes d'oxydoréduction majeurs. Carence : pellagre (3D : dermatite, diarrhée, démence).</li>
<li><strong>B5 (acide pantothénique) → CoA</strong> : transporteur de groupements acyle (acétyl-CoA, acyl-CoA).</li>
<li><strong>B6 (pyridoxine) → PLP</strong> : coenzyme des transaminases et de nombreuses réactions sur les AA.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : NAD⁺ = B3, FAD = B2, CoA = B5, PLP = B6, TPP = B1. Béribéri = B1, pellagre (3D) = B3, Wernicke = B1 + alcoolisme.</p></div>` },
    { title: "Vitamines B9, B12 et vitamine C", content: `<p class="mb-3">Ces vitamines jouent des rôles métaboliques spécifiques et cliniquement importants :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>B8 (biotine)</strong> : coenzyme des carboxylases (pyruvate carboxylase, ACC). Carence rare.</li>
<li><strong>B9 (folates) → THF</strong> : transfert d'unités monocarbonées (C1). Essentiel à la synthèse des bases puriques et de la thymidine. Carence : anémie mégaloblastique, anomalies de fermeture du tube neural (spina bifida → supplémentation périconceptionnelle).</li>
<li><strong>B12 (cobalamine)</strong> : coenzyme de la méthionine synthase (reméthylation de l'homocystéine) et de la méthylmalonyl-CoA mutase. Carence : anémie de Biermer (défaut de facteur intrinsèque), atteinte neurologique.</li>
<li><strong>Vitamine C (acide ascorbique)</strong> : antioxydant, cofacteur de la prolyl hydroxylase (synthèse du collagène), absorption du fer non héminique. Carence : scorbut (hémorragies gingivales, déchaussement dentaire).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : B9 (folates) : supplémentation obligatoire en péri-conceptionnel (prévention spina bifida). B12 : anémie de Biermer. Vitamine C : scorbut et synthèse du collagène.</p></div>` },
    { title: "Vitamines liposolubles A et D", content: `<p class="mb-3">Les vitamines liposolubles sont stockées dans les graisses et peuvent s'accumuler en excès :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Vitamine A (rétinol)</strong> : vision (rétinal dans la rhodopsine), différenciation cellulaire (acide rétinoïque), immunité. Sources : foie, carotte (β-carotène = provitamine A). Carence : héméralopie (cécité nocturne), xérophtalmie. Excès : tératogène (contre-indiqué en grossesse sous forme médicamenteuse).</li>
<li><strong>Vitamine D (cholécalciférol)</strong> : synthèse cutanée (UV-B → 7-déhydrocholestérol → D3) → 25-OH-D3 (foie) → 1,25-(OH)₂-D3 (rein, forme active = calcitriol). Action : absorption intestinale du Ca²⁺ et du phosphate, minéralisation osseuse. Carence : rachitisme (enfant), ostéomalacie (adulte). Récepteur nucléaire (VDR).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : La vitamine D est une « hormone » : synthèse cutanée UV → activation hépatique puis rénale → récepteur nucléaire VDR. Carence fréquente en population générale.</p></div>` },
    { title: "Vitamines liposolubles E et K", content: `<p class="mb-3">Les vitamines E et K complètent le groupe des vitamines liposolubles :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Vitamine E (tocophérol)</strong> : principal antioxydant liposoluble membranaire. Protège les AG polyinsaturés de la peroxydation lipidique. Régénérée par la vitamine C. Carence rare (malabsorption) : atteinte neurologique.</li>
<li><strong>Vitamine K</strong> : coenzyme de la γ-glutamyl carboxylase → γ-carboxylation des facteurs de coagulation II, VII, IX, X et des protéines C et S. K1 (phylloquinone, alimentation) et K2 (ménaquinone, flore intestinale).</li>
<li><strong>AVK (antivitamines K)</strong> : warfarine, fluindione — inhibent la vitamine K époxyde réductase → facteurs de coagulation non fonctionnels. Utilisés comme anticoagulants oraux.</li>
</ul>
<p class="mb-3">L'injection de <strong>vitamine K à la naissance</strong> est systématique pour prévenir la maladie hémorragique du nouveau-né (réserves faibles, flore intestinale immature).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : La vitamine K est nécessaire à la coagulation (facteurs II, VII, IX, X). Les AVK sont des anticoagulants anti-vitamine K. Injection de K systématique à la naissance.</p></div>` },
    { title: "Pathologies vitaminiques et supplémentation", content: `<p class="mb-3">Les carences et excès vitaminiques sont des situations cliniques importantes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Carences fréquentes</strong> : vitamine D (population générale, surtout en hiver), B9 (femmes en âge de procréer), B12 (végétaliens, personnes âgées, maladie de Biermer), fer + vitamine C.</li>
<li><strong>Groupes à risque</strong> : femmes enceintes (B9, D, fer), nouveau-nés (K), personnes âgées (D, B12), alcooliques chroniques (B1, B6, B9), patients sous dialyse.</li>
<li><strong>Hypervitaminoses</strong> : les vitamines liposolubles A et D sont toxiques en excès. Vitamine A : hépatotoxicité, tératogénicité. Vitamine D : hypercalcémie, néphrocalcinose.</li>
<li><strong>Les vitamines hydrosolubles</strong> (B, C) sont peu toxiques en excès car éliminées dans les urines.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Les vitamines liposolubles (A, D) sont toxiques en excès. B9 en péri-conceptionnel et K à la naissance sont des supplémentations systématiques. La carence en D est la plus fréquente.</p></div>` }
  ]
},

"chimie-hormones": {
  introduction: "Les hormones sont des messagers chimiques sécrétés par les glandes endocrines. Leur nature chimique détermine leur mode d'action, leur transport et leur pharmacologie.",
  readTime: 16,
  sections: [
    { title: "Classification chimique des hormones", content: `<p class="mb-3">Les hormones sont classées en trois groupes selon leur structure chimique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Hormones peptidiques/protéiques</strong> : insuline, glucagon, GH, ACTH, PTH, hormones hypothalamiques. Hydrophiles, stockées en granules, sécrétion par exocytose.</li>
<li><strong>Hormones stéroïdiennes</strong> : cortisol, aldostérone, testostérone, estradiol, progestérone, vitamine D. Lipophiles, dérivées du cholestérol via la prégnénolone. Non stockées (synthèse à la demande).</li>
<li><strong>Hormones dérivées d'acides aminés</strong> : catécholamines (tyrosine → dopamine → noradrénaline → adrénaline, hydrophiles), thyroïdiennes (T3, T4, lipophiles malgré leur origine AA).</li>
</ul>
<p class="mb-3">Règle générale : <strong>hydrophiles</strong> → transport libre, récepteurs membranaires, action rapide. <strong>Lipophiles</strong> → transport lié à des protéines, récepteurs nucléaires, action lente.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Peptidiques = hydrophiles = récepteurs membranaires = rapide. Stéroïdes = lipophiles = récepteurs nucléaires = lent. Exception : T3/T4 sont lipophiles malgré leur origine aminée.</p></div>` },
    { title: "Récepteurs membranaires et voies de signalisation", content: `<p class="mb-3">Les hormones hydrophiles agissent via des <strong>récepteurs membranaires</strong> couplés à différentes voies :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Récepteurs couplés aux protéines G (RCPG)</strong> : Gs → adénylate cyclase → AMPc → PKA (glucagon, ACTH, catécholamines β). Gq → PLC → IP3 + DAG → Ca²⁺ + PKC (vasopressine V1, angiotensine II).</li>
<li><strong>Récepteurs à activité tyrosine kinase</strong> : autophosphorylation → voie PI3K/Akt (insuline, IGF-1) et voie Ras/MAPK (facteurs de croissance).</li>
<li><strong>Récepteurs couplés aux JAK/STAT</strong> : GH, prolactine, érythropoïétine, cytokines.</li>
</ul>
<p class="mb-3">Les <strong>seconds messagers</strong> (AMPc, IP3, Ca²⁺, DAG) amplifient le signal hormonal par des cascades de phosphorylation.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : AMPc → PKA (glucagon). IP3/Ca²⁺ → PKC. L'insuline utilise un récepteur tyrosine kinase (voie PI3K/Akt). Les RCPG sont la plus grande famille de récepteurs.</p></div>` },
    { title: "Récepteurs nucléaires et hormones stéroïdiennes", content: `<p class="mb-3">Les hormones lipophiles traversent la membrane et agissent via des <strong>récepteurs nucléaires</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Mécanisme</strong> : l'hormone traverse la membrane → se lie au récepteur nucléaire → le complexe se fixe sur les HRE (Hormone Response Elements) de l'ADN → activation ou répression de la transcription de gènes cibles.</li>
<li><strong>Stéroïdes</strong> : cortisol (GR), aldostérone (MR), testostérone (AR), estradiol (ER), progestérone (PR).</li>
<li><strong>Hormones thyroïdiennes</strong> : T3 se fixe sur les récepteurs TR (associés au RXR). T4 est la pro-hormone, convertie en T3 active par les désiodases.</li>
<li><strong>Vitamine D</strong> : calcitriol se fixe sur VDR → régulation de l'absorption du Ca²⁺.</li>
</ul>
<p class="mb-3">La réponse est <strong>lente</strong> (heures à jours) car elle implique la transcription et la traduction de nouvelles protéines.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Les récepteurs nucléaires sont des facteurs de transcription ligand-dépendants. T4 → T3 par les désiodases. La réponse est lente car elle passe par la transcription génique.</p></div>` },
    { title: "Axes hypothalamo-hypophysaires", content: `<p class="mb-3">Les axes <strong>hypothalamo-hypophysaires</strong> régulent la sécrétion hormonale par rétrocontrôle :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Axe thyréotrope</strong> : TRH (hypothalamus) → TSH (antéhypophyse) → T3/T4 (thyroïde). Rétrocontrôle négatif de T3/T4 sur TRH et TSH.</li>
<li><strong>Axe corticotrope</strong> : CRH → ACTH → cortisol (surrénales). Rythme circadien (pic matinal). Rétrocontrôle négatif du cortisol.</li>
<li><strong>Axe gonadotrope</strong> : GnRH (pulsatile) → FSH/LH → stéroïdes sexuels. Rétrocontrôle négatif (sauf pic pré-ovulatoire d'estradiol → rétrocontrôle positif → pic de LH → ovulation).</li>
<li><strong>Axe somatotrope</strong> : GHRH → GH → IGF-1 (foie). La GH est contre-régulatrice de l'insuline (hyperglycémiante).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Les axes hypothalamo-hypophysaires fonctionnent par rétrocontrôle négatif. Exception : le pic d'estradiol pré-ovulatoire exerce un rétrocontrôle positif → pic de LH → ovulation.</p></div>` },
    { title: "Régulation de la glycémie : insuline et glucagon", content: `<p class="mb-3">La <strong>glycémie</strong> (0,7-1,1 g/L à jeun) est régulée par deux hormones pancréatiques antagonistes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Insuline</strong> (cellules β des îlots de Langerhans) : seule hormone hypoglycémiante. Stimule : captation du glucose (GLUT4, muscle/adipocytes), glycolyse, glycogénogenèse, lipogenèse, synthèse protéique. Inhibe : néoglucogenèse, glycogénolyse, lipolyse.</li>
<li><strong>Glucagon</strong> (cellules α) : hyperglycémiant. Stimule : glycogénolyse, néoglucogenèse, lipolyse, cétogenèse. Agit principalement sur le foie (voie AMPc/PKA).</li>
<li><strong>Rapport insuline/glucagon</strong> : élevé en post-prandial → stockage. Bas en jeûne → mobilisation.</li>
</ul>
<p class="mb-3">Le <strong>diabète de type 1</strong> = destruction auto-immune des cellules β → insulinopénie. <strong>Type 2</strong> = insulinorésistance + épuisement des cellules β → le plus fréquent (90 %).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : L'insuline est la seule hormone hypoglycémiante. Le rapport insuline/glucagon détermine l'orientation métabolique. Le diabète type 2 = insulinorésistance (90 % des cas).</p></div>` }
  ]
},

"chimie-medicaments": {
  introduction: "La chimie du médicament étudie les relations structure-activité, les mécanismes d'action moléculaires et la pharmacocinétique ADME qui déterminent l'efficacité et la sécurité des médicaments.",
  readTime: 16,
  sections: [
    { title: "Pharmacocinétique : Absorption et Distribution", content: `<p class="mb-3">La pharmacocinétique décrit le devenir du médicament dans l'organisme (<strong>ADME</strong>) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Absorption</strong> : passage du médicament dans la circulation. La <strong>règle de Lipinski</strong> prédit la biodisponibilité orale (MW < 500, logP < 5, HBD ≤ 5, HBA ≤ 10). L'effet de premier passage hépatique réduit la biodisponibilité orale.</li>
<li><strong>Distribution</strong> : le médicament se distribue dans les tissus. La liaison aux protéines plasmatiques (albumine, α1-glycoprotéine acide) limite la fraction libre active. Le <strong>Vd</strong> (volume de distribution) reflète la répartition tissulaire.</li>
<li><strong>Barrière hémato-encéphalique (BHE)</strong> : seules les molécules lipophiles et de petite taille la traversent. Limitation pour les médicaments du SNC.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : La règle de Lipinski prédit la biodisponibilité orale. Seule la fraction libre (non liée aux protéines) est pharmacologiquement active. Un grand Vd = distribution tissulaire importante.</p></div>` },
    { title: "Pharmacocinétique : Métabolisme et Élimination", content: `<p class="mb-3">Le métabolisme et l'élimination déterminent la durée d'action du médicament :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Métabolisme hépatique — Phase I</strong> : oxydation, réduction, hydrolyse. Les cytochromes P450 (CYP) sont les enzymes principales. CYP3A4 métabolise ~50 % des médicaments. CYP2D6 présente un polymorphisme génétique (métaboliseurs lents/rapides).</li>
<li><strong>Phase II</strong> : conjugaison (glucuronidation, sulfatation, acétylation, glutathion). Rend les métabolites hydrophiles et éliminables.</li>
<li><strong>Élimination</strong> : rénale (filtration glomérulaire, sécrétion tubulaire) ou biliaire/fécale. La <strong>clairance</strong> = volume de plasma épuré par unité de temps. Le <strong>T₁/₂</strong> (demi-vie) = temps pour que la concentration diminue de moitié.</li>
</ul>
<p class="mb-3">Les <strong>prodrogues</strong> sont des formes inactives activées in vivo par le métabolisme (ex. oméprazole → forme active dans les cellules pariétales gastriques).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : CYP3A4 métabolise ~50 % des médicaments. Le polymorphisme CYP2D6 explique la variabilité interindividuelle. L'état d'équilibre est atteint en ~5 demi-vies.</p></div>` },
    { title: "Interactions médicamenteuses", content: `<p class="mb-3">Les <strong>interactions médicamenteuses</strong> sont une cause fréquente d'effets indésirables :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Interactions pharmacocinétiques</strong> : modification de l'ADME. L'inhibition d'un CYP ↑ la concentration du médicament substrat (risque de toxicité). L'induction d'un CYP ↓ la concentration (risque d'inefficacité).</li>
<li><strong>Inhibiteurs classiques</strong> : kétoconazole (CYP3A4), fluoxétine (CYP2D6), jus de pamplemousse (CYP3A4 intestinal).</li>
<li><strong>Inducteurs classiques</strong> : rifampicine, phénobarbital, millepertuis, carbamazépine. L'induction prend plusieurs jours (synthèse de novo des CYP).</li>
<li><strong>Interactions pharmacodynamiques</strong> : effets additifs (aspirine + anticoagulant → saignement), antagonistes (naloxone vs morphine), synergiques.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : L'inhibition d'un CYP → risque de surdosage du substrat. L'induction → risque d'inefficacité. Le jus de pamplemousse inhibe le CYP3A4 intestinal.</p></div>` },
    { title: "Relation structure-activité et pharmacophore", content: `<p class="mb-3">La <strong>relation structure-activité (RSA)</strong> est le fondement de la chimie médicale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Pharmacophore</strong> : ensemble minimal de caractéristiques structurales nécessaires à l'activité biologique (liaisons H, charges, groupes hydrophobes dans une disposition spatiale précise).</li>
<li><strong>Modification structurale</strong> : bioisostères (remplacement de groupes fonctionnels par des équivalents), optimisation de l'affinité, de la sélectivité et des propriétés ADME.</li>
<li><strong>Stéréochimie et activité</strong> : les énantiomères peuvent avoir des activités très différentes (thalidomide : R-sédatif, S-tératogène). La pharmacologie moderne privilégie les eutomères (énantiomère actif).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le pharmacophore = les caractéristiques structurales minimales pour l'activité. Les énantiomères peuvent avoir des activités biologiques très différentes (ex. thalidomide).</p></div>` },
    { title: "Cibles thérapeutiques et mécanismes d'action", content: `<p class="mb-3">Les médicaments agissent sur des <strong>cibles moléculaires</strong> spécifiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Récepteurs</strong> : agonistes (miment le ligand naturel), antagonistes (bloquent le récepteur), agonistes partiels, agonistes inverses. Concepts : affinité (Kd), efficacité intrinsèque, puissance (EC50).</li>
<li><strong>Enzymes</strong> : inhibiteurs réversibles (compétitifs, non compétitifs) et irréversibles (aspirine sur COX-1). Les inhibiteurs suicides se lient de façon covalente.</li>
<li><strong>Canaux ioniques</strong> : bloqueurs (anesthésiques locaux sur Na⁺), modulateurs (benzodiazépines sur GABA-A/Cl⁻).</li>
<li><strong>Transporteurs</strong> : inhibiteurs de la recapture (ISRS sur le transporteur de la sérotonine).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Agoniste = active le récepteur, antagoniste = bloque. L'aspirine est un inhibiteur irréversible de COX-1. Les ISRS inhibent la recapture de la sérotonine.</p></div>` }
  ]
},

"chimie-radicaux-libres": {
  introduction: "Les radicaux libres et les espèces réactives de l'oxygène (ERO) jouent un rôle dans le vieillissement, les maladies neurodégénératives, le cancer et les maladies cardiovasculaires.",
  readTime: 16,
  sections: [
    { title: "Espèces réactives de l'oxygène (ERO)", content: `<p class="mb-3">Les <strong>ERO</strong> sont des molécules dérivées de l'oxygène possédant un électron non apparié ou un fort pouvoir oxydant :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Radical superoxyde (O₂•⁻)</strong> : produit par la réduction monoélectronique de l'O₂. Première ERO formée. Modérément réactif.</li>
<li><strong>Peroxyde d'hydrogène (H₂O₂)</strong> : non radicalaire mais précurseur du radical hydroxyle. Traverse les membranes.</li>
<li><strong>Radical hydroxyle (OH•)</strong> : le plus réactif et le plus dangereux. Formé par la réaction de Fenton : Fe²⁺ + H₂O₂ → Fe³⁺ + OH• + OH⁻. Non détoxifiable enzymatiquement.</li>
<li><strong>Oxygène singulet (¹O₂)</strong> : forme excitée de l'O₂, produit lors de réactions photochimiques.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : O₂•⁻ → H₂O₂ → OH• (le plus dangereux, réaction de Fenton avec Fe²⁺). Le radical hydroxyle est non détoxifiable enzymatiquement, d'où l'importance de contrôler le fer libre.</p></div>` },
    { title: "Sources cellulaires et dommages oxydatifs", content: `<p class="mb-3">Les ERO sont produites par plusieurs sources cellulaires :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Chaîne respiratoire mitochondriale</strong> : 1-2 % de l'O₂ consommé est converti en O₂•⁻ (principalement aux complexes I et III). Source principale d'ERO en conditions physiologiques.</li>
<li><strong>NADPH oxydases (NOX)</strong> : production intentionnelle d'ERO par les phagocytes (explosion oxydative bactéricide). NOX2 est la principale isoforme phagocytaire.</li>
<li><strong>Autres sources</strong> : xanthine oxydase, cytochromes P450, peroxysomes, radiations ionisantes, polluants.</li>
</ul>
<p class="mb-3"><strong>Dommages oxydatifs</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Lipides</strong> : peroxydation lipidique des membranes → MDA (malondialdéhyde), 4-HNE.</li>
<li><strong>Protéines</strong> : carbonylation, oxydation des thiols → perte de fonction enzymatique.</li>
<li><strong>ADN</strong> : 8-oxo-guanine (marqueur de dommage oxydatif), cassures simple et double brin → mutagenèse.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : La chaîne respiratoire mitochondriale est la source principale d'ERO. La 8-oxo-guanine est le biomarqueur de référence du dommage oxydatif à l'ADN.</p></div>` },
    { title: "Défenses antioxydantes enzymatiques", content: `<p class="mb-3">Les <strong>défenses enzymatiques</strong> forment une cascade coordonnée :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>SOD (Superoxyde Dismutase)</strong> : O₂•⁻ + O₂•⁻ → H₂O₂ + O₂. Trois isoformes : SOD1 (Cu/Zn, cytoplasme), SOD2 (Mn, mitochondrie), SOD3 (Cu/Zn, extracellulaire).</li>
<li><strong>Catalase</strong> : 2 H₂O₂ → 2 H₂O + O₂. Localisée dans les peroxysomes. Très efficace à forte concentration de H₂O₂.</li>
<li><strong>Glutathion peroxydase (GPx)</strong> : H₂O₂ + 2 GSH → 2 H₂O + GSSG. Utilise le sélénium comme cofacteur. Efficace à faible concentration de H₂O₂.</li>
<li><strong>Glutathion réductase</strong> : GSSG + NADPH → 2 GSH. Régénère le glutathion réduit grâce au NADPH (voie des pentoses phosphates).</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : SOD → catalase/GPx = cascade antioxydante. Le NADPH (voie des pentoses) régénère le GSH via la glutathion réductase. Le sélénium est cofacteur de la GPx.</p></div>` },
    { title: "Défenses non enzymatiques", content: `<p class="mb-3">Les <strong>antioxydants non enzymatiques</strong> complètent les défenses enzymatiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Glutathion (GSH)</strong> : tripeptide (Glu-Cys-Gly), antioxydant intracellulaire majeur. Le groupement thiol (-SH) de la cystéine est le site actif réducteur.</li>
<li><strong>Vitamine C (ascorbate)</strong> : antioxydant hydrosoluble. Régénère la vitamine E oxydée. Piège les ERO en milieu aqueux.</li>
<li><strong>Vitamine E (α-tocophérol)</strong> : antioxydant liposoluble membranaire. Interrompt la chaîne de peroxydation lipidique en piégeant les radicaux peroxyles.</li>
<li><strong>Autres</strong> : β-carotène, polyphénols (flavonoïdes, resvératrol), acide urique, bilirubine, coenzyme Q10.</li>
</ul>
<p class="mb-3">Les vitamines C et E agissent en synergie : la vitamine C (hydrosoluble) régénère la vitamine E (liposoluble) à l'interface membrane/cytoplasme.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le GSH est l'antioxydant intracellulaire majeur. La vitamine E protège les membranes (liposoluble), la vitamine C le milieu aqueux (hydrosoluble). Elles se régénèrent mutuellement.</p></div>` },
    { title: "Stress oxydant et pathologies", content: `<p class="mb-3">Le <strong>stress oxydant</strong> est un déséquilibre entre la production d'ERO et les défenses antioxydantes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Vieillissement</strong> : théorie radicalaire (Harman, 1956). L'accumulation de dommages oxydatifs contribue au vieillissement cellulaire. Les mitochondries sont à la fois source et cible des ERO.</li>
<li><strong>Maladies neurodégénératives</strong> : Alzheimer (Aβ + stress oxydant), Parkinson (dopamine + fer → OH•), SLA (mutations SOD1).</li>
<li><strong>Cancer</strong> : les dommages oxydatifs à l'ADN (8-oxoG) sont mutagènes et favorisent l'initiation tumorale. Paradoxalement, les ERO sont aussi utilisées par le système immunitaire pour détruire les cellules cancéreuses.</li>
<li><strong>Maladies cardiovasculaires</strong> : l'oxydation des LDL favorise l'athérosclérose. Le NO• (monoxyde d'azote) est un radical vasodilatateur bénéfique produit par la NO synthase endothéliale.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le stress oxydant = déséquilibre ERO/antioxydants. Impliqué dans le vieillissement, les maladies neurodégénératives, le cancer et l'athérosclérose. Les suppléments antioxydants n'ont pas prouvé leur efficacité en prévention.</p></div>` }
  ]
},

"chimie-spectroscopie": {
  introduction: "La spectroscopie est l'ensemble des techniques d'analyse structurale utilisant l'interaction matière-rayonnement. La RMN et la spectrométrie de masse sont les piliers de l'analyse moléculaire.",
  readTime: 16,
  sections: [
    { title: "RMN du proton (¹H)", content: `<p class="mb-3">La <strong>RMN ¹H</strong> (Résonance Magnétique Nucléaire) analyse l'environnement des protons dans une molécule :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Déplacement chimique (δ, ppm)</strong> : position du signal indiquant le type de proton. Alkyle : 0,8-2 ppm. Allylique/C-O : 3-4 ppm. Aromatique : 6-8 ppm. Aldéhyde : 9-10 ppm. Acide : 10-12 ppm.</li>
<li><strong>Multiplicité (couplage spin-spin)</strong> : un proton ayant n voisins équivalents donne n+1 pics (singulet, doublet, triplet, quadruplet). La constante de couplage J (Hz) indique la relation spatiale.</li>
<li><strong>Intégration</strong> : l'aire sous le pic est proportionnelle au nombre de protons équivalents.</li>
</ul>
<p class="mb-3">Le <strong>TMS (tétraméthylsilane)</strong> est la référence interne (δ = 0 ppm). Le solvant deutéré (CDCl₃, D₂O) évite les signaux du solvant.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : RMN ¹H : δ = type de proton, multiplicité = nombre de voisins (n+1), intégration = nombre de protons. Le blindage ↓ le δ, le déblindage ↑ le δ.</p></div>` },
    { title: "RMN du carbone 13 et RMN 2D", content: `<p class="mb-3">La <strong>RMN ¹³C</strong> complète la RMN ¹H en analysant le squelette carboné :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Déplacement chimique</strong> : gamme plus large (0-220 ppm). C-alkyle : 10-50 ppm. C-O : 50-90 ppm. C-aromatique : 110-160 ppm. C=O (cétone/aldéhyde) : 190-220 ppm. C=O (acide/ester) : 160-185 ppm.</li>
<li><strong>Découplage proton</strong> : chaque carbone donne un singulet (spectres simplifiés).</li>
<li><strong>DEPT</strong> : distingue CH₃, CH₂, CH et C quaternaire.</li>
</ul>
<p class="mb-3">La <strong>RMN 2D</strong> (COSY, HSQC, HMBC) permet d'établir les connexions entre atomes : COSY = corrélation H-H, HSQC = corrélation H-C directe, HMBC = corrélation H-C à longue distance.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : ¹³C : gamme 0-220 ppm, chaque C → singulet (découplé). DEPT distingue CH₃/CH₂/CH/C. La RMN 2D (COSY, HSQC) établit les connectivités.</p></div>` },
    { title: "Spectrométrie de masse", content: `<p class="mb-3">La <strong>spectrométrie de masse (SM)</strong> mesure le rapport masse/charge (m/z) des ions :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Ionisation</strong> : impact électronique (EI, molécules volatiles → fragmentation), électrospray (ESI, solutions → molécules intactes, protéines), MALDI (matrice solide → grands complexes).</li>
<li><strong>Pic moléculaire M⁺</strong> : donne la masse moléculaire exacte. Les isotopes (M+1, M+2) donnent des informations sur la composition.</li>
<li><strong>Fragmentations caractéristiques</strong> : −15 (CH₃), −18 (H₂O), −28 (CO ou C₂H₄), −31 (OCH₃), −44 (CO₂), −46 (NO₂).</li>
<li><strong>Haute résolution (HRMS)</strong> : mesure la masse exacte, permettant de déterminer la formule moléculaire.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le pic M⁺ = masse moléculaire. ESI = protéines en solution. MALDI = grands complexes. Perte de 18 = H₂O, perte de 28 = CO.</p></div>` },
    { title: "Spectroscopie infrarouge (IR)", content: `<p class="mb-3">La <strong>spectroscopie IR</strong> identifie les groupements fonctionnels par leurs vibrations caractéristiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Principe</strong> : absorption de lumière IR → vibration des liaisons (élongation, déformation). Le nombre d'onde (cm⁻¹) est caractéristique du type de liaison.</li>
<li><strong>Bandes caractéristiques</strong> : O-H (alcool) : 3200-3600 cm⁻¹ (large). N-H (amine) : 3300-3500 cm⁻¹. C-H : 2850-3000 cm⁻¹. C=O : 1650-1750 cm⁻¹ (intense). C=C aromatique : 1450-1600 cm⁻¹.</li>
<li><strong>Zone d'empreinte digitale</strong> : < 1500 cm⁻¹, spécifique de chaque molécule.</li>
</ul>
<p class="mb-3">L'IR est complémentaire de la RMN : l'IR identifie les fonctions, la RMN les connectivités.</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : C=O vers 1700 cm⁻¹ (intense), O-H vers 3400 cm⁻¹ (large), N-H vers 3400 cm⁻¹. L'IR identifie les groupements fonctionnels.</p></div>` },
    { title: "Spectroscopie UV-visible et applications analytiques", content: `<p class="mb-3">La <strong>spectroscopie UV-visible</strong> étudie les transitions électroniques des molécules :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Principe</strong> : absorption UV-visible par les chromophores (systèmes conjugués, cycles aromatiques, C=O). La longueur d'onde d'absorption maximale (λmax) et le coefficient d'extinction molaire (ε) caractérisent le chromophore.</li>
<li><strong>Loi de Beer-Lambert</strong> : A = ε × l × c (absorbance = ε × longueur du trajet × concentration). Base de la spectrophotométrie quantitative.</li>
<li><strong>Applications</strong> : dosage de protéines (280 nm, Trp/Tyr), dosage d'ADN (260 nm, bases), contrôle qualité des médicaments, suivi cinétique enzymatique.</li>
</ul>
<p class="mb-3">En résumé, la <strong>stratégie d'élucidation structurale</strong> combine : SM (masse moléculaire, formule), IR (fonctions), RMN ¹H et ¹³C (connectivités, nombre de protons).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Beer-Lambert : A = εlc (dosage quantitatif). ADN absorbe à 260 nm, protéines à 280 nm. Le rapport A260/A280 évalue la pureté d'un acide nucléique.</p></div>` }
  ]
},

"chimie-proteomique": {
  introduction: "La protéomique étudie l'ensemble des protéines (protéome) exprimées par une cellule ou un tissu à un instant donné. Elle complète la génomique en analysant les effecteurs moléculaires du vivant.",
  readTime: 16,
  sections: [
    { title: "Électrophorèse 2D et approche gel", content: `<p class="mb-3">L'approche classique de la protéomique repose sur la <strong>2D-PAGE (électrophorèse bidimensionnelle)</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>1ère dimension</strong> : isoélectrofocalisation (IEF) — séparation des protéines selon leur point isoélectrique (pI) sur un gradient de pH immobilisé.</li>
<li><strong>2ème dimension</strong> : SDS-PAGE — séparation selon la masse moléculaire apparente. Le SDS dénature et charge négativement toutes les protéines proportionnellement à leur taille.</li>
<li><strong>Visualisation</strong> : coloration (Coomassie, argent, fluorescence). Chaque spot = une protéine (ou isoforme).</li>
<li><strong>Identification</strong> : excision du spot → digestion trypsique → empreinte peptidique massique (PMF) par MALDI-TOF → identification par comparaison aux bases de données.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : 2D-PAGE : 1ère dimension = pI (IEF), 2ème = masse (SDS-PAGE). Identification par empreinte peptidique massique (MALDI-TOF) après digestion trypsique.</p></div>` },
    { title: "Protéomique shotgun (LC-MS/MS)", content: `<p class="mb-3">La <strong>protéomique shotgun</strong> est l'approche moderne de référence :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Principe</strong> : digestion totale du mélange protéique par la trypsine → mélange complexe de peptides → séparation par chromatographie liquide (nano-LC) → analyse par spectrométrie de masse en tandem (MS/MS).</li>
<li><strong>MS/MS</strong> : le premier analyseur sélectionne un peptide (ion précurseur), la cellule de collision le fragmente, le second analyseur analyse les fragments → séquençage du peptide.</li>
<li><strong>Avantages</strong> : plus sensible, plus automatisable et plus reproductible que la 2D-PAGE. Peut analyser des milliers de protéines en une seule analyse.</li>
</ul>
<p class="mb-3">L'identification repose sur la comparaison des spectres MS/MS avec les bases de données protéiques (UniProt, Swiss-Prot) via des algorithmes de recherche (Mascot, SEQUEST).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : LC-MS/MS = technique de référence en protéomique moderne. Le séquençage MS/MS permet d'identifier les peptides sans connaître la protéine a priori.</p></div>` },
    { title: "Protéomique quantitative", content: `<p class="mb-3">La <strong>protéomique quantitative</strong> compare les niveaux d'expression entre conditions expérimentales :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>SILAC (Stable Isotope Labeling by Amino acids in Cell culture)</strong> : marquage métabolique in vivo par des AA lourds (¹³C, ¹⁵N). Les protéines lourdes et légères sont distinguées par leur différence de masse en MS.</li>
<li><strong>iTRAQ / TMT</strong> : marquage chimique des peptides après digestion. Jusqu'à 16 conditions simultanées (TMT 16-plex). Analyse par MS/MS.</li>
<li><strong>Label-free</strong> : quantification sans marquage, basée sur l'intensité des pics MS ou le comptage spectral (nombre de spectres MS/MS par protéine). Plus simple mais moins précis.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : SILAC = marquage métabolique (in vivo). iTRAQ/TMT = marquage chimique (in vitro, multiplexage). Label-free = sans marquage (plus simple, moins précis).</p></div>` },
    { title: "Interactomique et modifications post-traductionnelles", content: `<p class="mb-3">La protéomique explore aussi les <strong>interactions protéine-protéine</strong> et les modifications post-traductionnelles :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Co-immunoprécipitation (co-IP)</strong> : utilise un anticorps pour capturer une protéine cible et ses partenaires d'interaction → identification par MS.</li>
<li><strong>Double-hybride</strong> : système génétique (levure) pour détecter les interactions binaires entre protéines.</li>
<li><strong>Phosphoprotéomique</strong> : enrichissement des phosphopeptides (TiO₂, IMAC) → identification des sites de phosphorylation. La phosphorylation régule l'activité de nombreuses protéines (kinases/phosphatases).</li>
<li><strong>Glycoprotéomique</strong> : analyse des sites de glycosylation et des structures glycanniques. Les lectines enrichissent les glycoprotéines.</li>
</ul>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : La co-IP identifie les partenaires d'interaction d'une protéine. La phosphoprotéomique étudie les phosphorylations régulatrices. Les modifications post-traductionnelles diversifient le protéome.</p></div>` },
    { title: "Applications biomédicales de la protéomique", content: `<p class="mb-3">La protéomique a des applications majeures en médecine :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biomarqueurs diagnostiques</strong> : identification de protéines dont l'expression est altérée dans les maladies (cancer, maladies cardiovasculaires). Ex. : troponine (infarctus), PSA (prostate), CA-125 (ovaire).</li>
<li><strong>Cibles thérapeutiques</strong> : identification de protéines surexprimées dans les tumeurs → développement de thérapies ciblées (anticorps monoclonaux, inhibiteurs de kinases).</li>
<li><strong>Pharmacoprotéomique</strong> : étude de l'effet des médicaments sur le protéome → compréhension des mécanismes d'action et des effets secondaires.</li>
<li><strong>Médecine personnalisée</strong> : le profil protéomique d'une tumeur guide le choix thérapeutique (théranostique).</li>
</ul>
<p class="mb-3">Le protéome est <strong>dynamique</strong> (varie selon le type cellulaire, l'état physiologique, l'environnement), contrairement au génome qui est statique. Un gène peut donner de multiples protéines (épissage, modifications post-traductionnelles).</p>
<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-emerald-800">Point clé PASS/LAS : Le protéome est dynamique (≠ génome statique). Un gène → plusieurs protéines. Applications : biomarqueurs (troponine, PSA), cibles thérapeutiques, médecine personnalisée.</p></div>` }
  ]
},

};
