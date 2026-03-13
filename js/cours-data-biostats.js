/* ===== COURS DÉTAILLÉS — BIOSTATISTIQUES ===== */
const COURS_BIOSTATS = {

/* ───────────────────────────────────────────── */
/*  1. STATISTIQUES DESCRIPTIVES                 */
/* ───────────────────────────────────────────── */
"biostats-descriptives": {
  introduction: "Les statistiques descriptives constituent le socle fondamental de l'analyse des données en santé. Elles permettent de résumer, organiser et présenter les données de manière synthétique avant toute inférence statistique.",
  readTime: 18,
  sections: [
    {
      title: "Types de variables et échelles de mesure",
      content: `<p class="mb-3">En biostatistiques, on distingue deux grandes familles de variables selon la nature des données recueillies :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Variables qualitatives (catégorielles)</strong> : elles décrivent une qualité ou une catégorie. On distingue les variables <strong>nominales</strong> (sans ordre naturel : sexe, groupe sanguin, couleur des yeux) et les variables <strong>ordinales</strong> (avec un ordre : stade de cancer I/II/III/IV, échelle de douleur, niveau de satisfaction).</li>
<li><strong>Variables quantitatives (numériques)</strong> : elles résultent d'une mesure ou d'un dénombrement. On distingue les variables <strong>discrètes</strong> (valeurs isolées : nombre d'enfants, nombre de consultations) et les variables <strong>continues</strong> (valeurs dans un intervalle : taille, poids, glycémie).</li>
</ul>
<p class="mb-3">Les échelles de mesure se hiérarchisent en quatre niveaux : <strong>nominale</strong> (simple classification), <strong>ordinale</strong> (classification ordonnée), <strong>d'intervalle</strong> (écarts mesurables mais zéro arbitraire, ex. température en °C) et <strong>de rapport</strong> (zéro absolu, ex. poids, taille). Cette distinction est cruciale car elle détermine les opérations statistiques autorisées.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La nature de la variable (qualitative ou quantitative) détermine directement les paramètres statistiques utilisables et les tests applicables. Identifier correctement le type de variable est la première étape de toute analyse.</p></div>`
    },
    {
      title: "Paramètres de position (tendance centrale)",
      content: `<p class="mb-3">Les paramètres de position résument la valeur centrale d'une distribution. Les trois principaux sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Moyenne arithmétique (x̄)</strong> : somme des valeurs divisée par l'effectif total. Formule : x̄ = (1/n) × Σxi. Sensible aux valeurs extrêmes, elle est adaptée aux distributions symétriques.</li>
<li><strong>Médiane (Me)</strong> : valeur qui partage l'effectif en deux parties égales (50 % des valeurs de chaque côté). Robuste face aux valeurs extrêmes, elle est préférée pour les distributions asymétriques.</li>
<li><strong>Mode (Mo)</strong> : valeur la plus fréquente de la série. Une distribution peut être unimodale, bimodale ou multimodale. C'est le seul paramètre de position utilisable pour les variables qualitatives nominales.</li>
</ul>
<p class="mb-3">La relation entre ces trois paramètres donne des informations sur la forme de la distribution. Pour une distribution symétrique : moyenne = médiane = mode. Pour une distribution asymétrique à droite : mode &lt; médiane &lt; moyenne. Pour une distribution asymétrique à gauche : moyenne &lt; médiane &lt; mode.</p>
<p class="mb-3">D'autres paramètres de position existent : les <strong>quartiles</strong> (Q1, Q2=médiane, Q3 qui divisent l'effectif en 4 parts égales), les <strong>déciles</strong> (en 10 parts) et les <strong>centiles/percentiles</strong> (en 100 parts), très utilisés en pédiatrie pour les courbes de croissance.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La moyenne est le paramètre le plus utilisé mais la médiane est préférable en présence de valeurs extrêmes (ex. revenus, durées de séjour). Les quartiles sont à la base du diagramme en boîte (box-plot).</p></div>`
    },
    {
      title: "Paramètres de dispersion",
      content: `<p class="mb-3">Les paramètres de dispersion mesurent la variabilité des données autour de la tendance centrale. Une mesure de position seule est insuffisante pour caractériser une distribution.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Étendue (Range)</strong> : différence entre la valeur maximale et la valeur minimale. Simple mais très sensible aux valeurs extrêmes.</li>
<li><strong>Intervalle interquartile (IQR)</strong> : IQR = Q3 − Q1. Il contient les 50 % centraux des observations. Robuste aux valeurs extrêmes, il est utilisé dans les box-plots pour détecter les outliers.</li>
<li><strong>Variance (s²)</strong> : moyenne des carrés des écarts à la moyenne. Formule : s² = (1/(n−1)) × Σ(xi − x̄)². On divise par (n−1) et non par n pour obtenir un estimateur sans biais (correction de Bessel).</li>
<li><strong>Écart-type (s)</strong> : racine carrée de la variance. Il a la même unité que la variable mesurée, ce qui le rend plus interprétable que la variance.</li>
<li><strong>Coefficient de variation (CV)</strong> : CV = (s / x̄) × 100. Exprimé en pourcentage, il permet de comparer la dispersion de séries ayant des unités ou des ordres de grandeur différents.</li>
</ul>
<p class="mb-3">Pour une distribution normale, environ 68 % des valeurs se situent dans l'intervalle [x̄ − s ; x̄ + s], 95 % dans [x̄ − 2s ; x̄ + 2s] et 99,7 % dans [x̄ − 3s ; x̄ + 3s]. C'est la <strong>règle des 68-95-99,7</strong> (ou règle empirique).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : On divise par (n−1) dans le calcul de la variance d'un échantillon (et non par n) pour corriger le biais d'estimation. Le coefficient de variation permet de comparer des dispersions entre variables d'unités différentes.</p></div>`
    },
    {
      title: "Paramètres de forme",
      content: `<p class="mb-3">Les paramètres de forme complètent la description d'une distribution en quantifiant son asymétrie et son aplatissement :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Coefficient d'asymétrie (skewness, γ1)</strong> : mesure le degré d'asymétrie de la distribution. γ1 = 0 : distribution symétrique. γ1 &gt; 0 : asymétrie à droite (queue étalée vers les grandes valeurs). γ1 &lt; 0 : asymétrie à gauche (queue étalée vers les petites valeurs).</li>
<li><strong>Coefficient d'aplatissement (kurtosis, γ2)</strong> : mesure l'épaisseur des queues de distribution par rapport à la loi normale. γ2 = 0 : distribution mésocurtique (comme la loi normale). γ2 &gt; 0 : distribution leptocurtique (queues épaisses, pic pointu). γ2 &lt; 0 : distribution platycurtique (queues fines, pic aplati).</li>
</ul>
<p class="mb-3">En pratique médicale, la plupart des variables biologiques suivent approximativement une distribution normale (glycémie, pression artérielle). Les distributions asymétriques sont fréquentes pour les durées (d'hospitalisation, de survie) ou les concentrations biologiques, souvent normalisables par transformation logarithmique.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Une distribution asymétrique à droite (skewness positif) est très fréquente en médecine (ex. durées de séjour). La transformation logarithmique permet souvent de symétriser ces distributions.</p></div>`
    },
    {
      title: "Tableaux de fréquences et séries groupées en classes",
      content: `<p class="mb-3">Lorsque les données sont nombreuses, on les organise en <strong>tableaux de fréquences</strong> qui présentent pour chaque valeur ou classe : l'effectif (ni), la fréquence relative (fi = ni/n), l'effectif cumulé (Ni) et la fréquence cumulée (Fi).</p>
<p class="mb-3">Pour les variables continues ou les variables discrètes à grand nombre de modalités, on regroupe les données en <strong>classes</strong> d'amplitude constante ou variable. Le choix du nombre de classes peut suivre la règle de Sturges : k ≈ 1 + 3,322 × log₁₀(n), où n est l'effectif total.</p>
<p class="mb-3">Lorsque les données sont groupées en classes, les calculs de moyenne et de variance utilisent les <strong>centres de classes</strong> (ci) comme approximation : x̄ ≈ (1/n) × Σ(ni × ci). La médiane se calcule par interpolation linéaire dans la classe médiane.</p>
<p class="mb-3">Les fréquences cumulées permettent de construire la <strong>courbe cumulative</strong> (ou ogive de Galton), utile pour déterminer graphiquement la médiane et les quartiles.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Lors du regroupement en classes, l'amplitude des classes doit être choisie avec soin. Des classes trop larges masquent l'information, des classes trop étroites créent des fluctuations aléatoires.</p></div>`
    },
    {
      title: "Représentations graphiques en statistiques descriptives",
      content: `<p class="mb-3">Le choix du graphique dépend du type de variable à représenter :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Variables qualitatives</strong> : diagramme en barres (barres séparées, hauteur proportionnelle à l'effectif ou la fréquence), diagramme circulaire (secteurs proportionnels aux fréquences, limité à un petit nombre de modalités).</li>
<li><strong>Variables quantitatives discrètes</strong> : diagramme en bâtons (traits verticaux, abscisse = valeur, ordonnée = effectif ou fréquence).</li>
<li><strong>Variables quantitatives continues</strong> : histogramme (rectangles jointifs, aire proportionnelle à la fréquence de chaque classe). Si les classes sont d'amplitudes inégales, c'est la <strong>densité de fréquence</strong> (fi / amplitude) qui est portée en ordonnée.</li>
<li><strong>Box-plot (boîte à moustaches)</strong> : représentation synthétique montrant la médiane, les quartiles Q1 et Q3 (boîte), et les moustaches (étendues jusqu'à 1,5 × IQR). Les points au-delà sont considérés comme des valeurs atypiques (outliers).</li>
</ul>
<p class="mb-3">Le box-plot est particulièrement utile pour comparer visuellement la distribution d'une variable quantitative entre plusieurs groupes (ex. pression artérielle chez les hommes vs les femmes).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'histogramme utilise des rectangles jointifs (variable continue) alors que le diagramme en barres utilise des barres séparées (variable qualitative). Ne pas confondre ces deux représentations.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  2. PROBABILITÉS                              */
/* ───────────────────────────────────────────── */
"biostats-probabilites": {
  introduction: "Les probabilités fournissent le cadre mathématique permettant de quantifier l'incertitude et de modéliser les phénomènes aléatoires en santé. Elles sont indispensables pour comprendre les tests diagnostiques, les essais cliniques et l'inférence statistique.",
  readTime: 20,
  sections: [
    {
      title: "Notions fondamentales de probabilités",
      content: `<p class="mb-3">Une <strong>expérience aléatoire</strong> est une expérience dont le résultat ne peut être prédit avec certitude (ex. résultat d'un test diagnostique, survenue d'un effet indésirable). L'ensemble de tous les résultats possibles est appelé <strong>univers</strong> (Ω).</p>
<p class="mb-3">Un <strong>événement</strong> est un sous-ensemble de Ω. On distingue l'événement élémentaire (un seul résultat), l'événement certain (Ω), l'événement impossible (∅) et les événements composés. Deux événements sont <strong>incompatibles</strong> (mutuellement exclusifs) s'ils ne peuvent se réaliser simultanément : A ∩ B = ∅.</p>
<p class="mb-3">La probabilité P d'un événement A vérifie les <strong>axiomes de Kolmogorov</strong> : (1) 0 ≤ P(A) ≤ 1. (2) P(Ω) = 1. (3) Si A et B sont incompatibles, P(A ∪ B) = P(A) + P(B) (additivité).</p>
<p class="mb-3">Trois approches permettent de définir une probabilité : l'approche <strong>classique</strong> (rapport du nombre de cas favorables au nombre de cas possibles, si équiprobabilité), l'approche <strong>fréquentiste</strong> (fréquence relative d'un événement quand le nombre d'expériences tend vers l'infini) et l'approche <strong>bayésienne</strong> (degré de croyance subjectif).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les axiomes de Kolmogorov sont le fondement de tout calcul probabiliste. Toute probabilité est comprise entre 0 et 1, et la somme des probabilités de tous les événements élémentaires vaut 1.</p></div>`
    },
    {
      title: "Probabilités conditionnelles et indépendance",
      content: `<p class="mb-3">La <strong>probabilité conditionnelle</strong> de A sachant B est la probabilité de A quand on sait que B s'est réalisé : P(A|B) = P(A ∩ B) / P(B), à condition que P(B) &gt; 0.</p>
<p class="mb-3">La <strong>formule des probabilités composées</strong> (règle de la multiplication) permet de calculer la probabilité de l'intersection : P(A ∩ B) = P(A|B) × P(B) = P(B|A) × P(A).</p>
<p class="mb-3">Deux événements A et B sont <strong>indépendants</strong> si la réalisation de l'un n'influence pas la probabilité de l'autre : P(A|B) = P(A), ce qui implique P(A ∩ B) = P(A) × P(B). En médecine, l'indépendance est rarement parfaite (ex. tabagisme et cancer du poumon ne sont pas indépendants).</p>
<p class="mb-3">La <strong>formule des probabilités totales</strong> est utilisée lorsqu'on dispose d'une partition de Ω en événements B1, B2, ..., Bk incompatibles et exhaustifs : P(A) = Σ P(A|Bi) × P(Bi). Par exemple, pour calculer la prévalence d'une maladie dans une population composée de sous-groupes.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La probabilité conditionnelle est omniprésente en médecine. La sensibilité d'un test est P(Test+|Malade), la spécificité est P(Test−|Non malade). Ce sont des probabilités conditionnelles.</p></div>`
    },
    {
      title: "Théorème de Bayes",
      content: `<p class="mb-3">Le <strong>théorème de Bayes</strong> permet d'inverser un conditionnement, c'est-à-dire de calculer P(B|A) à partir de P(A|B). Sa formule est : P(Bi|A) = P(A|Bi) × P(Bi) / Σ P(A|Bj) × P(Bj).</p>
<p class="mb-3">En médecine, ce théorème est fondamental pour calculer les <strong>valeurs prédictives</strong> d'un test diagnostique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Valeur prédictive positive (VPP)</strong> = P(Malade|Test+) : probabilité d'être réellement malade quand le test est positif.</li>
<li><strong>Valeur prédictive négative (VPN)</strong> = P(Non malade|Test−) : probabilité d'être réellement non malade quand le test est négatif.</li>
</ul>
<p class="mb-3">Le théorème de Bayes montre que les valeurs prédictives dépendent de la <strong>prévalence</strong> de la maladie dans la population testée. Un test très performant (haute sensibilité et spécificité) aura une faible VPP si la maladie est rare. C'est pourquoi le dépistage en population générale peut générer de nombreux faux positifs.</p>
<p class="mb-3">Exemple numérique : pour un test de sensibilité 95 % et spécificité 95 %, si la prévalence est de 1 %, la VPP n'est que d'environ 16 %. Autrement dit, 84 % des résultats positifs sont des faux positifs.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le théorème de Bayes est l'outil central pour interpréter les résultats d'un test diagnostique. La VPP diminue quand la prévalence diminue : un test positif dans une population à faible risque doit être interprété avec prudence.</p></div>`
    },
    {
      title: "Analyse combinatoire",
      content: `<p class="mb-3">L'analyse combinatoire fournit les outils de dénombrement nécessaires au calcul des probabilités dans les situations d'équiprobabilité :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Permutations</strong> : nombre d'arrangements ordonnés de n éléments distincts. Pn = n! (factorielle n). Exemple : 5! = 5 × 4 × 3 × 2 × 1 = 120.</li>
<li><strong>Arrangements</strong> : nombre de façons de choisir et ordonner p éléments parmi n. A(n,p) = n! / (n−p)!. L'ordre compte.</li>
<li><strong>Combinaisons</strong> : nombre de façons de choisir p éléments parmi n sans tenir compte de l'ordre. C(n,p) = n! / [p!(n−p)!]. Ce sont les <strong>coefficients binomiaux</strong>, notés aussi (n p).</li>
</ul>
<p class="mb-3">Les combinaisons sont particulièrement utilisées dans le calcul des probabilités de la <strong>loi binomiale</strong> : P(X = k) = C(n,k) × p^k × (1−p)^(n−k), qui modélise le nombre de succès dans n épreuves indépendantes.</p>
<p class="mb-3">Propriétés utiles : C(n,0) = C(n,n) = 1 ; C(n,p) = C(n, n−p) (symétrie) ; la formule de Pascal : C(n,p) = C(n−1, p−1) + C(n−1, p), qui permet de construire le triangle de Pascal.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les combinaisons C(n,p) interviennent dans la formule de la loi binomiale. Savoir les calculer rapidement est essentiel. Retenir que C(n,p) = C(n, n−p) permet de simplifier les calculs.</p></div>`
    },
    {
      title: "Variables aléatoires et espérance",
      content: `<p class="mb-3">Une <strong>variable aléatoire</strong> (VA) est une fonction qui associe un nombre réel à chaque résultat d'une expérience aléatoire. On distingue les VA discrètes (ensemble dénombrable de valeurs) et les VA continues (valeurs dans un intervalle).</p>
<p class="mb-3">Pour une VA discrète X, la <strong>loi de probabilité</strong> est définie par l'ensemble des couples (xi, pi) où pi = P(X = xi) et Σpi = 1. La <strong>fonction de répartition</strong> est F(x) = P(X ≤ x).</p>
<p class="mb-3">L'<strong>espérance mathématique</strong> E(X) est la valeur moyenne théorique de la VA : E(X) = Σ xi × pi (cas discret). Propriétés : E(aX + b) = aE(X) + b (linéarité) et E(X + Y) = E(X) + E(Y).</p>
<p class="mb-3">La <strong>variance</strong> mesure la dispersion autour de l'espérance : V(X) = E[(X − E(X))²] = E(X²) − [E(X)]² (formule de König-Huygens). Propriétés : V(aX + b) = a²V(X). Si X et Y sont indépendantes : V(X + Y) = V(X) + V(Y).</p>
<p class="mb-3">L'<strong>écart-type</strong> σ(X) = √V(X) s'exprime dans la même unité que la variable.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La formule de König-Huygens V(X) = E(X²) − [E(X)]² est très utile en pratique pour calculer la variance. Retenir aussi que la variance d'une somme de VA indépendantes est la somme des variances.</p></div>`
    },
    {
      title: "Arbres de probabilités et applications médicales",
      content: `<p class="mb-3">L'<strong>arbre de probabilités</strong> (ou arbre pondéré) est un outil graphique qui permet de visualiser et calculer les probabilités dans des expériences à plusieurs étapes. Chaque branche porte la probabilité conditionnelle associée.</p>
<p class="mb-3">Règles de lecture : la probabilité d'un chemin est le <strong>produit</strong> des probabilités le long des branches (règle de multiplication). La probabilité d'un événement est la <strong>somme</strong> des probabilités des chemins qui le réalisent (règle d'addition).</p>
<p class="mb-3">Application au <strong>dépistage médical</strong> : considérons une maladie de prévalence 2 % et un test de sensibilité 90 % et spécificité 95 %. L'arbre comporte deux niveaux : (1) malade/non malade, (2) test positif/négatif. On calcule alors : P(Test+) = 0,02 × 0,90 + 0,98 × 0,05 = 0,018 + 0,049 = 0,067. VPP = 0,018 / 0,067 ≈ 26,9 %.</p>
<p class="mb-3">Les arbres de probabilités sont également utilisés en <strong>arbres décisionnels</strong> cliniques pour comparer des stratégies thérapeutiques en intégrant les probabilités d'événements et leurs utilités (qualité de vie, survie).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'arbre de probabilités est l'outil de référence pour les exercices de Bayes. On multiplie le long des branches (probabilités conditionnelles) et on additionne les chemins menant au même événement.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  3. TESTS STATISTIQUES                        */
/* ───────────────────────────────────────────── */
"biostats-tests": {
  introduction: "Les tests statistiques permettent de prendre des décisions fondées sur les données en évaluant si un résultat observé peut être attribué au hasard ou reflète un effet réel. Ils sont au cœur de la médecine fondée sur les preuves.",
  readTime: 22,
  sections: [
    {
      title: "Principe général des tests d'hypothèse",
      content: `<p class="mb-3">Un test statistique est une procédure de décision qui permet de trancher entre deux hypothèses à partir de données observées :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Hypothèse nulle (H0)</strong> : hypothèse d'absence d'effet ou de différence. C'est l'hypothèse conservatrice que l'on cherche à rejeter (ex. « le traitement n'a pas d'effet », « les deux groupes ont la même moyenne »).</li>
<li><strong>Hypothèse alternative (H1)</strong> : hypothèse que l'on souhaite démontrer. Elle peut être bilatérale (H1 : μ ≠ μ0) ou unilatérale (H1 : μ &gt; μ0 ou μ &lt; μ0).</li>
</ul>
<p class="mb-3">La démarche du test suit cinq étapes : (1) Formuler H0 et H1. (2) Choisir le test adapté et le seuil de significativité α (généralement 5 %). (3) Calculer la statistique de test à partir des données. (4) Déterminer la valeur p (p-value). (5) Conclure : si p ≤ α, on rejette H0 au profit de H1.</p>
<p class="mb-3">La <strong>p-value</strong> est la probabilité d'observer un résultat au moins aussi extrême que celui observé, sous l'hypothèse H0. Ce n'est pas la probabilité que H0 soit vraie.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La p-value n'est PAS la probabilité que H0 soit vraie. C'est la probabilité d'observer un résultat aussi extrême si H0 était vraie. Un p &lt; 0,05 ne signifie pas que l'effet est cliniquement pertinent.</p></div>`
    },
    {
      title: "Risques d'erreur et puissance",
      content: `<p class="mb-3">Toute décision statistique comporte un risque d'erreur. On distingue deux types :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Erreur de type I (risque α)</strong> : rejeter H0 alors qu'elle est vraie (faux positif). Le seuil α fixe la probabilité maximale de cette erreur. En médecine, α = 5 % est la convention standard.</li>
<li><strong>Erreur de type II (risque β)</strong> : ne pas rejeter H0 alors qu'elle est fausse (faux négatif). β dépend de l'effectif, de la taille d'effet et de la variabilité.</li>
</ul>
<p class="mb-3">La <strong>puissance</strong> d'un test est la probabilité de rejeter H0 quand elle est fausse : Puissance = 1 − β. On souhaite généralement une puissance d'au moins 80 % (β ≤ 20 %). La puissance augmente avec l'effectif de l'échantillon, la taille de l'effet réel et le seuil α choisi.</p>
<p class="mb-3">Le <strong>calcul du nombre de sujets nécessaires (NSN)</strong> est réalisé avant l'étude pour garantir une puissance suffisante. Il dépend de : α (risque de première espèce), β (risque de seconde espèce), la taille d'effet attendue et la variabilité du critère de jugement.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : α et β sont inversement liés à effectif constant : diminuer α augmente β. Augmenter l'effectif permet de réduire les deux risques simultanément. Le calcul du NSN est obligatoire avant tout essai clinique.</p></div>`
    },
    {
      title: "Test du Chi-deux (χ²)",
      content: `<p class="mb-3">Le test du <strong>Chi-deux (χ²) de Pearson</strong> est utilisé pour comparer des proportions ou tester l'association entre deux variables qualitatives. Il repose sur la comparaison entre les effectifs observés (O) et les effectifs théoriques attendus sous H0 (E).</p>
<p class="mb-3">La statistique de test est : χ² = Σ (Oi − Ei)² / Ei, calculée sur toutes les cellules du tableau de contingence. Les effectifs théoriques se calculent par : Ei = (total ligne × total colonne) / effectif total.</p>
<p class="mb-3">Sous H0, cette statistique suit une loi du χ² à (r−1)(c−1) degrés de liberté, où r est le nombre de lignes et c le nombre de colonnes du tableau.</p>
<p class="mb-3"><strong>Conditions d'application</strong> : tous les effectifs théoriques doivent être supérieurs ou égaux à 5. Si cette condition n'est pas remplie, on utilise le <strong>test exact de Fisher</strong> (pour les tableaux 2×2) ou on regroupe des modalités.</p>
<p class="mb-3">La <strong>correction de Yates</strong> (correction de continuité) est parfois appliquée pour les tableaux 2×2 : χ²corrigé = Σ (|Oi − Ei| − 0,5)² / Ei. Elle rend le test légèrement plus conservateur.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le Chi-deux compare des proportions (variables qualitatives). Condition essentielle : effectifs théoriques ≥ 5. Sinon, utiliser le test exact de Fisher. Le nombre de degrés de liberté est (r−1)(c−1).</p></div>`
    },
    {
      title: "Test t de Student",
      content: `<p class="mb-3">Le <strong>test t de Student</strong> est utilisé pour comparer des moyennes. Plusieurs variantes existent selon la situation :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Test t pour un échantillon</strong> : compare la moyenne observée x̄ à une valeur théorique μ0. Statistique : t = (x̄ − μ0) / (s / √n). Degrés de liberté : n − 1.</li>
<li><strong>Test t pour deux échantillons indépendants</strong> : compare les moyennes de deux groupes distincts. Statistique : t = (x̄1 − x̄2) / √(s²p × (1/n1 + 1/n2)), où s²p est la variance poolée. Degrés de liberté : n1 + n2 − 2. Si les variances sont inégales, on utilise la correction de Welch.</li>
<li><strong>Test t pour échantillons appariés</strong> : compare les moyennes de deux mesures sur les mêmes sujets (ex. avant/après traitement). On travaille sur les différences di = xi1 − xi2, puis on teste si la moyenne des différences est nulle.</li>
</ul>
<p class="mb-3"><strong>Conditions d'application</strong> : variable quantitative continue, distribution normale (ou n ≥ 30 par le théorème central limite), échantillons indépendants (sauf test apparié). L'égalité des variances est testée par le test de Fisher-Snedecor ou le test de Levene.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le test t de Student compare des moyennes (variables quantitatives). Il existe trois variantes : un échantillon, deux échantillons indépendants, échantillons appariés. Conditions : normalité et égalité des variances (pour la version classique).</p></div>`
    },
    {
      title: "Choix du test statistique adapté",
      content: `<p class="mb-3">Le choix du test dépend de plusieurs critères : le type de variables (qualitatives/quantitatives), le nombre de groupes, l'appariement des données et le respect des conditions d'application.</p>
<p class="mb-3">Résumé des principaux tests selon la situation :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Comparer 2 proportions</strong> : Chi-deux de Pearson (ou Fisher si effectifs théoriques &lt; 5).</li>
<li><strong>Comparer 2 moyennes (indépendants)</strong> : t de Student (ou Mann-Whitney si non normalité).</li>
<li><strong>Comparer 2 moyennes (appariés)</strong> : t de Student apparié (ou Wilcoxon si non normalité).</li>
<li><strong>Comparer k moyennes (k &gt; 2)</strong> : ANOVA à un facteur (ou Kruskal-Wallis si non normalité).</li>
<li><strong>Lien entre 2 variables quantitatives</strong> : coefficient de corrélation de Pearson (ou Spearman si non linéarité).</li>
</ul>
<p class="mb-3">La notion de <strong>tests multiples</strong> est importante : lorsqu'on réalise de nombreux tests simultanément, le risque α global augmente. La correction de Bonferroni ajuste le seuil à α/k (k = nombre de tests). Des corrections moins conservatrices existent (Holm, Benjamini-Hochberg).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le choix du test repose sur trois questions : (1) Quel type de variable ? (2) Combien de groupes ? (3) Les conditions d'application sont-elles remplies ? Ce raisonnement est un classique des QCM.</p></div>`
    },
    {
      title: "Significativité statistique vs pertinence clinique",
      content: `<p class="mb-3">Un résultat <strong>statistiquement significatif</strong> (p &lt; 0,05) n'est pas nécessairement <strong>cliniquement pertinent</strong>. Avec un échantillon très grand, même une différence minime peut atteindre la significativité. À l'inverse, un résultat non significatif ne prouve pas l'absence d'effet (manque de puissance possible).</p>
<p class="mb-3">La <strong>taille d'effet</strong> quantifie l'ampleur de la différence ou de l'association observée, indépendamment de la taille de l'échantillon. Exemples : d de Cohen pour la différence de moyennes (petit : 0,2 ; moyen : 0,5 ; grand : 0,8), odds ratio pour l'association, coefficient de corrélation.</p>
<p class="mb-3">L'<strong>intervalle de confiance</strong> à 95 % de la taille d'effet est souvent plus informatif que la p-value seule. Il indique la plage de valeurs plausibles pour le paramètre estimé et reflète la précision de l'estimation.</p>
<p class="mb-3">La <strong>différence cliniquement minimale importante (DCMI)</strong> est le plus petit changement perçu comme bénéfique par le patient. Un essai clinique devrait être dimensionné pour détecter la DCMI, pas n'importe quelle différence.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Toujours distinguer significativité statistique et pertinence clinique. Un p &lt; 0,001 avec un effet minuscule n'a pas d'intérêt clinique. L'intervalle de confiance et la taille d'effet sont des compléments essentiels à la p-value.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  4. ÉPIDÉMIOLOGIE                             */
/* ───────────────────────────────────────────── */
"biostats-epidemio": {
  introduction: "L'épidémiologie est la science qui étudie la distribution et les déterminants des maladies dans les populations humaines. Elle fournit les outils méthodologiques pour identifier les facteurs de risque, évaluer les interventions de santé et orienter les politiques de santé publique.",
  readTime: 20,
  sections: [
    {
      title: "Mesures de fréquence des maladies",
      content: `<p class="mb-3">Les mesures de fréquence quantifient l'importance d'une maladie dans une population. Les deux mesures fondamentales sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Prévalence</strong> : proportion de personnes atteintes de la maladie à un instant donné (prévalence ponctuelle) ou sur une période (prévalence de période). P = nombre de cas existants / population totale. C'est une proportion (sans unité), comprise entre 0 et 1.</li>
<li><strong>Incidence</strong> : fréquence d'apparition de nouveaux cas sur une période donnée. Deux mesures : le <strong>taux d'incidence</strong> (TI = nouveaux cas / personnes-temps à risque, en personnes-années) et la <strong>proportion d'incidence</strong> (ou incidence cumulée, IC = nouveaux cas / population à risque au début de la période).</li>
</ul>
<p class="mb-3">La relation entre prévalence et incidence dans une population stable est : P ≈ TI × d, où d est la durée moyenne de la maladie. Cette formule montre que la prévalence augmente avec la durée de la maladie, même si l'incidence est faible (ex. maladies chroniques).</p>
<p class="mb-3">Le <strong>taux de mortalité</strong> (nombre de décès / population) et le <strong>taux de létalité</strong> (nombre de décès / nombre de malades) sont aussi des mesures de fréquence essentielles.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Ne pas confondre prévalence (photo à un instant t) et incidence (film sur une période). La prévalence inclut les anciens et les nouveaux cas, l'incidence ne compte que les nouveaux cas.</p></div>`
    },
    {
      title: "Mesures d'association",
      content: `<p class="mb-3">Les mesures d'association quantifient la force du lien entre un facteur d'exposition et une maladie :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Risque relatif (RR)</strong> : rapport des incidences entre exposés et non exposés. RR = Ie / Ine. RR = 1 : pas d'association. RR &gt; 1 : le facteur est un facteur de risque. RR &lt; 1 : le facteur est protecteur. Utilisé dans les études de cohorte.</li>
<li><strong>Odds ratio (OR)</strong> : rapport des cotes de maladie entre exposés et non exposés. OR = (a×d) / (b×c) dans un tableau 2×2. L'OR est utilisé dans les études cas-témoins (où le RR n'est pas calculable directement). Quand la maladie est rare (&lt; 10 %), OR ≈ RR.</li>
<li><strong>Différence de risques (DR)</strong> : DR = Ie − Ine. Aussi appelée excès de risque ou risque attribuable chez les exposés. Mesure absolue de l'effet.</li>
</ul>
<p class="mb-3">Le <strong>risque attribuable dans la population (RAP)</strong> estime la proportion de cas dans la population attribuable au facteur étudié : RAP = Pe × (RR − 1) / [1 + Pe × (RR − 1)], où Pe est la prévalence de l'exposition. Il est utile en santé publique pour prioriser les interventions.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le RR s'utilise en cohorte, l'OR en cas-témoins. L'OR approxime le RR si la maladie est rare. Retenir le calcul de l'OR à partir du tableau 2×2 : (a×d)/(b×c).</p></div>`
    },
    {
      title: "Types d'études épidémiologiques",
      content: `<p class="mb-3">Les études épidémiologiques se classent en deux grandes catégories selon que l'investigateur intervient ou non :</p>
<p class="mb-3"><strong>Études observationnelles</strong> (pas d'intervention) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Études descriptives</strong> : décrivent la distribution d'une maladie selon les caractéristiques de personne, de lieu et de temps (études transversales, séries de cas, études écologiques).</li>
<li><strong>Études analytiques</strong> : testent des hypothèses sur les facteurs de risque. Études de <strong>cohorte</strong> (suivre des sujets exposés et non exposés → mesure du RR), études <strong>cas-témoins</strong> (comparer l'exposition passée de malades et non malades → mesure de l'OR).</li>
</ul>
<p class="mb-3"><strong>Études expérimentales</strong> (intervention) : l'investigateur attribue l'exposition. L'<strong>essai contrôlé randomisé (ECR)</strong> est le gold standard pour évaluer l'efficacité d'un traitement. La randomisation et le double aveugle minimisent les biais.</p>
<p class="mb-3">Le <strong>niveau de preuve</strong> est hiérarchisé : méta-analyses d'ECR &gt; ECR &gt; cohortes &gt; cas-témoins &gt; études transversales &gt; séries de cas &gt; opinion d'experts.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les études de cohorte partent de l'exposition vers la maladie (prospective), les études cas-témoins partent de la maladie vers l'exposition (rétrospective). L'ECR est le plus haut niveau de preuve pour l'évaluation thérapeutique.</p></div>`
    },
    {
      title: "Standardisation et comparaisons de populations",
      content: `<p class="mb-3">Comparer directement les taux bruts de deux populations est souvent trompeur car les populations peuvent différer par leur structure d'âge. La <strong>standardisation</strong> corrige cet effet de structure.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Standardisation directe</strong> : on applique les taux spécifiques par âge de chaque population à une population de référence commune. On obtient des taux standardisés comparables.</li>
<li><strong>Standardisation indirecte</strong> : on applique les taux spécifiques d'une population de référence à la structure d'âge de la population étudiée pour calculer le nombre de cas attendus. Le <strong>ratio standardisé de mortalité (SMR)</strong> = cas observés / cas attendus. Un SMR &gt; 1 indique une surmortalité.</li>
</ul>
<p class="mb-3">La standardisation indirecte est préférée quand les effectifs par classe d'âge sont petits (instabilité des taux spécifiques). La standardisation directe est préférée quand les taux spécifiques sont disponibles et fiables.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La standardisation est indispensable pour comparer des populations de structures d'âge différentes. Le SMR (standardisation indirecte) est le rapport observé/attendu : un SMR de 1,3 signifie 30 % de décès en excès.</p></div>`
    },
    {
      title: "Dépistage et prévention",
      content: `<p class="mb-3">Le <strong>dépistage</strong> est la recherche systématique d'une maladie chez des sujets apparemment sains. Il vise à détecter la maladie à un stade précoce pour améliorer le pronostic. Les critères de Wilson et Jungner (OMS, 1968) définissent les conditions pour qu'un dépistage soit justifié.</p>
<p class="mb-3">On distingue trois niveaux de prévention :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Prévention primaire</strong> : empêcher la survenue de la maladie (vaccination, éducation à la santé, réduction des facteurs de risque).</li>
<li><strong>Prévention secondaire</strong> : détecter la maladie au stade asymptomatique pour la traiter précocement (dépistage). Exemples : mammographie, frottis cervico-utérin, dépistage néonatal.</li>
<li><strong>Prévention tertiaire</strong> : réduire les complications et les récidives chez les patients déjà malades (rééducation, prévention des rechutes).</li>
</ul>
<p class="mb-3">Les <strong>biais du dépistage</strong> sont spécifiques : biais de temps d'avance (lead time bias : le dépistage avance le diagnostic sans prolonger la survie réelle), biais de durée (length bias : le dépistage détecte préférentiellement les formes d'évolution lente), biais de surdiagnostic (détection de lésions qui n'auraient jamais évolué).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le biais de temps d'avance (lead time bias) donne l'illusion que le dépistage prolonge la survie alors qu'il ne fait qu'avancer la date du diagnostic. Seul un ECR permet de démontrer l'efficacité réelle du dépistage.</p></div>`
    },
    {
      title: "Causalité en épidémiologie",
      content: `<p class="mb-3">Mettre en évidence une association statistique ne suffit pas à établir une relation causale. Les <strong>critères de Hill</strong> (1965) guident le jugement de causalité :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Force de l'association</strong> : un RR élevé rend la causalité plus plausible.</li>
<li><strong>Constance (reproductibilité)</strong> : l'association est retrouvée dans différentes études, populations et contextes.</li>
<li><strong>Spécificité</strong> : un facteur est associé à une seule maladie (critère rarement rempli en pratique).</li>
<li><strong>Temporalité</strong> : l'exposition doit précéder la maladie. C'est le seul critère indispensable.</li>
<li><strong>Relation dose-effet</strong> : le risque augmente avec le niveau d'exposition (gradient biologique).</li>
<li><strong>Plausibilité biologique</strong> : un mécanisme biologique connu explique l'association.</li>
<li><strong>Cohérence</strong> : l'association est compatible avec les connaissances existantes.</li>
<li><strong>Preuve expérimentale</strong> : la suppression du facteur réduit la maladie.</li>
<li><strong>Analogie</strong> : des associations similaires ont été démontrées pour d'autres facteurs.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Parmi les critères de Hill, seule la temporalité est indispensable (la cause doit précéder l'effet). Les autres critères renforcent la présomption de causalité mais aucun n'est ni nécessaire ni suffisant isolément.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  5. LECTURE CRITIQUE D'ARTICLES               */
/* ───────────────────────────────────────────── */
"biostats-lecture": {
  introduction: "La lecture critique d'articles scientifiques est une compétence essentielle pour le futur professionnel de santé. Elle permet d'évaluer la validité, la pertinence et l'applicabilité des résultats publiés dans la littérature médicale.",
  readTime: 18,
  sections: [
    {
      title: "Structure IMRAD d'un article scientifique",
      content: `<p class="mb-3">La majorité des articles originaux en recherche biomédicale suivent la structure <strong>IMRAD</strong> (Introduction, Methods, Results, And Discussion), normalisée par le comité international des rédacteurs de revues médicales (ICMJE) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Introduction</strong> : contexte scientifique, état des connaissances, justification de l'étude et objectif clairement formulé (question PICO pour les essais : Population, Intervention, Comparateur, Outcome/critère de jugement).</li>
<li><strong>Méthodes</strong> : type d'étude, population étudiée (critères d'inclusion/exclusion), intervention, critères de jugement principal et secondaires, méthodes statistiques, calcul du nombre de sujets nécessaires, aspects éthiques (CPP, consentement).</li>
<li><strong>Résultats</strong> : description de la population incluse (flow chart CONSORT pour les ECR), résultats du critère principal, résultats secondaires, analyse en sous-groupes. Les résultats doivent être présentés avec intervalles de confiance et p-values.</li>
<li><strong>Discussion</strong> : interprétation des résultats, comparaison avec la littérature, forces et limites de l'étude, validité interne et externe, conclusion et perspectives.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La structure IMRAD est le standard international. Un article bien construit répond à une question claire (PICO), utilise une méthodologie adaptée et présente ses résultats avec les intervalles de confiance.</p></div>`
    },
    {
      title: "Évaluation de la validité interne",
      content: `<p class="mb-3">La <strong>validité interne</strong> est la capacité d'une étude à fournir des résultats non biaisés au sein de la population étudiée. Elle dépend de la minimisation des biais :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biais de sélection</strong> : la population étudiée n'est pas représentative ou les groupes ne sont pas comparables. La randomisation et les critères d'inclusion/exclusion précis minimisent ce biais.</li>
<li><strong>Biais de classement (mesure)</strong> : erreurs dans la mesure de l'exposition ou de la maladie. L'aveugle (simple, double) et l'utilisation de critères objectifs réduisent ce biais.</li>
<li><strong>Biais de confusion</strong> : un facteur tiers associé à la fois à l'exposition et à la maladie fausse l'association observée. La randomisation, la stratification et l'analyse multivariée permettent de le contrôler.</li>
</ul>
<p class="mb-3">Pour les essais cliniques, les grilles d'évaluation (Cochrane Risk of Bias, échelle de Jadad) structurent l'analyse de la validité interne en évaluant : la randomisation, l'aveugle, le suivi des participants et l'analyse en intention de traiter.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les trois biais principaux sont : sélection, classement et confusion. Savoir les identifier dans un article est une compétence fondamentale en LCA. La randomisation protège contre les biais de sélection et de confusion.</p></div>`
    },
    {
      title: "Critères de jugement et analyse des résultats",
      content: `<p class="mb-3">Le <strong>critère de jugement principal (CJP)</strong> est la variable sur laquelle repose la conclusion de l'étude. Il doit être unique, défini a priori, pertinent cliniquement et mesurable de façon reproductible. Le nombre de sujets nécessaires est calculé sur ce critère.</p>
<p class="mb-3">Les critères de jugement secondaires apportent des informations complémentaires mais ne permettent pas de conclure formellement (risque de tests multiples). Les critères composites (associant plusieurs événements) augmentent la puissance mais posent des problèmes d'interprétation si les composantes sont de gravité hétérogène.</p>
<p class="mb-3">L'<strong>analyse en intention de traiter (ITT)</strong> inclut tous les patients randomisés dans leur groupe d'attribution initial, quelle que soit l'observance réelle. Elle préserve le bénéfice de la randomisation et reflète les conditions réelles d'utilisation. L'<strong>analyse per protocole</strong> ne retient que les patients ayant suivi le protocole, ce qui introduit un biais de sélection.</p>
<p class="mb-3">Les résultats doivent être présentés sous forme de <strong>réduction absolue du risque (RAR)</strong> et de <strong>nombre de sujets à traiter (NNT = 1/RAR)</strong>, plus informatifs que la réduction relative du risque qui peut être trompeuse.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'analyse en intention de traiter (ITT) est la méthode de référence pour les ECR. Le NNT (nombre de sujets à traiter pour éviter un événement) est la mesure la plus concrète de l'efficacité d'un traitement.</p></div>`
    },
    {
      title: "Grilles de lecture standardisées",
      content: `<p class="mb-3">Des grilles standardisées ont été développées pour guider la rédaction et l'évaluation des articles selon le type d'étude :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>CONSORT</strong> (Consolidated Standards of Reporting Trials) : pour les essais contrôlés randomisés. Inclut une check-list de 25 items et un diagramme de flux (flow chart) montrant le parcours des patients.</li>
<li><strong>STROBE</strong> (Strengthening the Reporting of Observational Studies in Epidemiology) : pour les études observationnelles (cohortes, cas-témoins, transversales).</li>
<li><strong>PRISMA</strong> (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) : pour les revues systématiques et méta-analyses.</li>
<li><strong>STARD</strong> (Standards for Reporting of Diagnostic Accuracy Studies) : pour les études de performance diagnostique.</li>
</ul>
<p class="mb-3">Ces grilles ne jugent pas la qualité méthodologique mais vérifient la qualité du <strong>reporting</strong>. Pour évaluer le risque de biais, on utilise des outils spécifiques comme l'outil Cochrane Risk of Bias pour les ECR ou l'échelle Newcastle-Ottawa pour les études observationnelles.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : CONSORT = ECR, STROBE = études observationnelles, PRISMA = méta-analyses. Le diagramme de flux CONSORT est obligatoire dans les ECR et détaille le nombre de patients à chaque étape.</p></div>`
    },
    {
      title: "Validité externe et applicabilité clinique",
      content: `<p class="mb-3">La <strong>validité externe</strong> (ou généralisabilité) concerne la transposabilité des résultats à d'autres populations que celle étudiée. Une étude peut avoir une excellente validité interne mais une faible validité externe si la population est trop sélectionnée.</p>
<p class="mb-3">Pour évaluer l'applicabilité, on examine :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>La <strong>population</strong> : les patients de l'étude sont-ils similaires à ceux rencontrés en pratique courante ? Les critères d'exclusion sont-ils trop restrictifs ?</li>
<li>L'<strong>intervention</strong> : est-elle réalisable dans les conditions habituelles de soins (dosage, durée, suivi) ?</li>
<li>Le <strong>comparateur</strong> : le traitement de référence utilisé est-il celui utilisé dans la pratique locale ?</li>
<li>Le <strong>critère de jugement</strong> : est-il cliniquement pertinent pour le patient (mortalité, qualité de vie) ou s'agit-il d'un critère intermédiaire (critère de substitution) ?</li>
</ul>
<p class="mb-3">La distinction entre <strong>efficacité</strong> (efficacy, conditions expérimentales idéales) et <strong>effectiveness</strong> (efficacité en conditions réelles) est fondamentale. Les études pragmatiques visent à mesurer l'effectiveness.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Validité interne (l'étude est-elle bien menée ?) et validité externe (les résultats sont-ils transposables ?) sont les deux dimensions fondamentales de l'évaluation critique d'un article.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  6. LOIS DE PROBABILITÉ                      */
/* ───────────────────────────────────────────── */
"biostats-lois": {
  introduction: "Les lois de probabilité fournissent des modèles mathématiques permettant de décrire et de prédire le comportement de variables aléatoires en santé. Leur connaissance est indispensable pour comprendre les tests statistiques, les intervalles de confiance et l'inférence en général.",
  readTime: 20,
  sections: [
    {
      title: "Loi binomiale et applications médicales",
      content: `<p class="mb-3">La <strong>loi binomiale</strong> B(n, p) modélise le nombre de succès X parmi n épreuves de Bernoulli indépendantes, chacune ayant une probabilité de succès p. La probabilité d'observer exactement k succès est donnée par : P(X = k) = C(n, k) × p<sup>k</sup> × (1 − p)<sup>n−k</sup>, où C(n, k) = n! / (k! × (n−k)!) est le coefficient binomial.</p>
<p class="mb-3">Les paramètres de cette loi sont : <strong>espérance</strong> E(X) = np et <strong>variance</strong> Var(X) = np(1 − p). L'écart-type est donc σ = √(np(1 − p)).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Applications médicales</strong> : nombre de patients répondeurs parmi n traités (essai clinique), nombre de tests positifs parmi n dépistages, nombre de mutations parmi n sites analysés.</li>
<li><strong>Conditions d'utilisation</strong> : épreuves indépendantes, probabilité p constante à chaque épreuve, nombre d'épreuves n fixé.</li>
<li><strong>Approximation par la loi normale</strong> : lorsque n est grand et que np ≥ 5 et n(1 − p) ≥ 5, on peut approcher B(n, p) par N(np, np(1 − p)). Cette approximation simplifie les calculs pour les grands échantillons.</li>
</ul>
<p class="mb-3">La loi de Bernoulli B(1, p) est le cas particulier où n = 1 : la variable vaut 1 (succès) avec probabilité p et 0 (échec) avec probabilité 1 − p. C'est le modèle élémentaire pour tout événement binaire (malade/sain, positif/négatif).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La loi binomiale s'applique quand on compte des succès parmi n essais indépendants avec probabilité constante. E(X) = np. Approximation normale possible si np ≥ 5 et n(1−p) ≥ 5.</p></div>`
    },
    {
      title: "Loi de Poisson et événements rares",
      content: `<p class="mb-3">La <strong>loi de Poisson</strong> P(λ) modélise le nombre d'événements survenant dans un intervalle de temps ou d'espace donné, lorsque ces événements sont rares et indépendants. La probabilité d'observer k événements est : P(X = k) = (e<sup>−λ</sup> × λ<sup>k</sup>) / k!</p>
<p class="mb-3">La caractéristique fondamentale de la loi de Poisson est que <strong>E(X) = Var(X) = λ</strong>. Si dans un échantillon la moyenne et la variance sont proches, cela suggère une distribution de Poisson.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Approximation de la binomiale</strong> : quand n est grand (n ≥ 30) et p est petit (p ≤ 0,1), la loi B(n, p) peut être approchée par une loi de Poisson P(λ = np). C'est la loi des événements rares.</li>
<li><strong>Applications en santé</strong> : nombre de cas d'une maladie rare dans une région, nombre d'effets indésirables graves d'un médicament, nombre de mutations dans un gène, nombre d'appels aux urgences par heure.</li>
<li><strong>Propriété d'additivité</strong> : la somme de variables de Poisson indépendantes est aussi une loi de Poisson dont le paramètre est la somme des paramètres individuels : si X ~ P(λ₁) et Y ~ P(λ₂) indépendantes, alors X + Y ~ P(λ₁ + λ₂).</li>
</ul>
<p class="mb-3">La loi de Poisson est utilisée en pharmacovigilance pour la détection de signaux : on compare le nombre observé d'effets indésirables au nombre attendu sous l'hypothèse de Poisson.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La loi de Poisson modélise les événements rares (E = Var = λ). Elle approche la binomiale quand n ≥ 30 et p ≤ 0,1 avec λ = np.</p></div>`
    },
    {
      title: "Loi normale (gaussienne) et propriétés",
      content: `<p class="mb-3">La <strong>loi normale</strong> N(μ, σ²) est la distribution la plus importante en biostatistiques. Sa densité de probabilité est une courbe en cloche symétrique autour de la moyenne μ, entièrement définie par deux paramètres : la moyenne μ (centre) et la variance σ² (dispersion).</p>
<p class="mb-3">Propriétés fondamentales de la distribution normale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Règle empirique</strong> : 68,3 % des valeurs dans [μ − σ ; μ + σ], 95,4 % dans [μ − 2σ ; μ + 2σ], 99,7 % dans [μ − 3σ ; μ + 3σ].</li>
<li><strong>Intervalle à 95 %</strong> : [μ − 1,96σ ; μ + 1,96σ] contient exactement 95 % des observations (valeur critique z = 1,96).</li>
<li><strong>Symétrie</strong> : la courbe est parfaitement symétrique autour de μ, donc moyenne = médiane = mode.</li>
<li><strong>Stabilité par combinaison linéaire</strong> : toute combinaison linéaire de variables normales indépendantes suit aussi une loi normale.</li>
</ul>
<p class="mb-3">La <strong>loi normale centrée réduite</strong> N(0, 1) s'obtient par la transformation Z = (X − μ) / σ. Cette standardisation permet d'utiliser les tables de la loi normale pour calculer n'importe quelle probabilité. Les quantiles les plus utilisés sont : z<sub>0,025</sub> = 1,96 (seuil à 5 %), z<sub>0,005</sub> = 2,576 (seuil à 1 %).</p>
<p class="mb-3">En médecine, de nombreuses variables biologiques suivent approximativement une loi normale : pression artérielle, glycémie à jeun, taille, poids. Les valeurs de référence biologiques sont souvent définies comme μ ± 2σ (englobant 95 % de la population saine).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La loi normale est définie par μ et σ². 95 % des valeurs sont dans [μ ± 1,96σ]. La standardisation Z = (X − μ)/σ ramène toute normale à N(0, 1) pour utiliser les tables.</p></div>`
    },
    {
      title: "Théorème central limite et loi de Student",
      content: `<p class="mb-3">Le <strong>théorème central limite (TCL)</strong> est le résultat fondamental qui justifie l'utilisation de la loi normale en inférence statistique. Il stipule que la distribution de la moyenne d'un échantillon de taille n, issu de n'importe quelle population de moyenne μ et de variance σ², tend vers une loi normale N(μ, σ²/n) lorsque n devient grand (en pratique, n ≥ 30 est souvent suffisant).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Conséquence pratique</strong> : même si la variable d'origine n'est pas normale, la distribution des moyennes d'échantillons de taille suffisante (n ≥ 30) sera approximativement normale. Cela justifie l'utilisation des tests paramétriques dans la majorité des études cliniques.</li>
<li><strong>Erreur standard</strong> : l'écart-type de la distribution des moyennes est σ/√n, appelé erreur standard de la moyenne (SEM). Plus n augmente, plus la distribution des moyennes est resserrée autour de μ.</li>
</ul>
<p class="mb-3">La <strong>loi de Student</strong> (t de Student) intervient lorsque l'écart-type de la population σ est inconnu et estimé par l'écart-type de l'échantillon s. La statistique t = (x̄ − μ) / (s/√n) suit une loi de Student à (n − 1) degrés de liberté. Cette loi a des queues plus épaisses que la loi normale, surtout pour les petits échantillons. Quand n → ∞, la loi de Student converge vers la loi normale N(0, 1).</p>
<p class="mb-3">En pratique, la loi de Student est utilisée pour les tests de comparaison de moyennes (test t) et pour la construction des intervalles de confiance des moyennes lorsque n est petit.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le TCL justifie l'utilisation de la loi normale pour les moyennes dès que n ≥ 30, quelle que soit la distribution d'origine. La loi de Student remplace la loi normale quand σ est estimé par s (petits échantillons).</p></div>`
    },
    {
      title: "Autres lois et choix du modèle probabiliste",
      content: `<p class="mb-3">D'autres lois de probabilité sont régulièrement utilisées en biostatistiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Loi du Chi-deux (χ²)</strong> : somme de carrés de variables normales centrées réduites indépendantes. Paramètre : ν degrés de liberté. Utilisée pour les tests d'adéquation (χ² de Pearson), les tests d'indépendance et les tests de comparaison de variances.</li>
<li><strong>Loi de Fisher (F)</strong> : rapport de deux χ² indépendants divisés par leurs degrés de liberté respectifs. Utilisée en ANOVA (analyse de variance) pour comparer plus de deux moyennes.</li>
<li><strong>Loi exponentielle</strong> : modélise le temps d'attente entre deux événements de Poisson. Paramètre : λ (taux d'événements). E(X) = 1/λ. Propriété de « sans mémoire » : P(X > s + t | X > s) = P(X > t). Utilisée en analyse de survie sous l'hypothèse de risque constant.</li>
<li><strong>Loi log-normale</strong> : si Y = ln(X) suit une loi normale, alors X suit une loi log-normale. Fréquente en biologie pour les concentrations, les temps de séjour et les données asymétriques à droite.</li>
</ul>
<p class="mb-3">Le <strong>choix du modèle probabiliste</strong> dépend de la nature de la variable (discrète ou continue), du contexte (événements rares, temps d'attente, proportions) et de la vérification des hypothèses. Des tests de normalité (Shapiro-Wilk, Kolmogorov-Smirnov) et des graphiques (Q-Q plot, histogramme) permettent de valider l'adéquation d'un modèle.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : χ² pour les tests d'indépendance, F pour l'ANOVA, exponentielle pour la survie à risque constant. Le Q-Q plot et le test de Shapiro-Wilk vérifient la normalité.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  7. INTERVALLES DE CONFIANCE                  */
/* ───────────────────────────────────────────── */
"biostats-ic": {
  introduction: "Les intervalles de confiance sont l'outil fondamental de l'estimation en statistique inférentielle. Ils quantifient la précision d'une estimation ponctuelle en fournissant un intervalle de valeurs plausibles pour le paramètre inconnu de la population, avec un niveau de confiance donné.",
  readTime: 18,
  sections: [
    {
      title: "Principes de l'estimation et erreur standard",
      content: `<p class="mb-3">L'objectif de la statistique inférentielle est d'estimer un paramètre inconnu de la population (moyenne μ, proportion π, variance σ²) à partir d'un échantillon. On distingue deux types d'estimation :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Estimation ponctuelle</strong> : une valeur unique qui estime le paramètre (ex. x̄ estime μ, p̂ estime π). Un bon estimateur est sans biais (espérance égale au paramètre), convergent (précision augmente avec n) et efficace (variance minimale).</li>
<li><strong>Estimation par intervalle</strong> : un intervalle [borne inférieure ; borne supérieure] qui contient le paramètre avec une probabilité (1 − α), appelée niveau de confiance (typiquement 95 %).</li>
</ul>
<p class="mb-3">L'<strong>erreur standard</strong> (SE, Standard Error) mesure la variabilité de l'estimateur d'un échantillon à l'autre. Pour une moyenne : SE = σ/√n (ou s/√n si σ inconnu). Pour une proportion : SE = √(p̂(1 − p̂)/n). Plus n augmente, plus l'erreur standard diminue et plus l'estimation est précise.</p>
<p class="mb-3">Il ne faut pas confondre l'<strong>écart-type</strong> (mesure la variabilité des observations individuelles) et l'<strong>erreur standard</strong> (mesure la variabilité de l'estimateur). L'erreur standard est toujours plus petite que l'écart-type d'un facteur √n.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Ne pas confondre écart-type (dispersion des individus) et erreur standard (précision de l'estimateur). SE = σ/√n pour une moyenne. La précision augmente avec √n.</p></div>`
    },
    {
      title: "IC pour une moyenne",
      content: `<p class="mb-3">La formule générale d'un intervalle de confiance est : <strong>estimation ± valeur critique × erreur standard</strong>.</p>
<p class="mb-3">Pour la moyenne d'une population, deux cas se présentent :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>σ connu (ou n grand, n ≥ 30)</strong> : IC à 95 % = x̄ ± 1,96 × σ/√n. La valeur 1,96 est le quantile z<sub>0,025</sub> de la loi normale centrée réduite.</li>
<li><strong>σ inconnu et n petit (n < 30)</strong> : IC à 95 % = x̄ ± t<sub>α/2, n−1</sub> × s/√n, où t<sub>α/2, n−1</sub> est le quantile de la loi de Student à (n − 1) degrés de liberté. Pour n petit, t > 1,96, ce qui donne un IC plus large.</li>
</ul>
<p class="mb-3">Exemples de valeurs critiques selon le niveau de confiance : z = 1,645 pour IC à 90 %, z = 1,96 pour IC à 95 %, z = 2,576 pour IC à 99 %. Un IC plus large offre un niveau de confiance plus élevé mais une précision moindre.</p>
<p class="mb-3">Pour la <strong>différence de deux moyennes</strong> (groupes indépendants) : IC = (x̄₁ − x̄₂) ± t × SE, avec SE = √(s₁²/n₁ + s₂²/n₂). Si l'IC ne contient pas 0, la différence est statistiquement significative.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : IC d'une moyenne = x̄ ± z × σ/√n (σ connu) ou x̄ ± t × s/√n (σ inconnu). Utiliser la loi de Student quand σ est estimé et n < 30.</p></div>`
    },
    {
      title: "IC pour une proportion",
      content: `<p class="mb-3">Pour estimer la proportion π d'une population à partir d'un échantillon de taille n ayant observé une proportion p̂ = x/n :</p>
<p class="mb-3"><strong>IC à 95 %</strong> = p̂ ± 1,96 × √(p̂(1 − p̂)/n)</p>
<p class="mb-3">Cette formule (méthode de Wald) est valable sous les conditions d'approximation normale : np̂ ≥ 5 et n(1 − p̂) ≥ 5. Sinon, on utilise la méthode exacte de Clopper-Pearson basée sur la loi binomiale.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>IC pour la différence de deux proportions</strong> : IC = (p̂₁ − p̂₂) ± 1,96 × √(p̂₁(1−p̂₁)/n₁ + p̂₂(1−p̂₂)/n₂). Si l'IC ne contient pas 0, la différence est significative.</li>
<li><strong>IC pour l'odds ratio</strong> : on travaille sur l'échelle logarithmique. IC de ln(OR) = ln(OR) ± 1,96 × SE(ln(OR)), puis on exponentie pour obtenir l'IC de l'OR. Si l'IC ne contient pas 1, l'association est significative.</li>
<li><strong>IC pour le risque relatif</strong> : même principe sur l'échelle logarithmique. IC de ln(RR) = ln(RR) ± 1,96 × SE(ln(RR)).</li>
</ul>
<p class="mb-3">La largeur de l'IC d'une proportion est maximale quand p̂ = 0,5 (incertitude maximale). C'est pourquoi les calculs de taille d'échantillon utilisent souvent p = 0,5 comme hypothèse conservatrice.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : IC d'une proportion = p̂ ± 1,96 × √(p̂(1−p̂)/n). Conditions : np̂ ≥ 5 et n(1−p̂) ≥ 5. Pour un OR ou RR, on passe par le logarithme, et l'IC ne doit pas contenir 1 pour être significatif.</p></div>`
    },
    {
      title: "Interprétation correcte et erreurs fréquentes",
      content: `<p class="mb-3">L'interprétation d'un IC à 95 % est subtile et fait l'objet de nombreuses erreurs. L'interprétation <strong>correcte</strong> est :</p>
<p class="mb-3">« Si on répétait l'échantillonnage un très grand nombre de fois, 95 % des intervalles de confiance ainsi construits contiendraient la vraie valeur du paramètre. » Le paramètre est fixe (inconnu), c'est l'intervalle qui est aléatoire.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Erreur fréquente n°1</strong> : « Il y a 95 % de chances que la vraie valeur soit dans cet intervalle. » Faux : une fois calculé, l'IC contient ou ne contient pas la vraie valeur (événement certain ou impossible).</li>
<li><strong>Erreur fréquente n°2</strong> : « 95 % des observations individuelles sont dans cet intervalle. » Faux : l'IC concerne le paramètre (moyenne, proportion), pas les observations individuelles.</li>
<li><strong>Erreur fréquente n°3</strong> : confondre IC et intervalle de référence. L'intervalle de référence (ex. valeurs normales biologiques) couvre 95 % des individus sains, pas 95 % de confiance sur un paramètre.</li>
</ul>
<p class="mb-3"><strong>Lien IC et test statistique</strong> : un IC à 95 % et un test bilatéral au seuil α = 5 % donnent la même conclusion. Si l'IC à 95 % pour une différence ne contient pas 0 (ou si l'IC d'un OR/RR ne contient pas 1), le test correspondant est significatif à 5 %. L'IC apporte cependant plus d'information que la simple p-value car il indique la taille et la direction de l'effet.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'IC est fréquentiste : sur 100 échantillons, 95 des IC contiendraient μ. L'IC apporte plus d'information que la p-value car il montre la taille de l'effet et sa précision.</p></div>`
    },
    {
      title: "Facteurs influençant la largeur de l'IC et calcul de n",
      content: `<p class="mb-3">La largeur (précision) d'un intervalle de confiance dépend de trois facteurs :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Taille de l'échantillon (n)</strong> : la largeur de l'IC est proportionnelle à 1/√n. Doubler la précision (diviser la largeur par 2) nécessite de quadrupler n. C'est le facteur le plus important sur lequel le chercheur peut agir.</li>
<li><strong>Variabilité des données (σ ou p̂)</strong> : plus les données sont dispersées, plus l'IC est large. On ne peut généralement pas réduire la variabilité intrinsèque, mais une meilleure standardisation des mesures peut aider.</li>
<li><strong>Niveau de confiance (1 − α)</strong> : augmenter le niveau de confiance (ex. passer de 95 % à 99 %) élargit l'IC. On gagne en certitude mais on perd en précision.</li>
</ul>
<p class="mb-3"><strong>Calcul de la taille d'échantillon</strong> : on peut déterminer le n nécessaire pour obtenir un IC de largeur donnée. Pour une moyenne : n = (z<sub>α/2</sub> × σ / d)², où d est la demi-largeur souhaitée. Pour une proportion : n = z<sub>α/2</sub>² × p(1 − p) / d². En pratique, il faut souvent ajouter 10 à 20 % pour compenser les données manquantes et les perdus de vue.</p>
<p class="mb-3">En recherche clinique, l'IC à 95 % est le standard. Les recommandations CONSORT exigent la présentation des IC pour les résultats principaux des essais cliniques, car ils sont plus informatifs que les simples p-values.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Largeur de l'IC proportionnelle à 1/√n : pour doubler la précision, il faut quadrupler n. Le calcul de n a priori est indispensable dans tout protocole de recherche.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  8. ÉCHANTILLONNAGE                           */
/* ───────────────────────────────────────────── */
"biostats-echantillonnage": {
  introduction: "L'échantillonnage est l'étape méthodologique qui conditionne la validité de toute inférence statistique. Le choix de la méthode d'échantillonnage, la taille de l'échantillon et la représentativité déterminent la qualité des conclusions que l'on peut tirer d'une étude.",
  readTime: 18,
  sections: [
    {
      title: "Échantillonnage probabiliste : méthodes et principes",
      content: `<p class="mb-3">Un <strong>échantillonnage probabiliste</strong> garantit que chaque individu de la population a une probabilité connue et non nulle d'être sélectionné. C'est la seule approche permettant une inférence statistique rigoureuse avec quantification de l'erreur.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Échantillonnage aléatoire simple (EAS)</strong> : chaque individu a la même probabilité d'être sélectionné (tirage au sort). Méthode de référence, mais nécessite une liste exhaustive de la population (base de sondage) et peut être peu pratique pour les grandes populations dispersées.</li>
<li><strong>Échantillonnage stratifié</strong> : la population est divisée en strates homogènes (par âge, sexe, centre), puis un EAS est réalisé dans chaque strate. Avantages : représentativité garantie pour chaque strate, précision accrue si les strates sont homogènes. Allocation proportionnelle ou optimale (de Neyman).</li>
<li><strong>Échantillonnage en grappes (clusters)</strong> : on sélectionne aléatoirement des groupes entiers (hôpitaux, classes, villages) puis on inclut tous les individus de chaque grappe. Avantage : pas besoin de base de sondage individuelle. Inconvénient : perte de précision (effet de grappe, coefficient de corrélation intra-classe).</li>
<li><strong>Échantillonnage systématique</strong> : on sélectionne 1 individu tous les k = N/n dans la base de sondage, après un point de départ aléatoire. Simple à mettre en oeuvre mais risque de biais si la liste présente une périodicité.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Seul l'échantillonnage probabiliste permet l'inférence statistique rigoureuse. L'EAS est la référence. Le stratifié améliore la précision, les grappes simplifient la logistique mais perdent en précision.</p></div>`
    },
    {
      title: "Échantillonnage non probabiliste et ses limites",
      content: `<p class="mb-3">Dans un <strong>échantillonnage non probabiliste</strong>, la probabilité de sélection n'est pas connue. Ces méthodes ne permettent pas de calcul d'erreur d'échantillonnage ni d'inférence formelle, mais sont parfois les seules réalisables.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Échantillonnage de convenance</strong> : on recrute les sujets les plus facilement accessibles (patients consécutifs, volontaires). Fréquent en recherche clinique mais risque de biais de sélection important.</li>
<li><strong>Échantillonnage par quotas</strong> : on fixe des quotas selon certaines caractéristiques (âge, sexe) pour refléter la structure de la population, mais le choix des individus au sein de chaque quota n'est pas aléatoire.</li>
<li><strong>Échantillonnage boule de neige</strong> : chaque sujet recruté propose d'autres sujets potentiels. Utile pour les populations cachées ou rares (toxicomanes, maladies rares) mais forte dépendance au réseau initial.</li>
<li><strong>Échantillonnage de jugement (purposive)</strong> : l'enquêteur choisit les sujets jugés les plus informatifs. Utilisé en recherche qualitative mais fortement subjectif.</li>
</ul>
<p class="mb-3">Les résultats obtenus à partir d'échantillons non probabilistes peuvent être utiles pour générer des hypothèses ou pour des études exploratoires, mais leur <strong>validité externe</strong> est limitée. Il est crucial de discuter les biais potentiels liés au mode de recrutement.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Convenance, quotas et boule de neige ne permettent pas l'inférence formelle. Les résultats sont exploratoires. Toujours discuter les biais de sélection liés au mode de recrutement.</p></div>`
    },
    {
      title: "Fluctuations d'échantillonnage et distribution d'échantillonnage",
      content: `<p class="mb-3">La <strong>fluctuation d'échantillonnage</strong> est le fait que la valeur d'un estimateur (moyenne, proportion) varie d'un échantillon à l'autre, même si tous sont tirés de la même population. Cette variabilité est inévitable et constitue la base de la notion d'intervalle de confiance.</p>
<p class="mb-3">La <strong>distribution d'échantillonnage</strong> d'un estimateur décrit la loi de probabilité de cet estimateur sur l'ensemble des échantillons possibles :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Pour la moyenne x̄ : par le TCL, x̄ suit approximativement N(μ, σ²/n) si n ≥ 30 (ou exactement si la population est normale).</li>
<li>Pour la proportion p̂ : p̂ suit approximativement N(π, π(1−π)/n) si nπ ≥ 5 et n(1−π) ≥ 5.</li>
<li>Pour la variance s² : (n−1)s²/σ² suit une loi de χ² à (n−1) degrés de liberté.</li>
</ul>
<p class="mb-3">La <strong>loi des grands nombres</strong> garantit la convergence de l'estimateur vers le paramètre quand n augmente. Plus précisément, la probabilité que x̄ s'écarte de μ de plus de ε tend vers 0 quand n → ∞.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La fluctuation d'échantillonnage est la variabilité naturelle des estimateurs d'un échantillon à l'autre. L'erreur standard quantifie cette fluctuation et diminue en 1/√n.</p></div>`
    },
    {
      title: "Calcul de la taille d'échantillon",
      content: `<p class="mb-3">Le <strong>calcul du nombre de sujets nécessaires (NSN)</strong> est une étape obligatoire de tout protocole de recherche. Un échantillon trop petit manque de puissance (risque de conclure à tort à l'absence d'effet), un échantillon trop grand gaspille des ressources et expose inutilement des sujets.</p>
<p class="mb-3">Les paramètres nécessaires au calcul du NSN sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Risque α (erreur de type I)</strong> : probabilité de conclure à une différence qui n'existe pas. Classiquement fixé à 5 % (α = 0,05).</li>
<li><strong>Puissance (1 − β)</strong> : probabilité de détecter une vraie différence si elle existe. Classiquement fixée à 80 % ou 90 %. β est le risque de type II.</li>
<li><strong>Taille de l'effet attendu</strong> : la différence cliniquement pertinente que l'on souhaite détecter. Plus l'effet est petit, plus il faut de sujets.</li>
<li><strong>Variabilité (σ ou proportion attendue)</strong> : plus les données sont dispersées, plus il faut de sujets.</li>
<li><strong>Type de test</strong> : unilatéral ou bilatéral, et nature du critère de jugement.</li>
</ul>
<p class="mb-3">Pour comparer deux moyennes (test t bilatéral) : n par groupe ≈ 2 × (z<sub>α/2</sub> + z<sub>β</sub>)² × σ² / δ², où δ est la différence à détecter. En pratique, on majore de 10 à 20 % pour anticiper les perdus de vue.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le calcul du NSN dépend de α, puissance (1−β), variabilité et taille d'effet. Plus l'effet à détecter est petit, plus il faut de sujets. Toujours prévoir les perdus de vue (+10-20 %).</p></div>`
    },
    {
      title: "Biais d'échantillonnage et représentativité",
      content: `<p class="mb-3">Un <strong>biais d'échantillonnage</strong> survient lorsque l'échantillon n'est pas représentatif de la population cible, c'est-à-dire lorsque certains individus ont une probabilité de sélection différente de celle prévue.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biais de non-réponse</strong> : les sujets qui ne répondent pas (refus, impossibilité de contact) diffèrent souvent des répondants. Taux de réponse inférieur à 60 % = risque de biais majeur. Solution : relances, analyse des non-répondants, pondération.</li>
<li><strong>Biais de volontariat</strong> : les volontaires sont généralement plus jeunes, plus éduqués et en meilleure santé que la population générale (biais du volontaire sain).</li>
<li><strong>Biais de survie sélective</strong> (survivorship bias) : en ne sélectionnant que les survivants, on sous-estime la gravité d'une maladie ou surestime l'efficacité d'un traitement.</li>
<li><strong>Biais de Berkson</strong> : dans les études hospitalières, l'association entre deux pathologies peut être artificiellement modifiée car l'hospitalisation est liée aux deux conditions.</li>
</ul>
<p class="mb-3">La <strong>validité externe</strong> d'une étude dépend directement de la qualité de l'échantillonnage. Les critères d'inclusion et d'exclusion doivent être clairement définis. La population source (d'où est issu l'échantillon), la population cible (à qui on veut généraliser) et l'échantillon étudié doivent être distingués.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Non-réponse, volontariat et survie sélective sont les principaux biais d'échantillonnage. Distinguer population source, population cible et échantillon est essentiel pour évaluer la validité externe.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  9. DONNÉES CATÉGORIELLES                     */
/* ───────────────────────────────────────────── */
"biostats-categoriel": {
  introduction: "L'analyse des données catégorielles est omniprésente en médecine où de nombreuses variables sont qualitatives (malade/sain, exposé/non exposé, stade de la maladie). Des tests spécifiques permettent de comparer des proportions et de mesurer l'association entre variables catégorielles.",
  readTime: 18,
  sections: [
    {
      title: "Test du Chi-deux (χ²) de Pearson",
      content: `<p class="mb-3">Le <strong>test du χ²</strong> d'indépendance est le test de référence pour étudier l'association entre deux variables qualitatives dans un tableau de contingence r × c (r lignes, c colonnes).</p>
<p class="mb-3">Principe : on compare les effectifs <strong>observés</strong> (O) aux effectifs <strong>théoriques</strong> (E) calculés sous l'hypothèse d'indépendance : E = (total ligne × total colonne) / effectif total. La statistique de test est : χ² = Σ (O − E)² / E, avec ddl = (r − 1)(c − 1) degrés de liberté.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Conditions de validité</strong> : tous les effectifs théoriques doivent être ≥ 5. L'effectif total doit être suffisant. Les observations doivent être indépendantes (chaque sujet ne contribue qu'une fois au tableau).</li>
<li><strong>Correction de Yates</strong> : pour un tableau 2 × 2, on applique la correction de continuité : χ² = Σ (|O − E| − 0,5)² / E. Cette correction réduit la valeur du χ² et donne un résultat plus conservateur.</li>
<li><strong>Interprétation</strong> : si χ² calculé > χ² critique (ou p < α), on rejette H₀ d'indépendance. Le test indique l'existence d'une association mais pas sa force ni sa direction.</li>
</ul>
<p class="mb-3">Le test du χ² peut aussi servir de <strong>test d'adéquation</strong> (goodness of fit) pour vérifier si une distribution observée correspond à une distribution théorique (ex. vérifier les proportions de groupes sanguins attendues).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : χ² = Σ(O−E)²/E avec ddl = (r−1)(c−1). Condition : tous les effectifs théoriques ≥ 5. Le test détecte une association mais ne mesure pas sa force.</p></div>`
    },
    {
      title: "Test exact de Fisher et test de McNemar",
      content: `<p class="mb-3">Le <strong>test exact de Fisher</strong> est utilisé lorsque les conditions du χ² ne sont pas remplies, c'est-à-dire quand au moins un effectif théorique est inférieur à 5. Il calcule la probabilité exacte d'observer le tableau obtenu (ou un tableau plus extrême) sous H₀ d'indépendance, sans approximation par la loi du χ².</p>
<p class="mb-3">Le test de Fisher est particulièrement adapté aux petits échantillons et aux tableaux 2 × 2 avec des effectifs faibles. Il est basé sur la distribution hypergéométrique et donne un résultat exact, non approximatif.</p>
<p class="mb-3">Le <strong>test de McNemar</strong> s'utilise pour comparer deux proportions <strong>appariées</strong> (mesures répétées sur les mêmes sujets ou sujets appariés). Exemples : comparer le résultat de deux tests diagnostiques appliqués aux mêmes patients, ou comparer avant/après traitement.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>On construit un tableau 2 × 2 des concordances/discordances. Seules les paires discordantes (b et c) sont informatives.</li>
<li>Statistique : χ² = (|b − c| − 1)² / (b + c) avec 1 ddl (correction de continuité incluse).</li>
<li>Condition : b + c ≥ 20 pour l'approximation χ². Sinon, test binomial exact.</li>
</ul>
<p class="mb-3">Le choix entre χ², Fisher et McNemar dépend des effectifs et du design (indépendant vs apparié).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Fisher exact si effectif théorique < 5 (petits échantillons). McNemar pour proportions appariées (avant/après, test A vs test B sur mêmes patients). Seules les paires discordantes comptent pour McNemar.</p></div>`
    },
    {
      title: "Odds ratio (OR) et risque relatif (RR)",
      content: `<p class="mb-3">Dans un tableau 2 × 2 (exposition × maladie), les principales mesures d'association sont :</p>
<p class="mb-3">Notation du tableau : a = exposés malades, b = exposés non malades, c = non exposés malades, d = non exposés non malades.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Risque relatif (RR)</strong> = [a/(a+b)] / [c/(c+d)] = risque chez les exposés / risque chez les non exposés. RR = 1 : pas d'association. RR > 1 : facteur de risque. RR < 1 : facteur protecteur. Le RR est calculable uniquement dans les études de cohorte (où l'incidence est mesurable).</li>
<li><strong>Odds ratio (OR)</strong> = (a × d) / (b × c) = rapport des cotes. OR ≈ RR quand la maladie est rare (prévalence < 10 %). L'OR est la seule mesure d'association calculable dans les études cas-témoins (où l'incidence n'est pas connue).</li>
<li><strong>Réduction absolue du risque (RAR)</strong> = risque groupe contrôle − risque groupe traité. Correspond à la différence des risques.</li>
<li><strong>Nombre de sujets à traiter (NNT)</strong> = 1 / RAR. Nombre de patients à traiter pour éviter un événement supplémentaire.</li>
</ul>
<p class="mb-3">L'intervalle de confiance de l'OR se calcule sur l'échelle logarithmique : IC de ln(OR) = ln(OR) ± 1,96 × √(1/a + 1/b + 1/c + 1/d). Si l'IC de l'OR contient 1, l'association n'est pas statistiquement significative.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : RR = mesure de cohorte, OR = mesure cas-témoins. OR ≈ RR si maladie rare (< 10 %). IC de l'OR contient 1 = non significatif. NNT = 1/RAR.</p></div>`
    },
    {
      title: "Tableaux r × c et analyse de tendance",
      content: `<p class="mb-3">Lorsqu'une variable catégorielle a plus de deux modalités, on utilise un tableau r × c (r lignes, c colonnes) et le <strong>test du χ² d'indépendance généralisé</strong> avec (r−1)(c−1) degrés de liberté.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Analyse post-hoc</strong> : si le χ² global est significatif, il indique qu'au moins une case contribue à l'écart. On examine les <strong>résidus standardisés ajustés</strong> : un résidu > 1,96 en valeur absolue identifie les cases contribuant significativement au rejet de H₀.</li>
<li><strong>Test de tendance (Cochran-Armitage)</strong> : lorsque l'une des variables est ordinale (ex. dose de médicament en 3 niveaux), ce test est plus puissant que le χ² classique car il exploite l'information d'ordre. Il teste l'existence d'une relation linéaire entre l'exposition ordinale et la proportion de malades.</li>
<li><strong>V de Cramer</strong> : mesure la force de l'association dans un tableau r × c. V = √(χ²/(n × min(r−1, c−1))). V varie de 0 (indépendance) à 1 (association parfaite).</li>
</ul>
<p class="mb-3">Pour les variables ordinales, le <strong>coefficient gamma de Goodman-Kruskal</strong> et le <strong>tau de Kendall</strong> mesurent l'association en tenant compte de l'ordre des catégories, ce qui les rend plus informatifs que le χ² dans ce contexte.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Pour un tableau r × c, le χ² global teste l'indépendance. Les résidus ajustés identifient les cases significatives. Le test de Cochran-Armitage est plus puissant pour les variables ordinales.</p></div>`
    },
    {
      title: "Stratification et test de Mantel-Haenszel",
      content: `<p class="mb-3">Lorsqu'un <strong>facteur de confusion</strong> est suspecté, on peut stratifier l'analyse en réalisant des tableaux 2 × 2 séparés pour chaque strate (niveau du facteur de confusion) et combiner les résultats avec le <strong>test de Mantel-Haenszel</strong>.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>OR de Mantel-Haenszel (OR<sub>MH</sub>)</strong> : estimation combinée de l'OR ajusté sur le facteur de confusion. OR<sub>MH</sub> = Σ(a<sub>i</sub>d<sub>i</sub>/n<sub>i</sub>) / Σ(b<sub>i</sub>c<sub>i</sub>/n<sub>i</sub>), où i indexe les strates.</li>
<li><strong>Test d'homogénéité de Breslow-Day</strong> : vérifie que l'OR est constant à travers les strates (absence d'interaction/modification d'effet). Si ce test est significatif, l'OR combiné n'a pas de sens et il faut présenter les OR par strate.</li>
<li><strong>Confusion vs interaction</strong> : il y a confusion quand l'OR brut diffère de l'OR ajusté d'au moins 10 %. Il y a interaction (modification d'effet) quand l'OR varie significativement d'une strate à l'autre.</li>
</ul>
<p class="mb-3">Exemple classique : la relation entre café et cancer du pancréas est confondée par le tabagisme. Après stratification sur le statut tabagique, l'association disparaît (OR<sub>MH</sub> ≈ 1), montrant que le tabac était le vrai facteur de risque.</p>
<p class="mb-3">L'analyse stratifiée de Mantel-Haenszel est l'alternative non paramétrique à la régression logistique pour contrôler un petit nombre de facteurs de confusion catégoriels.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Mantel-Haenszel fournit un OR ajusté sur un facteur de confusion. Breslow-Day teste l'homogénéité des OR entre strates. Confusion = OR brut ≠ OR ajusté. Interaction = OR variable entre strates.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  10. BIAIS ET FACTEURS DE CONFUSION           */
/* ───────────────────────────────────────────── */
"biostats-biais": {
  introduction: "Les biais sont des erreurs systématiques qui menacent la validité interne des études épidémiologiques et cliniques. Contrairement aux erreurs aléatoires (fluctuations d'échantillonnage), les biais ne sont pas réduits en augmentant la taille de l'échantillon. Leur identification et leur prévention sont essentielles à la lecture critique de la littérature médicale.",
  readTime: 20,
  sections: [
    {
      title: "Biais de sélection",
      content: `<p class="mb-3">Un <strong>biais de sélection</strong> survient lorsque les sujets inclus dans l'étude ne sont pas représentatifs de la population cible, en raison de la manière dont ils ont été sélectionnés ou suivis. Ce biais affecte la constitution des groupes comparés.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biais d'auto-sélection (volontariat)</strong> : les volontaires diffèrent de la population générale (plus motivés, en meilleure santé). Fréquent dans les essais cliniques et les cohortes de volontaires.</li>
<li><strong>Biais de survie sélective</strong> : en n'étudiant que les survivants, on sous-estime la gravité de la maladie. Exemple : une cohorte de patients cancéreux recrutés en hôpital ne comprend que ceux ayant survécu assez longtemps pour être inclus.</li>
<li><strong>Biais de Berkson</strong> : dans les études hospitalières, deux maladies indépendantes en population générale peuvent apparaître associées car l'hospitalisation est liée aux deux. L'hôpital concentre les cas sévères et les comorbidités.</li>
<li><strong>Biais de Neyman (prévalence-incidence)</strong> : dans une étude transversale, les cas de courte durée (décès rapide ou guérison) sont sous-représentés. On ne capture que les cas prévalents.</li>
<li><strong>Biais d'attrition (perdus de vue)</strong> : les sujets qui quittent l'étude diffèrent souvent de ceux qui restent (plus malades, plus d'effets secondaires). Un taux de perdus de vue > 20 % menace la validité.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le biais de sélection affecte la constitution de l'échantillon. Berkson = biais hospitalier. Neyman = biais des études transversales. L'attrition > 20 % compromet la validité interne.</p></div>`
    },
    {
      title: "Biais de mesure (classement, information)",
      content: `<p class="mb-3">Un <strong>biais de mesure</strong> (ou biais de classement, ou biais d'information) survient lorsque la mesure de l'exposition ou de la maladie est erronée de manière systématique. On distingue les erreurs de classement différentielles et non différentielles.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biais de rappel (recall bias)</strong> : les malades se souviennent mieux de leurs expositions passées que les témoins sains. Fréquent dans les études cas-témoins. Exemple : les mères d'enfants malformés rapportent davantage la prise de médicaments pendant la grossesse.</li>
<li><strong>Biais de l'observateur (detection bias)</strong> : le médecin qui connaît le groupe du patient recherche plus activement les effets ou les diagnose différemment. L'aveugle (simple ou double) prévient ce biais.</li>
<li><strong>Biais de classement non différentiel</strong> : l'erreur de mesure est la même dans les deux groupes. Conséquence : dilution de l'association (OR et RR sont biaisés vers 1). Il réduit la puissance de l'étude.</li>
<li><strong>Biais de classement différentiel</strong> : l'erreur de mesure diffère entre les groupes. Conséquence imprévisible : peut surestimer ou sous-estimer l'association. Plus dangereux que le biais non différentiel.</li>
<li><strong>Biais de désirabilité sociale</strong> : les sujets tendent à sous-déclarer les comportements socialement négatifs (alcool, tabac) et à surdéclarer les comportements positifs (activité physique).</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le biais de rappel est le piège des études cas-témoins. Le classement non différentiel dilue l'association (biais vers le nul). Le double aveugle prévient le biais de l'observateur.</p></div>`
    },
    {
      title: "Facteurs de confusion : définition et critères",
      content: `<p class="mb-3">Un <strong>facteur de confusion</strong> est une variable tierce qui crée ou masque une association entre l'exposition et la maladie étudiées. Il fausse l'estimation de l'effet réel de l'exposition.</p>
<p class="mb-3">Pour être un facteur de confusion, une variable doit remplir <strong>trois critères simultanément</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Être associée à l'<strong>exposition</strong> (distribuée inégalement entre les groupes exposés et non exposés).</li>
<li>Être un facteur de risque de la <strong>maladie</strong> (associée à l'issue indépendamment de l'exposition).</li>
<li>Ne pas être un <strong>intermédiaire</strong> sur le chemin causal entre exposition et maladie.</li>
</ul>
<p class="mb-3">Exemple classique : dans l'étude de la relation café → cancer du pancréas, le tabagisme est un facteur de confusion car il est associé à la consommation de café (les fumeurs boivent plus de café), il est un facteur de risque de cancer du pancréas, et il n'est pas un intermédiaire.</p>
<p class="mb-3">La <strong>confusion</strong> se détecte en comparant la mesure d'association brute (non ajustée) et la mesure ajustée. Une modification de plus de 10 % entre l'OR brut et l'OR ajusté indique une confusion. Attention : ne pas confondre confusion et interaction (modification d'effet).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Un facteur de confusion est lié à l'exposition ET à la maladie, sans être un intermédiaire causal. On le détecte quand l'OR brut diffère de l'OR ajusté de plus de 10 %.</p></div>`
    },
    {
      title: "Méthodes de contrôle de la confusion",
      content: `<p class="mb-3">Le contrôle des facteurs de confusion peut se faire à deux moments : lors de la <strong>planification</strong> de l'étude (a priori) ou lors de l'<strong>analyse</strong> des données (a posteriori).</p>
<p class="mb-3"><strong>Méthodes a priori (planification)</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Randomisation</strong> : la méthode la plus puissante, uniquement possible dans les essais cliniques. Elle répartit aléatoirement les sujets entre les groupes, équilibrant tous les facteurs de confusion (connus et inconnus) si n est suffisant.</li>
<li><strong>Restriction</strong> : on limite l'étude à une seule catégorie du facteur de confusion (ex. inclure uniquement les non-fumeurs). Simple mais réduit la généralisabilité et la taille de l'échantillon.</li>
<li><strong>Appariement (matching)</strong> : chaque sujet exposé est associé à un sujet non exposé ayant les mêmes caractéristiques pour le facteur de confusion (même âge, même sexe). Fréquent dans les études cas-témoins.</li>
</ul>
<p class="mb-3"><strong>Méthodes a posteriori (analyse)</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Stratification</strong> : analyse séparée dans chaque strate du facteur de confusion, puis combinaison (Mantel-Haenszel). Limitée à un petit nombre de facteurs.</li>
<li><strong>Ajustement multivarié</strong> : régression logistique, de Cox, etc. Permet de contrôler simultanément plusieurs facteurs de confusion. C'est la méthode la plus utilisée dans les études observationnelles.</li>
<li><strong>Score de propension</strong> : résume en un seul score la probabilité d'être exposé en fonction des facteurs de confusion. Permet l'appariement ou la pondération dans les études observationnelles.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La randomisation est la meilleure méthode (contrôle des facteurs connus et inconnus). En observationnel, l'ajustement multivarié (régression) est la méthode standard. Le score de propension est une alternative moderne.</p></div>`
    },
    {
      title: "Interaction (modification d'effet) et causalité",
      content: `<p class="mb-3">L'<strong>interaction</strong> (ou modification d'effet) est un phénomène biologique réel (contrairement à la confusion qui est un artefact). Il y a interaction quand l'effet de l'exposition sur la maladie varie selon le niveau d'une troisième variable (le modificateur d'effet).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Interaction additive</strong> : la différence de risque (RD) varie entre les strates. Mesurée par le RERI (Relative Excess Risk due to Interaction).</li>
<li><strong>Interaction multiplicative</strong> : le RR ou l'OR varie entre les strates. Détectée par le test de Breslow-Day ou par un terme d'interaction dans le modèle de régression (β<sub>interaction</sub>).</li>
<li><strong>Exemple</strong> : l'amiante et le tabac ont une interaction multiplicative sur le cancer du poumon. Le risque combiné est beaucoup plus grand que la somme des risques individuels.</li>
</ul>
<p class="mb-3">Les <strong>critères de causalité de Hill</strong> (1965) permettent de passer d'une association statistique à un jugement causal : force de l'association, constance (reproductibilité), spécificité, temporalité (cause avant effet), gradient dose-réponse, plausibilité biologique, cohérence, preuve expérimentale, analogie. Seule la temporalité est considérée comme indispensable.</p>
<p class="mb-3">En pratique, la <strong>temporalité</strong> (l'exposition précède la maladie) est le seul critère nécessaire. Les autres critères sont des arguments en faveur de la causalité mais aucun n'est suffisant à lui seul.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Interaction = phénomène réel (l'effet varie selon un tiers facteur). Confusion = artefact à éliminer. Critères de Hill : 9 critères de causalité, seule la temporalité est indispensable.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  11. ESSAIS CLINIQUES                         */
/* ───────────────────────────────────────────── */
"biostats-essais": {
  introduction: "L'essai clinique randomisé contrôlé (ECR) constitue le gold standard de l'évaluation thérapeutique. Il fournit le plus haut niveau de preuve individuel en médecine fondée sur les preuves. La compréhension de sa méthodologie est essentielle pour la lecture critique d'articles et la pratique médicale.",
  readTime: 22,
  sections: [
    {
      title: "Phases de développement d'un médicament",
      content: `<p class="mb-3">Le développement clinique d'un médicament suit une séquence de quatre phases, après les études précliniques (in vitro et chez l'animal) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Phase I</strong> (n = 20-80, volontaires sains sauf oncologie) : première administration chez l'homme. Objectifs : tolérance, pharmacocinétique (absorption, distribution, métabolisme, excrétion), recherche de la dose maximale tolérée (DMT). Essai de dose-escalade.</li>
<li><strong>Phase II</strong> (n = 100-300, patients) : évaluation préliminaire de l'efficacité et détermination de la dose optimale. Phase IIa = preuve de concept. Phase IIb = dose-réponse. Premiers indices d'efficacité thérapeutique.</li>
<li><strong>Phase III</strong> (n = 1000+, patients) : essai comparatif randomisé à grande échelle. Objectif : démontrer l'efficacité et la sécurité du traitement par rapport au traitement de référence ou au placebo. C'est l'essai pivot pour l'obtention de l'AMM (Autorisation de Mise sur le Marché).</li>
<li><strong>Phase IV</strong> (post-commercialisation) : pharmacovigilance, études d'effectiveness en conditions réelles, détection des effets indésirables rares non détectés en phase III, études pharmaco-économiques.</li>
</ul>
<p class="mb-3">Le taux d'attrition est élevé : seules environ 10 % des molécules entrant en phase I obtiennent l'AMM. Le développement complet dure en moyenne 10-15 ans.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Phase I = tolérance (volontaires sains), Phase II = efficacité préliminaire, Phase III = preuve d'efficacité (AMM), Phase IV = pharmacovigilance post-AMM. Phase III = essai pivot.</p></div>`
    },
    {
      title: "Randomisation et aveugle",
      content: `<p class="mb-3">La <strong>randomisation</strong> est l'attribution aléatoire des sujets aux groupes de traitement. C'est la procédure fondamentale de l'essai clinique car elle élimine les biais de confusion, y compris les facteurs inconnus.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Randomisation simple</strong> : tirage au sort pour chaque patient (pile/face, table de nombres aléatoires, générateur informatique). Peut créer des déséquilibres si n est petit.</li>
<li><strong>Randomisation par blocs</strong> : des blocs de taille fixe (ex. 4 ou 6) garantissent un équilibre des groupes à intervalles réguliers. Attention : si la taille des blocs est connue, les dernières attributions sont prévisibles.</li>
<li><strong>Randomisation stratifiée</strong> : on randomise séparément dans chaque strate (par centre, par sexe, par stade) pour garantir l'équilibre des groupes sur des facteurs pronostiques importants.</li>
<li><strong>Randomisation par minimisation</strong> : méthode adaptative qui attribue le patient au groupe qui minimise le déséquilibre global sur plusieurs facteurs pronostiques.</li>
</ul>
<p class="mb-3">L'<strong>aveugle</strong> (insu) prévient les biais de mesure. <strong>Simple aveugle</strong> : le patient ignore son groupe. <strong>Double aveugle</strong> : patient et médecin ignorent le groupe. <strong>Triple aveugle</strong> : patient, médecin et analyste l'ignorent. Le <strong>placebo</strong> doit être identique au traitement actif en apparence pour maintenir l'insu. Quand l'aveugle est impossible (chirurgie), on utilise une <strong>évaluation en aveugle du critère</strong> (PROBE design).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La randomisation élimine la confusion (y compris facteurs inconnus). Le double aveugle élimine les biais de mesure. Randomisation par blocs = équilibre garanti. Stratifiée = équilibre sur les facteurs pronostiques.</p></div>`
    },
    {
      title: "Critères de jugement et calcul du NSN",
      content: `<p class="mb-3">Le <strong>critère de jugement principal (CJP)</strong> est la variable qui permet de conclure à l'efficacité du traitement. Il doit être unique, défini a priori dans le protocole, cliniquement pertinent, et mesurable de façon objective et reproductible.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Critères cliniques</strong> (hard endpoints) : mortalité, survenue d'événements cardiovasculaires, récidive tumorale. Les plus pertinents mais nécessitent de grands effectifs et un suivi long.</li>
<li><strong>Critères intermédiaires</strong> (surrogate endpoints) : marqueurs biologiques corrélés au critère clinique (HbA1c pour le diabète, charge virale pour le VIH). Plus faciles à mesurer mais le lien avec le bénéfice clinique doit être validé.</li>
<li><strong>Critères composites</strong> : combinaison de plusieurs événements (décès + infarctus + AVC). Augmentent le nombre d'événements et réduisent le NSN, mais chaque composante peut contribuer différemment.</li>
</ul>
<p class="mb-3">Le <strong>calcul du NSN</strong> (nombre de sujets nécessaires) repose sur : le risque α (5 %), la puissance 1 − β (80 % ou 90 %), la taille de l'effet cliniquement pertinente, et la variabilité. Il doit être réalisé a priori et justifié dans le protocole. Un NSN insuffisant rend l'essai non éthique (expose des patients sans chance de répondre à la question).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Un seul critère de jugement principal, défini a priori. Critères cliniques > intermédiaires. Le calcul du NSN est obligatoire et éthique. Un essai sous-dimensionné est non éthique.</p></div>`
    },
    {
      title: "Analyse en intention de traiter et types d'essais",
      content: `<p class="mb-3">L'<strong>analyse en intention de traiter (ITT)</strong> est le principe fondamental de l'analyse d'un essai clinique : chaque patient est analysé dans le groupe auquel il a été randomisé, quel que soit le traitement effectivement reçu (changement de traitement, arrêt, non-observance). L'ITT conserve l'effet de la randomisation et fournit une estimation pragmatique de l'efficacité.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Analyse per-protocole (PP)</strong> : seuls les patients ayant suivi le protocole sont analysés. Elle peut surestimer l'efficacité (exclut les non-observants, souvent ceux avec effets secondaires). Utilisée en complément de l'ITT, jamais seule.</li>
<li><strong>Essai de supériorité</strong> : H₁ = le nouveau traitement est supérieur. Le plus fréquent. L'ITT est conservatrice (biaise vers le nul).</li>
<li><strong>Essai de non-infériorité</strong> : H₁ = le nouveau traitement n'est pas inférieur au traitement de référence (marge δ prédéfinie). L'ITT peut favoriser la conclusion de non-infériorité (biaisée dans le « bon » sens). L'analyse PP est aussi importante.</li>
<li><strong>Essai d'équivalence</strong> : H₁ = les deux traitements sont équivalents (IC de la différence entièrement dans [−δ ; +δ]). Similaire à la non-infériorité mais bilatéral.</li>
</ul>
<p class="mb-3">Les <strong>essais adaptatifs</strong> permettent des modifications prédéfinies en cours d'essai (réévaluation du NSN, abandon d'un bras) sur la base d'analyses intermédiaires, avec contrôle du risque α global.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'ITT est le standard (analyse tous les patients dans leur groupe de randomisation). Pour un essai de supériorité, l'ITT est conservatrice. Pour un essai de non-infériorité, les analyses ITT et PP sont toutes deux nécessaires.</p></div>`
    },
    {
      title: "Aspects éthiques et réglementaires",
      content: `<p class="mb-3">La conduite d'un essai clinique est encadrée par un cadre éthique et réglementaire strict, issu des leçons de l'histoire (Code de Nuremberg 1947, Déclaration d'Helsinki 1964, loi Huriet-Sérusclat 1988 en France, loi Jardé 2012).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Consentement éclairé</strong> : information claire du patient sur les objectifs, les procédures, les risques et les alternatives. Le consentement doit être libre, éclairé, écrit et révocable à tout moment.</li>
<li><strong>Comité de Protection des Personnes (CPP)</strong> : avis favorable obligatoire avant le début de l'essai. Évalue le rapport bénéfice/risque, la qualité de l'information, la pertinence scientifique.</li>
<li><strong>ANSM</strong> : autorisation de l'Agence Nationale de Sécurité du Médicament pour les essais portant sur des médicaments ou des dispositifs médicaux.</li>
<li><strong>Bonnes Pratiques Cliniques (BPC / ICH-GCP)</strong> : normes internationales garantissant la qualité, la fiabilité et la protection des droits des participants.</li>
<li><strong>Enregistrement</strong> : tout essai doit être enregistré dans un registre public (ClinicalTrials.gov, EudraCT) avant l'inclusion du premier patient. Cela prévient le biais de publication.</li>
</ul>
<p class="mb-3">L'<strong>équipose clinique</strong> (clinical equipoise) est le principe éthique qui justifie la randomisation : il doit exister une incertitude réelle sur la supériorité d'un traitement par rapport à l'autre. Un comité de surveillance indépendant (DSMB) peut recommander l'arrêt anticipé de l'essai si un bénéfice ou un risque majeur est détecté.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Consentement éclairé + CPP + ANSM = obligations légales. L'équipose clinique justifie la randomisation. L'enregistrement préalable dans un registre public est obligatoire (prévient le biais de publication).</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  12. ÉTUDES OBSERVATIONNELLES                 */
/* ───────────────────────────────────────────── */
"biostats-etudes-obs": {
  introduction: "Les études observationnelles sont des études épidémiologiques dans lesquelles le chercheur observe sans intervenir sur l'exposition. Elles sont indispensables quand la randomisation est impossible (expositions nocives, facteurs génétiques) et représentent la majorité des études en épidémiologie.",
  readTime: 20,
  sections: [
    {
      title: "Études de cohorte",
      content: `<p class="mb-3">L'<strong>étude de cohorte</strong> suit un groupe de sujets initialement indemnes de la maladie, classés selon leur niveau d'exposition, et mesure l'apparition de la maladie au cours du temps. C'est le schéma observationnel de référence.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Cohorte prospective</strong> : l'exposition est mesurée au présent, puis les sujets sont suivis pour observer l'apparition de la maladie. Chronologie causale claire (exposition → maladie). Or de la recherche épidémiologique mais coûteuse et longue.</li>
<li><strong>Cohorte rétrospective (historique)</strong> : l'exposition passée est reconstituée à partir de dossiers existants (dossiers médicaux, fichiers professionnels). Le suivi est aussi rétrospectif. Plus rapide et moins coûteuse mais dépendante de la qualité des données historiques.</li>
<li><strong>Mesures d'association</strong> : le <strong>risque relatif (RR)</strong> = incidence chez les exposés / incidence chez les non exposés. Le <strong>risque attribuable (RA)</strong> = incidence chez les exposés − incidence chez les non exposés (excès de risque lié à l'exposition).</li>
<li><strong>Avantages</strong> : temporalité claire, calcul direct de l'incidence et du RR, possibilité d'étudier plusieurs maladies pour une même exposition, pas de biais de rappel.</li>
<li><strong>Inconvénients</strong> : coût et durée importants, inadaptée aux maladies rares (il faut une cohorte immense), perdus de vue, évolution des expositions dans le temps.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La cohorte prospective est le gold standard observationnel. Elle permet le calcul direct du RR et de l'incidence. Inadaptée aux maladies rares. Le principal risque est l'attrition (perdus de vue).</p></div>`
    },
    {
      title: "Études cas-témoins",
      content: `<p class="mb-3">L'<strong>étude cas-témoins</strong> part de la maladie : on sélectionne des sujets malades (cas) et des sujets non malades (témoins), puis on compare rétrospectivement leur exposition passée. C'est le schéma idéal pour les maladies rares.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Sélection des cas</strong> : cas incidents (nouveaux cas) préférables aux cas prévalents pour éviter le biais de Neyman. Critères diagnostiques précis et uniformes.</li>
<li><strong>Sélection des témoins</strong> : étape critique. Les témoins doivent être issus de la même population source que les cas. Témoins hospitaliers (même hôpital, autre pathologie) ou populationnels (population générale).</li>
<li><strong>Mesure d'association</strong> : l'<strong>odds ratio (OR)</strong> = (a × d) / (b × c). L'OR est une bonne approximation du RR quand la maladie est rare (prévalence < 10 %).</li>
<li><strong>Avantages</strong> : rapide, peu coûteuse, adaptée aux maladies rares et aux maladies à longue latence, possibilité d'étudier plusieurs expositions.</li>
<li><strong>Inconvénients</strong> : biais de rappel (les cas se souviennent mieux de leurs expositions), impossibilité de calculer l'incidence, difficulté de sélection des témoins, temporalité parfois floue.</li>
</ul>
<p class="mb-3">L'<strong>étude cas-témoins nichée dans une cohorte</strong> (nested case-control) combine les avantages des deux schémas : les cas surviennent dans une cohorte déjà suivie, et les témoins sont sélectionnés dans la même cohorte, avec des données d'exposition recueillies prospectivement (pas de biais de rappel).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'étude cas-témoins est le schéma de choix pour les maladies rares. L'OR est la mesure d'association (≈ RR si maladie rare). Le biais de rappel est sa principale faiblesse. La sélection des témoins est l'étape critique.</p></div>`
    },
    {
      title: "Études transversales et écologiques",
      content: `<p class="mb-3">L'<strong>étude transversale</strong> (cross-sectional) mesure simultanément l'exposition et la maladie à un instant donné (photographie de la population). C'est le schéma le plus simple et le plus rapide.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Mesures</strong> : prévalence (proportion de malades à un instant t), rapport de prévalence, OR de prévalence. On ne peut pas calculer l'incidence ni le RR.</li>
<li><strong>Avantages</strong> : rapide, peu coûteuse, utile pour la planification sanitaire, donne une image de l'état de santé de la population.</li>
<li><strong>Inconvénients</strong> : impossible d'établir la temporalité (l'oeuf ou la poule ?), biais de Neyman (les cas de courte durée sont sous-représentés), inadaptée aux maladies rares.</li>
</ul>
<p class="mb-3">L'<strong>étude écologique</strong> compare des groupes (pays, régions, populations) et non des individus. L'unité d'observation est le groupe. Exemple : corrélation entre la consommation moyenne de graisses animales d'un pays et son taux de mortalité cardiovasculaire.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biais écologique (erreur écologique)</strong> : une association observée au niveau du groupe ne s'applique pas nécessairement au niveau individuel. C'est le principal piège de ce type d'étude.</li>
<li>Utiles pour générer des hypothèses, mais jamais pour les confirmer.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'étude transversale mesure la prévalence (pas l'incidence) et ne permet pas de conclure sur la causalité (pas de temporalité). L'étude écologique souffre du biais écologique (groupe ≠ individu).</p></div>`
    },
    {
      title: "Niveaux de preuve et hiérarchie des études",
      content: `<p class="mb-3">La <strong>médecine fondée sur les preuves</strong> (Evidence-Based Medicine, EBM) hiérarchise les études selon leur niveau de preuve, c'est-à-dire leur capacité à établir un lien causal fiable :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Niveau 1 (le plus élevé)</strong> : méta-analyses d'essais cliniques randomisés, essais randomisés de grande taille avec résultats clairs.</li>
<li><strong>Niveau 2</strong> : essais randomisés de petite taille, études de cohorte prospectives bien conduites.</li>
<li><strong>Niveau 3</strong> : études cas-témoins bien conduites.</li>
<li><strong>Niveau 4</strong> : études transversales, séries de cas, études écologiques.</li>
<li><strong>Niveau 5 (le plus faible)</strong> : avis d'experts, cas cliniques isolés.</li>
</ul>
<p class="mb-3">Les <strong>grades de recommandation</strong> (HAS) découlent des niveaux de preuve : Grade A (preuve scientifique établie, niveau 1), Grade B (présomption scientifique, niveau 2), Grade C (faible niveau de preuve, niveaux 3-4), Avis d'experts (niveau 5).</p>
<p class="mb-3">Important : un essai randomisé mal conduit peut avoir un niveau de preuve inférieur à une étude observationnelle bien menée. La qualité méthodologique prime sur le type d'étude.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Méta-analyses > ECR > Cohortes > Cas-témoins > Transversales > Avis d'experts. La qualité méthodologique est aussi importante que le type d'étude. Grade A = preuve établie (niveau 1).</p></div>`
    },
    {
      title: "Guidelines de reporting : STROBE et autres",
      content: `<p class="mb-3">Des <strong>guidelines de reporting</strong> standardisent la présentation des résultats pour assurer la transparence et la reproductibilité. Chaque type d'étude a son guide spécifique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>STROBE</strong> (STrengthening the Reporting of OBservational studies in Epidemiology) : checklist de 22 items pour les études de cohorte, cas-témoins et transversales. Couvre le titre, l'introduction, les méthodes (population, variables, biais, taille d'échantillon), les résultats et la discussion.</li>
<li><strong>CONSORT</strong> : pour les essais cliniques randomisés. Inclut le diagramme de flux (flow chart) montrant le parcours des patients.</li>
<li><strong>PRISMA</strong> : pour les revues systématiques et méta-analyses.</li>
<li><strong>STARD</strong> : pour les études de précision diagnostique.</li>
<li><strong>MOOSE</strong> : pour les méta-analyses d'études observationnelles.</li>
</ul>
<p class="mb-3">STROBE recommande notamment de : décrire précisément les critères d'éligibilité, justifier la taille de l'échantillon, décrire les méthodes de gestion des données manquantes, discuter les biais potentiels, présenter les analyses principales et les analyses de sensibilité.</p>
<p class="mb-3">La connaissance de ces guidelines est essentielle pour la rédaction d'articles scientifiques et pour leur lecture critique.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : STROBE = études observationnelles, CONSORT = essais cliniques, PRISMA = revues systématiques. Ces guidelines garantissent la transparence et la qualité du reporting scientifique.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  13. SENSIBILITÉ ET SPÉCIFICITÉ               */
/* ───────────────────────────────────────────── */
"biostats-sensibilite": {
  introduction: "L'évaluation des performances des tests diagnostiques est une compétence fondamentale en médecine. Sensibilité, spécificité, valeurs prédictives et rapports de vraisemblance permettent de quantifier la capacité d'un test à identifier correctement les malades et les non-malades.",
  readTime: 20,
  sections: [
    {
      title: "Sensibilité et spécificité : définitions et calculs",
      content: `<p class="mb-3">Les performances intrinsèques d'un test diagnostique se mesurent par la <strong>sensibilité</strong> et la <strong>spécificité</strong>, calculées à partir du tableau 2 × 2 confrontant le résultat du test au diagnostic de référence (gold standard) :</p>
<p class="mb-3">Notation : VP = vrais positifs, FP = faux positifs, FN = faux négatifs, VN = vrais négatifs.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Sensibilité (Se)</strong> = VP / (VP + FN) = P(Test+ | Malade). C'est la proportion de malades correctement identifiés par le test. Une Se élevée signifie peu de faux négatifs.</li>
<li><strong>Spécificité (Sp)</strong> = VN / (VN + FP) = P(Test− | Non malade). C'est la proportion de non-malades correctement identifiés. Une Sp élevée signifie peu de faux positifs.</li>
<li><strong>Propriété fondamentale</strong> : Se et Sp sont des caractéristiques intrinsèques du test, indépendantes de la prévalence de la maladie dans la population testée.</li>
</ul>
<p class="mb-3">Il existe un <strong>compromis</strong> entre Se et Sp : en abaissant le seuil de positivité d'un test quantitatif, on augmente la sensibilité mais on diminue la spécificité (plus de faux positifs). Le choix du seuil dépend du contexte clinique.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Se = VP/(VP+FN) = capacité à détecter les malades. Sp = VN/(VN+FP) = capacité à identifier les non-malades. Se et Sp sont intrinsèques au test et indépendantes de la prévalence.</p></div>`
    },
    {
      title: "Valeurs prédictives et influence de la prévalence",
      content: `<p class="mb-3">En pratique clinique, le médecin connaît le résultat du test et veut savoir la probabilité que le patient soit réellement malade (ou non). C'est le rôle des <strong>valeurs prédictives</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Valeur prédictive positive (VPP)</strong> = VP / (VP + FP) = P(Malade | Test+). Probabilité d'être malade quand le test est positif.</li>
<li><strong>Valeur prédictive négative (VPN)</strong> = VN / (VN + FN) = P(Non malade | Test−). Probabilité de ne pas être malade quand le test est négatif.</li>
</ul>
<p class="mb-3">Contrairement à Se et Sp, les valeurs prédictives dépendent fortement de la <strong>prévalence</strong> de la maladie dans la population :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Quand la <strong>prévalence est faible</strong> (dépistage en population générale) : la VPP est basse (beaucoup de faux positifs parmi les positifs) mais la VPN est élevée. Un test positif doit être confirmé.</li>
<li>Quand la <strong>prévalence est élevée</strong> (patients suspects en consultation spécialisée) : la VPP est élevée mais la VPN diminue. Un test négatif peut être faussement rassurant.</li>
</ul>
<p class="mb-3">C'est pourquoi un même test (ex. PSA pour le cancer de la prostate) a des performances prédictives très différentes selon qu'il est utilisé en dépistage de masse (prévalence basse) ou en suivi de patients traités (prévalence élevée).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : VPP et VPN dépendent de la prévalence. Prévalence faible = VPP basse (beaucoup de faux positifs). Prévalence élevée = VPN basse. C'est le piège classique du dépistage en population générale.</p></div>`
    },
    {
      title: "Rapports de vraisemblance et probabilité post-test",
      content: `<p class="mb-3">Les <strong>rapports de vraisemblance</strong> (RV, likelihood ratios) combinent Se et Sp en un seul indicateur indépendant de la prévalence :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>RV+ (rapport de vraisemblance positif)</strong> = Se / (1 − Sp). Indique combien de fois un résultat positif est plus probable chez un malade que chez un non-malade. RV+ > 10 = test très informatif quand positif.</li>
<li><strong>RV− (rapport de vraisemblance négatif)</strong> = (1 − Se) / Sp. Indique combien de fois un résultat négatif est probable chez un malade par rapport à un non-malade. RV− < 0,1 = test très informatif quand négatif.</li>
</ul>
<p class="mb-3">Les RV permettent de calculer la <strong>probabilité post-test</strong> à partir de la probabilité pré-test (prévalence ou probabilité clinique) via le <strong>théorème de Bayes</strong> sous forme de cotes :</p>
<p class="mb-3">Cote post-test = Cote pré-test × RV, avec Cote = P / (1 − P).</p>
<p class="mb-3">Le <strong>nomogramme de Fagan</strong> est un outil graphique qui relie visuellement la probabilité pré-test, le rapport de vraisemblance et la probabilité post-test. Il illustre concrètement l'apport diagnostique d'un test.</p>
<p class="mb-3">Avantage majeur des RV : ils sont applicables à tout niveau de prévalence et permettent de combiner les résultats de plusieurs tests indépendants en multipliant les RV successifs.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : RV+ = Se/(1−Sp), RV− = (1−Se)/Sp. Indépendants de la prévalence. Cote post-test = cote pré-test × RV. RV+ > 10 ou RV− < 0,1 = test très utile. Nomogramme de Fagan pour le calcul graphique.</p></div>`
    },
    {
      title: "Règles SNOUT/SPIN et stratégie diagnostique",
      content: `<p class="mb-3">Deux mnémoniques résument l'utilisation optimale de la sensibilité et de la spécificité en stratégie diagnostique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>SNOUT</strong> (Sensitivity rules OUT) : un test très sensible, quand il est négatif, exclut la maladie (peu de faux négatifs). Utilisé en première intention pour le <strong>dépistage</strong> et le <strong>triage</strong>.</li>
<li><strong>SPIN</strong> (Specificity rules IN) : un test très spécifique, quand il est positif, confirme la maladie (peu de faux positifs). Utilisé en deuxième intention pour la <strong>confirmation diagnostique</strong>.</li>
</ul>
<p class="mb-3">La <strong>stratégie en deux temps</strong> est la plus fréquente en médecine :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Étape 1 : test de <strong>dépistage</strong> très sensible (ex. ELISA pour le VIH). Les négatifs sont rassurés (SNOUT).</li>
<li>Étape 2 : test de <strong>confirmation</strong> très spécifique (ex. Western Blot) sur les positifs de l'étape 1. Les positifs confirmés sont diagnostiqués (SPIN).</li>
</ul>
<p class="mb-3">Cette approche séquentielle augmente la spécificité globale tout en maintenant une bonne sensibilité. Elle réduit les faux positifs (anxiété inutile, examens complémentaires) tout en minimisant les faux négatifs (malades non diagnostiqués).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : SNOUT = un test sensible négatif exclut la maladie (dépistage). SPIN = un test spécifique positif confirme la maladie (confirmation). Stratégie en 2 temps : dépistage sensible puis confirmation spécifique.</p></div>`
    },
    {
      title: "Concordance et reproductibilité d'un test",
      content: `<p class="mb-3">Au-delà de la validité (Se et Sp), un test diagnostique doit être <strong>reproductible</strong> (donner le même résultat quand il est répété dans les mêmes conditions). On distingue :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Reproductibilité intra-observateur</strong> : concordance des résultats quand le même observateur répète la mesure. Évalue la stabilité de la lecture.</li>
<li><strong>Reproductibilité inter-observateurs</strong> : concordance des résultats entre deux observateurs différents. Évalue l'objectivité du test.</li>
<li><strong>Coefficient kappa (κ) de Cohen</strong> : mesure la concordance au-delà du hasard pour les variables qualitatives. κ = (concordance observée − concordance attendue) / (1 − concordance attendue). Interprétation : κ < 0,20 = faible, 0,21-0,40 = passable, 0,41-0,60 = modéré, 0,61-0,80 = bon, > 0,80 = excellent.</li>
<li><strong>Coefficient de corrélation intra-classe (ICC)</strong> : pour les variables quantitatives continues. Mesure la reproductibilité en tenant compte de la variabilité inter-sujets et intra-sujets.</li>
<li><strong>Méthode de Bland-Altman</strong> : représentation graphique de la concordance entre deux méthodes de mesure quantitatives. On trace la différence (méthode A − méthode B) en fonction de la moyenne ((A+B)/2). Les limites d'agrément (moyenne ± 1,96 × écart-type des différences) définissent l'intervalle dans lequel 95 % des différences se situent.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Kappa mesure la concordance qualitative (> 0,80 = excellent). ICC mesure la reproductibilité quantitative. Bland-Altman compare deux méthodes de mesure (limites d'agrément ± 1,96 SD).</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  14. COURBES ROC                              */
/* ───────────────────────────────────────────── */
"biostats-roc": {
  introduction: "La courbe ROC (Receiver Operating Characteristic) est l'outil graphique de référence pour évaluer et comparer les performances globales d'un test diagnostique quantitatif. Elle permet de visualiser le compromis entre sensibilité et spécificité pour tous les seuils possibles et de déterminer le seuil optimal selon le contexte clinique.",
  readTime: 18,
  sections: [
    {
      title: "Construction de la courbe ROC",
      content: `<p class="mb-3">Pour un test diagnostique quantitatif (ex. glycémie, PSA, troponine), le résultat est une valeur continue. On doit choisir un <strong>seuil de positivité</strong> au-delà duquel le test est déclaré positif. Chaque seuil donne un couple (Se, Sp) différent.</p>
<p class="mb-3">La <strong>courbe ROC</strong> représente la sensibilité (Se, en ordonnée) en fonction de (1 − Sp) (taux de faux positifs, en abscisse) pour tous les seuils possibles :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Le point (0, 0) correspond au seuil le plus élevé : aucun sujet n'est déclaré positif (Se = 0, Sp = 1).</li>
<li>Le point (1, 1) correspond au seuil le plus bas : tous les sujets sont déclarés positifs (Se = 1, Sp = 0).</li>
<li>La <strong>diagonale</strong> (de (0,0) à (1,1)) représente un test sans valeur discriminante (performance du hasard).</li>
<li>Un test parfait passerait par le point (0, 1) : Se = 1 et Sp = 1 simultanément.</li>
</ul>
<p class="mb-3">Plus la courbe se rapproche du coin supérieur gauche (0, 1), meilleur est le test. La forme de la courbe reflète la séparation entre les distributions des valeurs chez les malades et les non-malades.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La courbe ROC trace Se en fonction de (1−Sp) pour tous les seuils. La diagonale = hasard. Plus la courbe se rapproche du coin supérieur gauche, meilleur est le test.</p></div>`
    },
    {
      title: "Aire sous la courbe (AUC) et interprétation",
      content: `<p class="mb-3">L'<strong>aire sous la courbe ROC (AUC, Area Under the Curve)</strong> est un indicateur global de la capacité discriminante du test, résumant sa performance pour l'ensemble des seuils possibles.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>AUC = 0,5</strong> : test sans valeur discriminante (équivalent au hasard).</li>
<li><strong>AUC = 0,7 − 0,8</strong> : discrimination acceptable.</li>
<li><strong>AUC = 0,8 − 0,9</strong> : bonne discrimination.</li>
<li><strong>AUC > 0,9</strong> : excellente discrimination.</li>
<li><strong>AUC = 1,0</strong> : test parfait (discrimination parfaite entre malades et non-malades).</li>
</ul>
<p class="mb-3"><strong>Interprétation probabiliste</strong> : l'AUC correspond à la probabilité qu'un malade tiré au hasard ait une valeur de test supérieure à celle d'un non-malade tiré au hasard. Par exemple, AUC = 0,85 signifie que dans 85 % des paires (malade, non-malade), le malade aura la valeur la plus élevée.</p>
<p class="mb-3">L'intervalle de confiance de l'AUC permet de tester si l'AUC est significativement différente de 0,5 (test de DeLong). On peut aussi comparer les AUC de deux tests appliqués aux mêmes patients pour déterminer lequel est le plus performant.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : AUC = probabilité qu'un malade ait une valeur plus élevée qu'un non-malade. AUC > 0,9 = excellent. L'AUC permet de comparer globalement deux tests diagnostiques.</p></div>`
    },
    {
      title: "Choix du seuil optimal",
      content: `<p class="mb-3">La courbe ROC montre tous les compromis Se/Sp possibles, mais le choix du <strong>seuil optimal</strong> dépend du contexte clinique et des conséquences des erreurs de classement :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dépistage</strong> : on privilégie la <strong>sensibilité</strong> (seuil bas). On veut capter un maximum de malades, quitte à avoir des faux positifs (qui seront éliminés par un test de confirmation). Exemple : dépistage du VIH, dépistage néonatal.</li>
<li><strong>Confirmation diagnostique</strong> : on privilégie la <strong>spécificité</strong> (seuil élevé). On veut être sûr du diagnostic positif, quitte à manquer quelques cas. Exemple : confirmation par biopsie, Western Blot.</li>
<li><strong>Équilibre Se/Sp</strong> : quand les conséquences des faux positifs et des faux négatifs sont équivalentes.</li>
</ul>
<p class="mb-3">L'<strong>indice de Youden</strong> (J) = Se + Sp − 1 identifie le seuil qui maximise simultanément Se et Sp. Il correspond au point de la courbe ROC le plus éloigné de la diagonale. J varie de 0 (test inutile) à 1 (test parfait).</p>
<p class="mb-3">D'autres méthodes de choix de seuil existent : le point le plus proche du coin (0, 1), la minimisation du coût total des erreurs (en pondérant faux positifs et faux négatifs par leurs coûts respectifs), ou les seuils cliniques prédéfinis (ex. glycémie > 1,26 g/L pour le diabète).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Dépistage = privilégier Se (seuil bas). Confirmation = privilégier Sp (seuil élevé). Indice de Youden (J = Se + Sp − 1) identifie le meilleur compromis global.</p></div>`
    },
    {
      title: "Comparaison de courbes ROC",
      content: `<p class="mb-3">Comparer les performances de deux (ou plusieurs) tests diagnostiques est une question fréquente en médecine. Plusieurs méthodes permettent cette comparaison :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Comparaison visuelle</strong> : si une courbe ROC est entièrement au-dessus de l'autre, le test correspondant est uniformément meilleur. Si les courbes se croisent, la supériorité dépend du seuil choisi.</li>
<li><strong>Test de DeLong</strong> : test statistique pour comparer les AUC de deux tests appliqués aux mêmes patients (données appariées). Il tient compte de la corrélation entre les tests. C'est la méthode de référence.</li>
<li><strong>Comparaison par bootstrap</strong> : alternative non paramétrique au test de DeLong, utile pour les petits échantillons.</li>
<li><strong>Net Reclassification Improvement (NRI)</strong> : mesure l'amélioration du classement des patients quand on passe d'un modèle (ou test) à un autre. Plus informatif que la simple comparaison des AUC pour les différences modestes.</li>
</ul>
<p class="mb-3">Attention : deux tests peuvent avoir des AUC similaires mais des performances très différentes dans certaines zones de la courbe (à haute sensibilité ou à haute spécificité). L'AUC partielle (pAUC) permet de comparer les tests dans une zone d'intérêt spécifique.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le test de DeLong compare les AUC de deux tests appariés. Si les courbes se croisent, la supériorité dépend du seuil. Le NRI complète la comparaison des AUC pour évaluer le reclassement des patients.</p></div>`
    },
    {
      title: "Applications cliniques et limites de la courbe ROC",
      content: `<p class="mb-3">La courbe ROC est utilisée dans de nombreux contextes cliniques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biomarqueurs diagnostiques</strong> : évaluation de nouveaux marqueurs biologiques (troponine pour l'infarctus, BNP pour l'insuffisance cardiaque, PCT pour les infections bactériennes).</li>
<li><strong>Scores pronostiques</strong> : évaluation de scores de risque (score de Framingham, SOFA, APACHE II). L'AUC mesure la capacité du score à discriminer les patients à haut et bas risque.</li>
<li><strong>Imagerie médicale</strong> : comparaison de modalités d'imagerie (scanner vs IRM) pour la détection de lésions.</li>
<li><strong>Modèles prédictifs</strong> : évaluation de modèles de régression logistique par leur capacité discriminante (c-statistic = AUC).</li>
</ul>
<p class="mb-3"><strong>Limites de la courbe ROC</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>L'AUC ne tient pas compte de la prévalence ni des coûts relatifs des erreurs.</li>
<li>L'AUC est peu sensible aux différences dans des zones spécifiques de la courbe.</li>
<li>La courbe ROC ne mesure que la discrimination, pas la <strong>calibration</strong> (adéquation entre probabilités prédites et fréquences observées). Un test de Hosmer-Lemeshow évalue la calibration.</li>
<li>Pour les événements rares, la courbe <strong>précision-rappel</strong> (precision-recall curve) peut être plus informative que la ROC.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'AUC mesure la discrimination mais pas la calibration. Pour évaluer un modèle complet, il faut aussi la calibration (Hosmer-Lemeshow). La c-statistique d'un modèle logistique est identique à l'AUC de sa courbe ROC.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  15. RÉGRESSION LINÉAIRE ET LOGISTIQUE        */
/* ───────────────────────────────────────────── */
"biostats-regression": {
  introduction: "Les modèles de régression sont les outils fondamentaux de l'analyse multivariée en recherche biomédicale. Ils permettent d'étudier la relation entre une variable dépendante (issue, critère de jugement) et une ou plusieurs variables explicatives, tout en contrôlant les facteurs de confusion.",
  readTime: 22,
  sections: [
    {
      title: "Régression linéaire simple",
      content: `<p class="mb-3">La <strong>régression linéaire simple</strong> modélise la relation entre une variable dépendante Y (continue) et une variable explicative X par une droite : Y = β₀ + β₁X + ε, où β₀ est l'ordonnée à l'origine, β₁ est la pente (variation de Y pour une augmentation d'une unité de X) et ε est le résidu (erreur).</p>
<p class="mb-3">Les coefficients β₀ et β₁ sont estimés par la <strong>méthode des moindres carrés</strong>, qui minimise la somme des carrés des résidus Σ(yi − ŷi)².</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Coefficient de détermination R²</strong> : proportion de la variance de Y expliquée par le modèle. R² = 1 − (variance résiduelle / variance totale). R² varie de 0 (aucune explication) à 1 (explication parfaite). R² = r² (carré du coefficient de corrélation de Pearson).</li>
<li><strong>Test de significativité de β₁</strong> : H₀ : β₁ = 0 (pas de relation linéaire). Test de Student : t = β₁ / SE(β₁). Si p < 0,05, la pente est significativement différente de zéro.</li>
<li><strong>IC de β₁</strong> : β₁ ± t<sub>α/2,n−2</sub> × SE(β₁). L'IC donne la plage des valeurs plausibles pour l'effet de X sur Y.</li>
</ul>
<p class="mb-3"><strong>Conditions d'application</strong> : linéarité de la relation, indépendance des résidus, homoscédasticité (variance constante des résidus), normalité des résidus. Ces conditions se vérifient par les graphiques des résidus.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Y = β₀ + β₁X + ε. β₁ = variation de Y par unité de X. R² = proportion de variance expliquée. Conditions : linéarité, indépendance, homoscédasticité, normalité des résidus.</p></div>`
    },
    {
      title: "Régression linéaire multiple",
      content: `<p class="mb-3">La <strong>régression linéaire multiple</strong> étend le modèle à plusieurs variables explicatives : Y = β₀ + β₁X₁ + β₂X₂ + ... + βₚXₚ + ε. Chaque coefficient βᵢ représente l'effet de Xᵢ sur Y <strong>ajusté</strong> sur les autres variables du modèle (toutes choses égales par ailleurs).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>R² ajusté</strong> : corrige le R² pour le nombre de variables dans le modèle. Le R² brut augmente mécaniquement avec chaque variable ajoutée, même non pertinente. Le R² ajusté pénalise les variables inutiles.</li>
<li><strong>Contrôle de la confusion</strong> : en incluant un facteur de confusion dans le modèle, on obtient l'effet ajusté de l'exposition. Si le coefficient de l'exposition change de plus de 10 % après ajustement, la variable est un facteur de confusion.</li>
<li><strong>Terme d'interaction</strong> : β₃ × X₁ × X₂ teste si l'effet de X₁ dépend du niveau de X₂. Si β₃ est significatif, il y a interaction (modification d'effet).</li>
<li><strong>Variables indicatrices (dummy variables)</strong> : pour inclure une variable qualitative à k modalités, on crée (k − 1) variables binaires. La modalité de référence est celle non codée.</li>
</ul>
<p class="mb-3"><strong>Sélection des variables</strong> : méthode ascendante (forward), descendante (backward), pas-à-pas (stepwise), ou basée sur des critères d'information (AIC, BIC). La sélection doit être guidée par les connaissances médicales, pas uniquement par les p-values.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : En régression multiple, chaque βᵢ est ajusté sur les autres variables. Le R² ajusté corrige pour le nombre de variables. La sélection des variables doit combiner connaissance médicale et critères statistiques.</p></div>`
    },
    {
      title: "Régression logistique",
      content: `<p class="mb-3">La <strong>régression logistique</strong> est utilisée quand la variable dépendante Y est <strong>binaire</strong> (0/1, malade/sain, décès/survie). Le modèle prédit la probabilité P(Y = 1) via la fonction logit :</p>
<p class="mb-3">logit(P) = ln(P / (1 − P)) = β₀ + β₁X₁ + β₂X₂ + ... + βₚXₚ</p>
<p class="mb-3">Le logit transforme la probabilité (bornée entre 0 et 1) en une variable pouvant prendre toute valeur réelle.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Interprétation des coefficients</strong> : e<sup>βᵢ</sup> = <strong>odds ratio (OR) ajusté</strong> pour la variable Xᵢ. C'est l'interprétation fondamentale. Pour une variable binaire : OR = rapport des cotes de l'événement entre les deux groupes, ajusté sur les covariables.</li>
<li><strong>OR > 1</strong> : facteur de risque. <strong>OR < 1</strong> : facteur protecteur. <strong>OR = 1</strong> : pas d'association.</li>
<li><strong>IC de l'OR</strong> : IC(OR) = exp(βᵢ ± 1,96 × SE(βᵢ)). Si l'IC ne contient pas 1, l'association est significative.</li>
<li><strong>Estimation</strong> : les coefficients sont estimés par maximum de vraisemblance (et non par moindres carrés comme en régression linéaire).</li>
</ul>
<p class="mb-3">La régression logistique est le modèle standard des études cas-témoins et de toute analyse multivariée avec une variable binaire. Elle permet d'identifier les facteurs indépendamment associés à l'issue.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Régression logistique pour Y binaire. logit(P) = β₀ + β₁X₁ + ... e<sup>β</sup> = OR ajusté. OR > 1 = facteur de risque. IC de l'OR ne contient pas 1 = significatif. Estimation par maximum de vraisemblance.</p></div>`
    },
    {
      title: "Évaluation et diagnostic du modèle",
      content: `<p class="mb-3">Après la construction d'un modèle de régression, il est essentiel d'évaluer sa qualité et de vérifier ses hypothèses :</p>
<p class="mb-3"><strong>Pour la régression linéaire</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Analyse des résidus</strong> : graphique résidus vs valeurs prédites (vérifier l'homoscédasticité et la linéarité), Q-Q plot des résidus (vérifier la normalité).</li>
<li><strong>Multicolinéarité</strong> : corrélation élevée entre variables explicatives. Détectée par le VIF (Variance Inflation Factor). VIF > 5 ou 10 = multicolinéarité problématique. Solution : retirer une variable ou combiner les variables corrélées.</li>
<li><strong>Valeurs influentes</strong> : distance de Cook identifie les observations qui influencent fortement le modèle. Un point avec un résidu élevé ET un fort levier est très influent.</li>
</ul>
<p class="mb-3"><strong>Pour la régression logistique</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Discrimination</strong> : AUC de la courbe ROC (c-statistique). AUC > 0,8 = bonne discrimination.</li>
<li><strong>Calibration</strong> : test de Hosmer-Lemeshow. Compare les probabilités prédites aux fréquences observées par déciles de risque. Un test non significatif (p > 0,05) indique une bonne calibration.</li>
<li><strong>Règle du 1 pour 10</strong> : il faut au moins 10 événements par variable explicative pour une estimation stable des coefficients.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Vérifier les résidus (linéaire) et la discrimination + calibration (logistique). VIF > 5 = multicolinéarité. Règle du 10 : au moins 10 événements par variable en logistique.</p></div>`
    },
    {
      title: "Extensions et modèles avancés",
      content: `<p class="mb-3">Selon la nature de la variable dépendante et la structure des données, d'autres modèles de régression sont utilisés :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Régression de Poisson</strong> : pour les données de comptage (nombre d'événements). Le coefficient exponentié donne l'<strong>IRR</strong> (Incidence Rate Ratio). Hypothèse : variance = moyenne. Si surdispersion (variance > moyenne), on utilise la régression binomiale négative.</li>
<li><strong>Régression de Cox</strong> : pour les données de survie (temps jusqu'à un événement). h(t) = h₀(t) × exp(β₁X₁ + ...). Le coefficient exponentié donne le <strong>Hazard Ratio (HR)</strong>. Voir le chapitre Analyse de survie.</li>
<li><strong>Modèles mixtes (effets aléatoires)</strong> : pour les données hiérarchisées (patients dans des hôpitaux) ou les mesures répétées. Incluent des effets fixes (covariables) et des effets aléatoires (variabilité inter-groupes).</li>
<li><strong>Régression logistique ordinale</strong> : pour une variable dépendante ordinale à plus de 2 catégories ordonnées (ex. sévérité : légère/modérée/sévère). Hypothèse des odds proportionnels.</li>
<li><strong>Régression logistique multinomiale</strong> : pour une variable dépendante nominale à plus de 2 catégories non ordonnées.</li>
</ul>
<p class="mb-3">Le choix du modèle dépend de la nature de Y (continue, binaire, comptage, survie, ordinale) et de la structure des données (indépendantes, appariées, hiérarchisées, répétées).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Y continue → linéaire, Y binaire → logistique, Y comptage → Poisson, Y survie → Cox. Les modèles mixtes gèrent les données hiérarchisées et les mesures répétées.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  16. ANALYSE DE SURVIE                        */
/* ───────────────────────────────────────────── */
"biostats-survie": {
  introduction: "L'analyse de survie étudie le délai entre un événement initial (diagnostic, début de traitement) et un événement d'intérêt (décès, rechute, guérison). Sa particularité est la gestion des données censurées, c'est-à-dire des patients pour lesquels l'événement n'a pas encore été observé à la fin de l'étude.",
  readTime: 20,
  sections: [
    {
      title: "Données de survie et censure",
      content: `<p class="mb-3">En analyse de survie, la variable d'intérêt est le <strong>délai</strong> (temps) entre un point de départ et la survenue d'un événement. Ce temps est toujours positif et souvent de distribution asymétrique à droite.</p>
<p class="mb-3">La <strong>censure</strong> est le phénomène central de l'analyse de survie. Un sujet est censuré lorsque l'événement d'intérêt n'a pas été observé pendant la période d'étude :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Censure à droite</strong> (la plus fréquente) : le sujet est encore vivant à la fin de l'étude, ou a été perdu de vue, ou a présenté un événement compétitif (décès d'une autre cause). On sait seulement que le temps de survie est supérieur au temps observé.</li>
<li><strong>Censure à gauche</strong> : l'événement s'est produit avant le début de l'observation (ex. séroconversion VIH avant l'inclusion).</li>
<li><strong>Censure par intervalle</strong> : l'événement s'est produit entre deux visites, on ne connaît pas la date exacte.</li>
</ul>
<p class="mb-3">L'hypothèse fondamentale est la <strong>censure non informative</strong> : les sujets censurés ont le même pronostic que les sujets non censurés à risque au même moment. Si les perdus de vue ont un pronostic différent (ex. ils sont plus malades), l'analyse est biaisée.</p>
<p class="mb-3">On ne peut pas utiliser les méthodes classiques (moyenne, test t) car : (1) la distribution n'est pas normale, (2) les données censurées portent une information partielle qu'il faut exploiter sans la perdre.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La censure est l'information partielle sur les sujets sans événement observé. La censure à droite est la plus fréquente. L'hypothèse de censure non informative est essentielle à la validité de l'analyse.</p></div>`
    },
    {
      title: "Estimateur de Kaplan-Meier",
      content: `<p class="mb-3">L'estimateur de <strong>Kaplan-Meier</strong> est la méthode non paramétrique de référence pour estimer la fonction de survie S(t) = P(T > t), c'est-à-dire la probabilité de survivre au-delà du temps t.</p>
<p class="mb-3">À chaque temps d'événement tᵢ, on calcule : S(tᵢ) = S(tᵢ₋₁) × (1 − dᵢ/nᵢ), où dᵢ est le nombre d'événements au temps tᵢ et nᵢ est le nombre de sujets à risque juste avant tᵢ (les censurés avant tᵢ ne sont plus à risque).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Courbe de Kaplan-Meier</strong> : courbe en escalier décroissante. Les marches correspondent aux événements. Les censures sont habituellement indiquées par des petites marques verticales (ticks) sur la courbe.</li>
<li><strong>Médiane de survie</strong> : temps pour lequel S(t) = 0,50, c'est-à-dire le temps au bout duquel 50 % des sujets ont présenté l'événement. Préférée à la moyenne de survie car elle n'exige pas que tous les sujets aient présenté l'événement.</li>
<li><strong>Survie à un temps donné</strong> : on peut lire S(t) pour un temps spécifique (ex. survie à 5 ans). L'IC de Greenwood donne la précision de cette estimation.</li>
</ul>
<p class="mb-3">La courbe de Kaplan-Meier est l'outil de présentation standard des résultats de survie dans les essais cliniques et les études de cohorte. Le nombre de sujets à risque à chaque temps doit être indiqué sous le graphique.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Kaplan-Meier = courbe de survie en escalier qui gère les censures. Médiane de survie = temps où S(t) = 50 %. Toujours indiquer le nombre de sujets à risque sous la courbe.</p></div>`
    },
    {
      title: "Test du log-rank et comparaison de courbes",
      content: `<p class="mb-3">Le <strong>test du log-rank</strong> est le test de référence pour comparer les courbes de survie de deux (ou plusieurs) groupes. Il teste H₀ : les fonctions de survie sont identiques dans tous les groupes.</p>
<p class="mb-3">Principe : à chaque temps d'événement, on compare le nombre d'événements observés dans chaque groupe au nombre attendu sous H₀ (calculé proportionnellement aux effectifs à risque). La statistique est : χ² = Σ(Oᵢ − Eᵢ)² / Eᵢ, avec 1 ddl pour deux groupes.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Avantage</strong> : le log-rank est le test le plus puissant lorsque les risques sont <strong>proportionnels</strong> (les courbes ne se croisent pas).</li>
<li><strong>Limite</strong> : il donne un poids égal à tous les temps. Si les courbes se croisent (risques non proportionnels), le log-rank peut ne pas détecter de différence.</li>
<li><strong>Test de Wilcoxon généralisé (Breslow)</strong> : donne plus de poids aux temps précoces (quand le nombre de sujets à risque est élevé). Plus sensible aux différences précoces.</li>
<li><strong>Comparaisons multiples</strong> : pour k groupes, le log-rank global a (k − 1) ddl. Si significatif, les comparaisons deux à deux nécessitent une correction (Bonferroni ou autre).</li>
</ul>
<p class="mb-3">Important : le log-rank est un test <strong>non ajusté</strong>. Pour comparer la survie en ajustant sur des covariables, il faut utiliser le modèle de Cox.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le log-rank compare deux courbes de survie (H₀ : courbes identiques). Optimal si risques proportionnels (courbes qui ne se croisent pas). Test non ajusté ; pour l'ajustement, utiliser Cox.</p></div>`
    },
    {
      title: "Modèle de Cox (régression à risques proportionnels)",
      content: `<p class="mb-3">Le <strong>modèle de Cox</strong> (1972) est le modèle de régression semi-paramétrique de référence en analyse de survie. Il modélise le <strong>risque instantané</strong> (hazard) h(t) en fonction de covariables :</p>
<p class="mb-3">h(t|X) = h₀(t) × exp(β₁X₁ + β₂X₂ + ... + βₚXₚ)</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>h₀(t)</strong> : risque de base (baseline hazard), non spécifié (partie non paramétrique). C'est le risque quand toutes les covariables valent 0.</li>
<li><strong>exp(βᵢ) = Hazard Ratio (HR)</strong> : rapport des risques instantanés. HR > 1 = surrisque (facteur de mauvais pronostic). HR < 1 = facteur protecteur. HR = 1 = pas d'effet.</li>
<li><strong>IC du HR</strong> : IC(HR) = exp(βᵢ ± 1,96 × SE(βᵢ)). Si l'IC ne contient pas 1, l'association est significative.</li>
<li><strong>Semi-paramétrique</strong> : le modèle de Cox ne fait aucune hypothèse sur la forme de h₀(t) (contrairement aux modèles paramétriques), ce qui lui confère une grande flexibilité.</li>
</ul>
<p class="mb-3"><strong>Hypothèse des risques proportionnels</strong> : le HR est constant au cours du temps. Le rapport h(t|X=1) / h(t|X=0) = exp(β) ne dépend pas de t. Cette hypothèse doit être vérifiée (résidus de Schoenfeld, log(-log(S(t))) parallèles).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Cox : h(t) = h₀(t) × exp(βX). exp(β) = HR ajusté. HR > 1 = surrisque. Hypothèse des risques proportionnels = HR constant dans le temps. Vérifier avec résidus de Schoenfeld.</p></div>`
    },
    {
      title: "Risques compétitifs et modèles paramétriques",
      content: `<p class="mb-3">Dans de nombreuses situations cliniques, plusieurs événements différents peuvent survenir et empêcher l'observation de l'événement d'intérêt. Ce sont les <strong>risques compétitifs</strong> (competing risks).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Exemple</strong> : dans une étude sur la rechute d'un cancer, le décès non lié au cancer est un risque compétitif (le patient ne peut plus rechuter s'il est décédé d'une autre cause).</li>
<li><strong>Problème de Kaplan-Meier</strong> : traiter les risques compétitifs comme des censures surestime l'incidence cumulée de l'événement d'intérêt.</li>
<li><strong>Incidence cumulée</strong> (cumulative incidence function, CIF) : mesure correcte en présence de risques compétitifs. Test de Gray pour comparer les CIF entre groupes.</li>
<li><strong>Modèle de Fine et Gray</strong> : régression sur la sous-distribution des risques (subdistribution hazard). Donne un SHR (subdistribution hazard ratio) interprétable en termes d'incidence cumulée.</li>
</ul>
<p class="mb-3">Les <strong>modèles paramétriques</strong> spécifient la forme de h₀(t) : exponentiel (risque constant), Weibull (risque monotone), log-normal, log-logistique. Plus puissants que Cox si le modèle est correct, mais risqués si la forme est mal spécifiée. Le modèle de Weibull est le plus utilisé (inclut l'exponentiel comme cas particulier).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : En présence de risques compétitifs, Kaplan-Meier surestime l'incidence. Utiliser l'incidence cumulée et le modèle de Fine-Gray. Les modèles paramétriques (Weibull) sont plus puissants mais moins flexibles que Cox.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  17. TESTS NON PARAMÉTRIQUES                  */
/* ───────────────────────────────────────────── */
"biostats-non-parametriques": {
  introduction: "Les tests non paramétriques sont des alternatives aux tests paramétriques classiques lorsque les conditions d'application de ces derniers ne sont pas remplies : non-normalité de la distribution, petits échantillons, données ordinales ou présence de valeurs aberrantes. Ils reposent sur les rangs des observations plutôt que sur leurs valeurs numériques.",
  readTime: 18,
  sections: [
    {
      title: "Principe des tests non paramétriques et indications",
      content: `<p class="mb-3">Les tests <strong>non paramétriques</strong> ne font pas d'hypothèse sur la forme de la distribution des données (pas d'hypothèse de normalité). Ils utilisent les <strong>rangs</strong> des observations (classement par ordre croissant) plutôt que les valeurs brutes.</p>
<p class="mb-3">Indications des tests non paramétriques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Petit échantillon</strong> (n < 30) : le théorème central limite ne s'applique pas, et la normalité ne peut pas être supposée sauf si la population d'origine est clairement normale.</li>
<li><strong>Distribution non normale</strong> : distributions fortement asymétriques, multimodales ou avec des valeurs aberrantes (test de Shapiro-Wilk significatif).</li>
<li><strong>Variables ordinales</strong> : les données sont classées mais les intervalles entre les rangs ne sont pas quantifiables (échelle de douleur, stade de la maladie).</li>
<li><strong>Présence de valeurs aberrantes</strong> : les tests non paramétriques basés sur les rangs sont robustes aux outliers car le rang d'une valeur extrême est borné.</li>
</ul>
<p class="mb-3"><strong>Inconvénient</strong> : les tests non paramétriques sont généralement moins <strong>puissants</strong> (probabilité plus faible de détecter une vraie différence) que leurs équivalents paramétriques lorsque les conditions de normalité sont remplies. La perte de puissance est d'environ 5 % dans le pire des cas (efficacité de Pitman ≈ 0,95).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Tests non paramétriques = pas d'hypothèse de normalité, basés sur les rangs. Utilisés si n < 30, distribution non normale, variables ordinales ou valeurs aberrantes. Légèrement moins puissants si la normalité est vérifiée.</p></div>`
    },
    {
      title: "Test de Mann-Whitney (Wilcoxon rang-somme)",
      content: `<p class="mb-3">Le <strong>test de Mann-Whitney</strong> (aussi appelé test de Wilcoxon à somme de rangs, ou test U) est l'équivalent non paramétrique du <strong>test t de Student pour échantillons indépendants</strong>.</p>
<p class="mb-3"><strong>Hypothèses</strong> : H₀ : les distributions des deux groupes sont identiques. H₁ : les distributions diffèrent (localisation).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Principe</strong> : on classe toutes les observations (des deux groupes confondus) par rang, puis on somme les rangs dans chaque groupe. Si les groupes ont la même distribution, les sommes de rangs devraient être équilibrées.</li>
<li><strong>Statistique U</strong> : pour chaque paire d'observations (une de chaque groupe), U compte le nombre de fois où l'observation du groupe 1 est supérieure à celle du groupe 2.</li>
<li><strong>Conditions</strong> : données au moins ordinales, échantillons indépendants, distributions de même forme (seule la localisation diffère). Si n₁ et n₂ ≥ 20, approximation normale possible.</li>
<li><strong>Résultat</strong> : souvent présenté avec la médiane et l'intervalle interquartile (IQR) dans chaque groupe plutôt que la moyenne et l'écart-type.</li>
</ul>
<p class="mb-3">En cas d'<strong>ex-aequo</strong> (valeurs identiques), on attribue le rang moyen. Beaucoup d'ex-aequo réduisent la puissance du test.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Mann-Whitney = test t non paramétrique pour 2 groupes indépendants. Basé sur les rangs. Présenter médiane [IQR] plutôt que moyenne ± ET. Attention aux ex-aequo.</p></div>`
    },
    {
      title: "Test de Wilcoxon signé et test des signes",
      content: `<p class="mb-3">Le <strong>test de Wilcoxon signé</strong> (signed-rank test) est l'équivalent non paramétrique du <strong>test t pour échantillons appariés</strong>. Il compare deux mesures appariées (avant/après, jumeau 1/jumeau 2, même patient sous deux conditions).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Principe</strong> : on calcule les différences dᵢ = X₂ᵢ − X₁ᵢ pour chaque paire, on classe les |dᵢ| par rang, puis on somme séparément les rangs des différences positives (T+) et négatives (T−). Sous H₀ (pas de différence), T+ et T− devraient être équilibrés.</li>
<li><strong>Conditions</strong> : les différences doivent avoir une distribution symétrique (condition plus faible que la normalité). Les différences nulles sont exclues du test.</li>
<li><strong>Approximation normale</strong> : pour n ≥ 25 paires, la statistique de test peut être approchée par une loi normale.</li>
</ul>
<p class="mb-3">Le <strong>test des signes</strong> est encore plus simple : on compte simplement le nombre de différences positives et négatives (sans tenir compte de l'amplitude). C'est un test binomial sur la proportion de signes positifs (H₀ : proportion = 0,5). Il est moins puissant que le Wilcoxon signé car il n'utilise pas l'information sur l'amplitude des différences, mais il ne nécessite aucune hypothèse sur la forme de la distribution.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Wilcoxon signé = test t apparié non paramétrique (utilise rangs des différences). Test des signes = encore plus simple (ne compte que la direction). Wilcoxon signé est plus puissant que le test des signes.</p></div>`
    },
    {
      title: "Kruskal-Wallis et Friedman : comparaisons multiples",
      content: `<p class="mb-3">Lorsque l'on compare plus de deux groupes, les équivalents non paramétriques de l'ANOVA sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Test de Kruskal-Wallis</strong> : équivalent non paramétrique de l'<strong>ANOVA à un facteur</strong> pour k groupes indépendants (k ≥ 3). On classe toutes les observations par rang et on compare les rangs moyens entre groupes. H₀ : les k distributions sont identiques. La statistique H suit approximativement un χ² à (k − 1) ddl si les effectifs sont suffisants (≥ 5 par groupe).</li>
<li><strong>Comparaisons post-hoc</strong> : si le Kruskal-Wallis est significatif, les comparaisons deux à deux utilisent le test de Dunn (avec correction de Bonferroni ou Benjamini-Hochberg pour les comparaisons multiples).</li>
<li><strong>Test de Friedman</strong> : équivalent non paramétrique de l'<strong>ANOVA à mesures répétées</strong>. Pour k mesures appariées (ex. même patient à k temps différents). On classe les observations par rang au sein de chaque sujet.</li>
<li><strong>Comparaisons post-hoc de Friedman</strong> : test de Nemenyi pour les comparaisons deux à deux après un Friedman significatif.</li>
</ul>
<p class="mb-3">Ces tests n'indiquent que l'existence d'une différence globale entre les groupes, pas quels groupes diffèrent entre eux. Les tests post-hoc sont indispensables pour identifier les paires significatives.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Kruskal-Wallis = ANOVA non paramétrique (k groupes indépendants). Friedman = ANOVA mesures répétées non paramétrique. Post-hoc avec Dunn (Kruskal-Wallis) ou Nemenyi (Friedman).</p></div>`
    },
    {
      title: "Corrélation de Spearman et tests de normalité",
      content: `<p class="mb-3">Le <strong>coefficient de corrélation de Spearman (rₛ)</strong> est l'équivalent non paramétrique du coefficient de Pearson. Il mesure la <strong>corrélation monotone</strong> (pas nécessairement linéaire) entre deux variables en utilisant les rangs.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Calcul</strong> : rₛ = coefficient de Pearson calculé sur les rangs des observations (et non sur les valeurs brutes).</li>
<li><strong>Interprétation</strong> : rₛ varie de −1 à +1. rₛ = 1 signifie une relation monotone croissante parfaite, rₛ = −1 une relation monotone décroissante parfaite. Contrairement à Pearson, Spearman détecte les relations non linéaires tant qu'elles sont monotones.</li>
<li><strong>Tau de Kendall (τ)</strong> : alternative à Spearman, basée sur les paires concordantes et discordantes. Plus robuste pour les petits échantillons et les ex-aequo, mais interprétation moins intuitive.</li>
</ul>
<p class="mb-3"><strong>Tests de normalité</strong> (pour décider entre tests paramétriques et non paramétriques) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Shapiro-Wilk</strong> : le test le plus puissant pour les petits échantillons (n < 50). H₀ : les données suivent une loi normale. Si p < 0,05, on rejette la normalité.</li>
<li><strong>Kolmogorov-Smirnov</strong> : compare la distribution empirique à la distribution théorique. Moins puissant que Shapiro-Wilk.</li>
<li><strong>Q-Q plot</strong> : représentation graphique. Si les points s'alignent sur la droite de référence, la distribution est approximativement normale. Méthode visuelle complémentaire des tests formels.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Spearman = corrélation non paramétrique (basée sur les rangs, détecte les relations monotones). Shapiro-Wilk = meilleur test de normalité pour petits échantillons. Q-Q plot = vérification graphique de la normalité.</p></div>`
    }
  ]
},

"biostats-multivariee": {
  introduction: "L'analyse multivariée regroupe l'ensemble des méthodes statistiques qui étudient simultanément l'effet de plusieurs variables explicatives sur une variable dépendante. Elle est indispensable en recherche clinique pour contrôler les facteurs de confusion et identifier les facteurs indépendamment associés à un résultat de santé.",
  readTime: 18,
  sections: [
    {
      title: "Principes et objectifs de l'analyse multivariée",
      content: `<p class="mb-3">L'analyse <strong>multivariée</strong> (ou analyse ajustée) permet d'étudier la relation entre une variable dépendante (Y, critère de jugement) et plusieurs variables explicatives (X₁, X₂, ..., Xₚ) simultanément. Elle répond à deux objectifs majeurs :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Contrôle de la confusion</strong> : en incluant les facteurs de confusion dans le modèle, on obtient l'effet ajusté (indépendant) de chaque variable. Un facteur de confusion est une variable liée à la fois à l'exposition et à l'issue, et qui n'est pas sur le chemin causal.</li>
<li><strong>Identification des facteurs pronostiques indépendants</strong> : parmi plusieurs variables candidates, l'analyse multivariée identifie celles qui sont significativement et indépendamment associées à l'issue.</li>
</ul>
<p class="mb-3">La distinction fondamentale entre analyse <strong>univariée</strong> et <strong>multivariée</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Univariée (brute)</strong> : étudie la relation entre Y et une seule variable X à la fois. Les résultats peuvent être confondus par d'autres variables.</li>
<li><strong>Multivariée (ajustée)</strong> : étudie la relation entre Y et X₁ tout en maintenant X₂, X₃, ... constants. L'effet de X₁ est ajusté sur les autres covariables.</li>
</ul>
<p class="mb-3">Le choix du modèle multivariée dépend de la nature de la variable dépendante Y et de la structure des données. C'est la première question à se poser avant toute analyse.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'analyse multivariée contrôle la confusion en ajustant sur les covariables. L'effet ajusté est l'effet indépendant d'une variable, toutes les autres étant maintenues constantes.</p></div>`
    },
    {
      title: "Choix du modèle selon la nature de Y",
      content: `<p class="mb-3">Le choix du modèle de régression multivariée dépend directement de la <strong>nature de la variable dépendante Y</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Y continue</strong> (pression artérielle, glycémie, poids) → <strong>Régression linéaire multiple</strong>. Coefficient β = variation de Y pour une augmentation d'une unité de X, ajusté. Mesure d'association : coefficient β et son IC.</li>
<li><strong>Y binaire</strong> (0/1 : malade/sain, décès/survie) → <strong>Régression logistique</strong>. Mesure d'association : <strong>OR ajusté</strong> = exp(β). OR > 1 = facteur de risque, OR < 1 = facteur protecteur.</li>
<li><strong>Y = temps jusqu'à un événement</strong> (survie) → <strong>Modèle de Cox</strong>. Mesure d'association : <strong>HR ajusté</strong> = exp(β). HR > 1 = surrisque, HR < 1 = protecteur.</li>
<li><strong>Y = comptage</strong> (nombre d'événements) → <strong>Régression de Poisson</strong>. Mesure d'association : <strong>IRR</strong> (Incidence Rate Ratio) = exp(β). Si surdispersion : binomiale négative.</li>
<li><strong>Y ordinale</strong> (stade I/II/III/IV) → <strong>Régression logistique ordinale</strong>. Hypothèse des odds proportionnels.</li>
<li><strong>Y nominale à k catégories</strong> → <strong>Régression logistique multinomiale</strong>.</li>
</ul>
<p class="mb-3">Quel que soit le modèle, l'interprétation est similaire : chaque coefficient β représente l'effet ajusté de la variable correspondante, et exp(β) donne la mesure d'association (OR, HR, IRR) pour les modèles à lien logarithmique.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Y continue → linéaire (β). Y binaire → logistique (OR = exp(β)). Y survie → Cox (HR = exp(β)). Y comptage → Poisson (IRR = exp(β)). Le choix du modèle est dicté par la nature de Y.</p></div>`
    },
    {
      title: "Sélection des variables et construction du modèle",
      content: `<p class="mb-3">La <strong>sélection des variables</strong> à inclure dans le modèle multivariée est une étape cruciale. Plusieurs stratégies existent :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Sélection sur critères cliniques</strong> : inclusion a priori des variables identifiées comme facteurs de confusion ou de risque dans la littérature. C'est la méthode la plus recommandée car elle repose sur les connaissances médicales.</li>
<li><strong>Sélection ascendante (forward)</strong> : on part du modèle vide et on ajoute les variables une par une (la plus significative d'abord). Simple mais peut manquer des effets importants.</li>
<li><strong>Sélection descendante (backward)</strong> : on part du modèle complet et on retire les variables non significatives une par une. Généralement préférée car elle considère l'effet ajusté de chaque variable.</li>
<li><strong>Pas-à-pas (stepwise)</strong> : combinaison des deux méthodes. À chaque étape, on peut ajouter ou retirer une variable.</li>
<li><strong>Critères d'information</strong> : AIC (Akaike Information Criterion) et BIC (Bayesian IC) pénalisent la complexité du modèle. On choisit le modèle qui minimise AIC ou BIC. BIC pénalise plus les modèles complexes que AIC.</li>
</ul>
<p class="mb-3"><strong>Règle pratique</strong> : en régression logistique, il faut au moins <strong>10 événements par variable explicative</strong> (EPV, events per variable) pour que les estimations soient stables. En régression linéaire, il faut au moins 10-15 observations par variable.</p>
<p class="mb-3">Il faut toujours vérifier l'absence de <strong>multicolinéarité</strong> (corrélation élevée entre variables explicatives) par le VIF (Variance Inflation Factor). Un VIF > 5-10 est problématique.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La sélection des variables doit être guidée par les connaissances cliniques, pas uniquement par les p-values. Règle du 10 EPV en logistique. VIF > 5 = multicolinéarité. AIC/BIC comparent les modèles.</p></div>`
    },
    {
      title: "Confusion et interaction (modification d'effet)",
      content: `<p class="mb-3">Deux concepts fondamentaux doivent être distingués en analyse multivariée : la <strong>confusion</strong> et l'<strong>interaction</strong>.</p>
<p class="mb-3"><strong>Confusion</strong> : un facteur de confusion biaise l'estimation de la relation entre exposition et issue. Pour être un facteur de confusion, une variable doit : (1) être associée à l'exposition, (2) être associée à l'issue, (3) ne pas être sur le chemin causal. Le contrôle se fait par ajustement dans le modèle multivariée. En pratique, si l'ajustement modifie le coefficient de plus de 10 %, la variable est considérée comme un facteur de confusion.</p>
<p class="mb-3"><strong>Interaction (modification d'effet)</strong> : l'effet d'une variable X₁ sur Y dépend du niveau d'une autre variable X₂. On teste l'interaction en ajoutant un <strong>terme produit</strong> X₁ × X₂ dans le modèle :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Y = β₀ + β₁X₁ + β₂X₂ + β₃(X₁ × X₂) + ε</li>
<li>Si β₃ est significatif, il y a interaction : l'effet de X₁ est différent selon les strates de X₂.</li>
<li>En cas d'interaction significative, on ne doit pas présenter un effet global mais des effets stratifiés (effet de X₁ chez X₂ = 0 et chez X₂ = 1 séparément).</li>
</ul>
<p class="mb-3"><strong>Confusion ≠ Interaction</strong> : la confusion est un biais qu'on corrige (ajustement), l'interaction est un phénomène biologique qu'on rapporte (stratification). On ajuste pour la confusion, on stratifie pour l'interaction.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Confusion = biais corrigé par ajustement (modification > 10 % du coefficient). Interaction = modification d'effet testée par un terme produit X₁ × X₂. On ajuste pour la confusion, on stratifie pour l'interaction.</p></div>`
    },
    {
      title: "Analyse en composantes principales et réduction dimensionnelle",
      content: `<p class="mb-3">Lorsque le nombre de variables est très élevé (données omiques, questionnaires longs), des méthodes de <strong>réduction de dimension</strong> sont nécessaires avant ou à la place de la régression classique.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Analyse en composantes principales (ACP)</strong> : transforme p variables corrélées en k composantes principales non corrélées (k << p). Chaque composante est une combinaison linéaire des variables originales. Les premières composantes expliquent le maximum de variance. Le graphique des éboulis (scree plot) aide à choisir le nombre de composantes à retenir.</li>
<li><strong>Analyse factorielle</strong> : similaire à l'ACP mais cherche des facteurs latents qui expliquent les corrélations entre variables observées. Utilisée pour valider des questionnaires (structure factorielle).</li>
<li><strong>Analyse de correspondances (AFC)</strong> : pour les tableaux de contingence (variables qualitatives). Visualise les associations entre modalités de variables qualitatives.</li>
<li><strong>Classification hiérarchique (clustering)</strong> : regroupe les individus en classes homogènes sans hypothèse a priori. Dendrogramme pour visualiser les regroupements.</li>
</ul>
<p class="mb-3">Ces méthodes sont <strong>exploratoires</strong> (génération d'hypothèses) et non confirmatoires. Elles sont utilisées en recherche génomique, en pharmacologie (classification de médicaments), et pour la construction de scores composites.</p>
<p class="mb-3">En contexte de <strong>big data médical</strong>, des méthodes de machine learning (forêts aléatoires, LASSO, elastic net) complètent les approches classiques pour la sélection de variables et la prédiction.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'ACP réduit p variables corrélées en k composantes non corrélées. Méthode exploratoire pour les données de grande dimension. Le scree plot guide le choix du nombre de composantes.</p></div>`
    }
  ]
},

"biostats-descriptives-avancees": {
  introduction: "Les statistiques descriptives avancées approfondissent les outils de description des données en santé. Elles permettent de caractériser finement les distributions, de détecter les valeurs atypiques et de choisir les paramètres adaptés au type de données, compétences essentielles pour interpréter correctement les résultats en recherche biomédicale.",
  readTime: 18,
  sections: [
    {
      title: "Paramètres de position avancés et statistiques d'ordre",
      content: `<p class="mb-3">Au-delà de la moyenne, de la médiane et du mode, les <strong>statistiques d'ordre</strong> (ou quantiles) permettent de décrire finement la position des observations dans une distribution :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Quartiles (Q1, Q2, Q3)</strong> : divisent la distribution en 4 parts égales. Q1 = 25e percentile, Q2 = médiane = 50e percentile, Q3 = 75e percentile. L'intervalle interquartile IQR = Q3 − Q1 contient 50 % des observations centrales.</li>
<li><strong>Déciles (D1 à D9)</strong> : divisent en 10 parts égales. Utilisés en pharmacologie (déciles de dose) et en épidémiologie (déciles de revenus).</li>
<li><strong>Centiles (C1 à C99) ou percentiles</strong> : divisent en 100 parts égales. Fondamentaux en <strong>pédiatrie</strong> (courbes de croissance : un enfant au 75e percentile de poids signifie que 75 % des enfants de même âge et sexe pèsent moins).</li>
<li><strong>Moyenne tronquée (trimmed mean)</strong> : on retire un pourcentage des valeurs extrêmes (ex. 5 % de chaque côté) avant de calculer la moyenne. Compromis entre la sensibilité de la moyenne et la robustesse de la médiane.</li>
</ul>
<p class="mb-3">Le choix du paramètre de position dépend de la distribution : la <strong>moyenne</strong> est adaptée aux distributions symétriques, la <strong>médiane</strong> aux distributions asymétriques ou en présence de valeurs aberrantes. En cas de doute, rapporter les deux.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les percentiles sont essentiels en pédiatrie (courbes de croissance). La médiane est préférée à la moyenne pour les distributions asymétriques. La moyenne tronquée est un compromis robuste.</p></div>`
    },
    {
      title: "Paramètres de dispersion avancés et coefficient de variation",
      content: `<p class="mb-3">Les paramètres de dispersion quantifient la variabilité des données autour de la tendance centrale. Plusieurs indicateurs avancés complètent l'écart-type :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Variance (s²)</strong> : moyenne des carrés des écarts à la moyenne. Formule échantillonnale : s² = Σ(xi − x̄)² / (n − 1). On divise par (n − 1) et non par n pour obtenir un estimateur <strong>sans biais</strong> (correction de Bessel).</li>
<li><strong>Écart-type (s)</strong> : racine carrée de la variance. Même unité que la variable, donc plus interprétable. Pour une loi normale : 68 % des valeurs dans [x̄ ± s], 95 % dans [x̄ ± 2s], 99,7 % dans [x̄ ± 3s].</li>
<li><strong>Coefficient de variation (CV)</strong> : CV = (s / x̄) × 100 %. Mesure de dispersion <strong>relative</strong>, sans unité. Permet de comparer la dispersion entre des variables d'unités ou d'ordres de grandeur différents (ex. comparer la variabilité de la glycémie et celle du cholestérol).</li>
<li><strong>Écart absolu médian (MAD)</strong> : médiane des valeurs absolues des écarts à la médiane. Très robuste aux valeurs extrêmes. MAD = médiane(|xi − médiane(x)|).</li>
<li><strong>Étendue interquartile (IQR)</strong> : Q3 − Q1. Mesure de dispersion robuste, base de la détection des outliers dans les box-plots.</li>
</ul>
<p class="mb-3">En biologie médicale, le CV est utilisé pour évaluer la <strong>reproductibilité analytique</strong> d'un dosage (CV intra-essai et CV inter-essai). Un CV < 5 % est généralement considéré comme acceptable pour un dosage biologique.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : On divise par (n − 1) pour la variance échantillonnale (correction de Bessel). Le CV permet de comparer la dispersion entre variables d'unités différentes. CV < 5 % = bonne reproductibilité analytique.</p></div>`
    },
    {
      title: "Paramètres de forme : asymétrie et aplatissement",
      content: `<p class="mb-3">Les paramètres de forme caractérisent la <strong>silhouette</strong> de la distribution au-delà de sa position et de sa dispersion :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Coefficient d'asymétrie (skewness, γ₁)</strong> : mesure la symétrie de la distribution.
  <ul class="list-disc pl-6 mt-1 space-y-1">
  <li>γ₁ = 0 : distribution symétrique (comme la loi normale).</li>
  <li>γ₁ > 0 : asymétrie positive (queue étalée à droite). La moyenne est tirée vers la droite : mode < médiane < moyenne. Exemple : durées de séjour hospitalier, revenus.</li>
  <li>γ₁ < 0 : asymétrie négative (queue étalée à gauche). Moyenne < médiane < mode. Plus rare en médecine.</li>
  </ul>
</li>
<li><strong>Coefficient d'aplatissement (kurtosis, γ₂)</strong> : mesure l'épaisseur des queues par rapport à la loi normale.
  <ul class="list-disc pl-6 mt-1 space-y-1">
  <li>γ₂ = 0 : mésocurtique (comme la loi normale).</li>
  <li>γ₂ > 0 : leptocurtique (queues épaisses, pic pointu). Plus de valeurs extrêmes qu'attendu.</li>
  <li>γ₂ < 0 : platycurtique (queues fines, pic aplati).</li>
  </ul>
</li>
</ul>
<p class="mb-3">En pratique, la <strong>transformation logarithmique</strong> est souvent utilisée pour symétriser les distributions asymétriques à droite (fréquentes en biologie : concentrations, durées). Après transformation, on peut appliquer les tests paramétriques. La moyenne géométrique (exp(moyenne des log)) est alors la mesure de tendance centrale adaptée.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Skewness > 0 = queue à droite (mode < médiane < moyenne), fréquent en médecine. La transformation log symétrises ces distributions. Kurtosis mesure l'épaisseur des queues (leptocurtique = queues épaisses).</p></div>`
    },
    {
      title: "Détection des valeurs aberrantes (outliers)",
      content: `<p class="mb-3">Les <strong>valeurs aberrantes</strong> (outliers) sont des observations qui s'écartent notablement du reste des données. Leur détection est essentielle car elles peuvent résulter d'erreurs de mesure ou de saisie, ou représenter de véritables observations biologiques extrêmes.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Méthode du box-plot (Tukey)</strong> : une observation est considérée comme aberrante si elle est en dehors des barrières :
  <ul class="list-disc pl-6 mt-1 space-y-1">
  <li>Outlier modéré : valeur < Q1 − 1,5 × IQR ou > Q3 + 1,5 × IQR.</li>
  <li>Outlier extrême : valeur < Q1 − 3 × IQR ou > Q3 + 3 × IQR.</li>
  </ul>
</li>
<li><strong>Méthode des z-scores</strong> : z = (xi − x̄) / s. Une observation avec |z| > 2 ou 3 est suspecte. Sensible aux outliers eux-mêmes (car x̄ et s en sont affectés).</li>
<li><strong>Test de Grubbs</strong> : test statistique formel pour détecter un unique outlier dans un échantillon normalement distribué.</li>
<li><strong>Distance de Mahalanobis</strong> : pour les données multivariées, mesure la distance d'une observation au centre de la distribution en tenant compte des corrélations.</li>
</ul>
<p class="mb-3"><strong>Conduite à tenir</strong> devant un outlier : (1) vérifier si c'est une erreur de saisie ou de mesure (corriger ou supprimer), (2) si c'est une vraie valeur, analyser les résultats avec et sans l'outlier pour évaluer son influence, (3) ne jamais supprimer un outlier uniquement parce qu'il est gênant pour l'analyse. Documenter toute exclusion dans le protocole.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Outlier par box-plot : valeur hors [Q1 − 1,5 IQR ; Q3 + 1,5 IQR]. Toujours vérifier si c'est une erreur avant de supprimer. Analyser avec et sans l'outlier pour évaluer son impact.</p></div>`
    },
    {
      title: "Description bivariée et tableaux croisés",
      content: `<p class="mb-3">La <strong>description bivariée</strong> étudie la relation entre deux variables simultanément, avant toute analyse inférentielle. Le choix de la méthode dépend de la nature des deux variables :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Deux variables quantitatives</strong> : nuage de points (scatter plot) pour visualiser la relation, coefficient de corrélation de Pearson (r) pour quantifier la relation linéaire (−1 ≤ r ≤ +1). Attention : corrélation ne signifie pas causalité.</li>
<li><strong>Deux variables qualitatives</strong> : tableau de contingence (tableau croisé). On y lit les effectifs observés, les fréquences en ligne et en colonne. Le test du Chi-deux teste l'indépendance.</li>
<li><strong>Une variable quantitative et une qualitative</strong> : on compare les distributions de la variable quantitative entre les groupes définis par la variable qualitative. Représentation : box-plots côte à côte. Description : moyenne ± écart-type (ou médiane [Q1-Q3]) par groupe.</li>
</ul>
<p class="mb-3">La <strong>présentation standardisée des caractéristiques de base</strong> (Tableau 1 d'un article) est un élément fondamental de tout article scientifique. Il décrit les variables par groupe (traitement/contrôle) avec les paramètres adaptés : moyenne ± ET pour les variables normales, médiane [IQR] pour les non normales, n (%) pour les qualitatives.</p>
<p class="mb-3">La <strong>comparabilité des groupes</strong> à l'inclusion (dans un essai randomisé) se juge visuellement sur le Tableau 1. Contrairement à une pratique répandue, il n'est pas recommandé de faire des tests statistiques pour comparer les groupes à l'inclusion dans un essai randomisé (les différences sont dues au hasard par définition).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le Tableau 1 décrit les caractéristiques de base par groupe. Variables normales : moyenne ± ET. Non normales : médiane [IQR]. Qualitatives : n (%). Pas de test statistique pour comparer les groupes à l'inclusion d'un essai randomisé.</p></div>`
    }
  ]
},

"biostats-graphiques": {
  introduction: "Les représentations graphiques sont essentielles en biostatistiques pour explorer, résumer et communiquer les données. Le choix du graphique approprié dépend du type de variable et de l'objectif de l'analyse.",
  readTime: 16,
  sections: [
    {
      title: "Graphiques pour variables quantitatives",
      content: `<p class="mb-3">Les variables quantitatives disposent d'un large éventail de représentations graphiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Histogramme</strong> : rectangles jointifs dont l'aire est proportionnelle à la fréquence de chaque classe. Si les classes sont d'amplitudes inégales, on porte la densité de fréquence en ordonnée.</li>
<li><strong>Box-plot (boîte à moustaches)</strong> : résumé montrant la médiane, Q1, Q3 (boîte), moustaches (1,5 × IQR). Les points au-delà sont des outliers. Idéal pour comparer des groupes.</li>
<li><strong>Diagramme en bâtons</strong> : pour les variables discrètes, traits verticaux dont la hauteur correspond à l'effectif de chaque valeur.</li>
<li><strong>Nuage de points (scatter plot)</strong> : représente la relation entre deux variables quantitatives. La superposition d'une droite de régression visualise la tendance.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'histogramme utilise des rectangles jointifs (variable continue) tandis que le diagramme en barres utilise des barres séparées (variable qualitative). Le box-plot est l'outil de choix pour comparer visuellement les distributions entre groupes.</p></div>`
    },
    {
      title: "Graphiques pour variables qualitatives",
      content: `<p class="mb-3">Les variables qualitatives nécessitent des représentations adaptées à leur nature catégorielle :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Diagramme en barres</strong> : barres séparées dont la hauteur représente l'effectif ou la fréquence. Barres groupées pour comparer des sous-groupes.</li>
<li><strong>Diagramme circulaire (camembert)</strong> : secteurs proportionnels aux fréquences. Limité à 5-6 modalités maximum. Déconseillé pour les comparaisons précises.</li>
<li><strong>Diagramme en barres empilées</strong> : représente les proportions de sous-catégories au sein de chaque groupe, utile pour visualiser les tableaux de contingence.</li>
<li><strong>Diagramme en mosaïque</strong> : représente les fréquences conjointes de deux variables qualitatives par des rectangles dont l'aire est proportionnelle à la fréquence.</li>
</ul>
<p class="mb-3">En pratique médicale, les diagrammes en barres sont toujours préférés aux camemberts car ils permettent une comparaison visuelle plus précise.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le diagramme en barres est toujours préféré au camembert pour la comparaison de proportions. Les barres groupées ou empilées ajoutent une dimension à l'analyse.</p></div>`
    },
    {
      title: "Graphiques spécialisés en épidémiologie",
      content: `<p class="mb-3">L'épidémiologie et la recherche clinique utilisent des graphiques spécifiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Courbe de Kaplan-Meier</strong> : fonction de survie au cours du temps. Courbe en escalier descendante partant de 1. Les censures sont marquées par des croix. Comparaison par le test du log-rank.</li>
<li><strong>Forest plot</strong> : en méta-analyse, chaque étude est représentée par un carré (effet) et son IC 95 %. Le losange en bas = effet combiné. Ligne verticale à 1 = absence d'effet.</li>
<li><strong>Funnel plot</strong> : détecte le biais de publication. Abscisse : effet estimé. Ordonnée : précision. Asymétrie = biais suspecté.</li>
<li><strong>Courbe ROC</strong> : sensibilité en fonction de (1 - spécificité). L'AUC quantifie la performance du test diagnostique (0,5 = hasard, 1 = parfait).</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Forest plot = méta-analyse (losange = effet combiné). Funnel plot = biais de publication. Kaplan-Meier = survie (log-rank pour comparer).</p></div>`
    },
    {
      title: "Graphiques de concordance et vérification d'hypothèses",
      content: `<p class="mb-3">Plusieurs graphiques évaluent la concordance ou la validité des hypothèses statistiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Diagramme de Bland-Altman</strong> : concordance entre deux méthodes de mesure. Abscisse : moyenne des deux mesures. Ordonnée : différence. Limites d'agrément = biais ± 1,96 × ET des différences.</li>
<li><strong>Q-Q plot</strong> : compare la distribution observée à une loi théorique (souvent normale). Points alignés sur la diagonale = distribution compatible.</li>
<li><strong>Graphique des résidus</strong> : en régression, résidus tracés vs valeurs prédites. Répartition aléatoire autour de zéro = linéarité et homoscédasticité validées.</li>
<li><strong>Courbe cumulative (ogive de Galton)</strong> : fréquences cumulées permettant de lire graphiquement la médiane et les quartiles.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Bland-Altman = gold standard pour la concordance entre deux méthodes de mesure quantitative. Q-Q plot = vérification visuelle de la normalité.</p></div>`
    },
    {
      title: "Bonnes pratiques de visualisation des données",
      content: `<p class="mb-3">La qualité d'un graphique repose sur des règles fondamentales :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Choix adapté</strong> : le graphique doit correspondre au type de variable et à l'objectif (distribution, comparaison, corrélation, évolution temporelle).</li>
<li><strong>Axes étiquetés</strong> : titre, unités, échelle lisible. L'ordonnée doit généralement partir de zéro pour éviter de surestimer les différences.</li>
<li><strong>Représentation de l'incertitude</strong> : toujours ajouter barres d'erreur (IC 95 % ou ET) pour montrer la précision des estimations.</li>
<li><strong>Rapport données/encre (Tufte)</strong> : maximiser l'information, éviter le chartjunk (décorations inutiles). Préférer le 2D au 3D.</li>
<li><strong>Lisibilité</strong> : légende claire, couleurs contrastées adaptées aux daltoniens, taille de police suffisante.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Un bon graphique est simple, honnête et informatif. Toujours étiqueter les axes, commencer l'ordonnée à zéro et ajouter les barres d'erreur.</p></div>`
    }
  ]
},

"biostats-indices-avances": {
  introduction: "Les indices avancés permettent de quantifier les risques, les bénéfices thérapeutiques et la concordance entre observateurs ou méthodes de mesure. Ils sont essentiels pour l'interprétation des essais cliniques.",
  readTime: 16,
  sections: [
    {
      title: "NNT et NNH : quantifier le bénéfice thérapeutique",
      content: `<p class="mb-3">Le <strong>NNT (Number Needed to Treat)</strong> quantifie le nombre de patients qu'il faut traiter pour éviter un événement défavorable supplémentaire par rapport au groupe contrôle :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>NNT = 1 / RAR</strong> (Réduction Absolue du Risque), où RAR = risque contrôle − risque traité.</li>
<li>Un NNT petit (ex. 5) indique un traitement très efficace. Un NNT de 100 signifie qu'il faut traiter 100 patients pour en bénéficier à un seul.</li>
<li>Le NNT dépend du risque de base : plus le risque est élevé, plus le NNT est petit (même RRR).</li>
</ul>
<p class="mb-3">Le <strong>NNH (Number Needed to Harm)</strong> = 1 / augmentation absolue du risque d'effets indésirables. Il quantifie le risque d'effets secondaires. Le rapport NNT/NNH aide à évaluer la balance bénéfice/risque.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : NNT = 1/RAR. Plus le NNT est petit, plus le traitement est efficace. Le NNT dépend du risque de base : un même RRR donne un NNT plus petit chez les patients à haut risque.</p></div>`
    },
    {
      title: "Corrélation linéaire de Pearson",
      content: `<p class="mb-3">Le <strong>coefficient de corrélation de Pearson (r)</strong> mesure l'intensité et le sens de la relation linéaire entre deux variables quantitatives continues :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>r varie de −1 (corrélation négative parfaite) à +1 (corrélation positive parfaite). r = 0 : absence de corrélation linéaire.</li>
<li>Le <strong>coefficient de détermination R²</strong> = r² représente la proportion de variance de Y expliquée par X. Ex. : r = 0,7 → R² = 0,49 → X explique 49 % de la variabilité de Y.</li>
<li>Conditions d'utilisation : variables quantitatives continues, relation linéaire, distribution bivariée normale, absence de valeurs extrêmes.</li>
</ul>
<p class="mb-3"><strong>Corrélation ≠ causalité</strong> : deux variables peuvent être corrélées sans qu'il y ait de lien causal (facteur de confusion, causalité inverse). Le <strong>coefficient de Spearman</strong> (ρ) est l'alternative non paramétrique, basée sur les rangs.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : r de Pearson mesure la corrélation linéaire. R² = proportion de variance expliquée. Corrélation ≠ causalité (piège classique). Spearman = alternative non paramétrique.</p></div>`
    },
    {
      title: "Concordance inter-observateurs : Kappa de Cohen",
      content: `<p class="mb-3">Le <strong>coefficient Kappa (κ) de Cohen</strong> mesure la concordance entre deux observateurs pour une variable qualitative, en corrigeant l'accord dû au hasard :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>κ = (Po − Pe) / (1 − Pe)</strong>, où Po = proportion d'accords observés et Pe = proportion d'accords attendus par le hasard.</li>
<li>Interprétation : κ < 0,2 = faible ; 0,2-0,4 = modéré ; 0,4-0,6 = bon ; 0,6-0,8 = très bon ; > 0,8 = excellent.</li>
<li>Le Kappa pondéré s'applique aux variables ordinales (il pénalise plus les désaccords éloignés).</li>
<li>Le Kappa de Fleiss généralise à plus de 2 observateurs.</li>
</ul>
<p class="mb-3">Le Kappa peut être artificiellement bas quand la prévalence est très déséquilibrée (paradoxe de Kappa). Dans ce cas, on interprète aussi les indices de Kappa positif et négatif séparément.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : κ = (Po − Pe)/(1 − Pe). κ > 0,8 = concordance excellente. Le Kappa corrige l'accord dû au hasard, contrairement au simple pourcentage d'accord.</p></div>`
    },
    {
      title: "ICC et concordance pour variables quantitatives",
      content: `<p class="mb-3">Le <strong>coefficient de corrélation intraclasse (ICC)</strong> évalue la reproductibilité de mesures quantitatives réalisées par différents observateurs ou à différents moments :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>L'ICC varie de 0 (aucune reproductibilité) à 1 (reproductibilité parfaite). Interprétation similaire au Kappa.</li>
<li>Plusieurs modèles existent selon le design : ICC(1,1), ICC(2,1), ICC(3,1). Le choix dépend de si les observateurs sont fixes ou aléatoires.</li>
<li>Le <strong>coefficient de variation (CV)</strong> intra-individuel = (ET intra / moyenne) × 100, mesure la précision des mesures répétées.</li>
</ul>
<p class="mb-3">Le <strong>diagramme de Bland-Altman</strong> complète l'ICC en visualisant les différences entre deux méthodes : il trace la différence (Y1 − Y2) en fonction de la moyenne (Y1 + Y2)/2, avec les limites d'agrément à ± 1,96 ET.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'ICC évalue la reproductibilité des mesures quantitatives. Le Bland-Altman visualise les différences entre deux méthodes avec limites d'agrément = biais ± 1,96 ET.</p></div>`
    },
    {
      title: "Autres indices avancés en recherche clinique",
      content: `<p class="mb-3">Plusieurs indices complémentaires sont utilisés en recherche clinique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Fraction attribuable (FA)</strong> : proportion de cas qui serait évitée si l'exposition était supprimée. FA = (RR − 1) / RR chez les exposés.</li>
<li><strong>Fraction préventive</strong> : chez les exposés à un facteur protecteur, FP = 1 − RR.</li>
<li><strong>Indice de Youden</strong> : J = Se + Sp − 1, synthétise les performances d'un test diagnostique en un seul chiffre (0 = inutile, 1 = parfait). Utilisé pour choisir le seuil optimal sur la courbe ROC.</li>
<li><strong>Rapports de vraisemblance</strong> : LR+ = Se / (1 − Sp), LR− = (1 − Se) / Sp. Un LR+ > 10 ou LR− < 0,1 modifie considérablement la probabilité post-test.</li>
<li><strong>E-value</strong> : mesure la robustesse d'une association face aux facteurs de confusion non mesurés.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Youden = Se + Sp − 1 (seuil optimal ROC). LR+ > 10 est très informatif. La fraction attribuable mesure l'impact de santé publique d'une exposition.</p></div>`
    }
  ]
},

"biostats-meta-analyse": {
  introduction: "La méta-analyse est le plus haut niveau de preuve en médecine fondée sur les preuves. Elle combine statistiquement les résultats de plusieurs études pour obtenir une estimation plus précise de l'effet d'une intervention.",
  readTime: 18,
  sections: [
    {
      title: "Principes et étapes de la méta-analyse",
      content: `<p class="mb-3">La méta-analyse est une méthode statistique qui combine quantitativement les résultats de plusieurs études indépendantes portant sur la même question de recherche. Elle fait partie de la <strong>revue systématique</strong> qui est le processus global d'identification et d'évaluation des études.</p>
<p class="mb-3">Les étapes sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Question PICO</strong> : Population, Intervention, Comparaison, Outcome (critère de jugement).</li>
<li><strong>Recherche exhaustive</strong> : PubMed, Cochrane, Embase, littérature grise, essais non publiés pour limiter le biais de publication.</li>
<li><strong>Sélection des études</strong> : critères d'inclusion/exclusion prédéfinis, diagramme PRISMA (flow chart).</li>
<li><strong>Évaluation de la qualité</strong> : outils standardisés (risque de biais Cochrane, échelle de Newcastle-Ottawa).</li>
<li><strong>Extraction et synthèse</strong> : extraction des données, choix du modèle statistique, calcul de l'effet combiné.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La méta-analyse suit un protocole rigoureux : question PICO → recherche exhaustive → sélection (PRISMA) → évaluation qualité → synthèse statistique.</p></div>`
    },
    {
      title: "Modèles à effets fixes et effets aléatoires",
      content: `<p class="mb-3">Le choix du modèle statistique dépend de l'hypothèse sur l'homogénéité des études :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Modèle à effets fixes</strong> : suppose que toutes les études estiment le même effet vrai. La variabilité entre études est uniquement due au hasard. Méthode de Mantel-Haenszel ou de Peto.</li>
<li><strong>Modèle à effets aléatoires</strong> : suppose que chaque étude estime un effet vrai différent (variabilité inter-études réelle). Méthode de DerSimonian et Laird. Donne des IC plus larges.</li>
</ul>
<p class="mb-3">La <strong>pondération</strong> de chaque étude est proportionnelle à l'inverse de sa variance (les études plus précises, souvent plus grandes, pèsent davantage). En effets aléatoires, la variance inter-études (τ²) est ajoutée.</p>
<p class="mb-3">En pratique, le modèle à effets aléatoires est le plus souvent utilisé car l'hypothèse d'homogénéité parfaite est rarement tenable en médecine.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Effets fixes = un seul effet vrai (études homogènes). Effets aléatoires = effets vrais variables entre études (IC plus larges). La pondération est inversement proportionnelle à la variance.</p></div>`
    },
    {
      title: "Hétérogénéité entre les études",
      content: `<p class="mb-3">L'<strong>hétérogénéité</strong> est la variabilité des résultats entre les études au-delà de ce que le hasard peut expliquer. C'est un concept central en méta-analyse.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Test Q de Cochran</strong> : teste l'hypothèse d'homogénéité (H0 : effets identiques). Mais faible puissance quand peu d'études.</li>
<li><strong>I² de Higgins</strong> : pourcentage de variabilité due à l'hétérogénéité vraie. I² = 0 % : pas d'hétérogénéité. I² 25-50 % : faible. 50-75 % : modérée. > 75 % : forte.</li>
<li><strong>τ² (tau carré)</strong> : variance inter-études en valeur absolue. Utilisé dans le modèle à effets aléatoires.</li>
</ul>
<p class="mb-3">Les sources d'hétérogénéité peuvent être cliniques (populations différentes), méthodologiques (designs variés) ou statistiques. Les <strong>analyses en sous-groupes</strong> et la <strong>méta-régression</strong> permettent d'explorer les causes de l'hétérogénéité.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : I² est l'indicateur le plus utilisé pour quantifier l'hétérogénéité. I² > 75 % = hétérogénéité forte, nécessitant des analyses en sous-groupes pour en comprendre les causes.</p></div>`
    },
    {
      title: "Forest plot et interprétation des résultats",
      content: `<p class="mb-3">Le <strong>forest plot</strong> est le graphique central de la méta-analyse. Il présente visuellement les résultats de chaque étude et l'estimation combinée :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Chaque étude est représentée par un <strong>carré</strong> (taille proportionnelle au poids de l'étude) et une <strong>ligne horizontale</strong> (IC 95 %).</li>
<li>La <strong>ligne verticale à 1</strong> (pour OR/RR) ou à 0 (pour différence de moyennes) = absence d'effet. Si l'IC d'une étude croise cette ligne, l'effet n'est pas significatif.</li>
<li>Le <strong>losange</strong> en bas = estimation combinée. Sa largeur = IC 95 %. S'il ne croise pas la ligne d'absence d'effet, le résultat est statistiquement significatif.</li>
<li>Le test d'hétérogénéité (Q, I²) et le test global (Z, p) sont indiqués en bas du graphique.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Sur un forest plot, la taille du carré reflète le poids de l'étude. Le losange = effet combiné. Si le losange ne croise pas la ligne à 1 (ou 0), l'effet est significatif.</p></div>`
    },
    {
      title: "Biais de publication et funnel plot",
      content: `<p class="mb-3">Le <strong>biais de publication</strong> est la tendance à publier préférentiellement les études avec des résultats positifs ou significatifs. Il constitue une menace majeure pour la validité des méta-analyses.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Funnel plot</strong> : graphique en entonnoir avec en abscisse l'effet estimé et en ordonnée une mesure de précision (souvent l'erreur standard). En l'absence de biais, les points forment un entonnoir symétrique. Une <strong>asymétrie</strong> suggère un biais de publication.</li>
<li><strong>Test d'Egger</strong> : test statistique d'asymétrie du funnel plot (régression linéaire). Un p < 0,10 suggère un biais.</li>
<li><strong>Méthode trim and fill</strong> : estime le nombre d'études manquantes et recalcule l'effet combiné en les imputant.</li>
<li><strong>Fail-safe N de Rosenthal</strong> : nombre d'études non significatives qu'il faudrait ajouter pour rendre le résultat global non significatif.</li>
</ul>
<p class="mb-3">Pour limiter le biais de publication : rechercher la littérature grise, consulter les registres d'essais (ClinicalTrials.gov), contacter les auteurs.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le funnel plot détecte visuellement le biais de publication (asymétrie = biais suspecté). Le test d'Egger le confirme statistiquement. L'enregistrement des essais réduit ce biais.</p></div>`
    }
  ]
},

"biostats-protocole-essai": {
  introduction: "Le protocole est le document fondateur d'un essai clinique. Il définit la méthodologie, les analyses planifiées et les aspects réglementaires avant le début de l'étude.",
  readTime: 16,
  sections: [
    {
      title: "Structure et contenu du protocole",
      content: `<p class="mb-3">Le protocole d'un essai clinique est un document détaillé comprenant les éléments suivants :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Objectif principal</strong> : unique, clairement défini, avec le critère de jugement principal associé.</li>
<li><strong>Schéma d'étude</strong> : essai contrôlé randomisé, en parallèle ou en cross-over, simple ou double aveugle.</li>
<li><strong>Population</strong> : critères d'inclusion et d'exclusion précis, définissant la population cible.</li>
<li><strong>Interventions</strong> : description détaillée du traitement et du comparateur (placebo ou traitement actif).</li>
<li><strong>Critères de jugement</strong> : principal (unique, défini a priori) et secondaires. Variables et méthodes de mesure.</li>
<li><strong>Calcul du nombre de sujets nécessaires (NSN)</strong> : basé sur le risque α, la puissance (1−β), l'effet attendu et la variabilité.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Le critère de jugement principal est unique et défini a priori. Tout changement après le début de l'essai compromet la validité des résultats (biais de publication sélective).</p></div>`
    },
    {
      title: "Calcul du nombre de sujets nécessaires",
      content: `<p class="mb-3">Le <strong>NSN (Nombre de Sujets Nécessaires)</strong> détermine la taille de l'échantillon requise pour démontrer un effet avec une puissance statistique suffisante :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Risque α</strong> (erreur de type I) : probabilité de conclure à tort à un effet (faux positif). Habituellement fixé à 5 %.</li>
<li><strong>Puissance 1−β</strong> (avec β = erreur de type II) : probabilité de détecter un effet réel. Habituellement 80 % ou 90 %.</li>
<li><strong>Taille de l'effet attendu</strong> : différence cliniquement pertinente entre les groupes. Plus l'effet est petit, plus le NSN est grand.</li>
<li><strong>Variabilité</strong> : pour les variables continues, l'écart-type attendu. Plus la variabilité est grande, plus le NSN est grand.</li>
</ul>
<p class="mb-3">Le NSN augmente si : α diminue, β diminue (puissance augmente), l'effet attendu est petit, la variabilité est grande. Il faut aussi majorer pour les perdus de vue (10-20 % habituellement).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : NSN augmente si on veut détecter un petit effet, si la variabilité est grande, ou si on exige plus de puissance. Toujours majorer pour les perdus de vue.</p></div>`
    },
    {
      title: "Plan d'analyse statistique",
      content: `<p class="mb-3">Le <strong>plan d'analyse statistique (SAP)</strong> est défini avant le début de l'essai et détaille les méthodes statistiques utilisées :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Analyse en intention de traiter (ITT)</strong> : tous les patients randomisés sont analysés dans leur groupe d'assignation, quels que soient les écarts au protocole. C'est l'analyse principale recommandée.</li>
<li><strong>Analyse per protocole (PP)</strong> : ne conserve que les patients ayant respecté le protocole. Analyse complémentaire, généralement secondaire.</li>
<li><strong>Analyses en sous-groupes</strong> : prédéfinies dans le protocole, elles recherchent des modifications d'effet selon certaines caractéristiques (sexe, âge, sévérité).</li>
<li><strong>Analyses intermédiaires</strong> : prévues pour des raisons éthiques ou d'efficacité (méthodes de O'Brien-Fleming ou Peto). Nécessitent une correction du risque α.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'analyse ITT est la référence car elle préserve l'avantage de la randomisation. L'analyse PP surestime souvent l'effet du traitement (les non-compliants sont exclus).</p></div>`
    },
    {
      title: "Cadre réglementaire et éthique",
      content: `<p class="mb-3">En France, la conduite d'un essai clinique est encadrée par un cadre réglementaire strict :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>CPP (Comité de Protection des Personnes)</strong> : avis favorable obligatoire avant le début de l'essai. Évalue l'éthique, la méthodologie et la pertinence.</li>
<li><strong>ANSM (Agence Nationale de Sécurité du Médicament)</strong> : autorisation obligatoire pour les essais portant sur des médicaments.</li>
<li><strong>Consentement éclairé</strong> : information complète du patient (objectifs, risques, bénéfices, alternatives). Consentement écrit libre et révocable.</li>
<li><strong>Loi Jardé (2012)</strong> : classifie les recherches en 3 catégories selon le niveau de risque (interventionnelle, à risques minimes, non interventionnelle).</li>
</ul>
<p class="mb-3">La <strong>déclaration des conflits d'intérêts</strong> et le <strong>financement</strong> de l'essai doivent être transparents et déclarés dans les publications.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : CPP (éthique) + ANSM (sécurité) = double approbation obligatoire. La loi Jardé classe les recherches en 3 catégories selon le risque.</p></div>`
    },
    {
      title: "Guidelines de reporting : CONSORT, STROBE, PRISMA",
      content: `<p class="mb-3">Des guidelines internationales standardisent la rédaction et la publication des études médicales :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>CONSORT (Consolidated Standards of Reporting Trials)</strong> : checklist de 25 items pour les essais randomisés. Inclut le diagramme de flux (flow chart) montrant les patients à chaque étape.</li>
<li><strong>STROBE (STrengthening the Reporting of OBservational Studies)</strong> : pour les études observationnelles (cohortes, cas-témoins, transversales). 22 items.</li>
<li><strong>PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses)</strong> : pour les revues systématiques et méta-analyses. 27 items + diagramme de flux.</li>
<li><strong>STARD</strong> : pour les études de tests diagnostiques. <strong>SPIRIT</strong> : pour les protocoles d'essais cliniques.</li>
</ul>
<p class="mb-3">L'<strong>enregistrement prospectif</strong> des essais sur ClinicalTrials.gov ou EU Clinical Trials Register est obligatoire avant l'inclusion du premier patient.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : CONSORT = essais randomisés. STROBE = études observationnelles. PRISMA = revues systématiques. L'enregistrement prospectif est obligatoire pour lutter contre le biais de publication.</p></div>`
    }
  ]
},

"biostats-pharmacovigilance": {
  introduction: "La pharmacovigilance est la science qui surveille, évalue et prévient les effets indésirables des médicaments après leur mise sur le marché. Elle constitue la phase IV du développement du médicament.",
  readTime: 16,
  sections: [
    {
      title: "Notification spontanée et organisation",
      content: `<p class="mb-3">La <strong>notification spontanée</strong> est le pilier de la pharmacovigilance. Elle repose sur la déclaration volontaire des effets indésirables par les professionnels de santé et les patients :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>CRPV (Centres Régionaux de Pharmacovigilance)</strong> : 31 centres en France, reçoivent et analysent les déclarations. Expertise et conseil.</li>
<li><strong>ANSM</strong> : centralise les données nationales, prend les décisions réglementaires. Liée à l'EMA au niveau européen.</li>
<li><strong>Déclaration obligatoire</strong> pour les professionnels de santé : effets indésirables graves ou inattendus. Depuis 2011, les patients peuvent aussi déclarer directement.</li>
<li><strong>Limite majeure</strong> : la sous-notification. Seulement 5-10 % des EI graves sont déclarés. C'est le principal obstacle à la détection des signaux.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : La notification spontanée est obligatoire pour les EI graves ou inattendus. La sous-notification (5-10 %) est le principal problème de la pharmacovigilance.</p></div>`
    },
    {
      title: "Détection et analyse des signaux",
      content: `<p class="mb-3">La <strong>détection de signal</strong> est le processus d'identification d'une association potentielle entre un médicament et un effet indésirable non connu :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Signal</strong> : information suggérant une nouvelle association causale potentielle entre un médicament et un événement. Un signal n'est pas une preuve.</li>
<li><strong>PRR (Proportional Reporting Ratio)</strong> : rapport entre la proportion de déclarations d'un EI pour un médicament et cette proportion pour tous les autres médicaments. PRR > 2 avec au moins 3 cas = signal.</li>
<li><strong>Méthode bayésienne (BCPNN)</strong> : utilisée par l'OMS (VigiBase), calcule la probabilité qu'une association observée dépasse celle attendue.</li>
<li><strong>Data mining</strong> : fouille automatisée des bases de données pour détecter des associations statistiquement inhabituelles.</li>
</ul>
<p class="mb-3">Après détection, le signal est évalué, validé, puis des mesures réglementaires sont éventuellement prises.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Un signal n'est pas une preuve causale. Le PRR > 2 avec ≥ 3 cas déclenche une investigation. La validation du signal nécessite des études complémentaires.</p></div>`
    },
    {
      title: "Imputabilité : évaluer le lien causal",
      content: `<p class="mb-3">L'<strong>imputabilité</strong> évalue la probabilité qu'un effet indésirable soit causé par un médicament donné. La méthode française (Bégaud) repose sur deux axes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Imputabilité intrinsèque</strong> : évalue le lien pour le cas individuel selon des critères chronologiques (délai d'apparition, évolution à l'arrêt, réintroduction) et sémiologiques (signes évocateurs, facteurs favorisants, examens complémentaires, diagnos différentiels).</li>
<li><strong>Imputabilité extrinsèque</strong> : évalue les données bibliographiques disponibles sur cette association (effet connu, quelques cas publiés, non décrit).</li>
<li>Le score combiné donne un niveau d'imputabilité : exclu, douteux, plausible, vraisemblable, très vraisemblable.</li>
</ul>
<p class="mb-3">La <strong>réintroduction positive</strong> (rechallenge) est l'argument le plus fort d'imputabilité mais pose des problèmes éthiques (on ne réintroduit pas volontairement un médicament suspect).</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'imputabilité française combine critères chronologiques + sémiologiques (intrinsèque) et données de la littérature (extrinsèque). La réintroduction positive est l'argument le plus fort.</p></div>`
    },
    {
      title: "Études pharmaco-épidémiologiques",
      content: `<p class="mb-3">Les <strong>études pharmaco-épidémiologiques</strong> complètent la notification spontanée pour confirmer ou quantifier les risques médicamenteux en conditions réelles d'utilisation :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Études de cohorte</strong> : suivent des patients exposés et non exposés au médicament. Permettent de calculer le risque relatif. Meilleure preuve après l'essai randomisé.</li>
<li><strong>Études cas-témoins</strong> : comparent l'exposition médicamenteuse entre cas (avec EI) et témoins (sans EI). Calcul de l'odds ratio. Adaptées aux EI rares.</li>
<li><strong>Registres</strong> : collecte systématique de données sur les patients traités. Permettent un suivi à long terme en vie réelle.</li>
<li><strong>Bases de données médico-administratives</strong> (SNDS en France) : données de remboursement permettant des études populationnelles à grande échelle.</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les études pharmaco-épidémiologiques (cohortes, cas-témoins) quantifient les risques en conditions réelles. Le SNDS français permet des études populationnelles.</p></div>`
    },
    {
      title: "Mesures réglementaires et gestion du risque",
      content: `<p class="mb-3">Lorsqu'un risque est confirmé, différentes mesures réglementaires peuvent être prises, graduellement :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Modification du RCP</strong> : ajout de l'effet indésirable dans les mentions légales, ajout de mises en garde ou de contre-indications.</li>
<li><strong>Lettre aux professionnels de santé (DHPC)</strong> : information directe sur un nouveau risque identifié.</li>
<li><strong>Restriction d'utilisation</strong> : limitation des indications, prescription restreinte (hospitalière, spécialiste).</li>
<li><strong>Plan de gestion des risques (PGR)</strong> : obligatoire pour tout nouveau médicament depuis 2005. Comprend surveillance renforcée, études post-AMM, mesures de minimisation du risque.</li>
<li><strong>Suspension ou retrait d'AMM</strong> : en dernier recours, si le rapport bénéfice/risque devient défavorable (ex. Mediator, Vioxx).</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les mesures vont de la modification du RCP au retrait d'AMM. Le plan de gestion des risques est obligatoire pour tout nouveau médicament depuis 2005.</p></div>`
    }
  ]
},

"biostats-ethique-donnees": {
  introduction: "La protection des données de santé et les enjeux de l'intelligence artificielle en médecine sont des thématiques majeures au carrefour de l'éthique, du droit et de la technologie.",
  readTime: 16,
  sections: [
    {
      title: "RGPD et données de santé",
      content: `<p class="mb-3">Le <strong>Règlement Général sur la Protection des Données (RGPD)</strong>, en vigueur depuis 2018, encadre strictement le traitement des données personnelles en Europe :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Données de santé = données sensibles</strong> : elles bénéficient d'une protection renforcée. Leur traitement est en principe interdit sauf exceptions (consentement explicite, recherche, soins).</li>
<li><strong>Principes fondamentaux</strong> : finalité (usage déterminé), minimisation (collecter le strict nécessaire), exactitude, limitation de durée, intégrité et confidentialité.</li>
<li><strong>Droits des personnes</strong> : accès, rectification, effacement (droit à l'oubli), portabilité, opposition au traitement.</li>
<li><strong>DPO (Data Protection Officer)</strong> : obligatoire dans les établissements de santé. Veille au respect du RGPD.</li>
</ul>
<p class="mb-3">En France, la <strong>CNIL</strong> est l'autorité de contrôle. Les sanctions peuvent atteindre 4 % du chiffre d'affaires mondial ou 20 millions d'euros.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les données de santé sont des données sensibles au sens du RGPD, avec une protection renforcée. Les principes clés : finalité, minimisation, durée limitée, confidentialité.</p></div>`
    },
    {
      title: "Anonymisation et pseudonymisation",
      content: `<p class="mb-3">La distinction entre anonymisation et pseudonymisation est fondamentale en protection des données :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Anonymisation</strong> : processus <strong>irréversible</strong> rendant impossible la ré-identification. Les données anonymisées ne sont plus des données personnelles et sortent du champ du RGPD. Techniques : suppression d'identifiants, agrégation, k-anonymat, differential privacy.</li>
<li><strong>Pseudonymisation</strong> : remplacement des identifiants directs par des codes, mais la ré-identification reste <strong>possible</strong> avec la table de correspondance. Les données restent des données personnelles soumises au RGPD.</li>
</ul>
<p class="mb-3">En recherche médicale, la pseudonymisation est la norme car l'anonymisation complète rend impossible le suivi longitudinal des patients. Le <strong>Health Data Hub</strong> (Plateforme des données de santé) centralise les données du SNDS pour la recherche.</p>
<p class="mb-3">Le risque de <strong>ré-identification</strong> augmente avec la richesse des données : même sans nom, la combinaison date de naissance + code postal + sexe suffit souvent à identifier une personne.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Anonymisation = irréversible (hors RGPD). Pseudonymisation = réversible (toujours soumise au RGPD). En recherche, on pseudonymise car l'anonymisation empêche le suivi longitudinal.</p></div>`
    },
    {
      title: "Recherche sur données de santé : cadre légal",
      content: `<p class="mb-3">La recherche utilisant des données de santé est encadrée par des procédures spécifiques en France :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Méthodologies de référence (MR) de la CNIL</strong> : procédures simplifiées pour les recherches conformes à un cadre prédéfini. MR-001 (essais cliniques), MR-003 (études non interventionnelles), MR-004 (études sur données existantes).</li>
<li><strong>Avis du CPP</strong> : obligatoire pour les recherches impliquant la personne humaine (loi Jardé).</li>
<li><strong>Autorisation CNIL</strong> : nécessaire quand la recherche ne rentre pas dans une MR. Délai d'instruction de 2 mois.</li>
<li><strong>CESREES</strong> : Comité Éthique et Scientifique pour les Recherches, Études et Évaluations dans le domaine de la Santé. Avis préalable à la demande CNIL pour les études sur données du SNDS.</li>
</ul>
<p class="mb-3">Le <strong>consentement</strong> peut être remplacé par une simple information avec droit d'opposition pour les recherches rétrospectives sur données existantes.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les MR de la CNIL simplifient les démarches pour les recherches standards. Le consentement n'est pas toujours requis : l'information + droit d'opposition suffit pour les études rétrospectives.</p></div>`
    },
    {
      title: "Intelligence artificielle en santé",
      content: `<p class="mb-3">L'<strong>intelligence artificielle (IA)</strong> en santé soulève des enjeux éthiques majeurs liés aux biais, à la transparence et à la responsabilité :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biais algorithmiques</strong> : les modèles d'IA reproduisent et amplifient les biais présents dans les données d'entraînement (sous-représentation de certaines populations, biais historiques de diagnostic).</li>
<li><strong>Explicabilité (boîte noire)</strong> : les réseaux de neurones profonds (deep learning) produisent des résultats sans fournir de raisonnement explicite, posant un problème de confiance et de responsabilité.</li>
<li><strong>Supervision humaine</strong> : l'IA doit rester un outil d'aide à la décision. Le médecin conserve la responsabilité finale du diagnostic et du traitement.</li>
<li><strong>Validation clinique</strong> : un algorithme d'IA utilisé en clinique doit être validé comme un dispositif médical, avec des études de performance (sensibilité, spécificité, AUC).</li>
</ul>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : Les biais algorithmiques et le problème de la boîte noire sont les deux défis majeurs de l'IA en santé. La supervision humaine reste obligatoire.</p></div>`
    },
    {
      title: "Cadre réglementaire de l'IA : AI Act européen",
      content: `<p class="mb-3">L'<strong>AI Act</strong> (Règlement européen sur l'intelligence artificielle) adopté en 2024 établit un cadre réglementaire proportionné au niveau de risque :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Risque inacceptable</strong> (interdit) : notation sociale, manipulation subliminale, reconnaissance faciale de masse en temps réel.</li>
<li><strong>Haut risque</strong> : les dispositifs médicaux basés sur l'IA sont classés haut risque. Obligations : gestion des risques, qualité des données, transparence, supervision humaine, cybersécurité.</li>
<li><strong>Risque limité</strong> : obligations de transparence (chatbots doivent informer qu'ils sont des IA).</li>
<li><strong>Risque minimal</strong> : pas d'obligations spécifiques (filtres photo, jeux vidéo IA).</li>
</ul>
<p class="mb-3">En France, la HAS développe un cadre d'évaluation spécifique pour les dispositifs médicaux intégrant de l'IA, incluant des critères de performance clinique et de sécurité.</p>
<div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-cyan-800">Point clé PASS/LAS : L'AI Act classe les dispositifs médicaux IA en « haut risque » avec des obligations de transparence, qualité des données et supervision humaine obligatoire.</p></div>`
    }
  ]
},

};
