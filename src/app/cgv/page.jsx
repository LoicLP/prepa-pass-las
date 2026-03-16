export default function CGVPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero noise-overlay dot-grid pt-28 pb-10 md:pt-36 md:pb-14 relative overflow-hidden">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-[1.1] mb-4">
            Conditions G&eacute;n&eacute;rales de{' '}
            <span className="bg-gradient-to-r from-primary-600 via-violet-500 to-primary-600 bg-clip-text text-transparent">
              Vente
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Derni&egrave;re mise &agrave; jour : 16 mars 2026
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-10">

            {/* Article 1 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 1 &ndash; Objet
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales de Vente (ci-apr&egrave;s &laquo; CGV &raquo;) r&eacute;gissent les relations contractuelles entre :
                </p>
                <p className="pl-4 border-l-2 border-primary-200">
                  <strong className="text-gray-900">LP Labs</strong>, Soci&eacute;t&eacute; par Actions Simplifi&eacute;e (S.A.S.) au capital de 50,00 &euro;.
                  <br />
                  Email : <a href="mailto:support@prepa-pass-las.fr" className="text-primary-600 hover:underline">support@prepa-pass-las.fr</a>
                </p>
                <p>
                  Et toute personne physique ou morale (ci-apr&egrave;s &laquo; l&rsquo;Utilisateur &raquo;) acc&eacute;dant au site
                  {' '}<strong className="text-gray-900">prepa-pass-las.fr</strong> (ci-apr&egrave;s &laquo; la Plateforme &raquo;),
                  plateforme en ligne de pr&eacute;paration aux concours PASS et LAS (acc&egrave;s sant&eacute;).
                </p>
                <p>
                  La Plateforme propose des services de r&eacute;vision en ligne comprenant des QCM, des fiches de cours,
                  un mode examen, un tableau de bord de suivi de progression et des outils p&eacute;dagogiques.
                </p>
              </div>
            </article>

            {/* Article 2 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 2 &ndash; Acceptation des CGV
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  L&rsquo;inscription sur la Plateforme et/ou la souscription &agrave; un abonnement impliquent l&rsquo;acceptation
                  pleine et enti&egrave;re des pr&eacute;sentes CGV. L&rsquo;Utilisateur reconna&icirc;t en avoir pris connaissance
                  avant toute souscription.
                </p>
                <p>
                  LP Labs se r&eacute;serve le droit de modifier les pr&eacute;sentes CGV &agrave; tout moment.
                  Les CGV applicables sont celles en vigueur au moment de la souscription ou du renouvellement de l&rsquo;abonnement.
                </p>
              </div>
            </article>

            {/* Article 3 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 3 &ndash; Description des services
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                <p>La Plateforme propose trois formules d&rsquo;acc&egrave;s :</p>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 mt-0.5">1</span>
                    <div>
                      <p className="font-bold text-gray-900">D&eacute;couverte (Gratuit)</p>
                      <p>Acc&egrave;s limit&eacute; &agrave; 1 QCM par jour, fiches accessibles, corrections d&eacute;taill&eacute;es.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="font-bold text-gray-900">Essentiel &ndash; 19,90 &euro; / mois</p>
                      <p>QCM illimit&eacute;s, fiches t&eacute;l&eacute;chargeables en PDF, acc&egrave;s aux cours d&eacute;taill&eacute;s, mode Examen chronom&eacute;tr&eacute;, corrections d&eacute;taill&eacute;es.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700 shrink-0 mt-0.5">3</span>
                    <div>
                      <p className="font-bold text-gray-900">Premium+ &ndash; 39,90 &euro; / mois</p>
                      <p>Tout Essentiel + mode Examen complet, suivi de progression avanc&eacute;, objectifs personnalis&eacute;s, classement et comparaison.</p>
                    </div>
                  </div>
                </div>

                <p>
                  Le contenu p&eacute;dagogique (questions, fiches, cours) est fourni &agrave; titre indicatif et ne saurait
                  se substituer &agrave; l&rsquo;enseignement universitaire officiel. LP Labs s&rsquo;efforce de fournir des
                  contenus de qualit&eacute; mais ne garantit pas l&rsquo;exhaustivit&eacute; ni l&rsquo;absence d&rsquo;erreurs.
                </p>
              </div>
            </article>

            {/* Article 4 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 4 &ndash; Inscription et compte utilisateur
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  L&rsquo;acc&egrave;s &agrave; la Plateforme n&eacute;cessite la cr&eacute;ation d&rsquo;un compte personnel.
                  L&rsquo;Utilisateur s&rsquo;engage &agrave; fournir des informations exactes et &agrave; jour lors de son inscription.
                </p>
                <p>
                  Chaque compte est strictement personnel. L&rsquo;Utilisateur est responsable de la confidentialit&eacute;
                  de ses identifiants de connexion. Toute utilisation de son compte est r&eacute;put&eacute;e effectu&eacute;e
                  par l&rsquo;Utilisateur lui-m&ecirc;me.
                </p>
                <p>
                  LP Labs se r&eacute;serve le droit de suspendre ou supprimer un compte en cas de manquement aux
                  pr&eacute;sentes CGV ou d&rsquo;utilisation frauduleuse.
                </p>
              </div>
            </article>

            {/* Article 5 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 5 &ndash; Tarifs et paiement
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  Les tarifs des abonnements sont indiqu&eacute;s en euros, toutes taxes comprises (TTC), sur la page Tarifs de la Plateforme.
                  LP Labs se r&eacute;serve le droit de modifier ses tarifs &agrave; tout moment, les nouveaux tarifs s&rsquo;appliquant
                  uniquement aux nouvelles souscriptions ou aux renouvellements.
                </p>
                <p>
                  Le paiement s&rsquo;effectue en ligne par carte bancaire ou tout autre moyen de paiement accept&eacute; sur la Plateforme.
                  L&rsquo;abonnement est factur&eacute; mensuellement, sans engagement de dur&eacute;e minimale.
                </p>
                <p>
                  En cas de changement de formule, un ajustement au prorata temporis est appliqu&eacute;.
                </p>
              </div>
            </article>

            {/* Article 6 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 6 &ndash; Droit de r&eacute;tractation
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  Conform&eacute;ment aux articles L221-18 et suivants du Code de la consommation, l&rsquo;Utilisateur
                  dispose d&rsquo;un d&eacute;lai de <strong className="text-gray-900">quatorze (14) jours</strong> &agrave; compter
                  de la souscription pour exercer son droit de r&eacute;tractation, sans avoir &agrave; justifier de motif.
                </p>
                <p>
                  Pour exercer ce droit, l&rsquo;Utilisateur doit adresser une demande &agrave; l&rsquo;adresse{' '}
                  <a href="mailto:support@prepa-pass-las.fr" className="text-primary-600 hover:underline">support@prepa-pass-las.fr</a>{' '}
                  en indiquant clairement sa volont&eacute; de se r&eacute;tracter.
                </p>
                <p>
                  Toutefois, conform&eacute;ment &agrave; l&rsquo;article L221-28 du Code de la consommation, si l&rsquo;Utilisateur
                  a commenc&eacute; &agrave; utiliser le service (acc&egrave;s aux contenus payants) avant l&rsquo;expiration du d&eacute;lai
                  de r&eacute;tractation et avec son accord expr&egrave;s, il renonce &agrave; son droit de r&eacute;tractation.
                </p>
              </div>
            </article>

            {/* Article 7 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 7 &ndash; Dur&eacute;e et r&eacute;siliation
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  Les abonnements sont souscrits <strong className="text-gray-900">sans engagement de dur&eacute;e</strong>.
                  L&rsquo;Utilisateur peut r&eacute;silier son abonnement &agrave; tout moment depuis son espace personnel
                  ou en contactant le support.
                </p>
                <p>
                  La r&eacute;siliation prend effet &agrave; la fin de la p&eacute;riode de facturation en cours. L&rsquo;Utilisateur
                  conserve l&rsquo;acc&egrave;s aux fonctionnalit&eacute;s payantes jusqu&rsquo;&agrave; la fin de la p&eacute;riode pay&eacute;e.
                </p>
                <p>
                  Aucun remboursement n&rsquo;est effectu&eacute; pour la p&eacute;riode restante, sauf exercice du droit de
                  r&eacute;tractation dans les conditions pr&eacute;vues &agrave; l&rsquo;article 6.
                </p>
              </div>
            </article>

            {/* Article 8 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 8 &ndash; Propri&eacute;t&eacute; intellectuelle
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  L&rsquo;ensemble des contenus de la Plateforme (textes, questions, fiches, cours, visuels, logos,
                  code source, base de donn&eacute;es) est la propri&eacute;t&eacute; exclusive de LP Labs ou de ses partenaires
                  et est prot&eacute;g&eacute; par le droit de la propri&eacute;t&eacute; intellectuelle.
                </p>
                <p>
                  Toute reproduction, diffusion, modification ou utilisation commerciale des contenus sans autorisation
                  &eacute;crite pr&eacute;alable de LP Labs est strictement interdite et constitue une contrefa&ccedil;on
                  sanctionn&eacute;e par le Code de la propri&eacute;t&eacute; intellectuelle.
                </p>
                <p>
                  L&rsquo;Utilisateur b&eacute;n&eacute;ficie d&rsquo;un droit d&rsquo;utilisation personnel, non exclusif et non cessible,
                  limit&eacute; &agrave; la dur&eacute;e de son abonnement.
                </p>
              </div>
            </article>

            {/* Article 9 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 9 &ndash; Responsabilit&eacute; et limitation
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  LP Labs s&rsquo;engage &agrave; fournir la Plateforme avec diligence et dans les r&egrave;gles de l&rsquo;art.
                  Il s&rsquo;agit d&rsquo;une obligation de moyens.
                </p>
                <p>
                  LP Labs ne saurait &ecirc;tre tenue responsable en cas de :
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Indisponibilit&eacute; temporaire de la Plateforme pour maintenance ou cas de force majeure.</li>
                  <li>Pertes de donn&eacute;es li&eacute;es &agrave; une d&eacute;faillance technique ind&eacute;pendante de sa volont&eacute;.</li>
                  <li>R&eacute;sultats obtenus par l&rsquo;Utilisateur &agrave; ses concours ou examens.</li>
                  <li>Utilisation non conforme de la Plateforme par l&rsquo;Utilisateur.</li>
                </ul>
                <p>
                  En tout &eacute;tat de cause, la responsabilit&eacute; de LP Labs est limit&eacute;e au montant des sommes
                  effectivement vers&eacute;es par l&rsquo;Utilisateur au cours des douze (12) derniers mois.
                </p>
              </div>
            </article>

            {/* Article 10 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 10 &ndash; Protection des donn&eacute;es personnelles
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  Conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (RGPD) et &agrave; la
                  loi Informatique et Libert&eacute;s, LP Labs collecte et traite les donn&eacute;es personnelles de
                  l&rsquo;Utilisateur dans le cadre de l&rsquo;ex&eacute;cution du contrat et de la fourniture du service.
                </p>
                <p>Les donn&eacute;es collect&eacute;es comprennent notamment :</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Adresse email et identifiants de connexion.</li>
                  <li>Donn&eacute;es de progression (scores, sessions, temps d&rsquo;&eacute;tude).</li>
                  <li>Donn&eacute;es de navigation et d&rsquo;utilisation de la Plateforme.</li>
                </ul>
                <p>
                  Les donn&eacute;es sont h&eacute;berg&eacute;es de mani&egrave;re s&eacute;curis&eacute;e. Aucune donn&eacute;e personnelle n&rsquo;est vendue
                  ou c&eacute;d&eacute;e &agrave; des tiers &agrave; des fins commerciales.
                </p>
                <p>
                  L&rsquo;Utilisateur dispose d&rsquo;un droit d&rsquo;acc&egrave;s, de rectification, de suppression et de portabilit&eacute;
                  de ses donn&eacute;es. Ces droits peuvent &ecirc;tre exerc&eacute;s en contactant{' '}
                  <a href="mailto:support@prepa-pass-las.fr" className="text-primary-600 hover:underline">support@prepa-pass-las.fr</a>.
                </p>
              </div>
            </article>

            {/* Article 11 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 11 &ndash; Modification des CGV
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  LP Labs se r&eacute;serve le droit de modifier les pr&eacute;sentes CGV &agrave; tout moment.
                  Les Utilisateurs seront inform&eacute;s de toute modification substantielle par email ou notification
                  sur la Plateforme.
                </p>
                <p>
                  La poursuite de l&rsquo;utilisation de la Plateforme apr&egrave;s notification des modifications
                  vaut acceptation des nouvelles CGV.
                </p>
              </div>
            </article>

            {/* Article 12 */}
            <article>
              <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                Article 12 &ndash; Droit applicable et litiges
              </h2>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <p>
                  Les pr&eacute;sentes CGV sont r&eacute;gies par le droit fran&ccedil;ais.
                </p>
                <p>
                  En cas de litige, les parties s&rsquo;efforceront de trouver une solution amiable.
                  &Agrave; d&eacute;faut, le litige sera soumis aux tribunaux comp&eacute;tents dans les conditions de droit commun.
                </p>
                <p>
                  Conform&eacute;ment aux dispositions du Code de la consommation, l&rsquo;Utilisateur est inform&eacute; qu&rsquo;il
                  peut recourir &agrave; un m&eacute;diateur de la consommation en cas de litige non r&eacute;solu.
                </p>
              </div>
            </article>

            {/* Footer CGV */}
            <div className="pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                LP Labs S.A.S.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Contact : <a href="mailto:support@prepa-pass-las.fr" className="text-primary-500 hover:underline">support@prepa-pass-las.fr</a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
