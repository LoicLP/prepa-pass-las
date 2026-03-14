/* ===== COURS DÉTAILLÉS — SSH / ÉTHIQUE ===== */
export const COURS_SSH = {

/* ───────────────────────────────────────────── */
/*  1. ÉTHIQUE MÉDICALE                         */
/* ───────────────────────────────────────────── */
"ssh-ethique": {
  introduction: "L'éthique médicale constitue le socle fondamental de la pratique soignante. Elle interroge les valeurs, les principes et les devoirs qui guident le professionnel de santé dans ses décisions, au carrefour de la science, de la philosophie et du droit.",
  readTime: 22,
  sections: [
    {
      title: "Introduction et définitions",
      content: `<p class="mb-3">L'éthique médicale est une branche de l'éthique appliquée qui étudie les questions morales soulevées par la pratique de la médecine. Elle se distingue de la morale (ensemble de normes prescriptives) et de la déontologie (règles professionnelles codifiées) tout en entretenant des liens étroits avec ces deux domaines.</p>
<p class="mb-3">Le mot <strong>éthique</strong> vient du grec <em>ethos</em> (caractère, manière d'être) tandis que <strong>morale</strong> vient du latin <em>mores</em> (mœurs). Bien que souvent utilisés comme synonymes, l'éthique désigne davantage une réflexion critique sur les valeurs, là où la morale renvoie à un ensemble de règles établies.</p>
<p class="mb-3">L'éthique médicale s'articule autour de situations concrètes : faut-il informer un patient d'un pronostic fatal ? Peut-on pratiquer un acte sans consentement en urgence ? Comment arbitrer entre le bien individuel et le bien collectif ?</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : L'éthique ne fournit pas de réponses toutes faites mais une méthode de questionnement systématique face aux dilemmes cliniques. Elle est fondamentalement différente du droit qui impose des obligations.</p></div>`
    },
    {
      title: "Les quatre principes de Beauchamp et Childress",
      content: `<p class="mb-3">En 1979, Tom Beauchamp et James Childress publient <em>Principles of Biomedical Ethics</em>, ouvrage fondateur qui identifie quatre principes cardinaux de l'éthique biomédicale, appelés le <strong>principisme</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Autonomie</strong> : respecter la capacité du patient à prendre ses propres décisions de manière libre et éclairée. Ce principe fonde le consentement éclairé.</li>
<li><strong>Bienfaisance</strong> : agir dans l'intérêt du patient, promouvoir son bien-être et sa santé. Le médecin doit chercher à faire le bien.</li>
<li><strong>Non-malfaisance</strong> (<em>primum non nocere</em>) : ne pas nuire au patient. Ce principe, hérité d'Hippocrate, impose d'évaluer le rapport bénéfice/risque de toute intervention.</li>
<li><strong>Justice</strong> : distribuer équitablement les ressources de santé et traiter les patients de manière égale, sans discrimination.</li>
</ul>
<p class="mb-3">Ces quatre principes sont considérés comme <strong>prima facie</strong>, c'est-à-dire qu'ils sont tous valides a priori mais peuvent entrer en conflit. Dans ce cas, une délibération éthique est nécessaire pour déterminer lequel doit prévaloir selon le contexte.</p>
<p class="mb-3">Par exemple, un patient atteint de cancer peut refuser un traitement (autonomie) alors que le médecin estime qu'il devrait le suivre (bienfaisance). Le respect de l'autonomie du patient prime généralement, sauf situation d'urgence vitale.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le principisme de Beauchamp et Childress est le cadre éthique le plus utilisé en médecine occidentale. Savoir identifier quel principe est en jeu dans un cas clinique est une compétence essentielle à l'examen.</p></div>`
    },
    {
      title: "Le serment d'Hippocrate et les fondements historiques",
      content: `<p class="mb-3">Le <strong>serment d'Hippocrate</strong> (Ve siècle av. J.-C.) constitue le premier texte éthique médical connu. Il établit des principes fondamentaux toujours actuels : obligation de soigner, interdiction de nuire, secret médical, interdiction de relations sexuelles avec les patients.</p>
<p class="mb-3">Le texte original contenait également l'interdiction de pratiquer l'avortement et l'euthanasie, ainsi que l'interdiction de la chirurgie (réservée aux chirurgiens-barbiers). Ces éléments ont été adaptés au fil des siècles.</p>
<p class="mb-3">En France, le serment a été modernisé et est prononcé par les médecins lors de leur soutenance de thèse. La version actuelle, adoptée par l'Ordre des médecins, insiste sur le respect de la personne humaine, le secret professionnel et l'indépendance du médecin.</p>
<p class="mb-3">Au-delà d'Hippocrate, plusieurs jalons historiques ont marqué l'éthique médicale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Code de Nuremberg (1947)</strong> : rédigé après les expérimentations nazies, il pose le consentement volontaire comme condition absolue de toute recherche sur l'être humain.</li>
<li><strong>Déclaration d'Helsinki (1964)</strong> : adoptée par l'Association Médicale Mondiale, elle encadre la recherche biomédicale impliquant des sujets humains.</li>
<li><strong>Rapport Belmont (1979)</strong> : il distingue recherche et pratique clinique et formule trois principes : respect des personnes, bienfaisance et justice.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le Code de Nuremberg (1947) est le premier texte international imposant le consentement éclairé en recherche. La Déclaration d'Helsinki (1964, révisée régulièrement) en est le prolongement pour la recherche clinique.</p></div>`
    },
    {
      title: "Éthique de la relation médecin-patient",
      content: `<p class="mb-3">La relation médecin-patient a évolué d'un modèle <strong>paternaliste</strong> (le médecin décide pour le patient) vers un modèle <strong>autonomiste</strong> (le patient participe activement aux décisions le concernant). Cette évolution est consacrée en France par la <strong>loi du 4 mars 2002</strong> (loi Kouchner).</p>
<p class="mb-3">On distingue plusieurs modèles de la relation thérapeutique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Modèle paternaliste</strong> : le médecin détient le savoir et décide dans l'intérêt du patient, qui est passif. Dominant jusqu'à la fin du XXe siècle.</li>
<li><strong>Modèle informatif</strong> : le médecin fournit l'information technique et le patient décide seul. Le médecin est un simple prestataire de service.</li>
<li><strong>Modèle délibératif</strong> : médecin et patient dialoguent pour parvenir ensemble à la meilleure décision. C'est le modèle recommandé aujourd'hui, fondé sur la <strong>décision partagée</strong>.</li>
<li><strong>Modèle interprétatif</strong> : le médecin aide le patient à clarifier ses propres valeurs pour prendre une décision cohérente avec son projet de vie.</li>
</ul>
<p class="mb-3">Le <strong>consentement éclairé</strong> est l'expression juridique du respect de l'autonomie. Il suppose une information loyale, claire et appropriée sur le diagnostic, les traitements proposés, leurs bénéfices, leurs risques et les alternatives possibles (article L.1111-4 du Code de la santé publique).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La loi Kouchner du 4 mars 2002 a consacré le passage du paternalisme médical à la démocratie sanitaire. Le patient est désormais acteur de sa santé et co-décideur de son parcours de soins.</p></div>`
    },
    {
      title: "Le secret médical",
      content: `<p class="mb-3">Le <strong>secret médical</strong> est un pilier de l'éthique et du droit médical français. Il est protégé par l'article 226-13 du Code pénal (puni d'un an d'emprisonnement et 15 000 euros d'amende en cas de violation) et par l'article R.4127-4 du Code de la santé publique.</p>
<p class="mb-3">Le secret couvre toutes les informations portées à la connaissance du professionnel de santé dans l'exercice de ses fonctions : diagnostic, traitement, mais aussi tout ce que le patient confie, et même sa simple présence dans un établissement de soins.</p>
<p class="mb-3">Il existe cependant des <strong>exceptions légales</strong> au secret médical :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dérogations obligatoires</strong> : déclaration des maladies à déclaration obligatoire, signalement de sévices sur mineurs ou personnes vulnérables, certificats de décès.</li>
<li><strong>Dérogations facultatives</strong> : information de la personne de confiance, partage d'informations entre professionnels de santé participant à la prise en charge (secret partagé), signalement au procureur en cas de danger imminent.</li>
</ul>
<p class="mb-3">Le <strong>secret partagé</strong>, introduit par la loi du 4 mars 2002 et précisé par la loi de modernisation du système de santé de 2016, permet l'échange d'informations entre professionnels de santé d'une même équipe, sous réserve du consentement du patient et dans la limite de ce qui est nécessaire à la prise en charge.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le secret médical est absolu (il couvre tout ce que le médecin apprend dans l'exercice de sa profession) mais pas illimité (des exceptions légales existent). La violation est un délit pénal.</p></div>`
    },
    {
      title: "Les courants philosophiques en éthique médicale",
      content: `<p class="mb-3">L'éthique médicale s'appuie sur plusieurs traditions philosophiques qui offrent des cadres d'analyse différents :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Déontologisme kantien</strong> : l'action morale repose sur le devoir et le respect de règles universelles. L'impératif catégorique de Kant exige de traiter l'humanité toujours comme une fin, jamais simplement comme un moyen. En médecine, cela fonde le respect inconditionnel de la dignité du patient.</li>
<li><strong>Utilitarisme</strong> (Bentham, Mill) : l'action juste est celle qui maximise le bien-être global. En santé publique, ce cadre justifie par exemple la vaccination obligatoire (limiter la liberté individuelle pour le bien collectif).</li>
<li><strong>Éthique des vertus</strong> (Aristote) : l'accent est mis sur le caractère vertueux du soignant (compassion, prudence, justice). Un bon médecin n'est pas seulement techniquement compétent mais aussi moralement vertueux.</li>
<li><strong>Éthique du care</strong> (Gilligan, Tronto) : fondée sur l'attention à la vulnérabilité et l'importance des relations interpersonnelles. Elle valorise l'empathie, la sollicitude et la responsabilité envers les personnes dépendantes.</li>
<li><strong>Casuistique</strong> : raisonnement au cas par cas, par analogie avec des cas paradigmatiques. Plutôt que d'appliquer des principes abstraits, on compare la situation à des cas similaires déjà résolus.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La confrontation entre déontologisme (agir par devoir) et utilitarisme (maximiser le bien-être) est au cœur de nombreux dilemmes éthiques en médecine, notamment en situation de pénurie de ressources.</p></div>`
    },
    {
      title: "Les comités d'éthique en France",
      content: `<p class="mb-3">La France dispose d'un système institutionnel d'éthique médicale à plusieurs niveaux :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Le Comité Consultatif National d'Éthique (CCNE)</strong> : créé en 1983 par le président Mitterrand, c'est la plus haute instance éthique française. Composé de 40 membres (scientifiques, philosophes, juristes, représentants des courants de pensée), il rend des avis consultatifs sur les questions éthiques soulevées par les progrès des sciences.</li>
<li><strong>Les Espaces de Réflexion Éthique Régionaux (ERER)</strong> : créés par la loi de bioéthique de 2004, ils organisent la réflexion éthique au niveau territorial, forment les professionnels et informent le public.</li>
<li><strong>Les comités d'éthique hospitaliers</strong> : présents dans de nombreux établissements de santé, ils aident les équipes soignantes à résoudre des dilemmes éthiques concrets.</li>
<li><strong>Les Comités de Protection des Personnes (CPP)</strong> : ils évaluent les aspects éthiques des protocoles de recherche impliquant la personne humaine (loi Jardé de 2012).</li>
</ul>
<p class="mb-3">Le CCNE a rendu des avis majeurs sur des sujets tels que la fin de vie, la PMA, le diagnostic prénatal, l'intelligence artificielle en santé ou encore les enjeux éthiques liés aux pandémies.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le CCNE (1983) est un organe consultatif indépendant. Ses avis n'ont pas de force juridique contraignante mais influencent fortement la législation (ex. : les lois de bioéthique).</p></div>`
    },
    {
      title: "Dilemmes éthiques contemporains",
      content: `<p class="mb-3">La médecine contemporaine soulève des questions éthiques inédites, amplifiées par les progrès technologiques et les évolutions sociétales :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Intelligence artificielle et diagnostic</strong> : l'utilisation d'algorithmes pour le diagnostic pose la question de la responsabilité en cas d'erreur et du maintien de la relation humaine dans le soin.</li>
<li><strong>Médecine prédictive et données génétiques</strong> : le séquençage du génome permet d'identifier des prédispositions à certaines maladies, soulevant des questions sur le droit de savoir, le droit de ne pas savoir et les risques de discrimination génétique.</li>
<li><strong>Allocation des ressources en situation de crise</strong> : la pandémie de COVID-19 a mis en lumière les dilemmes de tri des patients en réanimation lorsque les ressources sont insuffisantes.</li>
<li><strong>Amélioration humaine (enhancement)</strong> : faut-il distinguer la médecine qui soigne de celle qui améliore les capacités humaines au-delà de la norme ? Le transhumanisme pose des défis éthiques majeurs.</li>
</ul>
<p class="mb-3">Face à ces enjeux, la démarche éthique repose sur un processus de <strong>délibération collective</strong> qui intègre les perspectives médicales, philosophiques, juridiques et sociétales.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Les questions éthiques contemporaines dépassent le cadre de la relation médecin-patient pour interroger le rapport entre progrès scientifique, dignité humaine et justice sociale.</p></div>`
    }
  ]
},

/* ───────────────────────────────────────────── */
/*  2. DROIT DE LA SANTÉ                        */
/* ───────────────────────────────────────────── */
"ssh-droit": {
  introduction: "Le droit de la santé encadre l'ensemble des relations entre les acteurs du système de santé. Il définit les droits des patients, les obligations des professionnels et les règles d'organisation du système de soins en France.",
  readTime: 22,
  sections: [
    {
      title: "Sources et fondements du droit de la santé",
      content: `<p class="mb-3">Le droit de la santé est une branche du droit qui régit les relations entre les patients, les professionnels de santé et les institutions sanitaires. Ses sources sont hiérarchisées selon la pyramide de Kelsen :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Normes constitutionnelles</strong> : le préambule de la Constitution de 1946 garantit la protection de la santé (alinéa 11). La Charte de l'environnement de 2004 consacre le lien entre santé et environnement.</li>
<li><strong>Normes internationales et européennes</strong> : Convention d'Oviedo (1997) sur les droits de l'homme et la biomédecine, Convention européenne des droits de l'homme (droit à la vie, article 2), directives européennes en matière de produits de santé.</li>
<li><strong>Normes législatives</strong> : le Code de la santé publique (CSP) est le texte de référence. La loi du 4 mars 2002 (loi Kouchner) en est la pierre angulaire.</li>
<li><strong>Normes réglementaires</strong> : décrets, arrêtés ministériels, circulaires qui précisent les modalités d'application des lois.</li>
<li><strong>Jurisprudence</strong> : les décisions des tribunaux (Conseil d'État, Cour de cassation) interprètent et complètent le droit positif.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le Code de la santé publique (CSP) est le recueil principal du droit de la santé en France. Il est divisé en parties législative (L.) et réglementaire (R. et D.).</p></div>`
    },
    {
      title: "La loi Kouchner du 4 mars 2002",
      content: `<p class="mb-3">La <strong>loi n° 2002-303 du 4 mars 2002 relative aux droits des malades et à la qualité du système de santé</strong>, dite loi Kouchner, est considérée comme la loi fondatrice de la démocratie sanitaire en France. Elle a profondément transformé la relation médecin-patient.</p>
<p class="mb-3">Les apports majeurs de cette loi :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Droit à l'information</strong> (art. L.1111-2 CSP) : toute personne a le droit d'être informée sur son état de santé. L'information doit être délivrée lors d'un entretien individuel et porter sur les investigations, traitements, risques fréquents ou graves normalement prévisibles, et alternatives thérapeutiques.</li>
<li><strong>Consentement éclairé</strong> (art. L.1111-4 CSP) : aucun acte médical ni aucun traitement ne peut être pratiqué sans le consentement libre et éclairé de la personne. Ce consentement peut être retiré à tout moment.</li>
<li><strong>Personne de confiance</strong> (art. L.1111-6 CSP) : toute personne majeure peut désigner une personne de confiance (parent, proche, médecin traitant) qui sera consultée si le patient est dans l'incapacité d'exprimer sa volonté.</li>
<li><strong>Accès au dossier médical</strong> (art. L.1111-7 CSP) : toute personne a accès à l'ensemble des informations de santé la concernant, directement ou par l'intermédiaire d'un médecin.</li>
<li><strong>Indemnisation des accidents médicaux</strong> : création de l'ONIAM (Office National d'Indemnisation des Accidents Médicaux) et des CRCI (Commissions Régionales de Conciliation et d'Indemnisation).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La loi Kouchner (2002) consacre quatre droits fondamentaux : droit à l'information, consentement éclairé, personne de confiance et accès au dossier médical. C'est LA loi à connaître en SSH.</p></div>`
    },
    {
      title: "La responsabilité médicale",
      content: `<p class="mb-3">La responsabilité médicale est le mécanisme juridique par lequel un professionnel de santé peut être tenu de répondre des conséquences dommageables de ses actes. Elle se décline en trois formes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Responsabilité civile</strong> : elle vise à indemniser le patient. En secteur libéral, elle est fondée sur la faute (article 1240 du Code civil). En secteur hospitalier public, c'est la responsabilité administrative devant les tribunaux administratifs. Depuis la loi Kouchner, la charge de la preuve de l'information incombe au médecin.</li>
<li><strong>Responsabilité pénale</strong> : elle sanctionne les infractions (homicide involontaire, blessures involontaires, non-assistance à personne en danger, violation du secret médical). Elle est toujours personnelle et ne peut pas être assurée.</li>
<li><strong>Responsabilité disciplinaire</strong> : elle est prononcée par l'Ordre des médecins (chambre disciplinaire) pour manquement aux obligations déontologiques. Les sanctions vont de l'avertissement à la radiation du tableau de l'Ordre.</li>
</ul>
<p class="mb-3">L'<strong>aléa thérapeutique</strong> désigne un dommage survenant sans faute, lié à un risque inhérent à l'acte médical. Depuis la loi Kouchner, les accidents médicaux sans faute peuvent être indemnisés par la solidarité nationale via l'ONIAM, sous certaines conditions de gravité.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Les trois types de responsabilité (civile, pénale, disciplinaire) peuvent se cumuler. La responsabilité pénale est toujours personnelle et inassurable.</p></div>`
    },
    {
      title: "Le droit des personnes vulnérables",
      content: `<p class="mb-3">Le droit de la santé accorde une protection renforcée aux personnes considérées comme vulnérables :</p>
<p class="mb-3"><strong>Les mineurs :</strong> le consentement aux soins est donné par les titulaires de l'autorité parentale. Cependant, le mineur doit être consulté et son avis pris en compte en fonction de son degré de maturité. Exceptions notables : le mineur peut consulter seul pour la contraception, l'IVG (sans autorisation parentale depuis la loi du 4 juillet 2001), et le dépistage des IST.</p>
<p class="mb-3"><strong>Les majeurs protégés :</strong> trois régimes de protection existent selon le degré d'incapacité :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Sauvegarde de justice</strong> : mesure temporaire, la personne conserve l'exercice de ses droits.</li>
<li><strong>Curatelle</strong> : la personne est assistée dans les actes importants mais conserve une autonomie partielle.</li>
<li><strong>Tutelle</strong> : la personne est représentée de manière continue, le tuteur donne le consentement aux soins.</li>
</ul>
<p class="mb-3">La loi du 5 mars 2007 portant réforme de la protection juridique des majeurs a renforcé les droits des personnes protégées, en insistant sur le respect de leur autonomie résiduelle et de leur dignité.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Même sous tutelle, le majeur protégé doit être informé et donner son avis sur les soins. Le tuteur ne peut consentir à sa place que si la personne est dans l'impossibilité de s'exprimer.</p></div>`
    },
    {
      title: "Le droit de l'hospitalisation",
      content: `<p class="mb-3">L'hospitalisation obéit à des règles juridiques précises, tant en ce qui concerne l'admission que le séjour et la sortie du patient.</p>
<p class="mb-3"><strong>L'hospitalisation libre</strong> est le principe : le patient entre et sort librement de l'hôpital, avec son consentement. Il conserve tous ses droits fondamentaux (liberté d'aller et venir, droit à la correspondance, droit de vote).</p>
<p class="mb-3"><strong>L'hospitalisation sans consentement en psychiatrie</strong> est l'exception, encadrée par la loi du 5 juillet 2011 (modifiée en 2013) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Soins à la demande d'un tiers (SDT)</strong> : un tiers (famille, proche) demande l'hospitalisation. Deux certificats médicaux sont nécessaires (un seul en cas de péril imminent).</li>
<li><strong>Soins sur décision du représentant de l'État (SDRE)</strong> : le préfet ordonne l'hospitalisation lorsque les troubles mentaux compromettent la sûreté des personnes ou portent atteinte à l'ordre public.</li>
</ul>
<p class="mb-3">Depuis la réforme de 2011, le juge des libertés et de la détention (JLD) contrôle systématiquement les mesures d'hospitalisation sans consentement dans un délai de 12 jours, puis tous les 6 mois.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : L'hospitalisation sans consentement en psychiatrie est soumise à un double contrôle : médical (certificats) et judiciaire (JLD). Elle ne peut durer que si les conditions médicales le justifient.</p></div>`
    },
    {
      title: "Les lois de bioéthique",
      content: `<p class="mb-3">La France est le premier pays au monde à s'être doté de <strong>lois de bioéthique</strong>, adoptées initialement en 1994 et régulièrement révisées :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Lois de bioéthique de 1994</strong> : trois lois fondatrices encadrant le don d'organes, l'assistance médicale à la procréation (AMP), le diagnostic prénatal et la recherche sur l'embryon. Principes : anonymat et gratuité du don, interdiction de la GPA, non-patrimonialité du corps humain.</li>
<li><strong>Révision de 2004</strong> : création de l'Agence de la biomédecine, ouverture encadrée de la recherche sur les cellules souches embryonnaires, création des ERER.</li>
<li><strong>Révision de 2011</strong> : maintien des principes fondamentaux, encadrement du diagnostic préimplantatoire (DPI), don croisé d'organes.</li>
<li><strong>Révision de 2021</strong> (loi du 2 août 2021) : ouverture de la PMA aux couples de femmes et aux femmes seules, autoconservation des ovocytes, réforme de l'accès aux origines pour les personnes nées d'un don.</li>
</ul>
<p class="mb-3">Les lois de bioéthique reposent sur trois principes fondamentaux inscrits dans le Code civil : <strong>le respect de la dignité humaine</strong>, <strong>la non-patrimonialité du corps humain</strong> (article 16-1) et <strong>l'inviolabilité du corps humain</strong> (article 16-3).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Les lois de bioéthique françaises sont révisées périodiquement (initialement tous les 5 ans, puis 7 ans). Les trois principes fondamentaux : dignité, non-patrimonialité et inviolabilité du corps humain.</p></div>`
    },
    {
      title: "Droit et nouvelles technologies en santé",
      content: `<p class="mb-3">L'essor du numérique et des nouvelles technologies en santé soulève des défis juridiques majeurs que le droit s'efforce d'encadrer :</p>
<p class="mb-3"><strong>Protection des données de santé :</strong> les données de santé sont des données sensibles au sens du RGPD (Règlement Général sur la Protection des Données, 2018) et de la loi Informatique et Libertés (1978, modifiée). Leur traitement est interdit par principe, sauf exceptions (consentement explicite, intérêt vital, santé publique, recherche). L'Espace Numérique de Santé (ENS) et le Dossier Médical Partagé (DMP) sont encadrés par des dispositions spécifiques.</p>
<p class="mb-3"><strong>Télémédecine :</strong> définie par la loi HPST de 2009 (article L.6316-1 CSP), elle comprend la téléconsultation, la téléexpertise, la télésurveillance, la téléassistance et la régulation médicale. Elle est prise en charge par l'Assurance maladie depuis 2018.</p>
<p class="mb-3"><strong>Intelligence artificielle :</strong> le cadre juridique de l'IA en santé est en construction. Le règlement européen sur l'IA (AI Act, 2024) classe les dispositifs médicaux utilisant l'IA comme à haut risque, imposant des obligations de transparence, de traçabilité et de supervision humaine.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Les données de santé bénéficient d'une protection renforcée par le RGPD. La télémédecine est légalement définie depuis la loi HPST de 2009 et remboursée depuis 2018.</p></div>`
    }
  ]
},

"ssh-bioethique": {
  introduction: "La bioéthique encadre les questions morales soulevées par les avancées des sciences biomédicales : procréation, génétique, recherche, fin de vie. Elle articule progrès scientifique et respect de la dignité humaine.",
  readTime: 20,
  sections: [
    {
      title: "Fondements et principes de la bioéthique",
      content: `<p class="mb-3">La <strong>bioéthique</strong> est née dans les années 1970, portée par la nécessité d'encadrer les avancées rapides de la biomédecine. Le terme, forgé par Van Rensselaer Potter (1970), désigne initialement une éthique globale liant sciences de la vie et valeurs humaines. En France, la bioéthique s'est structurée autour de grands principes inscrits dans le <strong>Code civil</strong>.</p>
<p class="mb-3">Les <strong>principes fondamentaux</strong> de la bioéthique française reposent sur trois piliers :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dignité de la personne humaine</strong> (article 16 du Code civil) : toute personne a droit au respect de son corps et de sa dignité, dès le commencement de la vie.</li>
<li><strong>Non-patrimonialité du corps humain</strong> (article 16-1) : le corps humain, ses éléments et ses produits ne peuvent faire l'objet d'un droit patrimonial. Le don d'organes, de sang et de gamètes est gratuit et anonyme.</li>
<li><strong>Inviolabilité du corps humain</strong> (article 16-3) : il ne peut être porté atteinte à l'intégrité du corps humain qu'en cas de nécessité médicale et avec le consentement de l'intéressé.</li>
</ul>
<p class="mb-3">Le <strong>CCNE</strong> (Comité Consultatif National d'Éthique), créé en 1983 par le président Mitterrand, rend des avis consultatifs sur les questions éthiques soulevées par les progrès de la biologie et de la médecine. Il organise également les <strong>États généraux de la bioéthique</strong> avant chaque révision législative, associant citoyens et experts.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Les trois principes fondamentaux de la bioéthique française : dignité, non-patrimonialité et inviolabilité du corps humain. Le CCNE (1983) rend des avis consultatifs et organise les États généraux de la bioéthique.</p></div>`
    },
    {
      title: "Les lois de bioéthique françaises : historique et révisions",
      content: `<p class="mb-3">Les <strong>lois de bioéthique</strong> françaises sont un dispositif législatif unique au monde, révisé périodiquement pour s'adapter aux évolutions scientifiques et sociétales :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Lois de 1994</strong> (trois lois fondatrices du 29 juillet 1994) : elles encadrent le don d'organes (consentement présumé, gratuité, anonymat), l'assistance médicale à la procréation (AMP), le diagnostic prénatal, la recherche sur l'embryon (interdite sauf dérogation). Création de l'Établissement Français des Greffes.</li>
<li><strong>Révision de 2004</strong> : création de l'<strong>Agence de la biomédecine</strong>, ouverture encadrée de la recherche sur les cellules souches embryonnaires humaines (sous conditions dérogatoires), interdiction du clonage reproductif et thérapeutique, création des Espaces de Réflexion Éthique Régionaux (ERER).</li>
<li><strong>Révision de 2011</strong> : maintien des principes fondamentaux, autorisation du don croisé d'organes, encadrement du diagnostic préimplantatoire (DPI), vitrification ovocytaire autorisée dans un cadre médical.</li>
<li><strong>Révision de 2021</strong> (loi du 2 août 2021) : ouverture de la PMA aux couples de femmes et aux femmes seules, autoconservation des ovocytes sans motif médical, réforme de l'accès aux origines pour les personnes nées d'un don, élargissement du DPI aux aneuploïdies.</li>
</ul>
<p class="mb-3">La <strong>clause de révision</strong> périodique (initialement tous les 5 ans, puis 7 ans) est une spécificité française qui garantit l'adaptation du cadre juridique aux évolutions scientifiques. Chaque révision est précédée d'États généraux de la bioéthique organisés par le CCNE.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Lois de bioéthique = 1994, 2004, 2011, 2021. Chaque révision est précédée d'États généraux. La loi de 2021 a ouvert la PMA aux couples de femmes et femmes seules et autorisé l'autoconservation ovocytaire.</p></div>`
    },
    {
      title: "Procréation médicalement assistée et don de gamètes",
      content: `<p class="mb-3">La <strong>procréation médicalement assistée</strong> (PMA ou AMP) regroupe l'ensemble des techniques permettant de pallier l'infertilité ou d'éviter la transmission d'une maladie grave. Elle soulève des questions éthiques majeures relatives à la filiation, à l'anonymat du don et à l'accès aux origines.</p>
<p class="mb-3">Les principales techniques d'AMP sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Insémination artificielle</strong> (IAC avec sperme du conjoint, IAD avec donneur) : technique la plus simple, le sperme est déposé dans l'utérus.</li>
<li><strong>Fécondation in vitro</strong> (FIV) : fécondation de l'ovocyte en laboratoire puis transfert de l'embryon. FIV-ICSI : injection intracytoplasmique d'un spermatozoïde.</li>
<li><strong>Don d'ovocytes</strong> et <strong>don d'embryons</strong> : encadrés par les principes de gratuité et d'anonymat du don.</li>
</ul>
<p class="mb-3">La <strong>loi de 2021</strong> a profondément modifié le cadre de la PMA : ouverture aux couples de femmes et aux femmes seules (auparavant réservée aux couples hétérosexuels infertiles), autoconservation des ovocytes sans motif médical, et création d'un dispositif d'accès aux origines permettant aux personnes nées d'un don d'accéder à l'identité du donneur (les donneurs devant consentir à la communication de leur identité).</p>
<p class="mb-3">La <strong>gestation pour autrui</strong> (GPA) reste interdite en France (article 16-7 du Code civil : « Toute convention portant sur la procréation ou la gestation pour le compte d'autrui est nulle »). La Cour de cassation (2019) a toutefois reconnu la transcription des actes de naissance établis à l'étranger.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : PMA élargie en 2021 aux couples de femmes et femmes seules. Don = gratuité + anonymat (mais accès aux origines possible depuis 2021). GPA = interdite en France (article 16-7 du Code civil).</p></div>`
    },
    {
      title: "Génétique, recherche sur l'embryon et clonage",
      content: `<p class="mb-3">Les avancées en <strong>génétique</strong> soulèvent des questions bioéthiques fondamentales touchant à l'identité, la dignité et l'intégrité de l'espèce humaine. Le cadre français distingue soigneusement les usages diagnostiques, thérapeutiques et d'amélioration (enhancement).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Diagnostic prénatal</strong> (DPN) : ensemble des techniques permettant de détecter in utero une affection grave du fœtus. Il pose la question de l'eugénisme et de la sélection des embryons.</li>
<li><strong>Diagnostic préimplantatoire</strong> (DPI) : analyse génétique des embryons obtenus par FIV avant transfert. Autorisé uniquement pour des maladies génétiques graves et incurables. Le DPI-HLA (« bébé médicament ») est strictement encadré.</li>
<li><strong>Tests génétiques</strong> : les tests en accès direct (DTC, Direct-to-Consumer) sont interdits en France sauf prescription médicale. Enjeux de protection des données génétiques et de discrimination.</li>
</ul>
<p class="mb-3">La <strong>recherche sur l'embryon humain</strong> et les cellules souches embryonnaires est autorisée sous conditions strictes depuis 2013 (passage d'un régime d'interdiction avec dérogations à un régime d'autorisation encadrée). L'embryon ne peut être créé à des fins de recherche. La recherche doit être pertinente sur le plan scientifique et ne pas pouvoir être menée par d'autres moyens.</p>
<p class="mb-3">Le <strong>clonage</strong> reproductif est interdit (crime contre l'espèce humaine, articles 214-1 et 214-2 du Code pénal). Le clonage thérapeutique (création d'embryons par transfert nucléaire à des fins de recherche) est également interdit en France. Les techniques de modification du génome germinal (CRISPR-Cas9 sur la lignée germinale) sont prohibées.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : DPI autorisé pour maladies graves et incurables. Clonage reproductif = crime contre l'espèce humaine. Recherche sur l'embryon = régime d'autorisation encadrée depuis 2013. Modification de la lignée germinale = interdite.</p></div>`
    },
    {
      title: "Don d'organes, transhumanisme et enjeux émergents",
      content: `<p class="mb-3">Le <strong>don d'organes</strong> en France repose sur trois principes fondamentaux : le <strong>consentement présumé</strong> (toute personne est donneur sauf si elle a exprimé son refus de son vivant via le registre national des refus), la <strong>gratuité</strong> (interdiction de toute commercialisation du corps humain) et l'<strong>anonymat</strong> (donneur et receveur ne se connaissent pas).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Don post-mortem</strong> : prélèvement après mort encéphalique ou, depuis 2005, après arrêt cardiaque (donneurs Maastricht III). La loi de 2016 a renforcé le consentement présumé en limitant les modalités d'expression du refus.</li>
<li><strong>Don du vivant</strong> : possible pour certains organes (rein, lobe hépatique) dans le cercle familial élargi ou entre proches. Le don croisé d'organes est autorisé depuis 2011.</li>
<li><strong>Pénurie d'organes</strong> : l'écart entre offre et demande reste un défi éthique majeur. L'Agence de la biomédecine gère la liste nationale d'attente et les règles d'attribution.</li>
</ul>
<p class="mb-3">Le <strong>transhumanisme</strong> prône l'utilisation des technologies pour dépasser les limites biologiques de l'humain (augmentation cognitive, extension de la longévité, interfaces cerveau-machine). La bioéthique française distingue la médecine qui <strong>soigne</strong> de celle qui <strong>augmente</strong> : les interventions d'amélioration (enhancement) ne relèvent pas de la solidarité nationale.</p>
<p class="mb-3">Les <strong>enjeux émergents</strong> incluent : les organoïdes et modèles embryonnaires synthétiques, les xénotransplantations (greffes d'organes animaux génétiquement modifiés), l'édition génomique (CRISPR-Cas9), les neurotechnologies et la neuroéthique, ainsi que les enjeux de brevetabilité du vivant.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Don d'organes = consentement présumé + gratuité + anonymat. Transhumanisme : distinction soigner/augmenter. Enjeux émergents : CRISPR, organoïdes, xénotransplantation, neurotechnologies.</p></div>`
    }
  ]
},

"ssh-deontologie": {
  introduction: "La déontologie médicale est l'ensemble des règles professionnelles que tout médecin doit respecter. Le Code de déontologie a force réglementaire et constitue le socle des obligations professionnelles.",
  readTime: 18,
  sections: [
    {
      title: "Le Code de déontologie médicale : nature et structure",
      content: `<p class="mb-3">Le <strong>Code de déontologie médicale</strong> est intégré au Code de la santé publique (articles R.4127-1 à R.4127-112), ce qui lui confère une <strong>valeur réglementaire</strong> (décret en Conseil d'État). Il ne s'agit donc pas d'un simple code de bonne conduite mais d'un texte juridiquement contraignant dont la violation peut entraîner des sanctions disciplinaires, civiles et pénales.</p>
<p class="mb-3">Le Code est structuré en plusieurs titres :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Devoirs généraux des médecins</strong> : respect de la vie et de la dignité humaine, indépendance professionnelle, compétence, moralité, probité, non-discrimination.</li>
<li><strong>Devoirs envers les patients</strong> : information loyale et claire, consentement éclairé, secret médical, continuité des soins, libre choix du médecin par le patient.</li>
<li><strong>Rapports des médecins entre eux et avec les autres professionnels</strong> : confraternité, non-dénigrement, collaboration interdisciplinaire.</li>
<li><strong>Exercice de la profession</strong> : conditions d'exercice, remplacement, exercice salarié, médecine d'expertise.</li>
</ul>
<p class="mb-3">Le serment d'Hippocrate, prononcé par les médecins lors de leur thèse, n'a pas de valeur juridique en soi mais inspire les principes du Code de déontologie. Le serment moderne a été actualisé par l'Ordre des médecins en 2012 pour intégrer les évolutions éthiques contemporaines.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le Code de déontologie a valeur réglementaire (intégré au CSP). Il s'impose à tout médecin inscrit au tableau de l'Ordre. Le serment d'Hippocrate n'a pas de valeur juridique propre.</p></div>`
    },
    {
      title: "L'Ordre des médecins et la juridiction disciplinaire",
      content: `<p class="mb-3">L'<strong>Ordre national des médecins</strong>, créé par l'ordonnance du 24 septembre 1945, est un organisme de droit privé chargé d'une mission de <strong>service public</strong>. Tout médecin doit être inscrit au tableau de l'Ordre pour exercer (sauf médecins militaires et médecins du travail dans certains cas).</p>
<p class="mb-3">Les missions de l'Ordre sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Veiller au respect de la déontologie</strong> et à la moralité professionnelle.</li>
<li><strong>Défendre l'honneur et l'indépendance</strong> de la profession médicale.</li>
<li><strong>Assurer la défense des patients</strong> et contribuer à la qualité des soins.</li>
<li><strong>Organiser la permanence des soins</strong> et tenir le tableau des médecins.</li>
</ul>
<p class="mb-3">La <strong>juridiction disciplinaire ordinale</strong> comprend les chambres disciplinaires de première instance (au niveau régional) et la chambre disciplinaire nationale (appel). Les sanctions disciplinaires sont graduées : <strong>avertissement</strong>, <strong>blâme</strong>, <strong>interdiction temporaire d'exercer</strong> (jusqu'à 3 ans), <strong>radiation du tableau</strong>. Un recours en cassation est possible devant le Conseil d'État.</p>
<p class="mb-3">La <strong>responsabilité disciplinaire</strong> est indépendante des responsabilités civile et pénale : un même fait peut donner lieu à des poursuites sur les trois plans simultanément (principe de l'indépendance des actions).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : L'Ordre des médecins a un pouvoir disciplinaire avec des sanctions graduées (avertissement, blâme, interdiction temporaire, radiation). Responsabilité disciplinaire = indépendante des responsabilités civile et pénale.</p></div>`
    },
    {
      title: "Le secret médical : fondements et exceptions",
      content: `<p class="mb-3">Le <strong>secret médical</strong> est un principe fondamental de la déontologie médicale, inscrit à l'article R.4127-4 du CSP et protégé pénalement par l'article 226-13 du Code pénal (1 an d'emprisonnement et 15 000 euros d'amende). Il couvre tout ce qui est confié au médecin, tout ce qu'il a vu, entendu, compris ou déduit dans l'exercice de sa profession.</p>
<p class="mb-3">Le secret médical est un <strong>droit du patient</strong> et une <strong>obligation du médecin</strong>. Il est :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Général</strong> : il couvre toutes les informations, pas seulement le diagnostic.</li>
<li><strong>Absolu</strong> : il s'impose même après la mort du patient (avec des aménagements pour les ayants droit).</li>
<li><strong>D'ordre public</strong> : le patient ne peut pas délier le médecin de son secret (le secret protège l'intérêt général, pas seulement l'intérêt individuel).</li>
</ul>
<p class="mb-3">Les <strong>exceptions légales</strong> au secret médical sont strictement encadrées :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Déclarations obligatoires</strong> : maladies à déclaration obligatoire, certificats de décès, certificats de naissance.</li>
<li><strong>Protection des personnes vulnérables</strong> : signalement de maltraitance sur mineurs ou personnes vulnérables (article 226-14 du Code pénal).</li>
<li><strong>Secret partagé</strong> : entre professionnels de santé participant à la prise en charge d'un même patient, avec le consentement du patient (loi Kouchner 2002, renforcé par la loi de modernisation de 2016).</li>
<li><strong>Réquisitions judiciaires</strong> et expertises médicales ordonnées par la justice.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le secret médical est général, absolu et d'ordre public. Exceptions : déclarations obligatoires, protection des vulnérables, secret partagé, réquisitions judiciaires. Sanction pénale : 1 an + 15 000 euros.</p></div>`
    },
    {
      title: "Obligations déontologiques spécifiques",
      content: `<p class="mb-3">Le Code de déontologie impose aux médecins des <strong>obligations spécifiques</strong> qui structurent l'exercice quotidien de la profession :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Indépendance professionnelle</strong> (article R.4127-5) : le médecin ne peut aliéner son indépendance sous quelque forme que ce soit. Cette indépendance est à la fois intellectuelle (liberté de prescription) et financière (interdiction du compérage et de la dichotomie).</li>
<li><strong>Liberté de prescription</strong> : le médecin est libre de ses prescriptions dans les limites fixées par la loi, mais doit prescrire de façon <strong>économe</strong> et conforme aux données acquises de la science.</li>
<li><strong>Obligation de soins</strong> et <strong>continuité des soins</strong> : le médecin doit assurer la continuité des soins ou adresser le patient à un confrère compétent.</li>
<li><strong>Non-discrimination</strong> (article R.4127-7) : le médecin doit soigner avec la même conscience tout patient quels que soient son origine, ses moeurs, sa situation sociale, sa nationalité, sa religion.</li>
<li><strong>Clause de conscience</strong> : le médecin peut refuser de pratiquer un acte contraire à ses convictions, sauf urgence et sous réserve d'orienter le patient.</li>
</ul>
<p class="mb-3">L'<strong>interdiction du compérage</strong> (article R.4127-22) prohibe tout accord entre un médecin et un tiers pour obtenir des avantages. La <strong>dichotomie</strong> (partage illicite d'honoraires) est également interdite. Ces règles protègent l'indépendance du médecin face aux pressions commerciales.</p>
<p class="mb-3">L'<strong>obligation de formation continue</strong> (Développement Professionnel Continu, DPC) impose aux médecins de maintenir et actualiser leurs connaissances tout au long de leur carrière, garantissant la qualité et la sécurité des soins.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Indépendance professionnelle = clé de voûte de la déontologie. Liberté de prescription mais obligation de prescrire de façon économe. Compérage et dichotomie = interdits. Clause de conscience = possible sauf urgence.</p></div>`
    },
    {
      title: "Déontologie et enjeux contemporains",
      content: `<p class="mb-3">La déontologie médicale doit aujourd'hui s'adapter à de <strong>nouveaux défis</strong> qui n'existaient pas lors de la rédaction originale du Code :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Médecine numérique</strong> : la télémédecine impose de nouvelles obligations déontologiques (qualité de la consultation, vérification de l'identité, sécurité des données). Le CNOM (Conseil National de l'Ordre des Médecins) a publié des recommandations spécifiques.</li>
<li><strong>Réseaux sociaux et e-réputation</strong> : les médecins doivent respecter le secret médical et l'obligation de réserve sur les réseaux sociaux. La publicité médicale reste interdite en principe, mais les frontières sont floues avec l'information en ligne.</li>
<li><strong>Conflits d'intérêts</strong> : la loi Bertrand (2011, « Sunshine Act » français) impose la transparence des liens entre professionnels de santé et industries (base Transparence Santé). La déclaration publique d'intérêts (DPI) est obligatoire pour les experts.</li>
<li><strong>Intelligence artificielle</strong> : le médecin reste responsable de ses décisions, même assisté par l'IA. L'obligation de compétence s'étend à la maîtrise des outils numériques.</li>
</ul>
<p class="mb-3">L'<strong>objection de conscience</strong> fait l'objet de débats renouvelés, notamment concernant l'IVG et la fin de vie. Le droit à l'objection de conscience est reconnu mais doit être concilié avec l'accès effectif aux soins : le médecin objecteur doit orienter le patient vers un confrère compétent.</p>
<p class="mb-3">Les <strong>lanceurs d'alerte</strong> en santé (cas Irène Frachon avec le Mediator) posent la question de la tension entre loyauté institutionnelle et devoir de protection de la santé publique. La loi Sapin II (2016) protège les lanceurs d'alerte de bonne foi.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La déontologie s'adapte au numérique (télémédecine, IA, réseaux sociaux). Loi Bertrand = transparence des liens d'intérêts. Clause de conscience = possible mais obligation d'orientation du patient.</p></div>`
    }
  ]
},

"ssh-droit-patients": {
  introduction: "Les droits des patients constituent un pilier de la démocratie sanitaire, consacrés par la loi Kouchner de 2002. Ils placent le patient au centre du système de santé en tant qu'acteur de sa propre prise en charge.",
  readTime: 20,
  sections: [
    {
      title: "La loi Kouchner du 4 mars 2002 : fondements et principes",
      content: `<p class="mb-3">La <strong>loi du 4 mars 2002</strong> relative aux droits des malades et à la qualité du système de santé, dite <strong>loi Kouchner</strong>, constitue un tournant majeur dans le droit de la santé français. Elle consacre la notion de <strong>démocratie sanitaire</strong> en reconnaissant le patient comme acteur à part entière de sa prise en charge.</p>
<p class="mb-3">Les droits fondamentaux consacrés par la loi sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Droit à l'information</strong> (article L.1111-2 CSP) : toute personne a droit à une information loyale, claire et appropriée sur son état de santé, les traitements proposés, leurs risques et alternatives.</li>
<li><strong>Consentement libre et éclairé</strong> (article L.1111-4) : aucun acte médical ne peut être pratiqué sans le consentement libre et éclairé du patient, révocable à tout moment.</li>
<li><strong>Droit au refus de traitement</strong> : le patient peut refuser tout traitement, y compris vital, après avoir été informé des conséquences.</li>
<li><strong>Respect de la dignité</strong> et <strong>non-discrimination</strong> dans l'accès aux soins.</li>
<li><strong>Droit à la qualité des soins</strong> et à la sécurité sanitaire.</li>
</ul>
<p class="mb-3">La loi a également instauré la <strong>démocratie sanitaire</strong> en donnant une place aux associations de patients agréées dans les instances de santé (conférences de santé, conseils d'administration des hôpitaux, HAS).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Loi Kouchner 2002 = droits des patients + démocratie sanitaire. Le consentement est libre, éclairé et révocable. Le patient peut refuser tout traitement y compris vital.</p></div>`
    },
    {
      title: "Information du patient et charge de la preuve",
      content: `<p class="mb-3">Le <strong>droit à l'information</strong> est un droit fondamental du patient. L'information doit porter sur : le diagnostic, les traitements envisagés et leurs alternatives, les risques fréquents ou graves normalement prévisibles, les conséquences prévisibles en cas de refus.</p>
<p class="mb-3">Les caractéristiques de l'information médicale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Loyale</strong> : sincère et honnête, sans dissimulation ni exagération.</li>
<li><strong>Claire</strong> : adaptée au niveau de compréhension du patient, en langage accessible.</li>
<li><strong>Appropriée</strong> : adaptée à la situation clinique et au patient.</li>
<li><strong>Délivrée lors d'un entretien individuel</strong> : l'information est principalement orale, complétée par des documents écrits.</li>
</ul>
<p class="mb-3">Depuis l'arrêt <strong>Hédreul</strong> (Cour de cassation, 25 février 1997), la <strong>charge de la preuve de l'information</strong> incombe au médecin et non au patient. Le médecin doit pouvoir prouver qu'il a bien informé le patient (tracabilité dans le dossier médical, formulaires d'information, etc.).</p>
<p class="mb-3">L'<strong>exception thérapeutique</strong> (article L.1111-2 alinéa 7) permet au médecin de limiter l'information en cas de diagnostic ou pronostic grave, dans l'intérêt du patient et pour des raisons légitimes qu'il apprécie en conscience. Cette exception est d'interprétation stricte.</p>
<p class="mb-3">L'accès au <strong>dossier médical</strong> est un droit du patient (loi Kouchner) : il peut obtenir communication de son dossier directement ou par l'intermédiaire d'un médecin, dans un délai de 8 jours (48h pour des informations de moins de 5 ans).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Arrêt Hédreul 1997 = la charge de la preuve de l'information incombe au médecin. L'information doit être loyale, claire et appropriée. Accès au dossier médical = droit du patient (8 jours).</p></div>`
    },
    {
      title: "Consentement, refus de soins et personnes vulnérables",
      content: `<p class="mb-3">Le <strong>consentement aux soins</strong> est un principe fondamental du droit médical. Il doit être :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Libre</strong> : sans contrainte ni pression, donné en dehors de toute situation d'urgence (sauf exception).</li>
<li><strong>Éclairé</strong> : le patient doit avoir reçu une information suffisante pour prendre sa décision.</li>
<li><strong>Spécifique</strong> : il porte sur un acte précis et ne vaut pas consentement général à tous les soins.</li>
<li><strong>Révocable</strong> : le patient peut retirer son consentement à tout moment.</li>
</ul>
<p class="mb-3">Le <strong>refus de soins par le patient</strong> est un droit, même lorsque le traitement est vital. Le médecin doit respecter la volonté du patient après l'avoir informé des conséquences de son refus. Il doit tout mettre en oeuvre pour convaincre le patient d'accepter les soins indispensables, mais ne peut pas passer outre (sauf urgence vitale et impossibilité d'obtenir le consentement).</p>
<p class="mb-3">Pour les <strong>personnes vulnérables</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Mineurs</strong> : le consentement est donné par les titulaires de l'autorité parentale. Le mineur est associé à la décision selon sa maturité. Le mineur peut s'opposer à la consultation de ses parents pour certains actes (contraception, IVG).</li>
<li><strong>Majeurs protégés</strong> (tutelle, curatelle, sauvegarde de justice) : le consentement est adapté au régime de protection. Le majeur protégé doit être informé et associé à la décision dans la mesure de ses capacités.</li>
<li><strong>Personne de confiance</strong> (article L.1111-6) : toute personne majeure peut désigner une personne de confiance qui sera consultée si le patient ne peut exprimer sa volonté.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Consentement = libre, éclairé, spécifique, révocable. Le refus de soins est un droit même vital. Personne de confiance = consultée si le patient ne peut s'exprimer. Mineurs = autorité parentale mais association à la décision.</p></div>`
    },
    {
      title: "Indemnisation des accidents médicaux et responsabilité",
      content: `<p class="mb-3">La loi Kouchner a profondément réformé le régime d'<strong>indemnisation des accidents médicaux</strong> en créant un système dual :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Accidents fautifs</strong> : indemnisation par la responsabilité civile du professionnel ou de l'établissement (assurance professionnelle obligatoire). La faute doit être prouvée (sauf pour les infections nosocomiales où la responsabilité est sans faute pour les établissements).</li>
<li><strong>Accidents non fautifs</strong> (aléa thérapeutique) : indemnisation par la <strong>solidarité nationale</strong> via l'ONIAM (Office National d'Indemnisation des Accidents Médicaux), sous conditions de gravité (IPP > 24%, arrêt de travail > 6 mois, etc.).</li>
</ul>
<p class="mb-3">Les <strong>CCI</strong> (Commissions de Conciliation et d'Indemnisation) sont des instances régionales qui examinent les demandes d'indemnisation. Elles émettent un avis sur la responsabilité et le montant de l'indemnisation. La procédure est gratuite et n'empêche pas un recours judiciaire.</p>
<p class="mb-3">Les <strong>types de responsabilité médicale</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Responsabilité civile</strong> : réparation du préjudice subi par le patient (contractuelle pour les libéraux, délictuelle ou administrative pour les hôpitaux publics).</li>
<li><strong>Responsabilité pénale</strong> : sanctions pour infractions (homicide involontaire, blessures involontaires, non-assistance à personne en danger, violation du secret médical).</li>
<li><strong>Responsabilité disciplinaire</strong> : sanctions ordinales pour manquement à la déontologie.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Accidents fautifs = assurance responsabilité civile. Accidents non fautifs = ONIAM (solidarité nationale). CCI = conciliation gratuite. Trois types de responsabilité : civile, pénale, disciplinaire.</p></div>`
    },
    {
      title: "Démocratie sanitaire et droits collectifs des usagers",
      content: `<p class="mb-3">La <strong>démocratie sanitaire</strong> est un concept issu de la loi Kouchner qui désigne la participation des citoyens et des usagers aux décisions de santé. Elle repose sur la reconnaissance des <strong>droits collectifs</strong> des patients en complément de leurs droits individuels.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Associations d'usagers agréées</strong> : elles représentent les patients dans les instances de santé (conférences régionales de santé, conseils de surveillance des hôpitaux, HAS, CNAM). L'agrément est délivré par le ministre de la Santé pour 5 ans.</li>
<li><strong>Représentants des usagers</strong> (RU) : ils siègent dans les instances hospitalières et contribuent à l'amélioration de la qualité et de la sécurité des soins.</li>
<li><strong>Commissions des usagers</strong> (CDU, ex-CRUQPC) : présentes dans chaque établissement de santé, elles examinent les plaintes et réclamations et contribuent à la politique qualité.</li>
</ul>
<p class="mb-3">La <strong>loi HPST</strong> (2009) et la <strong>loi de modernisation du système de santé</strong> (2016) ont renforcé la démocratie sanitaire : création des conseils territoriaux de santé, participation des usagers aux projets régionaux de santé, développement des actions de groupe en santé.</p>
<p class="mb-3">L'<strong>éducation thérapeutique du patient</strong> (ETP), reconnue par la loi HPST, s'inscrit dans cette logique de démocratie sanitaire : elle vise à rendre le patient acteur de sa santé en lui donnant les compétences pour gérer sa maladie chronique au quotidien. L'ETP est un processus continu, intégré aux soins, qui comprend des activités d'apprentissage et de soutien psychosocial.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Démocratie sanitaire = participation des usagers aux décisions de santé. CDU = commission des usagers dans chaque établissement. L'ETP rend le patient acteur de sa santé (loi HPST 2009).</p></div>`
    }
  ]
},

"ssh-fin-de-vie": {
  introduction: "L'accompagnement de la fin de vie soulève des questions éthiques majeures, encadrées par les lois Leonetti et Claeys-Leonetti. Ce sujet est au carrefour du droit, de l'éthique, de la philosophie et de la médecine.",
  readTime: 20,
  sections: [
    {
      title: "La loi Leonetti (2005) : interdiction de l'obstination déraisonnable",
      content: `<p class="mb-3">La <strong>loi Leonetti du 22 avril 2005</strong> relative aux droits des malades et à la fin de vie constitue le premier cadre législatif spécifique en France. Elle est née du drame de <strong>Vincent Humbert</strong> (2003), un jeune tétraplégique qui avait demandé le droit de mourir.</p>
<p class="mb-3">Les apports majeurs de la loi Leonetti :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Interdiction de l'obstination déraisonnable</strong> (article L.1110-5-1) : les traitements ne doivent pas être poursuivis par obstination déraisonnable lorsqu'ils sont inutiles, disproportionnés ou n'ont pour effet que le maintien artificiel de la vie.</li>
<li><strong>Droit au refus de traitement</strong> : le patient peut refuser tout traitement, y compris ceux qui le maintiennent en vie. Le médecin doit respecter cette volonté après avoir informé des conséquences.</li>
<li><strong>Traitements à double effet</strong> : le médecin peut administrer des traitements antalgiques qui ont pour effet secondaire d'abréger la vie, à condition que l'intention soit de soulager la souffrance (principe du double effet).</li>
<li><strong>Procédure collégiale</strong> : lorsque le patient est hors d'état d'exprimer sa volonté, la décision de limiter ou d'arrêter les traitements est prise à l'issue d'une procédure collégiale associant l'équipe soignante et un médecin consultant extérieur.</li>
</ul>
<p class="mb-3">L'<strong>affaire Vincent Lambert</strong> (2008-2019) a illustré la complexité de l'application de cette loi dans les cas d'état végétatif chronique et les conflits familiaux qui peuvent en découler.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Loi Leonetti 2005 = interdiction de l'obstination déraisonnable + droit au refus de traitement + double effet. Procédure collégiale obligatoire si le patient ne peut s'exprimer.</p></div>`
    },
    {
      title: "La loi Claeys-Leonetti (2016) : sédation profonde et directives anticipées",
      content: `<p class="mb-3">La <strong>loi Claeys-Leonetti du 2 février 2016</strong> renforce les droits des patients en fin de vie en créant de nouveaux droits et en consolidant les dispositifs existants.</p>
<p class="mb-3">Les apports de la loi de 2016 :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Sédation profonde et continue maintenue jusqu'au décès</strong> (SPCMD, article L.1110-5-2) : droit à une sédation profonde et continue associée à une analgésie, provoquant une altération de la conscience jusqu'au décès, dans deux cas : patient en phase terminale avec souffrance réfractaire, ou patient dont la décision d'arrêt de traitement engage le pronostic vital à court terme.</li>
<li><strong>Directives anticipées contraignantes</strong> : les DA s'imposent désormais au médecin (alors qu'elles n'étaient que consultatives dans la loi de 2005), sauf urgence vitale le temps d'évaluer la situation, ou caractère manifestement inapproprié ou non conforme à la situation médicale.</li>
<li><strong>Renforcement du rôle de la personne de confiance</strong> : son témoignage prévaut sur tout autre témoignage non médical en l'absence de directives anticipées.</li>
<li><strong>Hydratation et alimentation artificielles</strong> : explicitement qualifiées de traitements (et non de soins de base), elles peuvent donc être arrêtées dans le cadre de la limitation des traitements.</li>
</ul>
<p class="mb-3">La <strong>hiérarchie décisionnelle</strong> en fin de vie est désormais claire : 1) directives anticipées, 2) témoignage de la personne de confiance, 3) témoignage de la famille ou des proches, 4) décision médicale collégiale.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Claeys-Leonetti 2016 = sédation profonde et continue jusqu'au décès + DA contraignantes. Hiérarchie : DA > personne de confiance > famille > décision collégiale. Alimentation/hydratation = traitements.</p></div>`
    },
    {
      title: "Directives anticipées et personne de confiance",
      content: `<p class="mb-3">Les <strong>directives anticipées</strong> (DA, article L.1111-11 CSP) permettent à toute personne majeure d'exprimer par écrit ses volontés relatives à sa fin de vie, notamment concernant les conditions de limitation ou d'arrêt de traitement. Elles sont :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Rédigées par écrit</strong>, datées et signées par leur auteur, avec indication de son identité complète.</li>
<li><strong>Révisables et révocables</strong> à tout moment et par tout moyen.</li>
<li><strong>Sans limite de validité</strong> (depuis 2016, elles n'expirent plus au bout de 3 ans comme dans la loi de 2005).</li>
<li><strong>Contraignantes pour le médecin</strong> (sauf urgence vitale ou caractère manifestement inapproprié, après procédure collégiale).</li>
</ul>
<p class="mb-3">Un modèle de DA a été établi par décret, distinguant deux situations : la personne se sait atteinte d'une affection grave, ou la personne ne se sait pas atteinte d'une affection grave. Les DA peuvent être conservées par le médecin traitant, l'hôpital, ou enregistrées sur Mon Espace Santé.</p>
<p class="mb-3">La <strong>personne de confiance</strong> (article L.1111-6) est une personne majeure désignée par écrit par le patient pour l'accompagner dans ses démarches de santé et être consultée si le patient ne peut plus exprimer sa volonté. Elle peut être un parent, un proche ou le médecin traitant. Sa désignation est révocable à tout moment.</p>
<p class="mb-3">En pratique, seule une minorité de Français ont rédigé leurs DA ou désigné une personne de confiance. L'information et la promotion de ces dispositifs restent un enjeu majeur de santé publique.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : DA = écrites, datées, signées, révisables, sans limite de validité, contraignantes. La personne de confiance = désignée par écrit, témoigne des volontés du patient. Peu de Français ont rédigé leurs DA.</p></div>`
    },
    {
      title: "Soins palliatifs : philosophie et organisation",
      content: `<p class="mb-3">Les <strong>soins palliatifs</strong> sont définis par la loi du 9 juin 1999 comme des soins actifs et continus pratiqués par une équipe interdisciplinaire en institution ou à domicile. Ils visent à soulager la douleur, apaiser la souffrance psychique, sauvegarder la dignité de la personne malade et soutenir son entourage.</p>
<p class="mb-3">Les principes fondamentaux des soins palliatifs :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Approche globale</strong> : prise en charge de la douleur physique mais aussi des souffrances psychologiques, sociales et spirituelles (concept de « souffrance globale » ou « total pain » de Cicely Saunders).</li>
<li><strong>Interdisciplinarité</strong> : médecins, infirmiers, psychologues, assistants sociaux, bénévoles, aumôniers travaillent ensemble.</li>
<li><strong>Ni accélérer ni retarder la mort</strong> : les soins palliatifs affirment la vie et considèrent la mort comme un processus naturel.</li>
<li><strong>Accompagnement des proches</strong> : soutien psychologique des familles, y compris dans le deuil.</li>
</ul>
<p class="mb-3">L'<strong>organisation des soins palliatifs</strong> en France comprend : les <strong>USP</strong> (Unités de Soins Palliatifs) pour les situations les plus complexes, les <strong>LISP</strong> (Lits Identifiés de Soins Palliatifs) dans les services hospitaliers, les <strong>EMSP</strong> (Équipes Mobiles de Soins Palliatifs) intervenant en transversalité, et les <strong>HAD</strong> (Hospitalisation à Domicile) pour le maintien à domicile.</p>
<p class="mb-3">Malgré plusieurs plans nationaux (2002, 2008, 2015, 2021), l'accès aux soins palliatifs reste inégal sur le territoire : de nombreux départements ne disposent pas d'USP, et seulement un tiers des patients qui en auraient besoin bénéficient effectivement de soins palliatifs.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Soins palliatifs = soins actifs, globaux, interdisciplinaires. Cicely Saunders = concept de souffrance globale. USP, LISP, EMSP, HAD = les quatre structures. Accès encore inégal sur le territoire.</p></div>`
    },
    {
      title: "Euthanasie, suicide assisté et débats contemporains",
      content: `<p class="mb-3">Le débat sur la fin de vie en France se structure autour de plusieurs notions qu'il est essentiel de distinguer :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Euthanasie active</strong> : acte délibéré d'un tiers (généralement un médecin) visant à provoquer la mort d'un patient à sa demande. Interdite en France (assimilée à un homicide, article 221-1 du Code pénal).</li>
<li><strong>Suicide assisté</strong> : mise à disposition d'un moyen létal que le patient s'administre lui-même. Interdit en France.</li>
<li><strong>Euthanasie passive</strong> (terme discuté) : arrêt ou limitation des traitements qui maintiennent artificiellement en vie. Autorisée par la loi Leonetti (on parle plutôt de « laisser mourir »).</li>
<li><strong>Sédation profonde et continue</strong> : altération de la conscience maintenue jusqu'au décès. Autorisée par la loi Claeys-Leonetti sous conditions strictes.</li>
</ul>
<p class="mb-3">La distinction entre sédation profonde et euthanasie repose sur le <strong>principe du double effet</strong> (Thomas d'Aquin) : l'intention est de soulager la souffrance (effet recherché), la mort étant un effet secondaire prévisible mais non recherché. C'est l'<strong>intention</strong> (soulager vs provoquer la mort) qui fait la différence juridique et éthique.</p>
<p class="mb-3">En <strong>Europe</strong>, les législations varient : euthanasie légale aux Pays-Bas (2002), en Belgique (2002) et au Luxembourg (2009). Suicide assisté légal en Suisse (accompagné par des associations comme Exit ou Dignitas). En 2025, un projet de loi français ouvrant l'aide active à mourir est en discussion au Parlement.</p>
<p class="mb-3">Les arguments du débat : <strong>pour</strong> l'aide active à mourir (autonomie, dignité, compassion, inégalité d'accès au suicide assisté à l'étranger) ; <strong>contre</strong> (interdit de tuer, risque de pente glissante, pression sur les vulnérables, développement insuffisant des soins palliatifs).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Euthanasie active et suicide assisté = interdits en France. Distinction sédation/euthanasie = intention (double effet). Pays-Bas et Belgique = euthanasie légale depuis 2002. Débat français en cours.</p></div>`
    }
  ]
},

"ssh-sante-publique": {
  introduction: "La santé publique vise à prévenir les maladies, prolonger la vie et promouvoir la santé par des efforts collectifs organisés. Elle mobilise des connaissances épidémiologiques, sociales et politiques.",
  readTime: 20,
  sections: [
    {
      title: "Définitions, concepts et déterminants de la santé",
      content: `<p class="mb-3">La <strong>santé</strong> est définie par l'OMS (1946) comme « un état de complet bien-être physique, mental et social, et ne consiste pas seulement en une absence de maladie ou d'infirmité ». Cette définition, bien que critiquée pour son caractère utopique, a le mérite de dépasser la vision purement biomédicale.</p>
<p class="mb-3">La <strong>santé publique</strong> se définit comme l'art et la science de prévenir les maladies, de prolonger la vie et de promouvoir la santé par des efforts collectifs organisés de la société (Winslow, 1920). Elle se distingue de la médecine clinique par son approche <strong>populationnelle</strong> (la population comme unité d'analyse) plutôt qu'individuelle.</p>
<p class="mb-3">Les <strong>déterminants de la santé</strong> (modèle de Dahlgren et Whitehead, 1991) sont organisés en couches concentriques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Facteurs biologiques et génétiques</strong> : sexe, âge, patrimoine génétique.</li>
<li><strong>Comportements individuels</strong> : tabac, alcool, alimentation, activité physique, conduites à risque.</li>
<li><strong>Réseaux sociaux et communautaires</strong> : soutien social, intégration, isolement.</li>
<li><strong>Conditions de vie et de travail</strong> : logement, emploi, éducation, accès aux soins, environnement.</li>
<li><strong>Conditions socio-économiques, culturelles et environnementales</strong> : niveau de richesse du pays, politiques publiques, contexte culturel.</li>
</ul>
<p class="mb-3">Le système de soins ne représente qu'environ <strong>20%</strong> des déterminants de la santé, les facteurs socio-économiques et environnementaux ayant un poids beaucoup plus important.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Santé (OMS 1946) = bien-être physique, mental et social. Les déterminants de santé sont multifactoriels (Dahlgren & Whitehead). Le système de soins ne représente que ~20% des déterminants de santé.</p></div>`
    },
    {
      title: "Les niveaux de prévention et la promotion de la santé",
      content: `<p class="mb-3">La prévention se décline en <strong>quatre niveaux</strong> (classification étendue de l'OMS) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Prévention primaire</strong> : agir avant l'apparition de la maladie pour en empêcher la survenue. Exemples : vaccination, éducation à la santé, lutte contre le tabagisme, amélioration des conditions de travail, fluoruration de l'eau.</li>
<li><strong>Prévention secondaire</strong> : détecter la maladie à un stade précoce pour intervenir rapidement (dépistage). Exemples : dépistage néonatal (phénylcétonurie, hypothyroïdie), mammographie de dépistage du cancer du sein, frottis cervico-utérin, dépistage du cancer colorectal.</li>
<li><strong>Prévention tertiaire</strong> : réduire les complications et les récidives d'une maladie déjà installée. Exemples : rééducation post-AVC, prévention des rechutes en addictologie, réadaptation cardiaque.</li>
<li><strong>Prévention quaternaire</strong> (Jamoulle, 1986) : éviter la surmédicalisation et les interventions inutiles, protéger le patient contre l'excès de médecine. Elle lutte contre le surdiagnostic et le surtraitement.</li>
</ul>
<p class="mb-3">La <strong>promotion de la santé</strong>, définie par la <strong>Charte d'Ottawa</strong> (OMS, 1986), vise à donner aux individus les moyens de mieux maîtriser les déterminants de leur santé. Elle repose sur cinq stratégies : élaborer des politiques publiques saines, créer des environnements favorables, renforcer l'action communautaire, développer les aptitudes personnelles, réorienter les services de santé.</p>
<p class="mb-3">La distinction entre <strong>éducation pour la santé</strong> (information et apprentissage de comportements favorables) et <strong>promotion de la santé</strong> (action sur l'environnement et les politiques) est fondamentale : la promotion de la santé dépasse la responsabilisation individuelle pour agir sur les déterminants structurels.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : 4 niveaux de prévention : primaire (empêcher), secondaire (dépister), tertiaire (complications), quaternaire (surmédicalisation). Charte d'Ottawa 1986 = 5 stratégies de promotion de la santé.</p></div>`
    },
    {
      title: "Épidémiologie et indicateurs de santé",
      content: `<p class="mb-3">L'<strong>épidémiologie</strong> est la science qui étudie la distribution et les déterminants des maladies dans les populations. C'est le fondement scientifique de la santé publique.</p>
<p class="mb-3">Les principaux <strong>indicateurs de santé</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Espérance de vie à la naissance</strong> : nombre moyen d'années qu'un nouveau-né peut espérer vivre (France : ~79 ans pour les hommes, ~85 ans pour les femmes).</li>
<li><strong>Espérance de vie en bonne santé</strong> (EVBS ou EVSI) : nombre d'années vécues sans incapacité (~64 ans en France).</li>
<li><strong>Mortalité infantile</strong> : décès avant 1 an / naissances vivantes (France : ~3,5 pour mille).</li>
<li><strong>DALY</strong> (Disability-Adjusted Life Years) : années de vie perdues en raison de la mortalité prématurée et de l'incapacité.</li>
<li><strong>QALY</strong> (Quality-Adjusted Life Years) : années de vie ajustées sur la qualité, utilisées dans les évaluations médico-économiques.</li>
</ul>
<p class="mb-3">Les mesures épidémiologiques fondamentales :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Incidence</strong> : nombre de nouveaux cas dans une période donnée / population à risque.</li>
<li><strong>Prévalence</strong> : nombre total de cas existants à un moment donné / population totale.</li>
<li><strong>Risque relatif</strong> (RR) : rapport entre l'incidence chez les exposés et les non-exposés (études de cohorte).</li>
<li><strong>Odds ratio</strong> (OR) : rapport des cotes d'exposition, utilisé dans les études cas-témoins.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Incidence = nouveaux cas, prévalence = cas existants. DALY = années de vie perdues (mortalité + incapacité). QALY = années de vie ajustées sur la qualité. RR = études de cohorte, OR = études cas-témoins.</p></div>`
    },
    {
      title: "Acteurs et organisation de la santé publique en France",
      content: `<p class="mb-3">Le système de <strong>santé publique français</strong> s'organise autour de plusieurs niveaux institutionnels :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Niveau national</strong> : le ministère chargé de la Santé définit la politique de santé publique. La <strong>Stratégie Nationale de Santé</strong> (SNS) fixe les priorités pluriannuelles.</li>
<li><strong>Agences sanitaires</strong> : <strong>Santé publique France</strong> (surveillance épidémiologique, veille sanitaire, promotion de la santé), <strong>HAS</strong> (Haute Autorité de Santé : recommandations, évaluation des médicaments et dispositifs, certification des établissements), <strong>ANSM</strong> (sécurité du médicament), <strong>Agence de la biomédecine</strong> (greffes, AMP, génétique).</li>
<li><strong>Niveau régional</strong> : les <strong>ARS</strong> (Agences Régionales de Santé, créées par la loi HPST 2009) pilotent la politique de santé à l'échelon régional. Elles élaborent le <strong>Projet Régional de Santé</strong> (PRS) et coordonnent l'offre de soins, la prévention et le médico-social.</li>
<li><strong>Niveau local</strong> : communes, intercommunalités, contrats locaux de santé (CLS), ateliers santé-ville.</li>
</ul>
<p class="mb-3">La <strong>veille sanitaire</strong> repose sur des systèmes de surveillance (déclarations obligatoires des maladies, réseaux sentinelles, centres nationaux de référence) et des dispositifs d'alerte (signalements, gestion des crises sanitaires). Le <strong>Haut Conseil de la santé publique</strong> (HCSP) fournit des avis et recommandations d'experts.</p>
<p class="mb-3">Les <strong>plans nationaux de santé publique</strong> ciblent des pathologies ou des thématiques prioritaires : plans cancer (depuis 2003), plan national nutrition santé (PNNS), plans maladies chroniques, plans addictions, etc.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : ARS (loi HPST 2009) = pilotage régional de la santé. Santé publique France = veille et surveillance. HAS = recommandations et certification. SNS = Stratégie Nationale de Santé.</p></div>`
    },
    {
      title: "Vaccinations, dépistages et grands enjeux de santé publique",
      content: `<p class="mb-3">La <strong>vaccination</strong> est l'intervention de santé publique la plus efficace après l'accès à l'eau potable. En France, le calendrier vaccinal est établi par la HAS et le ministère de la Santé :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>11 vaccinations obligatoires</strong> pour les enfants nés depuis le 1er janvier 2018 : diphtérie, tétanos, poliomyélite, coqueluche, Haemophilus influenzae b, hépatite B, méningocoque C, pneumocoque, rougeole, oreillons, rubéole.</li>
<li>Le concept d'<strong>immunité collective</strong> (ou immunité de groupe) : lorsqu'une proportion suffisante de la population est immunisée, la propagation de l'agent infectieux est freinée, protégeant indirectement les personnes non vaccinées.</li>
<li>L'<strong>hésitation vaccinale</strong>, identifiée par l'OMS comme l'une des 10 menaces pour la santé mondiale (2019), désigne le retard ou le refus de vaccination malgré la disponibilité des vaccins.</li>
</ul>
<p class="mb-3">Les <strong>programmes de dépistage organisé</strong> en France concernent : le cancer du sein (mammographie tous les 2 ans de 50 à 74 ans), le cancer colorectal (test immunologique tous les 2 ans de 50 à 74 ans), le cancer du col de l'utérus (frottis de 25 à 65 ans). Le dépistage néonatal systématique recherche 13 maladies rares (phénylcétonurie, drépanocytose, mucoviscidose, etc.).</p>
<p class="mb-3">Les <strong>grands enjeux actuels</strong> de la santé publique : maladies chroniques (diabète, cancers, maladies cardiovasculaires = premières causes de mortalité), addictions (tabac, alcool, drogues), santé mentale, antibiorésistance, pandémies émergentes, vieillissement de la population, inégalités territoriales de santé (déserts médicaux).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : 11 vaccins obligatoires depuis 2018. Immunité collective = protection indirecte. 3 dépistages organisés (sein, colorectal, col utérin). Maladies chroniques = première cause de mortalité.</p></div>`
    }
  ]
},

"ssh-systeme-sante": {
  introduction: "Le système de santé français repose sur l'assurance maladie obligatoire et un réseau de soins mixte (public/privé). Comprendre son organisation, son financement et ses enjeux est essentiel pour tout futur professionnel de santé.",
  readTime: 20,
  sections: [
    {
      title: "Modèles de systèmes de santé et spécificités françaises",
      content: `<p class="mb-3">Les systèmes de santé dans le monde se structurent autour de deux grands modèles historiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Modèle bismarckien</strong> (Allemagne, 1883) : financement par des <strong>cotisations sociales</strong> prélevées sur les salaires (patronales et salariales). Les caisses d'assurance maladie gèrent le système. Principe : assurance professionnelle obligatoire.</li>
<li><strong>Modèle beveridgien</strong> (Royaume-Uni, 1942) : financement par l'<strong>impôt</strong>. Le NHS (National Health Service) offre des soins gratuits à tous les résidents. Principe : universalité et accès gratuit.</li>
<li><strong>Modèle libéral</strong> (États-Unis) : prédominance du secteur privé et des assurances privées. Couverture publique limitée (Medicare, Medicaid).</li>
</ul>
<p class="mb-3">Le système français est un <strong>modèle bismarckien</strong> historiquement, mais il a évolué vers un modèle <strong>mixte</strong> avec une composante beveridgienne croissante. En effet, la part du financement fiscal (CSG, impôts et taxes affectés) dépasse désormais celle des cotisations sociales traditionnelles. La <strong>Sécurité sociale</strong>, créée par les ordonnances de 1945, repose sur le principe de solidarité nationale.</p>
<p class="mb-3">La <strong>Protection Universelle Maladie</strong> (PUMa, 2016) a remplacé la CMU de base en garantissant la prise en charge des frais de santé à toute personne résidant de manière stable et régulière en France, indépendamment de son activité professionnelle.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Système français = bismarckien historiquement, mixte aujourd'hui (cotisations + CSG/impôts). Sécurité sociale = 1945. PUMa (2016) = couverture universelle pour tout résident stable et régulier.</p></div>`
    },
    {
      title: "Financement du système de santé",
      content: `<p class="mb-3">Le financement du système de santé français mobilise plusieurs sources :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Assurance maladie obligatoire</strong> (AMO) : branche maladie de la Sécurité sociale, financée par les cotisations sociales et la CSG. Elle prend en charge environ 78% de la <strong>CSBM</strong> (Consommation de Soins et de Biens Médicaux).</li>
<li><strong>Assurances complémentaires</strong> : mutuelles, institutions de prévoyance, assurances privées. Elles couvrent le <strong>ticket modérateur</strong> (part restant à la charge du patient après remboursement de l'AMO) et certains dépassements d'honoraires. Environ 13% de la CSBM.</li>
<li><strong>Reste à charge des ménages</strong> : environ 7% de la CSBM (l'un des plus faibles de l'OCDE).</li>
<li><strong>État et collectivités</strong> : prises en charge spécifiques (AME, prévention).</li>
</ul>
<p class="mb-3">La <strong>Complémentaire Santé Solidaire</strong> (C2S, ex-CMU-C et ACS) offre une complémentaire gratuite ou à faible coût aux personnes à revenus modestes. L'<strong>AME</strong> (Aide Médicale de l'État) couvre les soins des personnes en situation irrégulière sous conditions de ressources.</p>
<p class="mb-3">Les dépenses de santé en France représentent environ <strong>12% du PIB</strong>, soit parmi les niveaux les plus élevés de l'OCDE. L'<strong>ONDAM</strong> (Objectif National de Dépenses d'Assurance Maladie), voté chaque année en loi de financement de la Sécurité sociale (LFSS), fixe le plafond des dépenses remboursées.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : AMO = ~78% de la CSBM, complémentaires = ~13%, reste à charge = ~7%. C2S = complémentaire pour les revenus modestes. Dépenses de santé = ~12% du PIB. ONDAM = plafond voté en LFSS.</p></div>`
    },
    {
      title: "Organisation de l'offre de soins",
      content: `<p class="mb-3">L'offre de soins s'organise autour de deux grands secteurs :</p>
<p class="mb-3"><strong>Les soins de ville (soins ambulatoires) :</strong></p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Médecins libéraux</strong> : généralistes et spécialistes exerçant en cabinet. Liberté d'installation (avec des incitations pour les zones sous-dotées).</li>
<li><strong>Pharmacies d'officine</strong> : monopole pharmaceutique, rôle de proximité, dispensation et conseil.</li>
<li><strong>Professions paramédicales</strong> : infirmiers, kinésithérapeutes, orthophonistes, sages-femmes, etc.</li>
<li><strong>Maisons de santé pluriprofessionnelles</strong> (MSP) et <strong>CPTS</strong> (Communautés Professionnelles Territoriales de Santé) : organisations coordonnées de l'exercice ambulatoire.</li>
</ul>
<p class="mb-3"><strong>Les établissements de santé :</strong></p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Hôpitaux publics</strong> : CHU (Centres Hospitaliers Universitaires, triple mission de soins, enseignement et recherche), CH (Centres Hospitaliers), hôpitaux locaux.</li>
<li><strong>ESPIC</strong> (Établissements de Santé Privés d'Intérêt Collectif) : statut privé à but non lucratif, missions de service public.</li>
<li><strong>Cliniques privées à but lucratif</strong> : essentiellement chirurgie programmée et obstétrique.</li>
</ul>
<p class="mb-3">Le <strong>parcours de soins coordonné</strong> (loi du 13 août 2004) repose sur la déclaration d'un <strong>médecin traitant</strong> qui oriente le patient vers les spécialistes. Le non-respect du parcours entraîne des majorations du ticket modérateur.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Soins de ville = médecins libéraux, pharmacies, paramédicaux. Hôpital = CHU (soins + enseignement + recherche), CH, ESPIC, cliniques privées. Médecin traitant = clé du parcours de soins coordonné (2004).</p></div>`
    },
    {
      title: "Modes de financement des établissements et des professionnels",
      content: `<p class="mb-3">Les modes de rémunération des professionnels et de financement des établissements déterminent en grande partie le fonctionnement du système :</p>
<p class="mb-3"><strong>Rémunération des professionnels libéraux :</strong></p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Paiement à l'acte</strong> : mode de rémunération traditionnel en France. Chaque acte est codifié et tarifé selon la <strong>CCAM</strong> (Classification Commune des Actes Médicaux) et la <strong>NGAP</strong> (Nomenclature Générale des Actes Professionnels).</li>
<li><strong>Secteur 1</strong> : tarifs conventionnés sans dépassement d'honoraires. <strong>Secteur 2</strong> : honoraires libres avec dépassements autorisés (pratique « à tact et mesure »). <strong>OPTAM</strong> : engagement de modération des dépassements.</li>
<li><strong>Forfaits et rémunérations sur objectifs</strong> : la ROSP (Rémunération sur Objectifs de Santé Publique) complète le paiement à l'acte par des primes liées à la qualité de la prise en charge.</li>
</ul>
<p class="mb-3"><strong>Financement des établissements :</strong></p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>T2A</strong> (Tarification à l'Activité, depuis 2004) : chaque séjour hospitalier est classé dans un <strong>GHM</strong> (Groupe Homogène de Malades) auquel correspond un <strong>GHS</strong> (Groupe Homogène de Séjours) tarifé. Avantages : transparence, productivité. Limites : course à l'activité, inadaptation aux pathologies chroniques.</li>
<li><strong>MIGAC</strong> (Missions d'Intérêt Général et d'Aide à la Contractualisation) : financements complémentaires pour les missions non couvertes par la T2A (recherche, enseignement, précarité).</li>
<li>Réforme en cours : évolution vers des financements mixtes intégrant la qualité, la pertinence et la population desservie.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : T2A (2004) = financement à l'activité par GHM/GHS. Secteur 1 = tarifs conventionnés, secteur 2 = dépassements. La T2A est critiquée pour la course à l'activité et son inadaptation aux pathologies chroniques.</p></div>`
    },
    {
      title: "Enjeux contemporains du système de santé",
      content: `<p class="mb-3">Le système de santé français, classé parmi les meilleurs au monde par l'OMS en 2000, fait face à des <strong>défis majeurs</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Vieillissement de la population</strong> : augmentation des maladies chroniques, de la dépendance et des besoins en soins de long terme. Le nombre de personnes de plus de 85 ans va tripler d'ici 2050.</li>
<li><strong>Déserts médicaux</strong> : inégalités territoriales d'accès aux soins. Certaines zones manquent cruellement de médecins, notamment généralistes. Les mesures incitatives (aides à l'installation, CESP, maisons de santé) ont un impact limité.</li>
<li><strong>Maîtrise des dépenses</strong> : tension entre qualité des soins et soutenabilité financière. La pertinence des soins (éviter les actes inutiles) est un levier majeur.</li>
<li><strong>Virage ambulatoire</strong> : développement de la chirurgie ambulatoire et des alternatives à l'hospitalisation complète (HAD, SSIAD).</li>
<li><strong>Attractivité des métiers de santé</strong> : crise hospitalière, burn-out des soignants, difficultés de recrutement, enjeux de la formation (suppression du numerus clausus remplacé par le numerus apertus en 2020).</li>
</ul>
<p class="mb-3">Le <strong>numérique en santé</strong> transforme le système : Mon Espace Santé (DMP + messagerie sécurisée), télémédecine en expansion depuis le COVID-19, intelligence artificielle en aide au diagnostic, objets connectés de santé. Ces innovations soulèvent des questions d'équité (fracture numérique), de protection des données et de régulation.</p>
<p class="mb-3">La <strong>coordination des soins</strong> entre ville et hôpital, entre sanitaire et médico-social, reste un défi structurel. Les dispositifs d'appui à la coordination (DAC), les CPTS et les IPA (Infirmiers en Pratique Avancée) visent à améliorer cette articulation.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Enjeux majeurs : vieillissement, déserts médicaux, maîtrise des dépenses, virage ambulatoire, attractivité des métiers. Numerus clausus supprimé en 2020 (remplacé par le numerus apertus). Le numérique transforme le système.</p></div>`
    }
  ]
},

"ssh-sociologie": {
  introduction: "La sociologie de la santé étudie les déterminants sociaux de la santé, les inégalités et les comportements face à la maladie. Elle montre que la santé et la maladie sont des phénomènes profondément sociaux.",
  readTime: 20,
  sections: [
    {
      title: "La santé et la maladie comme constructions sociales",
      content: `<p class="mb-3">La sociologie de la santé repose sur un postulat fondamental : la santé et la maladie ne sont pas seulement des réalités biologiques mais aussi des <strong>constructions sociales</strong>. Ce qu'une société considère comme « normal » ou « pathologique » varie selon les époques, les cultures et les contextes sociaux.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Canguilhem</strong> (Le Normal et le Pathologique, 1943) : la distinction entre normal et pathologique n'est pas purement statistique. Le pathologique n'est pas un simple écart quantitatif par rapport à la norme, mais une <strong>normativité réduite</strong> — la maladie est l'incapacité d'instaurer de nouvelles normes de vie.</li>
<li><strong>Parsons</strong> (1951) : le <strong>rôle de malade</strong> (sick role) est un statut social temporaire qui libère l'individu de ses obligations sociales (travail, responsabilités) à deux conditions : il n'est pas responsable de sa maladie et il cherche activement à guérir en coopérant avec le médecin.</li>
<li><strong>Freidson</strong> (1970) : la profession médicale exerce un <strong>monopole</strong> sur la définition légitime de la maladie. Le médecin est un « entrepreneur moral » qui labellise les comportements comme normaux ou pathologiques.</li>
</ul>
<p class="mb-3">La <strong>médicalisation</strong> désigne le processus par lequel des problèmes auparavant non médicaux (tristesse, timidité, hyperactivité, ménopause) sont redéfinis comme des pathologies nécessitant une intervention médicale. Ce processus étend le pouvoir médical et l'industrie pharmaceutique à de nouveaux domaines de la vie sociale.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Santé/maladie = constructions sociales. Parsons : sick role = libération temporaire des obligations si le malade cherche à guérir. Freidson : la médecine a un monopole sur la définition de la maladie. Médicalisation = extension du champ médical.</p></div>`
    },
    {
      title: "Les inégalités sociales de santé : le gradient social",
      content: `<p class="mb-3">Les <strong>inégalités sociales de santé</strong> (ISS) constituent l'un des constats les plus robustes de la sociologie et de l'épidémiologie. Elles ne se limitent pas à la pauvreté mais forment un <strong>gradient continu</strong> : à chaque marche descendue dans l'échelle sociale, la santé se dégrade.</p>
<p class="mb-3">Les données françaises sont éloquentes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>L'espérance de vie à 35 ans diffère de <strong>~13 ans</strong> entre un ouvrier et un cadre supérieur masculin.</li>
<li>L'espérance de vie en bonne santé (sans incapacité) diffère encore davantage : les ouvriers passent plus d'années en mauvaise santé.</li>
<li>La mortalité par cancer est 2 à 3 fois plus élevée chez les ouvriers que chez les cadres.</li>
<li>L'obésité touche 3 fois plus les enfants d'ouvriers que les enfants de cadres.</li>
</ul>
<p class="mb-3"><strong>Michael Marmot</strong> (études Whitehall I et II, fonctionnaires britanniques) a démontré que les ISS ne s'expliquent pas seulement par la pauvreté absolue mais par la <strong>position relative</strong> dans la hiérarchie sociale. Même parmi des populations non pauvres, le gradient persiste. Marmot identifie le manque de <strong>contrôle sur sa vie</strong> (autonomie, latitude décisionnelle) comme un mécanisme clé.</p>
<p class="mb-3">Le modèle de <strong>Dahlgren et Whitehead</strong> (1991) représente les déterminants de santé en couches concentriques : du noyau biologique aux conditions socio-économiques générales, en passant par les comportements individuels, les réseaux sociaux et les conditions de vie et de travail.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : ISS = gradient continu (pas seulement pauvreté). Marmot : position relative + contrôle sur sa vie. Écart d'espérance de vie de ~13 ans entre ouvriers et cadres. Modèle de Dahlgren & Whitehead = couches concentriques de déterminants.</p></div>`
    },
    {
      title: "Sociologie des professions de santé et de la relation de soin",
      content: `<p class="mb-3">La sociologie des professions de santé analyse les rapports de pouvoir, les identités professionnelles et les dynamiques qui structurent le monde du soin.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Freidson</strong> (La Profession médicale, 1970) : la médecine est une <strong>profession dominante</strong> qui se caractérise par l'autonomie professionnelle (contrôle sur le contenu du travail), le monopole du diagnostic et du traitement, et la capacité à définir ce qui relève de la maladie.</li>
<li><strong>Hughes</strong> : les professions se définissent par le « mandat » (autorité à définir les pratiques légitimes) et la « licence » (autorisation légale d'exercer). Les professions de santé forment un système hiérarchisé avec la médecine au sommet.</li>
<li><strong>Abbott</strong> (The System of Professions, 1988) : les professions sont en compétition permanente pour le contrôle de « juridictions » (domaines d'expertise). Les transferts de compétences (ex : IPA) modifient ces frontières professionnelles.</li>
</ul>
<p class="mb-3">La <strong>relation médecin-patient</strong> a évolué selon plusieurs modèles :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Modèle paternaliste</strong> : le médecin sait et décide, le patient obéit (modèle traditionnel).</li>
<li><strong>Modèle informatif</strong> : le médecin informe, le patient décide seul (consommateur de soins).</li>
<li><strong>Modèle délibératif</strong> : le médecin et le patient décident ensemble (décision partagée). C'est le modèle promu actuellement, cohérent avec la démocratie sanitaire.</li>
<li><strong>Patient expert</strong> : dans les maladies chroniques, le patient développe une expertise expérientielle reconnue.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Freidson : médecine = profession dominante. La relation médecin-patient a évolué du paternalisme vers la décision partagée. Patient expert = expertise expérientielle dans les maladies chroniques.</p></div>`
    },
    {
      title: "Stigmatisation, déviance et expérience de la maladie",
      content: `<p class="mb-3">La sociologie étudie la maladie non seulement comme fait biologique mais comme <strong>expérience vécue</strong> et comme phénomène social porteur de significations et de conséquences identitaires.</p>
<p class="mb-3"><strong>Erving Goffman</strong> (Stigmate, 1963) a théorisé la notion de <strong>stigmatisation</strong> : un attribut qui disqualifie socialement l'individu. En santé, certaines maladies sont particulièrement stigmatisantes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Maladies mentales</strong> : la folie reste associée à la dangerosité, l'incompétence, l'imprévisibilité. Le stigma est un obstacle majeur au recours aux soins psychiatriques.</li>
<li><strong>VIH/sida</strong> : stigmatisation liée à la sexualité, aux conduites « déviantes » et à la peur de la contagion.</li>
<li><strong>Obésité</strong> : stigmatisation fondée sur la responsabilité individuelle présumée (« c'est de sa faute »).</li>
<li><strong>Handicap</strong> : stigmatisation liée à l'écart par rapport à la norme corporelle (Goffman : « identité sociale virtuelle » vs « identité sociale réelle »).</li>
</ul>
<p class="mb-3"><strong>Bourdieu</strong> explique les comportements de santé par l'<strong>habitus</strong> : les dispositions acquises au cours de la socialisation déterminent les pratiques alimentaires, le rapport au corps, le recours aux soins, la perception du risque. L'habitus est lié au <strong>capital culturel</strong> (niveau d'éducation), au <strong>capital économique</strong> (revenus) et au <strong>capital social</strong> (réseau de relations).</p>
<p class="mb-3">La sociologie de l'<strong>expérience de la maladie chronique</strong> (Bury, 1982) montre que la maladie chronique constitue une « rupture biographique » : elle bouleverse l'identité, les projets de vie et les relations sociales du malade, qui doit reconstruire un sens à son existence avec la maladie.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Goffman : stigmate = attribut disqualifiant socialement. Bourdieu : habitus + capitaux déterminent les comportements de santé. Bury : maladie chronique = rupture biographique bouleversant l'identité.</p></div>`
    },
    {
      title: "Sociologie de la santé publique et des politiques de santé",
      content: `<p class="mb-3">La sociologie analyse les <strong>politiques de santé publique</strong> comme des interventions qui ne sont jamais neutres socialement : elles reflètent des choix de société, des rapports de pouvoir et des représentations de la santé et de la responsabilité.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Responsabilisation individuelle vs déterminants structurels</strong> : les politiques de santé oscillent entre l'approche comportementale (inciter les individus à adopter des comportements sains) et l'approche structurelle (agir sur les conditions de vie, l'environnement, les politiques sociales). La sociologie critique montre que la responsabilisation individuelle tend à « blâmer la victime » (victim blaming).</li>
<li><strong>Empowerment</strong> : concept issu de la promotion de la santé qui vise à renforcer la capacité des individus et des communautés à agir sur les déterminants de leur santé. Il peut être individuel (compétences, confiance en soi) ou communautaire (action collective).</li>
<li><strong>Inégalités d'accès aux soins</strong> : au-delà des barrières financières (reste à charge, dépassements d'honoraires), des barrières géographiques (déserts médicaux), culturelles (littératie en santé) et sociales (discrimination, non-recours aux droits) limitent l'accès effectif aux soins.</li>
</ul>
<p class="mb-3">Le <strong>non-recours aux droits et aux soins</strong> est un phénomène massif : de nombreuses personnes éligibles à des prestations sociales ou à des dispositifs de santé n'y recourent pas, par méconnaissance, complexité administrative, honte ou sentiment d'illégitimité. Ce non-recours aggrave les inégalités de santé.</p>
<p class="mb-3">La <strong>sociologie des risques sanitaires</strong> (Beck, La Société du risque, 1986) analyse la perception sociale des risques : la confiance dans les institutions (État, expertise scientifique) est un déterminant majeur de l'acceptation des mesures de santé publique, comme l'ont montré les controverses vaccinales et la crise du COVID-19.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Les politiques de santé oscillent entre responsabilisation individuelle et action structurelle. Le non-recours aux droits aggrave les ISS. Beck : société du risque et confiance dans les institutions.</p></div>`
    }
  ]
},

"ssh-psychologie": {
  introduction: "La psychologie médicale étudie les aspects psychologiques de la maladie, de la relation soignant-soigné et des comportements de santé. Elle est indispensable pour une prise en charge globale du patient.",
  readTime: 20,
  sections: [
    {
      title: "Mécanismes de défense et réactions psychologiques face à la maladie",
      content: `<p class="mb-3">L'annonce d'une maladie grave constitue un <strong>traumatisme psychologique</strong> qui mobilise des mécanismes de défense inconscients permettant au patient de faire face à l'angoisse générée par la situation.</p>
<p class="mb-3">Les principaux <strong>mécanismes de défense</strong> du patient :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Déni</strong> : refus de reconnaître la réalité de la maladie. Mécanisme fréquent lors de l'annonce diagnostique. Peut être transitoire (adaptatif) ou massif et durable (pathologique, entravant les soins).</li>
<li><strong>Régression</strong> : retour à des comportements infantiles (dépendance, passivité, demandes affectives). La régression institutionnelle est favorisée par l'hospitalisation.</li>
<li><strong>Projection</strong> : attribution à l'extérieur (médecin, entourage, environnement) de la cause de sa maladie ou de ses émotions négatives (agressivité envers les soignants).</li>
<li><strong>Rationalisation</strong> : explication intellectuelle et logique de la maladie pour éviter le contact avec les émotions (« j'ai un cancer parce que j'ai été exposé à tel produit »).</li>
<li><strong>Sublimation</strong> : transformation de l'énergie liée à la souffrance en activité socialement valorisée (engagement associatif, création artistique).</li>
<li><strong>Isolation</strong> : séparation entre le contenu de la pensée et l'affect associé (le patient parle de sa maladie sans émotion apparente).</li>
</ul>
<p class="mb-3">Les soignants développent également des <strong>mécanismes de défense</strong> face à la souffrance des patients : banalisation, esquive relationnelle, fausse réassurance, fuite en avant, identification projective. La prise de conscience de ces mécanismes est essentielle pour préserver la qualité de la relation thérapeutique.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Mécanismes de défense du patient : déni, régression, projection, rationalisation, sublimation, isolation. Les soignants ont aussi des mécanismes de défense (banalisation, esquive, fausse réassurance).</p></div>`
    },
    {
      title: "Le processus de deuil et l'annonce diagnostique",
      content: `<p class="mb-3"><strong>Elisabeth Kübler-Ross</strong> (On Death and Dying, 1969) a décrit cinq <strong>étapes du deuil</strong> traversées par le patient confronté à une maladie grave ou à la mort :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Déni</strong> : « Non, pas moi, c'est impossible. » Refus initial de la réalité.</li>
<li><strong>Colère</strong> : « Pourquoi moi ? » Révolte contre l'injustice de la situation.</li>
<li><strong>Marchandage</strong> : « Si je guéris, je promets de... » Tentative de négociation avec le destin.</li>
<li><strong>Dépression</strong> : prise de conscience de la perte. Tristesse, retrait, anticipation du deuil.</li>
<li><strong>Acceptation</strong> : « Je suis en paix. » Acceptation sereine de la réalité (à ne pas confondre avec la résignation).</li>
</ul>
<p class="mb-3">Ces étapes ne sont <strong>pas linéaires</strong> : le patient peut revenir à une étape antérieure, vivre plusieurs étapes simultanément ou ne jamais atteindre l'acceptation. Ce modèle s'applique aussi au deuil des proches et à toute perte significative (emploi, divorce, amputation).</p>
<p class="mb-3">L'<strong>annonce diagnostique</strong> d'une maladie grave est un moment charnière qui nécessite des compétences relationnelles spécifiques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dispositif d'annonce en cancérologie</strong> (Plan Cancer, 2003) : temps médical dédié, temps d'accompagnement soignant (infirmier d'annonce), accès aux soins de support, articulation avec la médecine de ville.</li>
<li><strong>Protocole SPIKES</strong> (Buckman) : Setting (cadre), Perception (évaluer ce que sait le patient), Invitation (demander ce qu'il souhaite savoir), Knowledge (donner l'information), Emotions (répondre aux émotions), Strategy/Summary (planifier la suite).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Kübler-Ross : déni, colère, marchandage, dépression, acceptation (étapes non linéaires). Dispositif d'annonce = Plan Cancer. Protocole SPIKES = 6 étapes pour l'annonce diagnostique.</p></div>`
    },
    {
      title: "La relation soignant-soigné et ses modèles",
      content: `<p class="mb-3">La <strong>relation soignant-soigné</strong> est une relation asymétrique (le soignant détient un savoir et un pouvoir que le patient n'a pas) mais fondée sur la confiance et le respect mutuel. Elle constitue un outil thérapeutique à part entière.</p>
<p class="mb-3">Les dimensions de la relation thérapeutique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Empathie</strong> : capacité à comprendre l'expérience émotionnelle du patient sans s'y confondre. L'empathie clinique combine une dimension cognitive (comprendre) et une dimension affective (ressentir) tout en maintenant une distance professionnelle.</li>
<li><strong>Transfert</strong> : le patient projette sur le soignant des sentiments et attitudes issus de ses relations passées (figure parentale, autorité). Le soignant doit en être conscient pour ne pas y réagir de manière inappropriée.</li>
<li><strong>Contre-transfert</strong> : réactions émotionnelles du soignant envers le patient, liées à ses propres expériences et conflits internes. Sa reconnaissance est essentielle pour préserver l'objectivité du soin.</li>
<li><strong>Alliance thérapeutique</strong> : accord entre le patient et le soignant sur les objectifs du traitement et les moyens pour y parvenir. C'est l'un des meilleurs prédicteurs de l'efficacité thérapeutique.</li>
</ul>
<p class="mb-3">L'<strong>écoute active</strong> est la compétence relationnelle fondamentale du soignant. Elle comprend : la reformulation (reprendre les propos du patient pour vérifier la compréhension), les questions ouvertes (favorisant l'expression), le silence (laisser le patient élaborer sa pensée), la validation émotionnelle (reconnaître les émotions du patient comme légitimes).</p>
<p class="mb-3"><strong>Carl Rogers</strong> a défini trois conditions nécessaires à une relation d'aide efficace : l'<strong>empathie</strong>, la <strong>congruence</strong> (authenticité du soignant) et le <strong>regard positif inconditionnel</strong> (acceptation sans jugement).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Empathie = comprendre sans se confondre. Transfert et contre-transfert = à reconnaître. Rogers : empathie + congruence + regard positif inconditionnel. L'écoute active = compétence fondamentale.</p></div>`
    },
    {
      title: "Observance thérapeutique et modèles de comportements de santé",
      content: `<p class="mb-3">L'<strong>observance thérapeutique</strong> (ou adhésion thérapeutique) désigne l'adéquation entre le comportement du patient et les prescriptions médicales. On estime que 30 à 50% des patients souffrant de maladies chroniques ne suivent pas correctement leur traitement, ce qui a des conséquences majeures en termes de morbi-mortalité et de coûts de santé.</p>
<p class="mb-3">Les <strong>facteurs influençant l'observance</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Liés au traitement</strong> : complexité du schéma thérapeutique, effets indésirables, durée du traitement, nombre de médicaments.</li>
<li><strong>Liés au patient</strong> : croyances et représentations de la maladie, motivation, capacités cognitives, troubles psychiatriques, isolement social.</li>
<li><strong>Liés à la relation soignant-soigné</strong> : qualité de la communication, confiance, décision partagée, suivi régulier.</li>
<li><strong>Liés au système de santé</strong> : accès aux soins, coût des traitements, temps de consultation.</li>
</ul>
<p class="mb-3">Les <strong>modèles théoriques</strong> des comportements de santé :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Health Belief Model</strong> (Rosenstock, 1966) : l'adoption d'un comportement de santé dépend de la perception de la vulnérabilité, de la gravité, des bénéfices et des barrières, et de l'auto-efficacité.</li>
<li><strong>Théorie de l'action raisonnée</strong> (Fishbein & Ajzen) : le comportement est déterminé par l'intention, elle-même influencée par les attitudes et les normes subjectives.</li>
<li><strong>Modèle transthéorique du changement</strong> (Prochaska & DiClemente) : six stades — pré-contemplation, contemplation, préparation, action, maintien, rechute.</li>
<li><strong>Locus de contrôle</strong> (Rotter) : contrôle interne (« ma santé dépend de moi ») vs externe (« ma santé dépend de la chance/des médecins »).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Observance = 30-50% de non-observance dans les maladies chroniques. Health Belief Model : vulnérabilité, gravité, bénéfices, barrières. Prochaska : 6 stades du changement. La relation soignant-soigné est le premier facteur d'observance.</p></div>`
    },
    {
      title: "Éducation thérapeutique et psychologie de la maladie chronique",
      content: `<p class="mb-3">L'<strong>éducation thérapeutique du patient</strong> (ETP) est définie par l'OMS (1998) et reconnue en France par la <strong>loi HPST</strong> (2009, article L.1161-1 CSP). Elle vise à aider les patients atteints de maladies chroniques à acquérir ou maintenir les compétences nécessaires pour gérer au mieux leur vie avec la maladie.</p>
<p class="mb-3">Les étapes de la démarche d'ETP :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Diagnostic éducatif</strong> : exploration des connaissances, des représentations, des besoins et des ressources du patient (dimensions biomédicale, socio-professionnelle, cognitive, psycho-affective, projet du patient).</li>
<li><strong>Contrat éducatif</strong> : définition partagée des compétences à acquérir (compétences d'autosoins et compétences d'adaptation).</li>
<li><strong>Séances éducatives</strong> : individuelles ou collectives, utilisant des méthodes pédagogiques variées (ateliers pratiques, jeux de rôle, supports visuels).</li>
<li><strong>Évaluation</strong> : des compétences acquises, de l'évolution clinique et de la qualité de vie.</li>
</ul>
<p class="mb-3">La <strong>maladie chronique</strong> pose des défis psychologiques spécifiques : la perte de l'identité d'individu sain, la gestion de l'incertitude, la fatigue chronique, la restriction des activités, l'impact sur la vie sociale et professionnelle. Le concept de <strong>qualité de vie liée à la santé</strong> (QVLS) intègre les dimensions physique, psychologique, sociale et fonctionnelle.</p>
<p class="mb-3">Le <strong>burn-out des soignants</strong> (syndrome d'épuisement professionnel) est caractérisé par trois dimensions (Maslach) : l'<strong>épuisement émotionnel</strong>, la <strong>dépersonnalisation</strong> (cynisme, distance émotionnelle envers les patients) et la <strong>diminution de l'accomplissement personnel</strong>. La prévention passe par le soutien institutionnel, les groupes de parole (Balint) et la supervision clinique.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : ETP (loi HPST 2009) = diagnostic éducatif + contrat + séances + évaluation. Compétences d'autosoins et d'adaptation. Burn-out soignant (Maslach) : épuisement émotionnel + dépersonnalisation + diminution de l'accomplissement.</p></div>`
    }
  ]
},

"ssh-philosophie": {
  introduction: "La philosophie de la médecine interroge les fondements de la pratique médicale : qu'est-ce que la santé, la maladie, le normal et le pathologique ? Elle nourrit la réflexion éthique du soignant.",
  readTime: 20,
  sections: [
    {
      title: "Le normal et le pathologique : Canguilhem",
      content: `<p class="mb-3"><strong>Georges Canguilhem</strong> (Le Normal et le Pathologique, 1943) est l'auteur de référence en philosophie de la médecine. Sa thèse centrale remet en cause la conception positiviste de la maladie défendue par Auguste Comte et Claude Bernard.</p>
<p class="mb-3">Les thèses fondamentales de Canguilhem :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Critique de la conception quantitative</strong> : selon Comte et Bernard, le pathologique ne serait qu'une variation quantitative du normal (plus ou moins de la norme). Canguilhem rejette cette vision : la maladie est un <strong>changement qualitatif</strong>, une autre manière de vivre.</li>
<li><strong>La normativité biologique</strong> : la santé n'est pas le simple respect d'une norme statistique mais la capacité à <strong>instaurer de nouvelles normes</strong> de vie. L'individu sain est « normatif » : il peut modifier ses normes, s'adapter à de nouvelles conditions de vie.</li>
<li><strong>La maladie comme normativité réduite</strong> : le malade est celui dont la capacité normative est diminuée. Il est enfermé dans une norme unique, rigide, et ne peut plus tolérer les variations de son milieu.</li>
<li><strong>Le vivant comme acteur</strong> : le vivant n'est pas passif face à son milieu. La santé est une marge de tolérance face aux infidélités du milieu, une capacité d'adaptation et de dépassement.</li>
</ul>
<p class="mb-3">Pour Canguilhem, la médecine ne peut se réduire à une science appliquée : elle est un <strong>art</strong> qui prend en compte la singularité de chaque patient et son expérience subjective de la maladie. La norme médicale n'est jamais purement objective ; elle comporte toujours une dimension de valeur.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Canguilhem : santé = normativité (capacité d'instaurer de nouvelles normes). Maladie ≠ variation quantitative, c'est une normativité réduite. La médecine est un art, pas seulement une science appliquée.</p></div>`
    },
    {
      title: "Foucault : regard médical, biopouvoir et médicalisation",
      content: `<p class="mb-3"><strong>Michel Foucault</strong> a profondément renouvelé la compréhension des rapports entre médecine, pouvoir et société à travers plusieurs ouvrages majeurs.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Naissance de la clinique</strong> (1963) : Foucault analyse la naissance de la médecine moderne à la fin du XVIIIe siècle comme l'apparition d'un nouveau <strong>regard médical</strong>. Le corps du patient devient un objet d'observation systématique. La clinique au lit du malade et l'anatomopathologie (corrélation entre symptômes et lésions) fondent une médecine qui « voit » la maladie dans le corps.</li>
<li><strong>Le biopouvoir</strong> (La Volonté de savoir, 1976) : forme de pouvoir qui s'exerce sur la vie elle-même. Il se déploie à deux niveaux : l'<strong>anatomo-politique du corps</strong> (discipline des corps individuels : hygiène, normes de santé) et la <strong>biopolitique des populations</strong> (régulation des phénomènes de masse : natalité, mortalité, épidémies, longévité).</li>
<li><strong>La médicalisation de la société</strong> : extension progressive du domaine médical à des aspects de la vie qui n'étaient pas considérés comme pathologiques (sexualité, comportement des enfants, vieillissement, émotions). La médecine devient un instrument de <strong>normalisation sociale</strong>.</li>
</ul>
<p class="mb-3">L'<strong>Histoire de la folie</strong> (1961) montre comment la société moderne a construit la « folie » comme objet médical et justifié l'enfermement des malades mentaux. Le « grand renfermement » (XVIIe siècle) marque le moment où les déviants sont exclus et enfermés. Foucault invite à questionner les catégories médicales comme des constructions historiques et sociales.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Foucault : regard médical = objectivation du corps. Biopouvoir = anatomo-politique (corps) + biopolitique (populations). Médicalisation = extension du pouvoir médical à toute la vie sociale.</p></div>`
    },
    {
      title: "L'éthique du care et la philosophie du soin",
      content: `<p class="mb-3">L'<strong>éthique du care</strong> (sollicitude) est un courant philosophique qui place l'attention à la vulnérabilité et l'interdépendance humaine au centre de la morale, en opposition aux éthiques abstraites fondées sur la justice et les principes universels.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Carol Gilligan</strong> (In a Different Voice, 1982) : Gilligan critique le modèle de développement moral de Kohlberg (centré sur la justice abstraite) en montrant qu'il existe une « voix différente », celle du care, fondée sur l'attention aux relations, la responsabilité et la préoccupation pour autrui. Cette voix a été historiquement dévalorisée car associée au féminin.</li>
<li><strong>Joan Tronto</strong> (Un monde vulnérable, 1993) : Tronto propose une définition politique du care : « une activité qui inclut tout ce que nous faisons pour maintenir, perpétuer et réparer notre monde ». Elle identifie quatre phases : <strong>caring about</strong> (se soucier de), <strong>taking care of</strong> (prendre en charge), <strong>care-giving</strong> (soigner), <strong>care-receiving</strong> (recevoir le soin).</li>
<li><strong>Fabienne Brugère</strong> : a contribué à diffuser l'éthique du care en France, montrant ses implications pour la politique sociale et les professions de santé.</li>
</ul>
<p class="mb-3">En philosophie du soin, <strong>Frédéric Worms</strong> distingue le <strong>soin relation</strong> (attention à l'autre, présence, écoute) du <strong>soin réparation</strong> (acte technique médical). La crise du soin contemporain tient à la réduction du soin à sa dimension technique au détriment de sa dimension relationnelle.</p>
<p class="mb-3">L'éthique du care a des implications concrètes en médecine : valorisation des métiers du soin (souvent dévalorisés), reconnaissance de la vulnérabilité comme condition humaine universelle, attention aux inégalités dans la distribution du care (genre, classe sociale).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Gilligan : éthique du care vs éthique de la justice. Tronto : 4 phases du care (se soucier, prendre en charge, soigner, recevoir). Worms : soin-relation vs soin-réparation. Le care implique de reconnaître la vulnérabilité universelle.</p></div>`
    },
    {
      title: "Levinas, Ricœur et la philosophie de l'altérité en médecine",
      content: `<p class="mb-3">Plusieurs philosophes majeurs éclairent la dimension éthique de la rencontre avec le patient en tant qu'<strong>autre</strong> vulnérable.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Emmanuel Levinas</strong> (Totalité et Infini, 1961) : le <strong>visage d'autrui</strong> est une interpellation éthique qui précède toute réflexion. Le visage de l'autre, dans sa nudité et sa vulnérabilité, est un appel à la <strong>responsabilité</strong> infinie : « Tu ne tueras point ». En médecine, la rencontre avec le patient est d'abord une rencontre éthique avec un visage qui appelle au soin.</li>
<li><strong>Paul Ricœur</strong> (Soi-même comme un autre, 1990) : Ricœur distingue l'<strong>éthique</strong> (visée de la vie bonne, avec et pour autrui, dans des institutions justes) de la <strong>morale</strong> (normes universelles). La <strong>sollicitude</strong> est la disposition à se reconnaître dans l'autre souffrant. Le soignant et le patient sont liés par une relation de reconnaissance mutuelle.</li>
<li><strong>Hans Jonas</strong> (Le Principe responsabilité, 1979) : face à la puissance technique de la médecine moderne, Jonas propose une éthique de la <strong>responsabilité</strong> tournée vers l'avenir et la préservation des conditions de vie des générations futures. Le principe de précaution en santé s'inscrit dans cette logique.</li>
</ul>
<p class="mb-3">La philosophie de l'<strong>autonomie</strong> du patient oppose deux conceptions : l'autonomie <strong>kantienne</strong> (capacité rationnelle à se donner ses propres lois morales) et l'autonomie <strong>relationnelle</strong> (l'autonomie n'existe que dans un réseau de relations et de conditions sociales qui la rendent possible). La deuxième conception, plus réaliste en contexte médical, reconnaît que la maladie peut réduire l'autonomie sans l'abolir.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Levinas : le visage d'autrui = appel à la responsabilité. Ricœur : sollicitude + reconnaissance mutuelle. Jonas : principe responsabilité (éthique tournée vers l'avenir). Autonomie relationnelle vs autonomie kantienne.</p></div>`
    },
    {
      title: "Bioéthique philosophique et questions contemporaines",
      content: `<p class="mb-3">La philosophie de la médecine est confrontée à des <strong>questions contemporaines</strong> qui renouvellent profondément la réflexion éthique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Le corps : objet ou sujet ?</strong> La médecine moderne tend à objectiver le corps (le « corps-machine » de Descartes). La phénoménologie (Merleau-Ponty, Le corps vécu) rappelle que le corps est notre manière d'être au monde : il n'est pas un objet que l'on « a » mais un sujet que l'on « est ». Le patient est un corps-sujet, pas seulement un organisme à réparer.</li>
<li><strong>La souffrance et la douleur</strong> : la douleur est un phénomène neurophysiologique objectivable ; la souffrance est l'expérience subjective globale (physique, psychique, sociale, existentielle) qui l'accompagne. Cicely Saunders parle de « total pain » (souffrance globale) en soins palliatifs.</li>
<li><strong>Le transhumanisme</strong> : mouvement philosophique prônant le dépassement des limites biologiques humaines par la technologie. Il oppose les « bioconservateurs » (préservation de la nature humaine) aux « technoprogressistes » (amélioration légitime). La question centrale est : faut-il distinguer soigner et augmenter ?</li>
<li><strong>La médecine personnalisée</strong> : l'essor de la génomique et des biomarqueurs promet une médecine adaptée au profil de chaque patient. Mais elle soulève des questions de justice (accès inégal), de protection des données et d'identité (réduction de la personne à son profil génétique).</li>
</ul>
<p class="mb-3">Le philosophe <strong>Georges Canguilhem</strong> rappelait que la médecine est toujours un exercice de jugement de valeur : définir ce qui est sain ou malade, ce qui mérite d'être traité ou non, c'est porter un jugement normatif sur ce qu'est la « bonne vie ». Cette dimension normative doit être reconnue et discutée, jamais dissimulée sous une apparence de pure objectivité scientifique.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Merleau-Ponty : corps-sujet vs corps-objet. Souffrance globale (total pain) = physique + psychique + sociale + existentielle. Transhumanisme : soigner vs augmenter. La médecine porte toujours un jugement de valeur.</p></div>`
    }
  ]
},

"ssh-histoire": {
  introduction: "L'histoire de la médecine éclaire les transformations de la pensée médicale et les grandes étapes qui ont façonné la médecine moderne. Elle permet de comprendre les paradigmes actuels et leurs limites.",
  readTime: 20,
  sections: [
    {
      title: "Médecine antique : d'Hippocrate à Galien",
      content: `<p class="mb-3">L'<strong>Antiquité</strong> marque la naissance de la médecine comme discipline rationnelle, se distinguant progressivement de la magie et de la religion.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Hippocrate de Cos</strong> (460-370 av. J.-C.) : considéré comme le « père de la médecine ». Il sépare la médecine de la pensée religieuse en cherchant des causes naturelles aux maladies. La <strong>théorie des humeurs</strong> (sang, phlegme, bile jaune, bile noire) explique la santé par l'équilibre (crase) et la maladie par le déséquilibre (dyscrasie). Le <strong>serment d'Hippocrate</strong> fonde la déontologie médicale : « D'abord ne pas nuire » (Primum non nocere).</li>
<li><strong>Galien de Pergame</strong> (129-201 ap. J.-C.) : médecin des gladiateurs puis de l'empereur Marc Aurèle. Anatomie descriptive fondée sur la dissection animale (la dissection humaine étant interdite). Son système médical, mêlant observation et spéculation, dominera la médecine occidentale pendant <strong>1500 ans</strong>.</li>
<li><strong>Médecine arabe médiévale</strong> : Avicenne (Ibn Sina, 980-1037) rédige le Canon de la médecine, encyclopédie médicale qui restera une référence jusqu'au XVIIe siècle. Rhazès (Al-Razi) distingue variole et rougeole. Les hôpitaux arabes (bimaristans) sont parmi les premiers établissements de soins organisés.</li>
</ul>
<p class="mb-3">La médecine médiévale occidentale est marquée par la <strong>stagnation</strong> : prédominance de l'autorité des textes anciens (Galien, Avicenne), influence de l'Église (la maladie comme punition divine), interdiction de la dissection humaine. Les épidémies (peste noire, 1347-1351) révèlent l'impuissance de la médecine humorale.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Hippocrate = père de la médecine, théorie des humeurs, serment. Galien = anatomie animale, système dominant 1500 ans. Avicenne = Canon de la médecine. Médecine médiévale = stagnation sous l'autorité des Anciens.</p></div>`
    },
    {
      title: "Renaissance et révolution anatomique",
      content: `<p class="mb-3">La <strong>Renaissance</strong> (XVe-XVIe siècles) marque une rupture fondamentale avec l'autorité des textes anciens, grâce à la redécouverte de l'observation directe et de l'expérimentation.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>André Vésale</strong> (1514-1564) : son ouvrage De Humani Corporis Fabrica (1543) révolutionne l'anatomie en pratiquant lui-même des dissections humaines et en corrigeant les erreurs de Galien. Il inaugure une médecine fondée sur l'<strong>observation directe</strong> plutôt que sur l'autorité textuelle.</li>
<li><strong>Ambroise Paré</strong> (1510-1590) : chirurgien des rois de France, il modernise la chirurgie de guerre (ligature des artères au lieu de la cautérisation), développe les prothèses et affirme l'importance de l'expérience clinique : « Je le pansay, Dieu le guarit. »</li>
<li><strong>William Harvey</strong> (1578-1657) : découvre la <strong>circulation sanguine</strong> en 1628 (Exercitatio Anatomica de Motu Cordis), réfutant la théorie galénique du mouvement du sang. C'est l'un des premiers exemples de méthode expérimentale en médecine.</li>
</ul>
<p class="mb-3">Les XVIIe et XVIIIe siècles voient émerger de nouvelles approches :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Iatromécanisme</strong> (Descartes, Borelli) : le corps est une machine dont les maladies sont des dysfonctionnements mécaniques.</li>
<li><strong>Iatrochimie</strong> (Paracelse, Van Helmont) : la maladie est un déséquilibre chimique.</li>
<li><strong>Vitalisme</strong> (école de Montpellier) : la vie possède un principe irréductible à la physique et à la chimie.</li>
<li><strong>Edward Jenner</strong> (1749-1823) : invente la <strong>vaccination</strong> en 1796 en inoculant la variole bovine (cowpox) pour protéger contre la variole humaine.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Vésale (1543) = révolution anatomique par la dissection. Harvey (1628) = circulation sanguine. Jenner (1796) = vaccination. Renaissance = passage de l'autorité textuelle à l'observation directe.</p></div>`
    },
    {
      title: "XIXe siècle : la révolution microbienne et la médecine expérimentale",
      content: `<p class="mb-3">Le <strong>XIXe siècle</strong> est le siècle des révolutions médicales qui fondent la médecine scientifique moderne.</p>
<p class="mb-3"><strong>La révolution microbienne :</strong></p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Louis Pasteur</strong> (1822-1895) : chimiste de formation, il démontre la <strong>théorie des germes</strong> (les maladies infectieuses sont causées par des micro-organismes), développe la pasteurisation, crée des vaccins (charbon, rage) et fonde l'Institut Pasteur (1888).</li>
<li><strong>Robert Koch</strong> (1843-1910) : identifie les bacilles de la tuberculose (1882) et du choléra (1883). Ses <strong>postulats de Koch</strong> définissent les critères pour prouver qu'un micro-organisme cause une maladie donnée.</li>
<li><strong>Ignace Semmelweis</strong> (1818-1865) : démontre que le <strong>lavage des mains</strong> réduit la mortalité par fièvre puerpérale. Rejeté par ses pairs, il meurt dans un asile. Son histoire illustre la résistance au changement dans la profession médicale.</li>
<li><strong>Joseph Lister</strong> (1827-1912) : introduit l'<strong>antisepsie chirurgicale</strong> (acide phénique), réduisant considérablement les infections postopératoires.</li>
</ul>
<p class="mb-3"><strong>La médecine expérimentale :</strong></p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Claude Bernard</strong> (1813-1878) : Introduction à l'étude de la médecine expérimentale (1865). Il fonde la <strong>physiologie expérimentale</strong> et introduit le concept de <strong>milieu intérieur</strong> (homéostasie). Il prône la méthode hypothético-déductive en médecine : observation, hypothèse, expérimentation, conclusion.</li>
<li><strong>Xavier Bichat</strong> (1771-1802) : fondateur de l'histologie, il identifie les tissus comme unité fondamentale de l'organisme.</li>
<li><strong>Rudolf Virchow</strong> (1821-1902) : fonde la <strong>pathologie cellulaire</strong> (la cellule est le siège de la maladie) et développe une médecine sociale (« la médecine est une science sociale »).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Pasteur = théorie des germes + vaccins. Koch = bacille de la tuberculose + postulats. Semmelweis = lavage des mains. Claude Bernard = médecine expérimentale + milieu intérieur. Virchow = pathologie cellulaire.</p></div>`
    },
    {
      title: "XXe siècle : révolutions thérapeutiques et naissance de la bioéthique",
      content: `<p class="mb-3">Le <strong>XXe siècle</strong> voit des avancées médicales sans précédent mais aussi la prise de conscience des dangers de la médecine sans éthique.</p>
<p class="mb-3"><strong>Révolutions thérapeutiques :</strong></p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Antibiotiques</strong> : Alexander Fleming découvre la pénicilline en 1928 (production industrielle dès 1942). Les antibiotiques transforment radicalement le pronostic des maladies infectieuses.</li>
<li><strong>Imagerie médicale</strong> : rayons X (Röntgen, 1895), échographie (années 1950), scanner (Hounsfield, 1971), IRM (Lauterbur, Mansfield, années 1970).</li>
<li><strong>Transplantation d'organes</strong> : première greffe de rein (Murray, 1954), première greffe cardiaque (Barnard, 1967). Développement de l'immunosuppression (ciclosporine, 1980).</li>
<li><strong>Génétique</strong> : découverte de la structure de l'ADN (Watson et Crick, 1953), séquençage du génome humain (2003), CRISPR-Cas9 (Charpentier et Doudna, 2012).</li>
</ul>
<p class="mb-3"><strong>Naissance de la bioéthique :</strong></p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Expérimentations nazies</strong> : les médecins nazis ont pratiqué des expériences inhumaines sur les détenus des camps de concentration, révélant l'horreur d'une médecine sans éthique.</li>
<li><strong>Code de Nuremberg</strong> (1947) : premier texte international d'éthique de la recherche, fondé sur le <strong>consentement volontaire</strong> du sujet humain.</li>
<li><strong>Déclaration d'Helsinki</strong> (1964, AMM) : principes éthiques pour la recherche médicale impliquant des êtres humains, régulièrement révisée.</li>
<li><strong>Scandale de Tuskegee</strong> (1932-1972) : étude non éthique sur la syphilis chez des hommes afro-américains, sans traitement ni consentement. À l'origine du rapport Belmont (1979).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Pénicilline (Fleming, 1928), ADN (Watson-Crick, 1953), greffe cardiaque (Barnard, 1967). Code de Nuremberg 1947 = consentement obligatoire. Helsinki 1964 = éthique de la recherche. Tuskegee = scandale fondateur.</p></div>`
    },
    {
      title: "Histoire de la médecine française et enjeux contemporains",
      content: `<p class="mb-3">L'histoire de la <strong>médecine française</strong> présente des spécificités importantes pour le futur professionnel de santé :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>L'école clinique française</strong> (fin XVIIIe-XIXe) : avec Bichat, Laennec (invention du stéthoscope, 1816), Corvisart, la médecine française développe la méthode <strong>anatomo-clinique</strong> (corrélation entre symptômes cliniques et lésions anatomiques). Paris devient la capitale mondiale de la médecine.</li>
<li><strong>La Sécurité sociale</strong> (1945) : création par les ordonnances des 4 et 19 octobre 1945, inspirée du programme du CNR (Conseil National de la Résistance). Elle transforme l'accès aux soins en garantissant une protection universelle contre le risque maladie.</li>
<li><strong>Les grandes crises sanitaires françaises</strong> : affaire du sang contaminé (1985, VIH transmis par transfusion), vache folle (ESB, 1996), Mediator (2009, benfluorex), canicule de 2003 (15 000 décès), COVID-19 (2020). Ces crises ont renforcé la veille sanitaire et la régulation.</li>
</ul>
<p class="mb-3"><strong>La médecine du XXIe siècle</strong> est marquée par :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>La médecine personnalisée</strong> (ou médecine de précision) : traitement adapté au profil génétique, moléculaire et environnemental de chaque patient (thérapies ciblées en oncologie, pharmacogénomique).</li>
<li><strong>L'intelligence artificielle</strong> : aide au diagnostic (imagerie, dermatologie), aide à la décision, prédiction de risques, robots chirurgicaux.</li>
<li><strong>La médecine globale</strong> (One Health, santé planétaire) : reconnaissance de l'interdépendance entre santé humaine, animale et environnementale.</li>
<li><strong>La démocratie sanitaire</strong> : passage d'une médecine paternaliste à une médecine centrée sur le patient, associant les usagers aux décisions de santé.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : École clinique française = méthode anatomo-clinique (Bichat, Laennec). Sécurité sociale = 1945 (ordonnances CNR). Crises sanitaires (sang contaminé, Mediator) = renforcement de la veille. Médecine du XXIe siècle = personnalisée, IA, One Health.</p></div>`
    }
  ]
},

"ssh-epistemologie": {
  introduction: "L'épistémologie de la médecine analyse les fondements de la connaissance médicale, ses méthodes et ses limites. Elle interroge la scientificité de la médecine et les conditions de production du savoir médical.",
  readTime: 18,
  sections: [
    {
      title: "Fondements de l'épistémologie : Popper, Kuhn et Lakatos",
      content: `<p class="mb-3">L'<strong>épistémologie</strong> (du grec episteme, connaissance) est la branche de la philosophie qui étudie les conditions, les méthodes et les limites de la connaissance scientifique. Appliquée à la médecine, elle interroge : comment produit-on la connaissance médicale ? Qu'est-ce qui distingue le savoir médical scientifique de la croyance ou de l'opinion ?</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Karl Popper</strong> (Logique de la découverte scientifique, 1934) : le critère de démarcation entre science et non-science est la <strong>réfutabilité</strong> (falsifiabilité). Une théorie est scientifique si elle peut, en principe, être réfutée par l'observation. Une théorie non réfutable (comme la psychanalyse selon Popper) n'est pas scientifique.</li>
<li><strong>Thomas Kuhn</strong> (La Structure des révolutions scientifiques, 1962) : la science ne progresse pas de manière linéaire mais par <strong>paradigmes</strong>. Un paradigme est un ensemble de théories, méthodes et valeurs partagées par une communauté scientifique. Les « révolutions scientifiques » surviennent quand un paradigme est remplacé par un autre (ex : théorie des germes remplaçant la théorie des miasmes).</li>
<li><strong>Imre Lakatos</strong> : propose le concept de <strong>programmes de recherche</strong> avec un noyau dur (hypothèses fondamentales non négociables) et une ceinture protectrice (hypothèses auxiliaires modifiables). Un programme est « progressif » s'il génère de nouvelles prédictions, « dégénératif » sinon.</li>
</ul>
<p class="mb-3">La question de la <strong>scientificité de la médecine</strong> est centrale : la médecine est-elle une science appliquée (application de la biologie) ou un art fondé sur le jugement clinique ? Elle combine en réalité sciences fondamentales, savoir-faire technique et dimension relationnelle, ce qui en fait une pratique irréductible à la science pure.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Popper = réfutabilité (critère de scientificité). Kuhn = paradigmes et révolutions scientifiques. Lakatos = programmes de recherche progressifs/dégénératifs. La médecine est à la fois science, technique et art.</p></div>`
    },
    {
      title: "La médecine fondée sur les preuves (EBM)",
      content: `<p class="mb-3">La <strong>médecine fondée sur les preuves</strong> (Evidence-Based Medicine, EBM), conceptualisée par <strong>David Sackett</strong> en 1996, est le paradigme dominant de la médecine contemporaine. Elle intègre trois composantes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Les meilleures données disponibles de la recherche</strong> : issues d'études cliniques rigoureuses, hiérarchisées selon leur niveau de preuve.</li>
<li><strong>L'expertise clinique du médecin</strong> : le jugement du praticien fondé sur son expérience et ses compétences.</li>
<li><strong>Les valeurs et préférences du patient</strong> : ses attentes, ses craintes, son contexte de vie.</li>
</ul>
<p class="mb-3">La <strong>hiérarchie des preuves</strong> classe les types d'études par niveau de fiabilité :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Niveau 1</strong> : méta-analyses et revues systématiques d'essais contrôlés randomisés (ECR).</li>
<li><strong>Niveau 2</strong> : essais contrôlés randomisés de bonne qualité.</li>
<li><strong>Niveau 3</strong> : études de cohorte prospectives.</li>
<li><strong>Niveau 4</strong> : études cas-témoins, études transversales.</li>
<li><strong>Niveau 5</strong> : séries de cas, rapports de cas, avis d'experts.</li>
</ul>
<p class="mb-3">L'<strong>essai contrôlé randomisé</strong> (ECR) est considéré comme le « gold standard » de l'évaluation thérapeutique. Ses caractéristiques : randomisation (attribution aléatoire des participants aux groupes), groupe contrôle (placebo ou traitement de référence), double aveugle (ni le patient ni le médecin ne savent quel traitement est reçu), critères d'évaluation prédéfinis.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : EBM (Sackett, 1996) = preuves + expertise + préférences patient. Hiérarchie : méta-analyses > ECR > cohortes > cas-témoins > avis d'experts. ECR = gold standard (randomisation + double aveugle + groupe contrôle).</p></div>`
    },
    {
      title: "Limites de l'EBM et biais méthodologiques",
      content: `<p class="mb-3">Si l'EBM a considérablement amélioré la rigueur de la pratique médicale, elle présente des <strong>limites importantes</strong> qu'il est essentiel de connaître :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Inadaptation aux cas individuels complexes</strong> : les ECR étudient des populations homogènes et excluent souvent les patients polypathologiques, âgés ou présentant des comorbidités. L'application de résultats populationnels à un patient singulier reste un exercice de jugement.</li>
<li><strong>Biais de publication</strong> : les études aux résultats positifs sont plus facilement publiées que celles aux résultats négatifs (publication bias). Le registre des essais cliniques (ClinicalTrials.gov) vise à limiter ce biais.</li>
<li><strong>Influence de l'industrie pharmaceutique</strong> : financement des études, ghostwriting (rédaction fantôme par l'industrie), manipulation des critères d'évaluation (outcome reporting bias), utilisation de comparateurs inadaptés.</li>
<li><strong>Négligence des savoirs expérientiels</strong> : l'expérience subjective du patient et le savoir pratique du clinicien peuvent être marginalisés face à la « preuve » statistique.</li>
</ul>
<p class="mb-3">Les principaux <strong>biais méthodologiques</strong> en recherche clinique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biais de sélection</strong> : les participants ne sont pas représentatifs de la population cible.</li>
<li><strong>Biais de confusion</strong> : un facteur tiers influence à la fois l'exposition et le résultat.</li>
<li><strong>Biais de mesure</strong> (biais d'information) : erreur systématique dans la mesure de l'exposition ou du résultat.</li>
<li><strong>Effet Hawthorne</strong> : les participants modifient leur comportement parce qu'ils se savent observés.</li>
<li><strong>Effet placebo/nocebo</strong> : amélioration (placebo) ou détérioration (nocebo) liée aux attentes du patient.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Limites de l'EBM : inadaptation au cas individuel, biais de publication, influence industrielle. Biais principaux : sélection, confusion, mesure, Hawthorne. L'effet placebo est un phénomène neurobiologique réel.</p></div>`
    },
    {
      title: "Médecine narrative et savoirs complémentaires",
      content: `<p class="mb-3">Face aux limites de l'EBM, des approches complémentaires se sont développées pour enrichir la connaissance médicale et la pratique clinique.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Médecine narrative</strong> (Rita Charon, 2001) : valorise le <strong>récit du patient</strong> comme source de connaissance. Le patient ne se réduit pas à un ensemble de données biologiques ; son histoire de vie, ses représentations, son vécu de la maladie sont essentiels à la compréhension et à la prise en charge. La compétence narrative du médecin implique d'écouter, d'interpréter et de répondre au récit du patient.</li>
<li><strong>Recherche qualitative</strong> : entretiens, observations, analyses de discours. Elle explore les significations, les expériences et les processus sociaux. Elle est complémentaire de la recherche quantitative (qui mesure et compare).</li>
<li><strong>Savoirs expérientiels des patients</strong> : dans les maladies chroniques, les patients développent une expertise par l'expérience qui complète le savoir médical. Le concept de « patient expert » ou « patient ressource » reconnaît cette expertise.</li>
</ul>
<p class="mb-3">La tension entre <strong>médecine standardisée</strong> (guidelines, protocoles, EBM) et <strong>médecine personnalisée</strong> (adaptation au patient singulier) est au cœur de la pratique clinique contemporaine. Le bon médecin est celui qui sait mobiliser les données de la science tout en restant attentif à la singularité de chaque patient.</p>
<p class="mb-3">Les <strong>données en vie réelle</strong> (Real-World Evidence) issues des bases de données de santé (SNDS en France), des cohortes observationnelles et des registres complètent les données des ECR en apportant des informations sur l'efficacité en conditions réelles (effectiveness) plutôt que sur l'efficacité expérimentale (efficacy).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Médecine narrative (Charon) = le récit du patient comme connaissance. Recherche qualitative complète la recherche quantitative. Patient expert = savoir expérientiel reconnu. Données en vie réelle (RWE) complètent les ECR.</p></div>`
    },
    {
      title: "Épistémologie et pratiques non conventionnelles",
      content: `<p class="mb-3">L'épistémologie permet d'analyser de manière critique les <strong>pratiques non conventionnelles</strong> (médecines alternatives et complémentaires, MAC) et leur rapport à la scientificité.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Homéopathie</strong> : fondée par Hahnemann (1796), elle repose sur la loi de similitude et la dilution (jusqu'à des concentrations infinitésimales). Du point de vue de la physique et de la chimie, les dilutions homéopathiques ne contiennent plus de molécule active au-delà de la dilution 12CH. Les méta-analyses (Shang, 2005) n'ont pas démontré d'efficacité supérieure au placebo. Déremboursée en France depuis 2021.</li>
<li><strong>Acupuncture</strong> : certaines études suggèrent une efficacité dans la douleur chronique, mais la question des mécanismes (placebo, stimulation nerveuse) reste débattue.</li>
<li><strong>Ostéopathie, naturopathie, sophrologie</strong> : ces pratiques ont des niveaux de preuve variables et nécessitent une évaluation rigoureuse.</li>
</ul>
<p class="mb-3">Le critère de <strong>réfutabilité</strong> (Popper) est essentiel pour distinguer les pratiques fondées sur des données scientifiques de celles qui ne le sont pas. Une pratique qui ne peut être réfutée par aucune observation (dont les partisans expliquent tout échec par un défaut de la méthode et non par l'inefficacité du traitement) n'est pas scientifique.</p>
<p class="mb-3">L'<strong>esprit critique</strong> du futur médecin doit s'exercer dans toutes les directions : envers les médecines alternatives non validées, mais aussi envers les excès de la médecine conventionnelle (surdiagnostic, surtraitement, conflits d'intérêts). La <strong>pensée critique</strong> implique l'évaluation rigoureuse des sources, la conscience des biais et la distinction entre corrélation et causalité.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : L'épistémologie permet d'évaluer les MAC : critère de réfutabilité, niveaux de preuve, distinction placebo/effet spécifique. L'esprit critique s'exerce aussi envers la médecine conventionnelle (surdiagnostic, conflits d'intérêts).</p></div>`
    }
  ]
},

"ssh-communication": {
  introduction: "La communication en santé englobe la relation médecin-patient, l'éducation thérapeutique et la communication publique sur les enjeux de santé. C'est une compétence clinique fondamentale.",
  readTime: 18,
  sections: [
    {
      title: "La communication médecin-patient : modèles et compétences",
      content: `<p class="mb-3">La <strong>communication médecin-patient</strong> est un acte thérapeutique en soi : elle influence directement la satisfaction du patient, l'observance thérapeutique, les résultats cliniques et la réduction des plaintes médico-légales.</p>
<p class="mb-3">Le modèle de <strong>Calgary-Cambridge</strong> (Silverman, Kurtz, Draper) structure la consultation médicale en six étapes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Initier la consultation</strong> : établir le rapport initial, identifier les raisons de la consultation.</li>
<li><strong>Recueillir l'information</strong> : explorer les problèmes du patient (perspective biomédicale et perspective du patient).</li>
<li><strong>Structurer la consultation</strong> : organiser le déroulement, résumer, signaler les transitions.</li>
<li><strong>Construire la relation</strong> : développer le rapport, impliquer le patient (transversal).</li>
<li><strong>Expliquer et planifier</strong> : donner l'information, vérifier la compréhension, planifier la prise en charge.</li>
<li><strong>Clore la consultation</strong> : résumer, vérifier l'accord, planifier le suivi.</li>
</ul>
<p class="mb-3">Les <strong>compétences relationnelles</strong> fondamentales du soignant :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Écoute active</strong> : attention totale, reformulation, silences, questions ouvertes.</li>
<li><strong>Empathie clinique</strong> : comprendre et reconnaître les émotions du patient sans s'y noyer.</li>
<li><strong>Communication non verbale</strong> : posture, regard, distance, ton de voix (55% du message est non verbal selon Mehrabian).</li>
<li><strong>Assertivité</strong> : capacité à exprimer clairement son avis médical tout en respectant le patient.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Modèle Calgary-Cambridge = 6 étapes de la consultation. L'écoute active améliore satisfaction et observance. Communication non verbale = 55% du message (Mehrabian). L'empathie clinique est une compétence qui s'apprend.</p></div>`
    },
    {
      title: "Littératie en santé et décision médicale partagée",
      content: `<p class="mb-3">La <strong>littératie en santé</strong> (health literacy) est définie par l'OMS comme la capacité des individus à accéder, comprendre, évaluer et utiliser l'information de santé pour prendre des décisions éclairées concernant leur santé.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>En France, près de <strong>50%</strong> de la population a un niveau insuffisant de littératie en santé.</li>
<li>Un faible niveau est associé à : une moins bonne santé perçue, une moindre observance thérapeutique, un recours accru aux urgences, une utilisation inadéquate des médicaments, un moindre recours au dépistage.</li>
<li>La littératie en santé est un <strong>déterminant d'équité</strong> : les populations les plus défavorisées ont les niveaux les plus faibles, ce qui aggrave les inégalités sociales de santé.</li>
</ul>
<p class="mb-3">La <strong>décision médicale partagée</strong> (DMP ou shared decision-making) est un processus au cours duquel le médecin et le patient prennent ensemble une décision de santé, en partageant les informations pertinentes (données scientifiques, options thérapeutiques, risques et bénéfices) et en intégrant les valeurs et préférences du patient.</p>
<p class="mb-3">Les conditions de la DMP :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Il existe <strong>plusieurs options</strong> raisonnables (pas de DMP si une seule option médicalement justifiée).</li>
<li>Le médecin partage les <strong>données probantes</strong> de manière compréhensible (outils d'aide à la décision, pictogrammes, chiffres absolus plutôt que relatifs).</li>
<li>Le patient exprime ses <strong>valeurs et préférences</strong>.</li>
<li>La décision est prise <strong>conjointement</strong>.</li>
</ul>
<p class="mb-3">L'adaptation du discours médical au niveau de littératie du patient est un enjeu fondamental : utiliser un langage simple, vérifier la compréhension (méthode du « teach-back » : demander au patient de reformuler), utiliser des supports visuels.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : ~50% des Français ont un niveau insuffisant de littératie en santé. La décision partagée = médecin + patient décident ensemble. Méthode teach-back = faire reformuler pour vérifier la compréhension.</p></div>`
    },
    {
      title: "Communication de crise et infodémie",
      content: `<p class="mb-3">La <strong>communication de crise sanitaire</strong> est un enjeu majeur de santé publique, mis en lumière par les pandémies (COVID-19), les scandales sanitaires (sang contaminé, Mediator) et les alertes environnementales.</p>
<p class="mb-3">Les principes d'une communication de crise efficace :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Rapidité</strong> : communiquer tôt, même si toutes les informations ne sont pas disponibles (dire ce qu'on sait et ce qu'on ne sait pas).</li>
<li><strong>Transparence</strong> : ne pas minimiser ni exagérer les risques. Reconnaître l'incertitude.</li>
<li><strong>Cohérence</strong> : les messages doivent être alignés entre les différentes sources institutionnelles.</li>
<li><strong>Empathie</strong> : reconnaître la souffrance et les inquiétudes de la population.</li>
<li><strong>Crédibilité</strong> : s'appuyer sur des sources scientifiques reconnues et des porte-parole légitimes.</li>
</ul>
<p class="mb-3">L'<strong>infodémie</strong> (néologisme OMS) désigne la diffusion massive de fausses informations en santé, amplifiée par les réseaux sociaux et les algorithmes de recommandation. Elle constitue une menace pour la santé publique en alimentant l'hésitation vaccinale, les théories du complot et les pratiques dangereuses (automédication inappropriée, recours aux « fake cures »).</p>
<p class="mb-3">Les stratégies de lutte contre l'infodémie : fact-checking institutionnel, éducation aux médias et à l'esprit critique, présence proactive des institutions de santé sur les réseaux sociaux, régulation des plateformes numériques, formation des professionnels de santé à la communication numérique.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Communication de crise = rapidité + transparence + cohérence + empathie. L'infodémie (OMS) = fausses informations massives en santé, amplifiées par les réseaux sociaux. L'hésitation vaccinale est alimentée par l'infodémie.</p></div>`
    },
    {
      title: "Communication interprofessionnelle et travail en équipe",
      content: `<p class="mb-3">La <strong>communication interprofessionnelle</strong> est essentielle pour la sécurité des patients et la qualité des soins. Les erreurs de communication sont la première cause d'<strong>événements indésirables graves</strong> en établissement de santé.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Transmissions ciblées</strong> : méthode structurée de transmission d'informations entre soignants (Données, Actions, Résultats — DAR) assurant la continuité des soins.</li>
<li><strong>Outil SBAR</strong> (Situation, Background, Assessment, Recommendation) : méthode de communication structurée utilisée pour les transmissions urgentes entre professionnels. Développée par la marine américaine, adoptée en santé pour réduire les erreurs.</li>
<li><strong>Briefing et débriefing</strong> : en bloc opératoire, la checklist chirurgicale (OMS, 2008, « Safe Surgery Saves Lives ») est un outil de communication standardisé qui a réduit significativement les complications et la mortalité postopératoires.</li>
<li><strong>Staff pluridisciplinaire</strong> : réunion de concertation pluridisciplinaire (RCP) en oncologie, staff de service, comité de retour d'expérience (CREX).</li>
</ul>
<p class="mb-3">Les <strong>barrières à la communication interprofessionnelle</strong> : hiérarchie rigide (le junior n'ose pas alerter le senior), cloisonnement des professions, manque de temps, absence d'outils structurés, cultures professionnelles différentes.</p>
<p class="mb-3">La <strong>simulation en santé</strong> (mannequins, patients standardisés, réalité virtuelle) est un outil pédagogique qui permet de travailler les compétences communicationnelles (annonce, relation, travail en équipe) dans un environnement sécurisé : « jamais la première fois sur le patient ».</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Erreurs de communication = première cause d'événements indésirables. SBAR = communication structurée. Checklist chirurgicale OMS = réduit la mortalité. La simulation permet de s'entraîner en sécurité.</p></div>`
    },
    {
      title: "Communication et éthique : vérité, mensonge et secret",
      content: `<p class="mb-3">La communication en santé soulève des <strong>questions éthiques fondamentales</strong> liées à la vérité, au mensonge et au secret :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Le droit à la vérité</strong> : le patient a droit à une information loyale et complète (loi Kouchner 2002). L'époque du « mensonge thérapeutique » (cacher le diagnostic pour « protéger » le patient) est révolue. Cependant, l'information doit être délivrée avec tact et progressivement.</li>
<li><strong>L'exception thérapeutique</strong> : le médecin peut, exceptionnellement, limiter l'information en cas de pronostic grave, dans l'intérêt du patient et pour des raisons légitimes. Cette exception est d'interprétation stricte et ne peut justifier un mensonge.</li>
<li><strong>Le droit de ne pas savoir</strong> : le patient peut refuser d'être informé de son diagnostic ou de son pronostic (sauf si cette ignorance met en danger des tiers).</li>
<li><strong>La communication avec les proches</strong> : le secret médical s'impose, même vis-à-vis de la famille. L'information ne peut être partagée avec les proches qu'avec l'accord du patient (sauf situations légalement prévues).</li>
</ul>
<p class="mb-3">La <strong>communication avec les enfants et les adolescents</strong> nécessite des adaptations spécifiques : langage adapté à l'âge, utilisation de supports ludiques, implication progressive dans les décisions, respect de la maturation psychologique. Le mineur doit être informé et associé aux décisions selon son degré de maturité.</p>
<p class="mb-3">La <strong>communication interculturelle</strong> est un enjeu croissant dans une société multiculturelle : barrières linguistiques (recours à l'interprétariat professionnel plutôt qu'à la famille), différences culturelles dans la représentation de la maladie et du corps, normes sociales différentes concernant le rôle du patient et de la famille dans les décisions de santé.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Droit à la vérité (loi Kouchner) + droit de ne pas savoir + exception thérapeutique (d'interprétation stricte). Le secret médical s'impose même vis-à-vis de la famille. Communication interculturelle = interprétariat professionnel indispensable.</p></div>`
    }
  ]
},

"ssh-economie-sante": {
  introduction: "L'économie de la santé analyse l'allocation des ressources dans le système de santé et l'évaluation du rapport coût-efficacité des interventions. Elle est au cœur des décisions de politique sanitaire.",
  readTime: 18,
  sections: [
    {
      title: "Le marché de la santé et ses spécificités",
      content: `<p class="mb-3">L'économie de la santé est une discipline qui applique les outils de l'analyse économique au secteur de la santé. La santé n'est pas un bien comme les autres : elle est un <strong>bien méritoire</strong> (merit good), dont l'accès est considéré comme un droit fondamental indépendamment de la capacité de payer.</p>
<p class="mb-3">Les <strong>défaillances du marché</strong> en santé :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Asymétrie d'information</strong> : le médecin (agent) détient un savoir que le patient (principal) n'a pas. Cette asymétrie justifie la régulation et le rôle de l'État pour protéger le patient. C'est la relation d'<strong>agence</strong> (Arrow, 1963).</li>
<li><strong>Aléa moral</strong> (moral hazard) : les individus assurés ont tendance à consommer davantage de soins car ils sont protégés financièrement. Le ticket modérateur, les franchises et les participations forfaitaires visent à limiter cet effet.</li>
<li><strong>Sélection adverse</strong> (anti-sélection) : dans un système d'assurance volontaire, les personnes à haut risque s'assurent davantage, tandis que les personnes à faible risque se désinscrivent, déséquilibrant le système. L'assurance obligatoire est la réponse à ce problème.</li>
<li><strong>Externalités</strong> : la santé produit des effets sur des tiers (ex : vaccination = externalité positive car protection collective ; maladie contagieuse = externalité négative).</li>
</ul>
<p class="mb-3">La <strong>demande induite</strong> par l'offre (Say's law appliquée à la santé) : l'augmentation du nombre de médecins ou d'équipements tend à augmenter la consommation de soins, indépendamment des besoins réels. Ce phénomène justifie la régulation de l'offre de soins.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La santé = bien méritoire, pas un bien de consommation ordinaire. Arrow (1963) : asymétrie d'information et relation d'agence. Aléa moral = surconsommation liée à l'assurance. Sélection adverse = justifie l'assurance obligatoire.</p></div>`
    },
    {
      title: "Les évaluations médico-économiques",
      content: `<p class="mb-3">L'<strong>évaluation médico-économique</strong> compare les <strong>coûts</strong> et les <strong>résultats</strong> de différentes stratégies de santé pour aider à l'allocation optimale des ressources rares. Elle est obligatoire en France pour les médicaments et dispositifs médicaux revendiquant un ASMR I à III (avis de la CEESP, commission de la HAS).</p>
<p class="mb-3">Les types d'évaluation médico-économique :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Analyse coût-efficacité</strong> (ACE) : le résultat est mesuré en unité clinique (années de vie gagnées, événements évités). Exemple : coût par année de vie gagnée.</li>
<li><strong>Analyse coût-utilité</strong> (ACU) : le résultat est mesuré en <strong>QALY</strong> (Quality-Adjusted Life Years), qui combine durée et qualité de vie. C'est la méthode de référence. Le QALY intègre la préférence du patient pour un état de santé donné (utilité entre 0 = mort et 1 = santé parfaite).</li>
<li><strong>Analyse coût-bénéfice</strong> (ACB) : tous les résultats sont monétarisés (en euros). Permet de comparer des interventions de domaines différents mais pose le problème éthique de la monétarisation de la vie humaine.</li>
<li><strong>Analyse de minimisation des coûts</strong> : lorsque deux stratégies ont la même efficacité, on choisit la moins coûteuse.</li>
</ul>
<p class="mb-3">Le <strong>ratio coût-efficacité incrémental</strong> (ICER) = ΔCoût / ΔEfficacité. Il exprime le coût supplémentaire par unité d'efficacité gagnée en passant d'une stratégie à une autre. En France, il n'existe pas de seuil officiel de « disposition à payer » (willingness to pay), contrairement au NICE britannique (~30 000 livres/QALY).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : ACE = résultat clinique, ACU = QALY (référence), ACB = résultat monétarisé. ICER = ΔCoût/ΔEfficacité. Le QALY combine durée et qualité de vie. Pas de seuil officiel de disposition à payer en France.</p></div>`
    },
    {
      title: "Le médicament : prix, remboursement et régulation",
      content: `<p class="mb-3">Le <strong>circuit du médicament</strong> en France est strictement réglementé de la recherche à la commercialisation :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>AMM</strong> (Autorisation de Mise sur le Marché) : délivrée par l'ANSM (nationale) ou l'EMA (européenne) après évaluation de la qualité, de la sécurité et de l'efficacité du médicament.</li>
<li><strong>SMR</strong> (Service Médical Rendu) : évalué par la Commission de la Transparence (HAS), il détermine le taux de <strong>remboursement</strong> : SMR majeur (65%), important (65%), modéré (30%), faible (15%), insuffisant (non remboursé).</li>
<li><strong>ASMR</strong> (Amélioration du Service Médical Rendu) : évalue le progrès thérapeutique par rapport aux traitements existants (I = majeure à V = absence d'amélioration). L'ASMR détermine le <strong>prix</strong> du médicament.</li>
<li><strong>CEPS</strong> (Comité Économique des Produits de Santé) : négocie le prix avec les laboratoires sur la base de l'ASMR, des prix européens et du volume de ventes prévisible.</li>
</ul>
<p class="mb-3">Les <strong>médicaments génériques</strong> (même principe actif, même forme, même dosage que le princeps, mais sans brevet) sont 30 à 60% moins chers. Leur développement est encouragé par le droit de substitution du pharmacien. Les <strong>biosimilaires</strong> sont l'équivalent des génériques pour les médicaments biologiques (anticorps monoclonaux, insulines, etc.).</p>
<p class="mb-3">Les <strong>thérapies innovantes</strong> (thérapies géniques, CAR-T cells, thérapies ciblées) posent un défi financier majeur : certaines atteignent des prix de plusieurs centaines de milliers d'euros par traitement. La question de la <strong>soutenabilité</strong> financière et de l'<strong>équité d'accès</strong> à ces traitements est un enjeu éthique et économique central.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : SMR = remboursement (insuffisant = non remboursé). ASMR = prix (I = majeure, V = absence d'amélioration). CEPS négocie les prix. Génériques = 30-60% moins chers. Thérapies innovantes = défi de soutenabilité financière.</p></div>`
    },
    {
      title: "Maîtrise des dépenses et pertinence des soins",
      content: `<p class="mb-3">La <strong>maîtrise des dépenses de santé</strong> est un enjeu majeur face à la croissance continue des coûts (vieillissement, innovation technologique, maladies chroniques). Les dépenses de santé en France représentent environ <strong>12% du PIB</strong>.</p>
<p class="mb-3">Les leviers de maîtrise des dépenses :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Pertinence des soins</strong> : éviter les actes inutiles, redondants ou inappropriés. En France, on estime que 20 à 30% des actes médicaux ne sont pas pertinents (surdiagnostic, surtraitement). L'Atlas des variations des pratiques médicales illustre les disparités territoriales inexpliquées.</li>
<li><strong>Parcours de soins coordonné</strong> : le médecin traitant comme pivot de la coordination, évitant le nomadisme médical et les examens redondants.</li>
<li><strong>Virage ambulatoire</strong> : développement de la chirurgie ambulatoire (entrée et sortie le même jour), de l'HAD et des alternatives à l'hospitalisation complète, réduisant les durées de séjour et les coûts.</li>
<li><strong>Médicaments génériques et biosimilaires</strong> : réduction du coût des traitements médicamenteux.</li>
<li><strong>Prévention</strong> : investir dans la prévention pour réduire l'incidence des maladies et les coûts de prise en charge curative (1 euro investi en prévention = plusieurs euros économisés en soins curatifs).</li>
</ul>
<p class="mb-3">La <strong>régulation</strong> des dépenses passe par l'ONDAM (Objectif National de Dépenses d'Assurance Maladie, voté chaque année en LFSS) et par des outils contractuels (CAPI, ROSP, contrats d'amélioration de la qualité et de l'efficience des soins).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Dépenses de santé = ~12% du PIB. 20-30% des actes ne sont pas pertinents. Leviers : pertinence, parcours coordonné, ambulatoire, génériques, prévention. ONDAM = plafond voté en LFSS.</p></div>`
    },
    {
      title: "Économie de la santé et enjeux éthiques",
      content: `<p class="mb-3">L'économie de la santé soulève des <strong>questions éthiques fondamentales</strong> liées à l'allocation des ressources rares et à la tension entre efficience et équité.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Justice distributive</strong> : comment répartir équitablement des ressources limitées ? Faut-il privilégier l'efficience (maximiser les résultats de santé globaux) ou l'équité (garantir un accès égal pour tous, y compris les plus défavorisés) ?</li>
<li><strong>Rationnement</strong> : toute société pratique un rationnement des soins (explicite ou implicite). La question n'est pas s'il faut rationner mais comment rationner de manière juste et transparente.</li>
<li><strong>Valeur de la vie humaine</strong> : l'utilisation du QALY suppose que toutes les années de vie ont la même valeur, ce qui est contestable (une année de vie d'un enfant vaut-elle autant qu'une année de vie d'un centenaire ?).</li>
<li><strong>Discrimination par l'âge</strong> (ageism) : certaines approches utilitaristes (DALY, « fair innings ») pourraient défavoriser les personnes âgées dans l'allocation des ressources.</li>
<li><strong>Maladies rares</strong> : le traitement de maladies rares (orphelines) est souvent très coûteux pour un petit nombre de patients. La solidarité nationale justifie-t-elle des coûts très élevés par QALY ?</li>
</ul>
<p class="mb-3">Le <strong>dilemme équité-efficience</strong> est permanent en économie de la santé : les interventions les plus coût-efficaces ne sont pas nécessairement les plus équitables, et les politiques les plus équitables ne sont pas toujours les plus efficientes. Le décideur public doit arbitrer entre ces deux exigences.</p>
<p class="mb-3">L'<strong>évaluation des technologies de santé</strong> (Health Technology Assessment, HTA) intègre désormais des dimensions éthiques, sociales et organisationnelles en plus de l'évaluation clinique et économique. La HAS en France développe cette approche multidimensionnelle.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Tension efficience vs équité = cœur de l'économie de la santé. Le rationnement est inévitable ; la question est comment le rendre juste. Le QALY pose des questions éthiques (valeur de la vie, âge, maladies rares).</p></div>`
    }
  ]
},

"ssh-demographie": {
  introduction: "La démographie étudie la structure et la dynamique des populations. En santé, elle est essentielle pour la planification des besoins, l'épidémiologie et la compréhension des transitions sanitaires.",
  readTime: 18,
  sections: [
    {
      title: "Indicateurs démographiques fondamentaux",
      content: `<p class="mb-3">La <strong>démographie</strong> (du grec demos, peuple, et graphein, écrire) est la science qui étudie les populations humaines : leur taille, leur structure, leur évolution et les facteurs qui les influencent (natalité, mortalité, migration).</p>
<p class="mb-3">Les <strong>indicateurs démographiques</strong> fondamentaux :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Taux de natalité</strong> : nombre de naissances vivantes / population moyenne x 1000. France : ~11 pour mille.</li>
<li><strong>Taux de mortalité brut</strong> : nombre de décès / population moyenne x 1000. France : ~9 pour mille. Ce taux doit être standardisé sur l'âge pour les comparaisons internationales.</li>
<li><strong>Taux de fécondité</strong> : nombre d'enfants par femme en âge de procréer. L'<strong>indice conjoncturel de fécondité</strong> (ICF) mesure le nombre moyen d'enfants par femme. Le seuil de remplacement est de 2,1 enfants/femme. France : ~1,7 (en baisse).</li>
<li><strong>Espérance de vie à la naissance</strong> : nombre moyen d'années qu'un nouveau-né peut espérer vivre. France : ~79 ans (H), ~85 ans (F). L'écart entre sexes se réduit progressivement.</li>
<li><strong>Mortalité infantile</strong> : décès avant 1 an / naissances vivantes x 1000. France : ~3,5 pour mille (en légère augmentation, préoccupation sanitaire).</li>
<li><strong>Mortalité néonatale</strong> : décès avant 28 jours / naissances vivantes x 1000.</li>
<li><strong>Mortalité périnatale</strong> : morts-nés + décès dans les 7 premiers jours / naissances totales x 1000.</li>
</ul>
<p class="mb-3">La <strong>pyramide des âges</strong> représente graphiquement la structure par âge et sexe d'une population. En France, elle prend la forme d'un « toupie » (base rétrécie = faible natalité, milieu large = baby-boomers, sommet élargi = allongement de la durée de vie).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : ICF France ~1,7 (sous le seuil de remplacement de 2,1). Espérance de vie : ~79 ans H, ~85 ans F. Mortalité infantile = 3,5 pour mille. La pyramide des âges française = forme de toupie.</p></div>`
    },
    {
      title: "Transition démographique et transition épidémiologique",
      content: `<p class="mb-3">La <strong>transition démographique</strong> est le passage d'un régime démographique ancien (forte natalité et forte mortalité) à un régime moderne (faible natalité et faible mortalité). Ce processus historique se déroule en quatre phases :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Phase 1 (pré-transitionnelle)</strong> : natalité et mortalité élevées, croissance lente. Sociétés agricoles traditionnelles.</li>
<li><strong>Phase 2 (début de transition)</strong> : la mortalité baisse (progrès d'hygiène, alimentation, médecine) tandis que la natalité reste élevée. Forte croissance démographique.</li>
<li><strong>Phase 3 (fin de transition)</strong> : la natalité baisse à son tour (urbanisation, contraception, éducation des femmes). La croissance ralentit.</li>
<li><strong>Phase 4 (post-transitionnelle)</strong> : natalité et mortalité basses. Croissance faible ou nulle. Vieillissement de la population.</li>
</ul>
<p class="mb-3">La <strong>transition épidémiologique</strong> (Abdel Omran, 1971) décrit l'évolution parallèle des causes de mortalité :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Ère des épidémies et famines</strong> : maladies infectieuses, mortalité élevée, espérance de vie ~30 ans.</li>
<li><strong>Ère du recul des pandémies</strong> : amélioration de l'hygiène, vaccination, alimentation. Espérance de vie ~50 ans.</li>
<li><strong>Ère des maladies dégénératives et de société</strong> : les maladies chroniques (cancers, maladies cardiovasculaires, diabète) deviennent les premières causes de mortalité. Espérance de vie > 70 ans.</li>
</ul>
<p class="mb-3">Certains auteurs ajoutent une <strong>quatrième ère</strong> : le recul des maladies dégénératives (allongement de la vie en bonne santé) et l'émergence de nouvelles menaces (maladies émergentes, antibiorésistance, pandémies).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Transition démographique = 4 phases (forte mortalité/natalité vers faible mortalité/natalité). Transition épidémiologique (Omran) = infectieuses vers chroniques comme premières causes de décès.</p></div>`
    },
    {
      title: "Vieillissement de la population : enjeux sanitaires et sociaux",
      content: `<p class="mb-3">Le <strong>vieillissement de la population</strong> est le défi démographique majeur du XXIe siècle pour les systèmes de santé des pays développés.</p>
<p class="mb-3">Les données françaises :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Les plus de 65 ans représentent environ <strong>21%</strong> de la population (contre 14% en 1970).</li>
<li>Le nombre de personnes de plus de <strong>85 ans</strong> va tripler d'ici 2050 (de 2 à 5 millions).</li>
<li>Le ratio de dépendance (actifs/inactifs) se dégrade : il était de 4 actifs pour 1 retraité en 1960, il sera de 1,5 pour 1 vers 2050.</li>
</ul>
<p class="mb-3">Les <strong>conséquences sanitaires</strong> du vieillissement :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Polypathologie</strong> : les personnes âgées cumulent plusieurs maladies chroniques (HTA, diabète, arthrose, insuffisance cardiaque), complexifiant la prise en charge.</li>
<li><strong>Dépendance</strong> : perte d'autonomie nécessitant une aide pour les actes de la vie quotidienne. La grille AGGIR (Autonomie Gérontologie Groupes Iso-Ressources) classe les niveaux de dépendance (GIR 1 = très dépendant à GIR 6 = autonome).</li>
<li><strong>Maladies neurodégénératives</strong> : Alzheimer (900 000 cas en France), Parkinson, démences vasculaires.</li>
<li><strong>Fragilité</strong> : syndrome gériatrique caractérisé par une diminution des réserves physiologiques augmentant la vulnérabilité aux agressions.</li>
</ul>
<p class="mb-3">Les <strong>réponses politiques</strong> : APA (Allocation Personnalisée d'Autonomie), EHPAD (Établissements d'Hébergement pour Personnes Âgées Dépendantes), développement du maintien à domicile, création de la 5e branche de la Sécurité sociale (autonomie, 2020), loi Grand Âge en préparation.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : >65 ans = ~21% de la population. Nombre de >85 ans va tripler d'ici 2050. Grille AGGIR = mesure de la dépendance. 5e branche SS = autonomie (2020). Polypathologie et fragilité = défis gériatriques.</p></div>`
    },
    {
      title: "Démographie et santé dans le monde",
      content: `<p class="mb-3">Les <strong>disparités démographiques mondiales</strong> sont considérables et reflètent les inégalités de développement :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Espérance de vie</strong> : 84 ans au Japon vs 53 ans en République centrafricaine (écart de 30 ans).</li>
<li><strong>Mortalité infantile</strong> : < 3 pour mille en Scandinavie vs > 80 pour mille dans certains pays d'Afrique subsaharienne.</li>
<li><strong>Mortalité maternelle</strong> : 2 pour 100 000 en France vs > 1000 pour 100 000 en Sierra Leone.</li>
<li><strong>Population mondiale</strong> : 8 milliards (2022). La croissance ralentit mais les projections prévoient 9,7 milliards en 2050 et un pic vers 10,4 milliards avant 2100.</li>
</ul>
<p class="mb-3">Les <strong>Objectifs de Développement Durable</strong> (ODD, Nations Unies, 2015-2030) incluent des cibles sanitaires ambitieuses (ODD 3 « Bonne santé et bien-être ») : réduire la mortalité maternelle, mettre fin aux décès évitables d'enfants de moins de 5 ans, combattre le VIH, la tuberculose et le paludisme, assurer la couverture sanitaire universelle.</p>
<p class="mb-3">La <strong>double charge de morbidité</strong> (double burden of disease) affecte de nombreux pays en développement qui font face simultanément aux maladies infectieuses (VIH, tuberculose, paludisme) et aux maladies chroniques (diabète, cancers, maladies cardiovasculaires) liées à la transition épidémiologique en cours.</p>
<p class="mb-3">Les <strong>migrations</strong> internationales ont des implications sanitaires : santé des migrants (traumatismes, maladies infectieuses, santé mentale), accès aux soins dans les pays d'accueil (AME en France), « fuite des cerveaux » médicaux (brain drain) des pays pauvres vers les pays riches.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Écart d'espérance de vie de 30 ans entre pays riches et pauvres. ODD 3 = santé pour tous d'ici 2030. Double charge de morbidité dans les pays en développement (infectieuses + chroniques). Brain drain médical = enjeu mondial.</p></div>`
    },
    {
      title: "Épidémiologie descriptive et outils de surveillance",
      content: `<p class="mb-3">L'<strong>épidémiologie descriptive</strong> utilise les données démographiques pour caractériser la distribution des maladies dans la population selon trois dimensions : <strong>temps</strong> (quand ?), <strong>lieu</strong> (où ?) et <strong>personne</strong> (qui ?).</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dimension temporelle</strong> : tendances séculaires, variations saisonnières, épidémies (augmentation inhabituelle du nombre de cas), pandémies (épidémie mondiale), endémies (présence constante dans une région).</li>
<li><strong>Dimension spatiale</strong> : cartographie des maladies, identification de clusters (agrégats spatio-temporels), comparaisons internationales.</li>
<li><strong>Dimension personnelle</strong> : distribution selon l'âge, le sexe, la profession, le niveau socio-économique, l'ethnie, les comportements à risque.</li>
</ul>
<p class="mb-3">Les <strong>sources de données</strong> démographiques et sanitaires en France :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>INSEE</strong> : recensement, état civil (naissances, décès, mariages), projections démographiques.</li>
<li><strong>CépiDc</strong> (INSERM) : causes médicales de décès (certificats de décès).</li>
<li><strong>SNDS</strong> (Système National des Données de Santé) : base de données médico-administratives couvrant 99% de la population (consommation de soins, hospitalisations, ALD).</li>
<li><strong>Santé publique France</strong> : surveillance épidémiologique (déclarations obligatoires, réseaux sentinelles, centres nationaux de référence).</li>
<li><strong>Enquêtes de santé</strong> : Baromètre santé, ESPS, EHIS.</li>
</ul>
<p class="mb-3">La <strong>standardisation</strong> (directe ou indirecte) des taux est indispensable pour les comparaisons entre populations ayant des structures d'âge différentes. Le <strong>taux comparatif de mortalité</strong> (standardisé sur l'âge) permet des comparaisons valides entre régions ou pays.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Épidémiologie descriptive = temps, lieu, personne. SNDS = base médico-administrative couvrant 99% de la population. La standardisation sur l'âge est indispensable pour comparer les taux entre populations.</p></div>`
    }
  ]
},

"ssh-inegalites": {
  introduction: "Les inégalités sociales de santé sont un gradient : la santé se dégrade à chaque marche descendue de l'échelle sociale. Comprendre et combattre ces inégalités est un enjeu fondamental de santé publique.",
  readTime: 18,
  sections: [
    {
      title: "Le gradient social de santé : définition et mesure",
      content: `<p class="mb-3">Les <strong>inégalités sociales de santé</strong> (ISS) désignent les différences systématiques, évitables et injustes d'état de santé entre groupes sociaux. Elles ne se limitent pas à la pauvreté mais forment un <strong>gradient continu</strong> : à chaque marche descendue dans l'échelle sociale, la santé se dégrade.</p>
<p class="mb-3">Les données en France :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>L'espérance de vie à 35 ans diffère de <strong>~13 ans</strong> entre un ouvrier et un cadre supérieur (hommes).</li>
<li>L'espérance de vie <strong>en bonne santé</strong> (sans incapacité) varie encore davantage : un ouvrier passe non seulement moins d'années en vie, mais proportionnellement plus d'années en mauvaise santé.</li>
<li>La mortalité par cancer du poumon est <strong>3 fois plus élevée</strong> chez les ouvriers que chez les cadres.</li>
<li>Le taux d'obésité est <strong>3 à 4 fois plus élevé</strong> chez les enfants d'ouvriers que chez ceux de cadres.</li>
<li>L'accès au dépistage du cancer est significativement moindre dans les catégories défavorisées.</li>
</ul>
<p class="mb-3"><strong>Michael Marmot</strong> (études Whitehall, fonctionnaires britanniques) a démontré que les ISS ne s'expliquent pas par la pauvreté absolue mais par la <strong>position relative</strong> dans la hiérarchie sociale. Même parmi des populations non pauvres, le gradient persiste. Les mécanismes identifiés par Marmot : manque de <strong>contrôle sur sa vie</strong> (autonomie, latitude décisionnelle au travail), stress chronique, moindre soutien social.</p>
<p class="mb-3">Il faut distinguer les <strong>inégalités de santé</strong> (différences observées) des <strong>iniquités de santé</strong> (différences injustes et évitables). Les différences biologiques (sexe, âge) produisent des inégalités de santé mais pas nécessairement des iniquités.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : ISS = gradient continu, pas seulement pauvreté. Écart d'espérance de vie de ~13 ans ouvrier/cadre. Marmot : position relative + contrôle sur sa vie. Inégalité ≠ iniquité (différence injuste et évitable).</p></div>`
    },
    {
      title: "Les déterminants sociaux de la santé",
      content: `<p class="mb-3">Les <strong>déterminants sociaux de la santé</strong> sont les conditions dans lesquelles les individus naissent, grandissent, vivent, travaillent et vieillissent. Ils sont responsables de la majeure partie des ISS.</p>
<p class="mb-3">Le modèle de la <strong>Commission des Déterminants Sociaux de la Santé</strong> (OMS, 2008, présidée par Marmot) distingue :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Déterminants structurels</strong> (causes des causes) : contexte socio-économique et politique (gouvernance, politiques macroéconomiques, politiques sociales), position socio-économique (revenu, éducation, profession, genre, ethnie), cohésion sociale.</li>
<li><strong>Déterminants intermédiaires</strong> : conditions matérielles (logement, quartier, conditions de travail, alimentation), comportements de santé (tabac, alcool, activité physique), facteurs psychosociaux (stress, soutien social), système de santé (accès, qualité).</li>
</ul>
<p class="mb-3">Les <strong>mécanismes</strong> par lesquels la position sociale affecte la santé :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Exposition différentielle</strong> : les groupes défavorisés sont plus exposés aux facteurs de risque (pollution, travail pénible, stress, alimentation déséquilibrée, logement insalubre).</li>
<li><strong>Vulnérabilité différentielle</strong> : à exposition égale, les groupes défavorisés sont plus vulnérables (moindres ressources pour faire face, moindre soutien social).</li>
<li><strong>Conséquences différentielles</strong> : une même maladie a des conséquences sociales et économiques plus graves pour les personnes défavorisées (perte d'emploi, précarisation).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Commission OMS 2008 (Marmot) : déterminants structurels (causes des causes) + intermédiaires. Trois mécanismes : exposition, vulnérabilité et conséquences différentielles. Les conditions de vie pèsent plus que les comportements individuels.</p></div>`
    },
    {
      title: "Inégalités territoriales et accès aux soins",
      content: `<p class="mb-3">Les <strong>inégalités territoriales de santé</strong> sont une dimension importante des ISS en France. La mortalité prématurée (avant 65 ans) varie du simple au double entre les départements les mieux et les moins bien lotis.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Déserts médicaux</strong> : zones sous-dotées en professionnels de santé (médecins généralistes, spécialistes, dentistes). Environ 6 millions de Français vivent dans un désert médical. Les zones rurales et les quartiers prioritaires de la politique de la ville sont les plus touchés.</li>
<li><strong>Gradient Nord-Sud</strong> : la mortalité est globalement plus élevée dans le Nord et le Nord-Est de la France que dans le Sud.</li>
<li><strong>Outre-mer</strong> : les territoires ultramarins présentent des indicateurs de santé significativement inférieurs à la métropole (mortalité infantile plus élevée, prévalence du diabète, moindre accès aux soins spécialisés).</li>
</ul>
<p class="mb-3">Les <strong>barrières à l'accès aux soins</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Barrières financières</strong> : reste à charge, dépassements d'honoraires, non-recours aux droits (C2S, AME).</li>
<li><strong>Barrières géographiques</strong> : éloignement des professionnels de santé, temps de trajet, coût du transport.</li>
<li><strong>Barrières culturelles et linguistiques</strong> : faible littératie en santé, barrière de la langue, représentations culturelles de la maladie.</li>
<li><strong>Refus de soins discriminatoires</strong> : refus de certains médecins de recevoir des bénéficiaires de la C2S ou de l'AME (pratique illégale, sanctionnée par l'Ordre).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : ~6 millions de Français en désert médical. Gradient Nord-Sud de mortalité. Barrières financières, géographiques, culturelles et discriminatoires. Le refus de soins aux bénéficiaires C2S/AME est illégal.</p></div>`
    },
    {
      title: "Précarité, exclusion et santé",
      content: `<p class="mb-3">La <strong>précarité</strong> est définie par Joseph Wresinski (fondateur d'ATD Quart Monde, 1987) comme l'absence d'une ou plusieurs sécurités (emploi, logement, éducation, santé) empêchant les personnes d'assumer leurs obligations et leurs droits. Elle a des conséquences directes et majeures sur la santé.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Sans-domicile</strong> : espérance de vie de ~49 ans (vs ~80 ans en population générale). Pathologies spécifiques : gelures, maladies infectieuses (tuberculose, gale), troubles psychiatriques, addictions, pathologies dentaires.</li>
<li><strong>Migrants et demandeurs d'asile</strong> : pathologies liées au parcours migratoire (traumatismes, violences, PTSD), maladies infectieuses (tuberculose, hépatites), barrières d'accès aux soins (administratives, linguistiques, culturelles).</li>
<li><strong>Populations incarcérées</strong> : prévalence élevée d'addictions, de troubles psychiatriques, de VIH et d'hépatite C. Les soins en prison sont assurés par les USMP (Unités Sanitaires en Milieu Pénitentiaire).</li>
<li><strong>Non-recours aux droits</strong> : de nombreuses personnes éligibles à la C2S, à l'AME ou à d'autres dispositifs n'y recourent pas, par méconnaissance, complexité administrative ou honte.</li>
</ul>
<p class="mb-3">Les <strong>Permanences d'Accès aux Soins de Santé</strong> (PASS) sont des dispositifs hospitaliers qui facilitent l'accès au système de santé des personnes en situation de précarité. Elles offrent un accueil médico-social, des soins sans avance de frais et un accompagnement dans les démarches administratives.</p>
<p class="mb-3">Le score <strong>EPICES</strong> (Évaluation de la Précarité et des Inégalités de santé dans les Centres d'Examens de Santé) est un questionnaire en 11 items qui mesure la précarité de manière multidimensionnelle (au-delà du seul critère financier).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Précarité (Wresinski) = absence de sécurités fondamentales. Sans-domicile : espérance de vie ~49 ans. PASS = accès aux soins des précaires à l'hôpital. Score EPICES = mesure multidimensionnelle de la précarité.</p></div>`
    },
    {
      title: "Politiques de lutte contre les inégalités de santé",
      content: `<p class="mb-3">La lutte contre les ISS est un objectif prioritaire de la politique de santé française (inscrit dans la loi de santé publique de 2004 et la Stratégie Nationale de Santé). Plusieurs <strong>approches</strong> sont possibles :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Politiques ciblées</strong> : interventions spécifiques pour les populations les plus défavorisées (PASS, C2S, AME, programmes de quartier). Limites : ne réduisent pas le gradient social dans son ensemble, risque de stigmatisation.</li>
<li><strong>Universalisme proportionné</strong> (Marmot, 2010) : politiques universelles (bénéficiant à tous) mais dont l'intensité est proportionnée au niveau de désavantage. Exemple : la PMI (Protection Maternelle et Infantile) est universelle mais renforce son action dans les zones défavorisées.</li>
<li><strong>Action sur les déterminants structurels</strong> : politiques d'éducation, d'emploi, de logement, de protection sociale, de lutte contre les discriminations. C'est l'approche « Health in All Policies » (la santé dans toutes les politiques).</li>
</ul>
<p class="mb-3">L'<strong>évaluation d'impact sur la santé</strong> (EIS) est un outil qui permet d'évaluer a priori les effets potentiels d'une politique publique (transport, urbanisme, éducation) sur la santé et les ISS, avant sa mise en œuvre.</p>
<p class="mb-3">L'<strong>empowerment</strong> (renforcement du pouvoir d'agir) est une stratégie complémentaire qui vise à donner aux individus et aux communautés les moyens de prendre le contrôle de leur santé : participation des habitants, développement des compétences, santé communautaire, démocratie participative en santé.</p>
<p class="mb-3">La <strong>médiation en santé</strong> fait le lien entre les populations éloignées du système de santé et les professionnels : médiateurs de santé pairs (anciens patients formés), interprètes en santé, navigateurs de parcours.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Marmot : universalisme proportionné (universel + intensité proportionnée). Health in All Policies = la santé dans toutes les politiques. Empowerment = pouvoir d'agir des populations. L'EIS évalue l'impact des politiques sur la santé.</p></div>`
    }
  ]
},

"ssh-handicap": {
  introduction: "Le handicap est une restriction de participation sociale résultant de l'interaction entre une déficience et un environnement inadapté. Sa compréhension a profondément évolué, passant d'un modèle médical à un modèle social et inclusif.",
  readTime: 18,
  sections: [
    {
      title: "Évolution des modèles du handicap",
      content: `<p class="mb-3">La compréhension du <strong>handicap</strong> a considérablement évolué au cours du XXe siècle, passant d'une vision individuelle et médicale à une approche sociale et environnementale.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Modèle médical (individuel)</strong> : le handicap est une déficience individuelle à corriger, guérir ou compenser. La personne handicapée est un « patient » dont la condition relève de la médecine. Ce modèle reste utile pour la prise en charge médicale mais ne rend pas compte de la dimension sociale du handicap.</li>
<li><strong>Modèle social</strong> (Disability Studies, années 1970-80) : le handicap n'est pas dans la personne mais dans la <strong>société</strong> qui crée des barrières (physiques, institutionnelles, attitudinales) empêchant la participation des personnes ayant des déficiences. Le handicap est une forme d'<strong>oppression sociale</strong> (Oliver, 1990).</li>
<li><strong>Modèle biopsychosocial</strong> (CIF, OMS 2001) : synthèse des deux modèles. Le handicap résulte de l'<strong>interaction</strong> entre des facteurs de santé (déficiences) et des facteurs contextuels (environnement, facteurs personnels). Il n'est pas une caractéristique fixe mais une situation dynamique.</li>
</ul>
<p class="mb-3">La <strong>CIF</strong> (Classification Internationale du Fonctionnement, du Handicap et de la Santé, OMS 2001) a remplacé la CIH (Classification Internationale des Handicaps, Wood, 1980). Elle s'organise autour de cinq dimensions :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Fonctions organiques</strong> et <strong>structures anatomiques</strong> (niveau corporel).</li>
<li><strong>Activités</strong> (capacité de l'individu à réaliser des tâches).</li>
<li><strong>Participation</strong> (implication dans les situations de vie réelle).</li>
<li><strong>Facteurs environnementaux</strong> (facilitateurs ou obstacles).</li>
<li><strong>Facteurs personnels</strong> (âge, sexe, motivation, expérience de vie).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Modèle médical = déficience individuelle. Modèle social = barrières de l'environnement. CIF (OMS 2001) = modèle biopsychosocial : fonctions, activités, participation, facteurs environnementaux et personnels.</p></div>`
    },
    {
      title: "La loi du 11 février 2005 et le cadre juridique français",
      content: `<p class="mb-3">La <strong>loi du 11 février 2005</strong> pour l'égalité des droits et des chances, la participation et la citoyenneté des personnes handicapées est le texte fondateur du droit du handicap en France.</p>
<p class="mb-3">Sa <strong>définition du handicap</strong> (article L.114 du CASF) : « Constitue un handicap toute limitation d'activité ou restriction de participation à la vie en société subie dans son environnement par une personne en raison d'une altération substantielle, durable ou définitive d'une ou plusieurs fonctions physiques, sensorielles, mentales, cognitives ou psychiques, d'un polyhandicap ou d'un trouble de santé invalidant. »</p>
<p class="mb-3">Les apports majeurs de la loi de 2005 :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Droit à la compensation</strong> : toute personne handicapée a droit à la compensation des conséquences de son handicap, quelles que soient l'origine et la nature de la déficience. La <strong>PCH</strong> (Prestation de Compensation du Handicap) finance les aides humaines, techniques, animalières, etc.</li>
<li><strong>Accessibilité universelle</strong> : les bâtiments publics, les transports, la voirie et les établissements recevant du public doivent être rendus accessibles (obligation progressive, avec des délais d'adaptation).</li>
<li><strong>Scolarisation en milieu ordinaire</strong> : droit à l'inscription dans l'école de son quartier, avec des aménagements (AVS/AESH, matériel adapté, PPS).</li>
<li><strong>Emploi</strong> : obligation d'emploi de 6% de travailleurs handicapés pour les entreprises de plus de 20 salariés (OETH).</li>
</ul>
<p class="mb-3">Les <strong>MDPH</strong> (Maisons Départementales des Personnes Handicapées) sont le guichet unique d'accueil et d'évaluation des besoins. La <strong>CDAPH</strong> (Commission des Droits et de l'Autonomie des Personnes Handicapées) prend les décisions d'orientation et d'attribution des prestations.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Loi 2005 = droit à la compensation + accessibilité + scolarisation en milieu ordinaire + OETH 6%. MDPH = guichet unique. PCH = prestation de compensation. CDAPH = commission de décision.</p></div>`
    },
    {
      title: "Types de handicap et prise en charge",
      content: `<p class="mb-3">La loi de 2005 reconnaît explicitement <strong>plusieurs types de handicap</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Handicap moteur</strong> : atteinte de la motricité (paraplégie, tétraplégie, hémiplégie, amputations, maladies neuromusculaires). Enjeux : accessibilité, aides techniques (fauteuil roulant, prothèses), rééducation.</li>
<li><strong>Handicap sensoriel</strong> : déficience visuelle (malvoyance, cécité) ou auditive (surdité, malentendance). Enjeux : langue des signes (LSF), aides auditives, audiodescription, braille.</li>
<li><strong>Handicap mental (intellectuel)</strong> : limitations des capacités intellectuelles (trisomie 21, syndrome de l'X fragile). À distinguer du handicap psychique.</li>
<li><strong>Handicap psychique</strong> : conséquences de troubles psychiatriques (schizophrénie, troubles bipolaires, dépression sévère) sur la vie sociale. Les capacités intellectuelles sont préservées mais le fonctionnement social est altéré.</li>
<li><strong>Handicap cognitif</strong> : troubles spécifiques des apprentissages (dyslexie, dysphasie, dyspraxie), troubles du spectre autistique (TSA), TDAH.</li>
<li><strong>Polyhandicap</strong> : association d'une déficience mentale sévère et d'une déficience motrice grave, entraînant une restriction extrême de l'autonomie.</li>
<li><strong>Maladies invalidantes</strong> : maladies chroniques entraînant un handicap (sclérose en plaques, mucoviscidose, diabète sévère, cancer).</li>
</ul>
<p class="mb-3">Les <strong>structures médico-sociales</strong> accueillant les personnes handicapées : IME (Institut Médico-Éducatif, enfants), ESAT (Établissement et Service d'Aide par le Travail, adultes), MAS (Maison d'Accueil Spécialisée, adultes lourdement handicapés), FAM (Foyer d'Accueil Médicalisé), SAVS et SAMSAH (services d'accompagnement en milieu ouvert).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Types de handicap : moteur, sensoriel, mental, psychique, cognitif, polyhandicap, maladies invalidantes. Handicap mental ≠ handicap psychique. Structures : IME, ESAT, MAS, FAM, SAVS, SAMSAH.</p></div>`
    },
    {
      title: "Inclusion, accessibilité et droits internationaux",
      content: `<p class="mb-3">Le passage de l'<strong>intégration</strong> à l'<strong>inclusion</strong> marque un changement de paradigme fondamental :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Intégration</strong> : la personne handicapée doit s'adapter à l'environnement existant pour y trouver sa place (logique d'adaptation individuelle).</li>
<li><strong>Inclusion</strong> : c'est l'<strong>environnement</strong> qui doit s'adapter pour accueillir toutes les personnes, quelles que soient leurs différences (logique de transformation sociale). La diversité est vue comme une richesse, pas comme un problème.</li>
</ul>
<p class="mb-3">La <strong>Convention des Nations Unies relative aux droits des personnes handicapées</strong> (CDPH, 2006, ratifiée par la France en 2010) consacre le modèle social et les droits fondamentaux : dignité, autonomie, non-discrimination, participation pleine et effective, respect de la différence, égalité des chances, accessibilité.</p>
<p class="mb-3">L'<strong>accessibilité universelle</strong> (design for all) vise à concevoir des produits, services et environnements utilisables par tous, sans nécessité d'adaptation. Elle bénéficie à l'ensemble de la population (personnes âgées, parents avec poussettes, personnes temporairement accidentées).</p>
<p class="mb-3">L'<strong>aménagement raisonnable</strong> est l'obligation d'adapter les conditions de travail, d'études ou de vie aux besoins spécifiques d'une personne handicapée, dans la mesure où cela ne constitue pas une charge disproportionnée. Le refus d'aménagement raisonnable est une forme de discrimination (loi du 27 mai 2008).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Inclusion ≠ intégration (c'est l'environnement qui s'adapte, pas la personne). Convention ONU 2006 = droits fondamentaux des personnes handicapées. Accessibilité universelle bénéficie à tous. Refus d'aménagement raisonnable = discrimination.</p></div>`
    },
    {
      title: "Handicap et société : représentations, stigmatisation et empowerment",
      content: `<p class="mb-3">Les <strong>représentations sociales du handicap</strong> ont évolué historiquement mais restent marquées par des stéréotypes et des préjugés :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Antiquité</strong> : le handicap est souvent vu comme une malédiction divine (exposition des enfants difformes à Sparte).</li>
<li><strong>Moyen Âge</strong> : charité chrétienne mais aussi exclusion (les « fous » et les « infirmes » sont mis à l'écart).</li>
<li><strong>XIXe siècle</strong> : institutionnalisation massive (asiles, hospices). L'eugénisme se développe (stérilisation forcée aux États-Unis, programme T4 nazi d'extermination des personnes handicapées).</li>
<li><strong>XXe siècle</strong> : mouvement de désinstitutionnalisation, reconnaissance des droits, lutte contre les discriminations.</li>
</ul>
<p class="mb-3">La <strong>stigmatisation</strong> du handicap (Goffman) persiste dans les attitudes de pitié, de paternalisme, d'infantilisation ou d'évitement. Le <strong>validisme</strong> (ableism) est le système de discrimination qui hiérarchise les personnes selon leurs capacités et considère la norme valide comme supérieure.</p>
<p class="mb-3">L'<strong>empowerment</strong> des personnes handicapées passe par :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Auto-représentation</strong> : les personnes handicapées parlent en leur nom propre (« Nothing about us without us »).</li>
<li><strong>Pair-aidance</strong> : accompagnement par des pairs (personnes partageant la même expérience du handicap).</li>
<li><strong>Vie autonome</strong> (Independent Living Movement) : droit de choisir son mode de vie, son lieu de résidence, ses aides. Rejet de l'institutionnalisation systématique.</li>
<li><strong>Participation politique</strong> : droit de vote effectif (y compris pour les majeurs sous tutelle depuis 2019), représentation dans les instances consultatives.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Validisme = discrimination fondée sur les capacités. « Nothing about us without us » = auto-représentation. Pair-aidance et vie autonome = empowerment. Programme T4 nazi = rappel historique de l'eugénisme.</p></div>`
    }
  ]
},

"ssh-recherche": {
  introduction: "L'éthique de la recherche biomédicale encadre la protection des personnes se prêtant à la recherche. Elle repose sur des textes fondateurs nés des traumatismes historiques et sur un cadre réglementaire rigoureux.",
  readTime: 20,
  sections: [
    {
      title: "Fondements historiques de l'éthique de la recherche",
      content: `<p class="mb-3">L'éthique de la recherche biomédicale est née des <strong>traumatismes historiques</strong> causés par des expérimentations menées sans le consentement des personnes.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Expérimentations nazies</strong> (1939-1945) : les médecins nazis ont pratiqué des expériences inhumaines sur les détenus des camps de concentration (expériences sur l'hypothermie, les gaz de combat, les maladies infectieuses, la chirurgie osseuse). Le procès des médecins à Nuremberg (1946-1947) a conduit au <strong>Code de Nuremberg</strong> (1947), premier texte international d'éthique de la recherche.</li>
<li><strong>Code de Nuremberg</strong> (1947) : 10 principes dont le premier est le <strong>consentement volontaire</strong> du sujet humain, qui doit avoir la capacité légale de consentir, exercer un libre pouvoir de choix, et disposer d'une information suffisante.</li>
<li><strong>Déclaration d'Helsinki</strong> (Association Médicale Mondiale, 1964, révisée régulièrement, dernière version 2013) : principes éthiques pour la recherche médicale impliquant des êtres humains. Elle distingue recherche thérapeutique et non thérapeutique, affirme la primauté du bien-être du participant sur les intérêts de la science et de la société.</li>
<li><strong>Scandale de Tuskegee</strong> (1932-1972, États-Unis) : étude observationnelle sur la syphilis chez 600 hommes afro-américains, dont 399 syphilitiques, qui n'ont jamais été traités ni informés, même après l'avènement de la pénicilline. Ce scandale a conduit au <strong>Rapport Belmont</strong> (1979).</li>
</ul>
<p class="mb-3">Le <strong>Rapport Belmont</strong> (1979) définit trois principes éthiques fondamentaux : <strong>le respect des personnes</strong> (autonomie, consentement), <strong>la bienfaisance</strong> (maximiser les bénéfices, minimiser les risques) et <strong>la justice</strong> (répartition équitable des charges et des bénéfices de la recherche).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Nuremberg 1947 = consentement volontaire obligatoire. Helsinki 1964 = primauté du bien-être du participant. Tuskegee = scandale fondateur. Belmont 1979 = 3 principes : respect, bienfaisance, justice.</p></div>`
    },
    {
      title: "Le cadre réglementaire français : la loi Jardé",
      content: `<p class="mb-3">En France, la recherche impliquant la personne humaine est encadrée par la <strong>loi Jardé</strong> (loi du 5 mars 2012, entrée en application le 18 novembre 2016). Elle a remplacé la loi Huriet-Sérusclat de 1988 (première loi française d'encadrement de la recherche biomédicale).</p>
<p class="mb-3">La loi Jardé classe les recherches en <strong>trois catégories</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Catégorie 1 : Recherches interventionnelles</strong> (RIPH 1) : comportent une intervention sur la personne non justifiée par sa prise en charge habituelle (ex : essai d'un nouveau médicament, chirurgie expérimentale). Elles nécessitent l'avis favorable d'un CPP ET l'autorisation de l'ANSM.</li>
<li><strong>Catégorie 2 : Recherches interventionnelles à risques et contraintes minimes</strong> (RIPH 2) : interventions peu invasives listées par arrêté (ex : prise de sang supplémentaire, questionnaire avec prélèvement). Avis favorable du CPP nécessaire, pas d'autorisation ANSM.</li>
<li><strong>Catégorie 3 : Recherches non interventionnelles</strong> (RIPH 3) : observationnelles, sans modification de la prise en charge (ex : étude de cohorte, étude sur dossiers). Avis favorable du CPP nécessaire.</li>
</ul>
<p class="mb-3">Les acteurs de la recherche :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Promoteur</strong> : personne physique ou morale qui prend l'initiative de la recherche, en assure la gestion et vérifie le financement.</li>
<li><strong>Investigateur</strong> : médecin qui dirige et surveille la réalisation de la recherche sur un site.</li>
<li><strong>CPP</strong> (Comité de Protection des Personnes) : instance éthique indépendante qui évalue la pertinence scientifique, le rapport bénéfice/risque, la qualité de l'information et du consentement.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Loi Jardé (2012) = 3 catégories (interventionnelle, risques minimes, non interventionnelle). CPP obligatoire pour les 3 catégories. ANSM nécessaire uniquement pour la catégorie 1. Promoteur = responsable, investigateur = dirige sur site.</p></div>`
    },
    {
      title: "Consentement éclairé et protection des personnes vulnérables",
      content: `<p class="mb-3">Le <strong>consentement éclairé</strong> est la pierre angulaire de l'éthique de la recherche. Il doit être :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Libre</strong> : sans contrainte ni pression (pas de lien de subordination entre le chercheur et le participant).</li>
<li><strong>Éclairé</strong> : après avoir reçu une information complète et compréhensible sur les objectifs, les méthodes, les risques, les bénéfices attendus, les alternatives et le droit de retrait.</li>
<li><strong>Spécifique</strong> : il porte sur une recherche précise et ne vaut pas consentement général.</li>
<li><strong>Révocable</strong> : le participant peut se retirer à tout moment sans avoir à justifier sa décision et sans conséquence sur sa prise en charge médicale.</li>
<li><strong>Écrit</strong> : pour les recherches de catégorie 1, le consentement doit être recueilli par écrit (formulaire signé). Pour les catégories 2 et 3, une information écrite et une non-opposition peuvent suffire.</li>
</ul>
<p class="mb-3">La protection des <strong>personnes vulnérables</strong> fait l'objet de dispositions renforcées :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Mineurs</strong> : consentement des titulaires de l'autorité parentale ET assentiment de l'enfant selon sa maturité. La recherche doit être en rapport avec la condition du mineur.</li>
<li><strong>Majeurs protégés</strong> (tutelle, curatelle) : consentement adapté au régime de protection. Le tuteur consent, mais le majeur protégé est informé et associé.</li>
<li><strong>Situations d'urgence</strong> : le consentement peut être recueilli a posteriori auprès du patient ou de sa personne de confiance/famille, si la recherche ne peut être différée.</li>
<li><strong>Personnes privées de liberté</strong> : recherche possible uniquement si elle est en rapport direct avec leur condition et si le bénéfice individuel est attendu.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Consentement = libre, éclairé, spécifique, révocable, écrit (catégorie 1). Protections renforcées pour les vulnérables : mineurs (autorité parentale + assentiment), majeurs protégés, urgences (consentement a posteriori).</p></div>`
    },
    {
      title: "Intégrité scientifique et conflits d'intérêts",
      content: `<p class="mb-3">L'<strong>intégrité scientifique</strong> est l'ensemble des principes et pratiques garantissant l'honnêteté et la rigueur de la recherche. Les manquements à l'intégrité minent la confiance dans la science et peuvent avoir des conséquences graves pour la santé publique.</p>
<p class="mb-3">Les principales formes de <strong>fraude scientifique</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Fabrication</strong> (FFP) : invention de données ou de résultats qui n'existent pas.</li>
<li><strong>Falsification</strong> : manipulation ou modification de données, de résultats, d'images ou de procédures pour que la recherche apparaisse conforme aux hypothèses.</li>
<li><strong>Plagiat</strong> : utilisation des idées, résultats ou mots d'autrui sans attribution appropriée.</li>
</ul>
<p class="mb-3">Les <strong>pratiques de recherche questionnables</strong> (Questionable Research Practices, QRP) sont des comportements qui, sans être de la fraude caractérisée, compromettent la qualité de la recherche : p-hacking (manipulation statistique pour obtenir un résultat significatif), HARKing (Hypothesizing After Results are Known), saucissonnage des publications (salami slicing), non-publication des résultats négatifs.</p>
<p class="mb-3">Les <strong>conflits d'intérêts</strong> surviennent lorsque des intérêts secondaires (financiers, professionnels, personnels) peuvent influencer le jugement du chercheur. La <strong>déclaration publique d'intérêts</strong> (DPI) est obligatoire pour les experts. La loi Bertrand (2011) impose la transparence des liens entre professionnels de santé et industries.</p>
<p class="mb-3">En France, l'<strong>OFIS</strong> (Office Français de l'Intégrité Scientifique) et les référents intégrité dans chaque établissement de recherche veillent au respect des bonnes pratiques. Le <strong>plan national pour la science ouverte</strong> (2018) promeut l'accès ouvert aux publications et aux données de recherche.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : FFP = fabrication, falsification, plagiat. QRP = p-hacking, HARKing, salami slicing. La DPI est obligatoire pour les experts. Loi Bertrand 2011 = transparence des liens d'intérêts. OFIS = intégrité scientifique en France.</p></div>`
    },
    {
      title: "Enjeux éthiques contemporains de la recherche",
      content: `<p class="mb-3">La recherche biomédicale contemporaine soulève de <strong>nouveaux enjeux éthiques</strong> que les cadres réglementaires traditionnels peinent à couvrir :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Recherche sur les données massives</strong> (Big Data) : l'utilisation de bases de données de santé (SNDS, biobanques, données génomiques) pose des questions de consentement (les participants n'ont pas consenti à des usages futurs imprévus), de vie privée (risque de ré-identification) et de propriété des données.</li>
<li><strong>Intelligence artificielle en recherche</strong> : les algorithmes de machine learning utilisent des données d'entraînement qui peuvent contenir des biais (raciaux, de genre, sociaux). La transparence des algorithmes (explicabilité) et la responsabilité en cas d'erreur sont des enjeux majeurs.</li>
<li><strong>Recherche en situation de crise</strong> : les pandémies (COVID-19) ont montré la tension entre l'urgence d'obtenir des résultats et le respect des normes éthiques. Les essais adaptatifs et les autorisations d'urgence soulèvent des questions de rigueur méthodologique.</li>
<li><strong>Recherche sur les organoïdes et embryons synthétiques</strong> : les modèles embryonnaires créés in vitro questionnent les limites de la recherche sur l'embryon (la règle des 14 jours est-elle encore pertinente ?).</li>
<li><strong>Recherche dans les pays à ressources limitées</strong> : risque d'exploitation (les participants du Sud bénéficient rarement des résultats de la recherche), standard de soins (le groupe contrôle doit-il recevoir le meilleur traitement mondial ou le meilleur traitement local ?).</li>
</ul>
<p class="mb-3">Le <strong>partage des bénéfices</strong> de la recherche est un principe éthique émergent : les participants et les communautés qui contribuent à la recherche doivent avoir accès aux résultats et aux innovations qui en découlent. Ce principe est inscrit dans la Déclaration d'Helsinki (post-study access).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Big Data = enjeux de consentement et de vie privée. IA = risque de biais algorithmiques. Recherche en crise = tension urgence/rigueur. Recherche Nord-Sud = risque d'exploitation. Partage des bénéfices = obligation éthique.</p></div>`
    }
  ]
},

"ssh-anthropologie": {
  introduction: "L'anthropologie médicale étudie les représentations culturelles de la santé, de la maladie et du corps à travers les sociétés. Elle est indispensable pour comprendre la diversité des rapports au soin.",
  readTime: 18,
  sections: [
    {
      title: "Disease, illness, sickness : les trois dimensions de la maladie",
      content: `<p class="mb-3">L'anthropologie médicale propose une analyse de la maladie qui dépasse la seule dimension biomédicale en distinguant <strong>trois dimensions</strong> (Kleinman, 1980) :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Disease</strong> (la maladie-du-médecin) : la réalité biologique objectivée par le savoir médical. C'est la maladie telle que la biomédecine la définit : diagnostic, physiopathologie, traitement. Le disease relève du regard clinique.</li>
<li><strong>Illness</strong> (la maladie-du-malade) : l'expérience subjective et vécue de la maladie par le patient. Elle inclut les symptômes perçus, la souffrance, les représentations, les explications profanes, l'impact sur la vie quotidienne et l'identité. L'illness est culturellement construite.</li>
<li><strong>Sickness</strong> (la maladie-de-la-société) : la dimension sociale de la maladie. Comment la société reconnaît, catégorise et gère la maladie : arrêt de travail, invalidité, stigmatisation, politiques de santé publique. Le sickness articule les dimensions individuelle et collective.</li>
</ul>
<p class="mb-3">Cette triple perspective montre que le médecin et le patient ne parlent pas toujours de la même chose : le médecin traite le disease tandis que le patient vit l'illness. La <strong>discordance</strong> entre ces deux perspectives est source de malentendus, de non-observance et d'insatisfaction.</p>
<p class="mb-3">Le concept de <strong>modèle explicatif</strong> (Explanatory Model, Kleinman) désigne l'ensemble des représentations qu'un individu ou un groupe se fait d'une maladie : ses causes, son mécanisme, sa signification, son pronostic et son traitement. Explorer le modèle explicatif du patient est essentiel pour adapter le soin.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Disease = maladie biomédicale, illness = vécu subjectif, sickness = dimension sociale. Kleinman : le modèle explicatif du patient doit être exploré. La discordance disease/illness = source de malentendus.</p></div>`
    },
    {
      title: "Systèmes médicaux et pluralisme thérapeutique",
      content: `<p class="mb-3">L'anthropologie médicale étudie la diversité des <strong>systèmes médicaux</strong> à travers le monde. Chaque culture a développé ses propres théories de la maladie et ses propres pratiques thérapeutiques.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Biomédecine</strong> (médecine « occidentale ») : fondée sur la science expérimentale, l'anatomie, la physiologie et la pharmacologie. Elle est devenue le système médical dominant à l'échelle mondiale mais n'est qu'un système parmi d'autres du point de vue anthropologique.</li>
<li><strong>Médecine traditionnelle chinoise</strong> (MTC) : fondée sur les concepts de qi (énergie vitale), yin/yang (forces complémentaires), les cinq éléments, les méridiens. Pratiques : acupuncture, pharmacopée, qi gong, massage tui na.</li>
<li><strong>Ayurvéda</strong> (Inde) : fondée sur les trois doshas (vata, pitta, kapha), la constitution individuelle (prakriti) et l'équilibre entre les éléments. Pratiques : alimentation, plantes, yoga, méditation.</li>
<li><strong>Médecines traditionnelles africaines</strong> : systèmes variés intégrant la dimension spirituelle (maladie comme déséquilibre avec le monde des ancêtres), l'usage de plantes médicinales et les rituels thérapeutiques.</li>
<li><strong>Chamanisme</strong> : dans de nombreuses cultures (Sibérie, Amériques, Asie), le chaman est un intermédiaire entre le monde visible et le monde des esprits, capable de diagnostiquer et traiter les maladies.</li>
</ul>
<p class="mb-3">Le <strong>pluralisme médical</strong> (ou pluralisme thérapeutique) est la coexistence de plusieurs systèmes de soins dans une même société. En France, de nombreux patients combinent biomédecine et médecines complémentaires (homéopathie, ostéopathie, naturopathie, médecine chinoise). Ce pluralisme est souvent dissimulé au médecin par crainte du jugement.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La biomédecine est un système médical parmi d'autres (MTC, ayurvéda, médecines traditionnelles). Le pluralisme médical est la norme dans la plupart des sociétés. Les patients combinent souvent plusieurs systèmes sans en informer leur médecin.</p></div>`
    },
    {
      title: "Représentations culturelles du corps et de la douleur",
      content: `<p class="mb-3">Le <strong>corps</strong> n'est pas seulement une réalité biologique : il est aussi un <strong>objet culturel</strong> dont la signification varie selon les sociétés. L'anthropologie montre que les pratiques corporelles (alimentation, sexualité, soins du corps, mort) sont culturellement construites.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Marcel Mauss</strong> (Les Techniques du corps, 1934) : les manières de marcher, dormir, nager, accoucher sont des « techniques du corps » acquises par socialisation. Chaque culture transmet ses propres normes corporelles.</li>
<li><strong>Mary Douglas</strong> (De la souillure, 1966) : les notions de pureté et de souillure organisent les rapports au corps dans toutes les sociétés. La maladie peut être perçue comme une forme de souillure ou de transgression d'un interdit.</li>
<li><strong>David Le Breton</strong> (Anthropologie de la douleur, 1995) : la douleur est un phénomène biologique universel mais son expression et sa signification sont culturellement variables. Le seuil de tolérance à la douleur, les modalités d'expression (cris, silence, plainte) et la signification attribuée (épreuve, punition, purification) varient considérablement.</li>
</ul>
<p class="mb-3">Les <strong>représentations du corps en médecine</strong> influencent la pratique soignante : le corps anatomique du médecin n'est pas le corps vécu du patient. Le don d'organes, la greffe, la transfusion sanguine peuvent heurter des représentations culturelles ou religieuses du corps et de l'intégrité corporelle.</p>
<p class="mb-3">Les <strong>pratiques de modification corporelle</strong> (excision, circoncision, tatouage rituel, scarification) sont des enjeux interculturels en médecine. Les mutilations génitales féminines (excision, infibulation) sont interdites en France et constituent un problème de santé publique.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Mauss : techniques du corps = acquises par socialisation. Le Breton : la douleur est biologiquement universelle mais culturellement variable. Le corps du médecin ≠ le corps vécu du patient. Les MGF sont interdites en France.</p></div>`
    },
    {
      title: "Compétence culturelle et soins interculturels",
      content: `<p class="mb-3">La <strong>compétence culturelle</strong> (cultural competence) désigne la capacité du professionnel de santé à comprendre, respecter et intégrer les dimensions culturelles dans la relation de soin. Elle est devenue une compétence essentielle dans les sociétés multiculturelles.</p>
<p class="mb-3">Les composantes de la compétence culturelle :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Conscience culturelle</strong> (cultural awareness) : reconnaître ses propres biais culturels et l'influence de sa culture sur sa pratique.</li>
<li><strong>Connaissance culturelle</strong> (cultural knowledge) : acquérir des connaissances sur les différentes cultures (sans tomber dans les stéréotypes).</li>
<li><strong>Habileté culturelle</strong> (cultural skill) : savoir mener un entretien culturellement sensible, explorer les représentations du patient.</li>
<li><strong>Humilité culturelle</strong> (cultural humility) : adopter une posture d'apprentissage permanent, reconnaître ses limites.</li>
</ul>
<p class="mb-3">L'<strong>ethnocentrisme médical</strong> est le risque de considérer la biomédecine comme le seul système médical légitime et de dévaloriser les autres systèmes de soins. Il peut conduire à des malentendus, à de la non-observance et à une détérioration de la relation de soin.</p>
<p class="mb-3">L'<strong>interprétariat professionnel en santé</strong> est essentiel pour les patients allophones. Le recours à un membre de la famille comme interprète est déconseillé car il compromet la confidentialité, l'exactitude de la traduction et l'expression libre du patient (surtout pour les sujets sensibles : violences, sexualité, psychiatrie).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Compétence culturelle = conscience + connaissance + habileté + humilité. L'ethnocentrisme médical = obstacle au soin. L'interprétariat professionnel est préférable au recours familial (confidentialité, exactitude).</p></div>`
    },
    {
      title: "Anthropologie de la mort, du deuil et des rituels",
      content: `<p class="mb-3">L'anthropologie de la <strong>mort</strong> montre que les attitudes face à la mort, les rituels funéraires et le deuil sont profondément culturels et variables.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Philippe Ariès</strong> (L'Homme devant la mort, 1977) : l'histoire occidentale de la mort est passée de la « mort apprivoisée » (mort familière, publique, ritualisée au Moyen Âge) à la « mort interdite » (mort cachée, hospitalisée, médicalisée au XXe siècle). Aujourd'hui, 80% des décès ont lieu à l'hôpital ou en institution en France.</li>
<li><strong>Louis-Vincent Thomas</strong> : fondateur de la thanatologie (science de la mort). Il analyse le déni occidental de la mort et les mécanismes de défense sociale face à la mort (euphémismes, éloignement des mourants, médicalisation de la fin de vie).</li>
<li><strong>Diversité des rituels</strong> : inhumation, crémation, exposition aux vautours (rite zoroastrien), enterrement en pleine terre (tradition musulmane), toilette mortuaire, veillée funéraire. Chaque culture a ses propres normes concernant le traitement du corps mort et l'expression du deuil.</li>
</ul>
<p class="mb-3">En contexte hospitalier, le soignant est confronté à la <strong>diversité des pratiques</strong> face à la mort : la toilette mortuaire rituelle (islam, judaïsme), les prières, les objets sacrés, les interdits alimentaires, la position du corps, la présence de la famille. Le respect de ces pratiques dans la mesure du possible est un enjeu de dignité.</p>
<p class="mb-3">Le <strong>deuil</strong> est un processus universel mais ses manifestations sont culturellement encadrées : durée du deuil (40 jours dans l'islam, shiva dans le judaïsme), vêtements de deuil, interdits comportementaux, rituels commémoratifs. La médicalisation du deuil (prescription de psychotropes, pathologisation du deuil prolongé) fait l'objet de critiques anthropologiques.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Ariès : de la « mort apprivoisée » à la « mort interdite ». 80% des décès en institution en France. Les rituels funéraires sont culturellement variables. Le soignant doit respecter la diversité des pratiques face à la mort.</p></div>`
    }
  ]
},

"ssh-genre-sante": {
  introduction: "Le genre influence la santé à travers les normes sociales, les comportements et l'accès aux soins. Les inégalités de genre en santé sont un enjeu de justice sociale et de qualité des soins.",
  readTime: 18,
  sections: [
    {
      title: "Sexe, genre et santé : définitions et distinctions",
      content: `<p class="mb-3">La compréhension des inégalités de genre en santé nécessite de distinguer clairement <strong>sexe</strong> et <strong>genre</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Sexe</strong> : ensemble des caractéristiques biologiques (chromosomiques, hormonales, anatomiques) qui différencient les mâles et les femelles. Le sexe influence la physiologie, le métabolisme des médicaments, la susceptibilité à certaines maladies.</li>
<li><strong>Genre</strong> : construction sociale qui définit les rôles, les comportements, les activités et les attributs qu'une société considère comme appropriés pour les hommes et les femmes. Le genre est appris, variable selon les cultures et les époques, et modifiable.</li>
</ul>
<p class="mb-3">Le sexe et le genre <strong>interagissent</strong> pour produire des différences de santé :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li>Les hommes ont une espérance de vie inférieure de <strong>~6 ans</strong> (France : ~79 vs ~85 ans). Cette différence n'est que partiellement biologique : elle s'explique largement par les <strong>comportements à risque</strong> encouragés par les normes de masculinité (alcool, tabac, conduites dangereuses, moindre recours aux soins).</li>
<li>Les femmes vivent plus longtemps mais avec plus d'années en <strong>mauvaise santé</strong> (morbidité différentielle). Elles souffrent davantage de maladies auto-immunes, d'ostéoporose, de dépression et d'anxiété.</li>
<li>L'écart d'espérance de vie entre hommes et femmes se <strong>réduit</strong> progressivement (il était de 8 ans dans les années 1990) en raison de la convergence des comportements (tabagisme féminin, moindre surmortalité masculine au travail).</li>
</ul>
<p class="mb-3">La notion d'<strong>intersectionnalité</strong> (Crenshaw, 1989) montre que le genre n'agit pas seul mais interagit avec d'autres facteurs de discrimination (classe sociale, origine ethnique, orientation sexuelle, handicap) pour produire des inégalités cumulatives.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Sexe = biologique, genre = construction sociale. Écart d'espérance de vie ~6 ans (H < F), en partie lié aux normes de masculinité. Les femmes vivent plus longtemps mais avec plus de morbidité. Intersectionnalité = cumul des discriminations.</p></div>`
    },
    {
      title: "Biais de genre en médecine et sous-diagnostic",
      content: `<p class="mb-3">Les <strong>biais de genre en médecine</strong> affectent le diagnostic, le traitement et la recherche, contribuant à des inégalités de prise en charge.</p>
<p class="mb-3">Les principaux biais identifiés :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Sous-diagnostic chez les femmes</strong> : certaines pathologies sont sous-diagnostiquées car elles ont été historiquement décrites chez l'homme et les symptômes féminins diffèrent. Exemples : <strong>infarctus du myocarde</strong> (symptômes atypiques chez la femme : fatigue, nausées, douleur dorsale plutôt que douleur thoracique typique), <strong>TDAH</strong> (sous-diagnostiqué chez les filles car la présentation est moins « bruyante »), <strong>endométriose</strong> (retard diagnostique moyen de 7 ans).</li>
<li><strong>Sous-représentation dans la recherche</strong> : les femmes ont été historiquement exclues des essais cliniques (crainte de la grossesse, variabilité hormonale jugée gênante). Les connaissances médicales sont donc largement fondées sur le corps masculin comme « norme ». Les NIH (États-Unis) n'ont imposé l'inclusion des femmes dans les essais qu'en 1993.</li>
<li><strong>Prise en charge différentielle de la douleur</strong> : les plaintes douloureuses des femmes sont plus souvent attribuées à des causes psychologiques (« c'est dans la tête »), conduisant à une moindre prescription d'antalgiques et à un plus grand délai de prise en charge.</li>
<li><strong>Pharmacologie genrée</strong> : les différences pharmacocinétiques et pharmacodynamiques entre hommes et femmes (masse graisseuse, activité enzymatique, hormones) sont insuffisamment prises en compte dans le dosage des médicaments.</li>
</ul>
<p class="mb-3">La <strong>médecine genrée</strong> (gender medicine) est un champ émergent qui vise à intégrer systématiquement les différences de sexe et de genre dans la recherche, l'enseignement et la pratique médicale.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Sous-diagnostic féminin : infarctus (symptômes atypiques), TDAH, endométriose (retard de 7 ans). Les femmes sous-représentées dans les essais cliniques (inclusion obligatoire depuis 1993 aux États-Unis). La douleur des femmes est plus souvent psychologisée.</p></div>`
    },
    {
      title: "Violences de genre et santé publique",
      content: `<p class="mb-3">Les <strong>violences faites aux femmes</strong> sont reconnues comme un problème majeur de <strong>santé publique</strong> par l'OMS. Elles ont des conséquences physiques, psychologiques et sociales considérables.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Violences conjugales</strong> : en France, environ 213 000 femmes sont victimes de violences physiques et/ou sexuelles par leur conjoint ou ex-conjoint chaque année. Les conséquences : traumatismes, troubles psychotraumatiques (PTSD), dépression, addictions, grossesses non désirées, IST.</li>
<li><strong>Violences sexuelles</strong> : viols, agressions sexuelles, harcèlement. 94 000 femmes sont victimes de viol ou tentative de viol chaque année en France.</li>
<li><strong>Mutilations génitales féminines</strong> (MGF) : excision, infibulation. 200 millions de femmes concernées dans le monde (OMS). Interdites en France (crime, article 222-9 du Code pénal). Environ 60 000 femmes mutilées vivant en France.</li>
<li><strong>Mariages forcés</strong> : constituent une violence de genre avec des conséquences sanitaires (grossesses précoces, IST, isolement).</li>
</ul>
<p class="mb-3">Le <strong>rôle du médecin</strong> face aux violences de genre :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Dépistage systématique</strong> : poser la question des violences de manière routinière (recommandation HAS).</li>
<li><strong>Rédaction d'un certificat médical descriptif</strong> : constater les lésions sans se prononcer sur leur origine (description objective).</li>
<li><strong>Orientation</strong> : vers les associations spécialisées, les UMJ (Unités Médico-Judiciaires), le 3919 (numéro d'aide aux victimes).</li>
<li><strong>Signalement</strong> : possibilité de lever le secret médical pour signaler les violences sur mineurs (obligation) ou sur majeurs en danger immédiat (avec l'accord de la victime, sauf péril imminent — loi du 30 juillet 2020).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : 213 000 femmes victimes de violences conjugales/an en France. Le médecin doit dépister, constater (certificat descriptif), orienter et peut signaler. MGF = crime. 3919 = numéro d'aide aux victimes.</p></div>`
    },
    {
      title: "Santé sexuelle et reproductive",
      content: `<p class="mb-3">La <strong>santé sexuelle et reproductive</strong> (SSR) est définie par l'OMS comme un état de bien-être physique, mental et social lié à la sexualité. Elle englobe le droit à une vie sexuelle satisfaisante et sûre, la capacité de se reproduire et la liberté de décider si, quand et avec quelle fréquence le faire.</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Contraception</strong> : la France dispose d'un large éventail de méthodes contraceptives (pilule, DIU, implant, préservatif, contraception d'urgence). La contraception est gratuite et confidentielle pour les mineures. La loi Neuwirth (1967) a légalisé la contraception.</li>
<li><strong>IVG</strong> (Interruption Volontaire de Grossesse) : légalisée par la loi Veil (1975), elle est un droit garanti jusqu'à 14 semaines de grossesse (16 SA) depuis la loi de 2022. L'IVG est inscrite dans la Constitution depuis la loi constitutionnelle du 8 mars 2024 (« La loi détermine les conditions dans lesquelles s'exerce la liberté garantie à la femme d'avoir recours à une interruption volontaire de grossesse »).</li>
<li><strong>Suivi de grossesse</strong> : PMI (Protection Maternelle et Infantile), consultations prénatales obligatoires, dépistages (trisomie 21, diabète gestationnel), préparation à la naissance.</li>
<li><strong>Infections sexuellement transmissibles</strong> (IST) : dépistage, prévention (préservatif, PrEP pour le VIH), traitement. La France a une stratégie de dépistage élargi du VIH (proposé à toute la population au moins une fois dans la vie).</li>
</ul>
<p class="mb-3">Les <strong>enjeux de SSR</strong> dans le monde : accès à la contraception (214 millions de femmes dans les pays en développement n'ont pas accès à une contraception moderne), mortalité maternelle (295 000 décès/an, 94% dans les pays à faible revenu), mariages précoces, grossesses adolescentes.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Loi Neuwirth 1967 = contraception. Loi Veil 1975 = IVG. IVG inscrite dans la Constitution (2024). IVG jusqu'à 14 semaines de grossesse (16 SA). Contraception gratuite et confidentielle pour les mineures.</p></div>`
    },
    {
      title: "Genre, identités et santé des minorités",
      content: `<p class="mb-3">Les questions de <strong>genre et d'identité</strong> ont des implications importantes en santé, au-delà du binarisme homme/femme :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Personnes transgenres</strong> : les personnes dont l'identité de genre ne correspond pas au sexe assigné à la naissance. Elles font face à des enjeux de santé spécifiques : accès aux traitements hormonaux, chirurgies de réassignation, santé mentale (prévalence élevée de dépression, anxiété, idées suicidaires liées à la transphobie et à la dysphorie de genre). La dépsychiatrisation de la transidentité (retirée des maladies mentales par l'OMS en 2019, CIM-11) est un progrès majeur.</li>
<li><strong>Personnes intersexuées</strong> : variations du développement sexuel ne correspondant pas aux catégories binaires mâle/femelle (1,7% des naissances selon certaines estimations). Les chirurgies « normalisatrices » précoces font l'objet de controverses éthiques (consentement, nécessité médicale).</li>
<li><strong>Santé des personnes LGBTQ+</strong> : les discriminations (homophobie, transphobie, lesbophobie) ont des conséquences sur la santé mentale (risque suicidaire multiplié par 4 chez les jeunes LGB) et l'accès aux soins (évitement des soins par peur du jugement).</li>
</ul>
<p class="mb-3">La <strong>santé masculine</strong> est également un enjeu de genre : les normes de masculinité (force, endurance, indépendance) conduisent les hommes à consulter moins, à sous-estimer les symptômes et à avoir des comportements à risque. Le suicide est 3 fois plus fréquent chez les hommes que chez les femmes en France.</p>
<p class="mb-3">L'intégration du genre dans la <strong>formation médicale</strong> est un enjeu pédagogique : enseigner les différences de sexe et de genre dans la physiologie, la pharmacologie, la sémiologie et la relation de soin pour former des médecins conscients de ces dimensions.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Transidentité = dépsychiatrisée (CIM-11, 2019). Risque suicidaire x4 chez les jeunes LGB. Suicide x3 chez les hommes (normes de masculinité). L'intégration du genre dans la formation médicale est essentielle.</p></div>`
    }
  ]
},

"ssh-psychiatrie": {
  introduction: "La psychiatrie interroge les frontières entre normal et pathologique, les droits des patients en santé mentale et la place de la maladie mentale dans la société.",
  readTime: 18,
  sections: [
    {
      title: "Histoire de la psychiatrie",
      content: `<p class="mb-3">L'histoire de la psychiatrie reflète l'évolution du regard de la société sur la maladie mentale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Antiquité et Moyen Âge</strong> : la folie est interprétée comme possession démoniaque ou punition divine. Les « fous » sont marginalisés ou enfermés.</li>
<li><strong>Pinel (1793)</strong> : « libère les aliénés de leurs chaînes » à Bicêtre. Naissance du traitement moral : la folie est une maladie qui peut être soignée.</li>
<li><strong>Loi Esquirol (1838)</strong> : chaque département doit disposer d'un asile. Premier cadre légal de l'internement psychiatrique.</li>
<li><strong>Sectorisation (1960)</strong> : organisation des soins psychiatriques par secteur géographique, visant des soins de proximité et la réinsertion sociale.</li>
<li><strong>Désinstitutionnalisation (1960-70)</strong> : fermeture progressive des asiles, développement des soins ambulatoires, centres médico-psychologiques (CMP).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Pinel (1793) = naissance de la psychiatrie moderne. Esquirol (1838) = premier cadre légal. La sectorisation (1960) organise les soins de proximité.</p></div>`
    },
    {
      title: "Soins sans consentement en psychiatrie",
      content: `<p class="mb-3">La loi du <strong>5 juillet 2011</strong> (modifiée en 2013) encadre les soins psychiatriques sans consentement, en conciliant le droit aux soins et la protection des libertés individuelles :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>SDT (Soins à la Demande d'un Tiers)</strong> : nécessite la demande d'un tiers (famille, proche) et deux certificats médicaux (dont un d'un médecin extérieur). En urgence (SDT-U), un seul certificat suffit.</li>
<li><strong>SPI (Soins en cas de Péril Imminent)</strong> : quand aucun tiers ne peut être trouvé. Un seul certificat médical. Le directeur de l'établissement prend la décision.</li>
<li><strong>SDRE (Soins sur Décision du Représentant de l'État)</strong> : ancien HO. Pour les personnes dont les troubles compromettent la sûreté des personnes ou l'ordre public. Décision préfectorale sur certificat médical.</li>
</ul>
<p class="mb-3">Le <strong>JLD (Juge des Libertés et de la Détention)</strong> contrôle systématiquement les mesures à 12 jours, puis à 6 mois. Le patient peut saisir le JLD à tout moment. Les soins sans consentement peuvent prendre la forme d'une hospitalisation complète ou de soins ambulatoires (programme de soins).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : SDT = demande d'un tiers + 2 certificats. SPI = pas de tiers disponible. SDRE = ordre public. Contrôle du JLD obligatoire à 12 jours.</p></div>`
    },
    {
      title: "Normal et pathologique en psychiatrie",
      content: `<p class="mb-3">La question de la frontière entre <strong>normal et pathologique</strong> est centrale en psychiatrie et en philosophie de la médecine :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Canguilhem</strong> (Le Normal et le Pathologique, 1943) : la santé n'est pas l'absence de maladie mais la capacité à créer de nouvelles normes de vie. La maladie est une réduction de cette capacité normative.</li>
<li><strong>Classification des troubles mentaux</strong> : le DSM-5 (APA) et la CIM-11 (OMS) définissent les critères diagnostiques. Débats sur la médicalisation de la souffrance psychique ordinaire (deuil, timidité).</li>
<li><strong>Antipsychiatrie</strong> (Szasz, Laing, Foucault) : mouvement critique contestant le pouvoir psychiatrique et la notion même de maladie mentale comme construction sociale servant au contrôle social.</li>
<li><strong>Neurodiversité</strong> : courant considérant certaines conditions (autisme, TDAH) non comme des pathologies mais comme des variations neurologiques naturelles.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Canguilhem définit la santé comme capacité normative. Le débat normal/pathologique interroge les limites de la médicalisation et le risque de contrôle social.</p></div>`
    },
    {
      title: "Stigmatisation de la maladie mentale",
      content: `<p class="mb-3">La <strong>stigmatisation</strong> des personnes souffrant de troubles mentaux constitue un obstacle majeur à l'accès aux soins et à l'insertion sociale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Stéréotypes</strong> : les personnes atteintes de troubles mentaux sont perçues comme dangereuses, imprévisibles ou responsables de leur maladie. En réalité, elles sont plus souvent victimes que auteurs de violence.</li>
<li><strong>Auto-stigmatisation</strong> : intériorisation des stéréotypes négatifs par le patient lui-même, entraînant honte, isolement et retard de recours aux soins.</li>
<li><strong>Discrimination structurelle</strong> : difficultés d'accès à l'emploi, au logement, aux assurances. Sous-investissement chronique de la psychiatrie dans le système de santé.</li>
<li><strong>Lutte contre la stigmatisation</strong> : campagnes de sensibilisation, programmes de contact (rencontre avec des personnes concernées), formation des professionnels, témoignages de patients (pair-aidance).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La stigmatisation retarde l'accès aux soins et aggrave le pronostic. Les programmes de contact (rencontre directe) sont les interventions anti-stigma les plus efficaces.</p></div>`
    },
    {
      title: "Rétablissement et pair-aidance",
      content: `<p class="mb-3">Le paradigme du <strong>rétablissement (recovery)</strong> a transformé la psychiatrie contemporaine :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Définition</strong> : le rétablissement n'est pas la guérison mais un processus personnel de reconstruction d'une vie satisfaisante malgré la persistance éventuelle de symptômes. Il valorise l'espoir, l'identité, le sens et l'empowerment.</li>
<li><strong>Pair-aidance</strong> : des personnes ayant vécu un trouble mental sont formées pour accompagner d'autres patients. Elles apportent une expertise d'expérience complémentaire à l'expertise clinique. Reconnaissance institutionnelle croissante en France.</li>
<li><strong>Directives anticipées psychiatriques</strong> : permettent au patient de formuler à l'avance ses souhaits en cas de crise (traitements acceptés/refusés, personne de confiance). Valorisent l'autonomie du patient.</li>
<li><strong>Réhabilitation psychosociale</strong> : programmes structurés visant à restaurer les compétences sociales, cognitives et professionnelles (remédiation cognitive, entraînement aux habiletés sociales, emploi accompagné).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le rétablissement = processus personnel, pas guérison. La pair-aidance apporte une expertise d'expérience. Les directives anticipées psychiatriques renforcent l'autonomie du patient.</p></div>`
    }
  ]
},

"ssh-ecologie-sante": {
  introduction: "L'écologie de la santé étudie les interactions entre environnement et santé humaine. Le concept One Health reconnaît l'interdépendance entre santé humaine, animale et environnementale.",
  readTime: 16,
  sections: [
    {
      title: "Déterminants environnementaux de la santé",
      content: `<p class="mb-3">L'environnement est un déterminant majeur de la santé, responsable d'environ <strong>23 % de la mortalité mondiale</strong> selon l'OMS :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Pollution atmosphérique</strong> : PM2,5, ozone, NO₂ → 48 000 décès prématurés/an en France, 7 millions dans le monde. Maladies respiratoires, cardiovasculaires, cancers du poumon.</li>
<li><strong>Pollution de l'eau</strong> : contamination chimique (pesticides, métaux lourds, résidus médicamenteux) et microbiologique. Impact sur les maladies diarrhéiques dans les pays en développement.</li>
<li><strong>Perturbateurs endocriniens</strong> : bisphénol A, phtalates, pesticides organochlorés. Effets à faibles doses, fenêtre d'exposition critique (période fœtale), effets transgénérationnels.</li>
<li><strong>Bruit</strong> : stress, troubles du sommeil, risque cardiovasculaire accru. Deuxième facteur environnemental de morbidité en Europe après la pollution atmosphérique.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : 23 % de la mortalité mondiale est liée à l'environnement. Les perturbateurs endocriniens agissent à faibles doses avec des fenêtres de vulnérabilité (vie fœtale).</p></div>`
    },
    {
      title: "Le concept One Health",
      content: `<p class="mb-3">Le concept <strong>One Health (Une seule santé)</strong> reconnaît l'interdépendance entre santé humaine, santé animale et santé des écosystèmes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Zoonoses</strong> : 75 % des maladies infectieuses émergentes sont d'origine animale (SARS-CoV-2, Ebola, grippe aviaire, VIH). La déforestation et l'élevage intensif favorisent l'émergence de nouveaux pathogènes.</li>
<li><strong>Antibiorésistance</strong> : l'usage massif d'antibiotiques en médecine humaine et vétérinaire (50 % de la production mondiale pour l'élevage) sélectionne des bactéries résistantes. Enjeu majeur de One Health.</li>
<li><strong>Biodiversité et santé</strong> : l'effet de dilution suggère que la biodiversité réduit le risque de transmission de pathogènes. La perte de biodiversité augmente le contact avec les espèces réservoirs.</li>
<li><strong>Sécurité alimentaire</strong> : contamination de la chaîne alimentaire par pesticides, métaux lourds, antibiotiques. Surveillance par les agences (ANSES en France).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : One Health = approche intégrée santé humaine + animale + environnementale. 75 % des maladies émergentes sont des zoonoses. L'antibiorésistance est un enjeu One Health majeur.</p></div>`
    },
    {
      title: "Changement climatique et santé",
      content: `<p class="mb-3">Le <strong>changement climatique</strong> est considéré par l'OMS comme la plus grande menace sanitaire du XXIe siècle :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Chaleur extrême</strong> : vagues de chaleur (canicule 2003, 15 000 décès en France). Populations vulnérables : personnes âgées, travailleurs extérieurs, sans-abri.</li>
<li><strong>Maladies vectorielles</strong> : extension géographique du moustique tigre (Aedes albopictus) en Europe. Cas autochtones de dengue et chikungunya en France métropolitaine.</li>
<li><strong>Sécurité alimentaire</strong> : baisse des rendements agricoles, malnutrition, insécurité alimentaire dans les pays les plus vulnérables.</li>
<li><strong>Santé mentale</strong> : éco-anxiété, stress post-traumatique après catastrophes climatiques, augmentation des suicides liée aux vagues de chaleur.</li>
<li><strong>Migrations climatiques</strong> : déplacements de populations liés aux catastrophes naturelles, élévation du niveau de la mer, désertification.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le changement climatique impacte la santé via la chaleur, les maladies vectorielles, l'alimentation et la santé mentale. Les populations les plus vulnérables sont les plus touchées.</p></div>`
    },
    {
      title: "Principe de précaution et santé environnementale",
      content: `<p class="mb-3">Le <strong>principe de précaution</strong> est un principe juridique et éthique fondamental en santé environnementale :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Définition</strong> : en cas de risque de dommages graves ou irréversibles, l'absence de certitude scientifique absolue ne doit pas servir de prétexte pour retarder les mesures de prévention. Inscrit dans la Charte de l'environnement (2005, valeur constitutionnelle).</li>
<li><strong>Précaution ≠ prévention</strong> : la prévention s'applique aux risques connus et quantifiés, la précaution aux risques suspectés mais non encore prouvés.</li>
<li><strong>PNSE (Plan National Santé Environnement)</strong> : programme interministériel français qui définit les priorités en santé environnementale.</li>
<li><strong>Exposome</strong> : concept émergent désignant la totalité des expositions environnementales d'un individu tout au long de sa vie (chimiques, physiques, biologiques, psychosociales).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le principe de précaution s'applique aux risques suspectés mais non prouvés. Il est distinct de la prévention (risques connus). L'exposome = totalité des expositions environnementales d'une vie.</p></div>`
    },
    {
      title: "Santé planétaire et développement durable",
      content: `<p class="mb-3">La <strong>santé planétaire (Planetary Health)</strong> élargit le concept One Health en intégrant les limites planétaires :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Limites planétaires</strong> (Rockström, 2009) : 9 seuils à ne pas dépasser pour maintenir l'habitabilité de la Terre. 6 sont déjà franchis (changement climatique, biodiversité, azote/phosphore, eau douce, usage des sols, pollution chimique).</li>
<li><strong>Co-bénéfices santé-climat</strong> : les politiques de réduction des émissions de GES bénéficient aussi à la santé (mobilité active, alimentation durable, qualité de l'air).</li>
<li><strong>Empreinte carbone du système de santé</strong> : 8 % des émissions de GES en France. Les établissements de santé développent des démarches de développement durable.</li>
<li><strong>Objectifs de développement durable (ODD)</strong> : l'ODD 3 (bonne santé) est interconnecté avec les ODD environnementaux (13 climat, 14 océans, 15 biodiversité).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La santé planétaire lie la santé humaine aux limites planétaires. Le système de santé français émet 8 % des GES. Les politiques climat ont des co-bénéfices sanitaires.</p></div>`
    }
  ]
},

"ssh-esante": {
  introduction: "La e-santé regroupe l'ensemble des technologies numériques appliquées à la santé : télémédecine, dossier médical partagé, applications de santé et intelligence artificielle.",
  readTime: 16,
  sections: [
    {
      title: "Télémédecine : définition et cadre légal",
      content: `<p class="mb-3">La <strong>télémédecine</strong>, définie par la loi HPST (2009) et le décret du 19 octobre 2010, comprend <strong>5 actes</strong> :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Téléconsultation</strong> : consultation à distance entre un médecin et un patient. Remboursée par l'Assurance Maladie depuis 2018.</li>
<li><strong>Téléexpertise</strong> : avis d'un médecin spécialiste sollicité par un autre médecin, sans présence du patient.</li>
<li><strong>Télésurveillance</strong> : suivi à distance d'indicateurs de santé (glycémie, tension, poids). Entrée dans le droit commun en 2023.</li>
<li><strong>Téléassistance</strong> : un professionnel de santé assiste à distance un autre professionnel pendant un acte.</li>
<li><strong>Régulation médicale</strong> : orientation des patients par le Centre 15 (SAMU).</li>
</ul>
<p class="mb-3">La pandémie COVID-19 a provoqué une explosion de la téléconsultation (de 10 000 actes/semaine à 1 million en avril 2020), pérennisant certains usages.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La télémédecine comprend 5 actes définis par la loi HPST (2009). La téléconsultation est remboursée depuis 2018. Le COVID-19 a massifié les usages.</p></div>`
    },
    {
      title: "Mon Espace Santé et dossier médical partagé",
      content: `<p class="mb-3"><strong>Mon Espace Santé</strong> (2022) est le service numérique de référence pour les usagers du système de santé français :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>DMP (Dossier Médical Partagé)</strong> : carnet de santé numérique contenant comptes rendus, résultats d'examens, ordonnances, antécédents. Accessible aux professionnels de santé autorisés par le patient.</li>
<li><strong>Messagerie sécurisée</strong> : échanges chiffrés entre le patient et ses professionnels de santé.</li>
<li><strong>Catalogue d'applications</strong> : applications de santé référencées et évaluées (nutrition, suivi de grossesse, maladies chroniques).</li>
<li><strong>Agenda santé</strong> : rappels de rendez-vous, vaccinations, dépistages.</li>
</ul>
<p class="mb-3">L'<strong>identité nationale de santé (INS)</strong> basée sur le NIR (numéro de sécurité sociale) garantit l'identification unique du patient dans tous les systèmes d'information de santé.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Mon Espace Santé = DMP + messagerie sécurisée + catalogue d'apps. L'INS garantit l'identification unique du patient. Le DMP est accessible aux professionnels autorisés.</p></div>`
    },
    {
      title: "Intelligence artificielle en santé",
      content: `<p class="mb-3">L'<strong>intelligence artificielle (IA)</strong> transforme la médecine avec des applications croissantes :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Aide au diagnostic</strong> : imagerie médicale (détection de tumeurs, rétinopathie diabétique), dermatologie (classification des lésions cutanées), anatomopathologie.</li>
<li><strong>Aide à la décision thérapeutique</strong> : prédiction de réponse aux traitements, optimisation des protocoles en oncologie, pharmacogénomique.</li>
<li><strong>Prédiction de risques</strong> : scores de risque de réadmission, détection précoce de la septicémie, surveillance des patients en réanimation.</li>
<li><strong>Recherche et développement</strong> : découverte de molécules (drug discovery), analyse de données omiques, génération de données synthétiques.</li>
</ul>
<p class="mb-3">Les enjeux éthiques sont majeurs : <strong>biais algorithmiques</strong>, <strong>explicabilité</strong> (boîte noire), <strong>responsabilité</strong> en cas d'erreur, <strong>protection des données</strong> d'entraînement.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : L'IA en santé excelle en imagerie et prédiction de risques. Les enjeux : biais des données d'entraînement, explicabilité (boîte noire), responsabilité médico-légale.</p></div>`
    },
    {
      title: "Fracture numérique et inégalités",
      content: `<p class="mb-3">La <strong>fracture numérique</strong> risque d'aggraver les inégalités de santé si elle n'est pas anticipée :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Illectronisme</strong> : 13 millions de Français ont des difficultés avec le numérique. Les personnes âgées, précaires et en zones rurales sont les plus touchées.</li>
<li><strong>Inégalités d'accès</strong> : couverture réseau insuffisante dans certaines zones, coût des équipements, absence de smartphone ou d'ordinateur.</li>
<li><strong>Littératie numérique en santé</strong> : capacité à trouver, comprendre et utiliser l'information de santé en ligne. Variable selon l'âge, le niveau d'éducation et la catégorie socioprofessionnelle.</li>
<li><strong>Risque de déshumanisation</strong> : la technologie ne doit pas remplacer la relation humaine soignant-soigné. Le numérique est un outil, pas une finalité.</li>
</ul>
<p class="mb-3">Des dispositifs d'<strong>inclusion numérique</strong> existent : médiateurs numériques en santé, espaces France Services, accompagnement par les pharmaciens et les professionnels de santé.</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : 13 millions de Français sont en difficulté avec le numérique. La e-santé risque d'aggraver les inégalités si des mesures d'inclusion ne sont pas mises en place.</p></div>`
    },
    {
      title: "Cybersécurité et protection des données en santé",
      content: `<p class="mb-3">La <strong>cybersécurité</strong> des établissements de santé est un enjeu critique face à la multiplication des cyberattaques :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Menaces</strong> : rançongiciels (ransomware) paralysant les hôpitaux, vol de données de santé, phishing ciblant les professionnels. En 2021-2022, de nombreux hôpitaux français ont été victimes de cyberattaques.</li>
<li><strong>Hébergement des données de santé</strong> : les hébergeurs doivent être certifiés HDS (Hébergeur de Données de Santé) par un organisme accrédité. Le débat sur la souveraineté des données (hébergement en Europe vs cloud américain).</li>
<li><strong>Interopérabilité</strong> : les systèmes d'information de santé doivent pouvoir communiquer entre eux. Standards : HL7 FHIR, DICOM (imagerie). Le CI-SIS (Cadre d'Interopérabilité des SIS) est le référentiel français.</li>
<li><strong>Consentement numérique</strong> : le patient doit être informé et consentir à l'utilisation de ses données numériques de santé, conformément au RGPD.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Les cyberattaques contre les hôpitaux sont en forte hausse. La certification HDS est obligatoire pour héberger des données de santé. L'interopérabilité est essentielle au parcours de soins coordonné.</p></div>`
    }
  ]
},

"ssh-pharmacologie-sociale": {
  introduction: "La pharmacologie sociale étudie les dimensions sociétales du médicament : accès, usage, mésusage, marketing pharmaceutique et enjeux économiques.",
  readTime: 16,
  sections: [
    {
      title: "Le médicament : objet technique, économique et social",
      content: `<p class="mb-3">Le médicament est un objet complexe situé au carrefour de la science, de l'économie et de la société :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>AMM (Autorisation de Mise sur le Marché)</strong> : délivrée par l'ANSM (nationale) ou l'EMA (européenne). Évalue la qualité pharmaceutique, la sécurité et l'efficacité. Procédures : centralisée, décentralisée, reconnaissance mutuelle.</li>
<li><strong>SMR (Service Médical Rendu)</strong> : évalué par la HAS. Détermine le taux de remboursement (insuffisant = non remboursé, faible = 15 %, modéré = 30 %, important = 65 %).</li>
<li><strong>ASMR (Amélioration du SMR)</strong> : niveaux I à V (majeure à absente). Détermine le prix du médicament. ASMR V = pas de progrès thérapeutique.</li>
<li><strong>Brevet et générique</strong> : brevet de 20 ans. Après expiration, les génériques (bioéquivalents) permettent de réduire les coûts. Les biosimilaires sont l'équivalent pour les médicaments biologiques.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : SMR = remboursement (insuffisant à important). ASMR = prix (I majeure à V absente). Les génériques sont disponibles après expiration du brevet de 20 ans.</p></div>`
    },
    {
      title: "Mésusage et bon usage du médicament",
      content: `<p class="mb-3">Le <strong>mésusage</strong> du médicament est un problème de santé publique majeur en France :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Non-observance</strong> : 50 % des patients chroniques ne prennent pas correctement leur traitement. Causes : effets indésirables, complexité du schéma, déni de la maladie, coût.</li>
<li><strong>Automédication inappropriée</strong> : usage sans avis médical, interactions médicamenteuses, retard diagnostique. Mais l'automédication responsable est encouragée pour les pathologies bénignes.</li>
<li><strong>Surconsommation d'antibiotiques</strong> : la France est parmi les plus gros consommateurs européens, favorisant l'antibiorésistance. Campagnes « Les antibiotiques, c'est pas automatique ».</li>
<li><strong>Mésusage des opioïdes</strong> : augmentation des prescriptions d'opioïdes forts, risque de dépendance et de décès par surdosage. Pas encore au niveau de la crise américaine mais vigilance nécessaire.</li>
<li><strong>Iatrogénie médicamenteuse</strong> : effets indésirables liés aux médicaments, responsables d'environ 130 000 hospitalisations/an en France. Les personnes âgées polymédiquées sont les plus à risque.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : 50 % de non-observance chez les patients chroniques. La surconsommation d'antibiotiques favorise l'antibiorésistance. L'iatrogénie cause 130 000 hospitalisations/an en France.</p></div>`
    },
    {
      title: "Effet placebo et nocebo",
      content: `<p class="mb-3">L'<strong>effet placebo</strong> est un phénomène psychobiologique réel, impliquant des mécanismes neurobiologiques identifiés :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Mécanismes neurobiologiques</strong> : libération d'endorphines (douleur), de dopamine (Parkinson), modulation de la réponse inflammatoire. L'IRM fonctionnelle montre des modifications réelles de l'activité cérébrale.</li>
<li><strong>Facteurs modulateurs</strong> : relation médecin-patient, attentes du patient, conditionnement, couleur et taille du comprimé, voie d'administration (injection > oral), prix perçu du médicament.</li>
<li><strong>Effet nocebo</strong> : effet négatif lié aux attentes négatives du patient. La lecture excessive des effets indésirables peut provoquer des symptômes. Pose des problèmes éthiques pour l'information du patient.</li>
<li><strong>Enjeux éthiques</strong> : peut-on prescrire un placebo en pratique clinique ? Le mensonge thérapeutique est-il justifiable ? Les placebos ouverts (open-label) montrent une efficacité même quand le patient sait qu'il reçoit un placebo.</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : L'effet placebo a des mécanismes neurobiologiques réels (endorphines, dopamine). L'effet nocebo est son pendant négatif. Les placebos ouverts fonctionnent même quand le patient est informé.</p></div>`
    },
    {
      title: "Marketing pharmaceutique et conflits d'intérêts",
      content: `<p class="mb-3">L'<strong>industrie pharmaceutique</strong> exerce une influence considérable sur les pratiques de prescription :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Visite médicale</strong> : représentants pharmaceutiques informant les médecins sur les médicaments. Budget promotionnel > budget R&D pour certains laboratoires. En déclin avec la certification de la visite médicale.</li>
<li><strong>Leaders d'opinion (KOL)</strong> : médecins influents rémunérés par l'industrie pour des conférences, publications, essais cliniques. Risque de biais dans les recommandations.</li>
<li><strong>Loi Bertrand (2011)</strong> : Sunshine Act français. Obligation de publier les avantages consentis aux professionnels de santé sur la base Transparence Santé (> 10 €).</li>
<li><strong>Disease mongering</strong> : création ou exagération de maladies pour élargir le marché (pré-hypertension, pré-diabète, syndrome de déficit en testostérone).</li>
</ul>
<p class="mb-3">La <strong>déclaration publique d'intérêts (DPI)</strong> est obligatoire pour les experts participant aux instances de décision (HAS, ANSM, comités d'AMM).</p>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : La loi Bertrand (Sunshine Act) rend transparents les liens industrie-médecins (base Transparence Santé). Le disease mongering = création de maladies pour vendre des médicaments.</p></div>`
    },
    {
      title: "Accès aux médicaments et enjeux économiques",
      content: `<p class="mb-3">L'<strong>accès aux médicaments</strong> soulève des questions d'équité et de soutenabilité financière :</p>
<ul class="list-disc pl-6 mb-3 space-y-2">
<li><strong>Prix des médicaments innovants</strong> : les thérapies géniques (> 1 million €/patient), les immunothérapies anti-cancéreuses et les thérapies ciblées posent un défi de soutenabilité pour les systèmes de santé.</li>
<li><strong>CEPS (Comité Économique des Produits de Santé)</strong> : négocie les prix des médicaments remboursés en France avec les laboratoires, en fonction de l'ASMR et des comparateurs.</li>
<li><strong>Accès précoce (ex-ATU)</strong> : permet l'utilisation de médicaments innovants avant leur AMM pour des maladies graves sans alternative thérapeutique.</li>
<li><strong>Accord ADPIC et licences obligatoires</strong> : les brevets pharmaceutiques sont protégés par l'OMC, mais les pays peuvent imposer des licences obligatoires en cas d'urgence sanitaire (débat pendant la pandémie COVID-19).</li>
<li><strong>Médicaments essentiels</strong> : liste OMS des médicaments répondant aux besoins prioritaires de santé publique. Pénuries récurrentes de médicaments essentiels en France (amoxicilline, paracétamol).</li>
</ul>
<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mt-4"><p class="text-sm font-semibold text-rose-800">Point clé PASS/LAS : Le prix des thérapies innovantes menace la soutenabilité des systèmes de santé. Le CEPS négocie les prix en France. Les pénuries de médicaments essentiels sont un problème croissant.</p></div>`
    }
  ]
},

};
