export default function Cookies() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card border border-border rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
            Politique des Cookies
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">
              Dernière mise à jour : 29 juin 2025
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                1. Qu&apos;est-ce qu&apos;un cookie ?
              </h2>
              <p className="mb-4">
                Un cookie est un petit fichier texte déposé sur votre terminal
                (ordinateur, tablette, smartphone) lors de la visite d&apos;un
                site internet. Il permet au site de mémoriser des informations
                sur votre visite, comme votre langue de préférence et
                d&apos;autres paramètres.
              </p>
              <p className="mb-4">
                Les cookies facilitent votre navigation et permettent
                d&apos;améliorer votre expérience utilisateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                2. Cookies utilisés sur FreeHunt
              </h2>

              <h3 className="text-lg font-medium mb-3">
                2.1 Cookies essentiels (strictement nécessaires)
              </h3>
              <p className="mb-4">
                Ces cookies sont indispensables au fonctionnement du site et ne
                peuvent pas être désactivés.
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-4 py-2 text-left">
                        Cookie
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        Finalité
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        Durée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        authentik_session
                      </td>
                      <td className="border border-border px-4 py-2">
                        Authentification utilisateur
                      </td>
                      <td className="border border-border px-4 py-2">
                        Session
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        authentik_csrf
                      </td>
                      <td className="border border-border px-4 py-2">
                        Protection contre les attaques CSRF
                      </td>
                      <td className="border border-border px-4 py-2">
                        Session
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        freehunt_preferences
                      </td>
                      <td className="border border-border px-4 py-2">
                        Préférences utilisateur (langue, thème)
                      </td>
                      <td className="border border-border px-4 py-2">
                        12 mois
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-medium mb-3">
                2.2 Cookies analytiques
              </h3>
              <p className="mb-4">
                Ces cookies nous permettent de mesurer l&apos;audience et
                d&apos;analyser l&apos;utilisation du site pour améliorer nos
                services.
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-4 py-2 text-left">
                        Service
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        Finalité
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        Durée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2">Matomo</td>
                      <td className="border border-border px-4 py-2">
                        Analyse d&apos;audience anonymisée
                      </td>
                      <td className="border border-border px-4 py-2">
                        13 mois
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mb-4">
                <strong>Note :</strong> Matomo est configuré en mode respectueux
                de la vie privée, avec anonymisation des adresses IP et respect
                du Do Not Track.
              </p>

              <h3 className="text-lg font-medium mb-3">
                2.3 Cookies fonctionnels
              </h3>
              <p className="mb-4">
                Ces cookies améliorent les fonctionnalités du site et votre
                expérience utilisateur.
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-border rounded-lg">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-4 py-2 text-left">
                        Cookie
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        Finalité
                      </th>
                      <th className="border border-border px-4 py-2 text-left">
                        Durée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        freehunt_search_history
                      </td>
                      <td className="border border-border px-4 py-2">
                        Historique des recherches
                      </td>
                      <td className="border border-border px-4 py-2">
                        30 jours
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border px-4 py-2">
                        freehunt_notifications
                      </td>
                      <td className="border border-border px-4 py-2">
                        Préférences de notifications
                      </td>
                      <td className="border border-border px-4 py-2">
                        12 mois
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Cookies tiers</h2>

              <h3 className="text-lg font-medium mb-3">
                3.1 Stripe (paiements)
              </h3>
              <p className="mb-4">
                Pour le traitement sécurisé des paiements, nous utilisons Stripe
                qui peut déposer ses propres cookies.
              </p>
              <p className="mb-4">
                Consultez la{" "}
                <a
                  href="https://stripe.com/fr/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  politique de confidentialité de Stripe
                </a>{" "}
                pour plus d&apos;informations.
              </p>

              <h3 className="text-lg font-medium mb-3">
                3.2 Cloudflare (sécurité et performance)
              </h3>
              <p className="mb-4">
                Cloudflare peut déposer des cookies pour assurer la sécurité et
                optimiser les performances du site.
              </p>
              <p className="mb-4">
                Consultez la{" "}
                <a
                  href="https://www.cloudflare.com/privacypolicy/"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  politique de confidentialité de Cloudflare
                </a>{" "}
                pour plus d&apos;informations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                4. Gestion de vos préférences
              </h2>

              <h3 className="text-lg font-medium mb-3">
                4.1 Paramétrage de votre navigateur
              </h3>
              <p className="mb-4">
                Vous pouvez configurer votre navigateur pour accepter ou refuser
                les cookies :
              </p>

              <h4 className="text-base font-medium mb-2">Google Chrome</h4>
              <ol className="list-decimal pl-6 mb-4">
                <li>Cliquez sur le menu Chrome (⋮) → Paramètres</li>
                <li>
                  Cliquez sur « Confidentialité et sécurité » puis « Cookies et
                  autres données de site »
                </li>
                <li>Choisissez vos préférences</li>
              </ol>

              <h4 className="text-base font-medium mb-2">Firefox</h4>
              <ol className="list-decimal pl-6 mb-4">
                <li>Cliquez sur le menu (☰) → Paramètres</li>
                <li>Sélectionnez « Vie privée et sécurité »</li>
                <li>
                  Dans la section « Cookies et données de sites », configurez
                  vos préférences
                </li>
              </ol>

              <h4 className="text-base font-medium mb-2">Safari</h4>
              <ol className="list-decimal pl-6 mb-4">
                <li>Cliquez sur Safari → Préférences</li>
                <li>Cliquez sur l&apos;onglet « Confidentialité »</li>
                <li>Configurez vos préférences pour les cookies</li>
              </ol>

              <h3 className="text-lg font-medium mb-3">
                4.2 Conséquences de la désactivation
              </h3>
              <p className="mb-4">
                La désactivation de certains cookies peut affecter le
                fonctionnement du site :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Cookies essentiels :</strong> La désactivation
                  empêchera le bon fonctionnement du site
                </li>
                <li>
                  <strong>Cookies analytiques :</strong> Nous ne pourrons plus
                  améliorer le site selon vos usages
                </li>
                <li>
                  <strong>Cookies fonctionnels :</strong> Certaines
                  fonctionnalités ne seront plus disponibles
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                5. Durée de conservation
              </h2>
              <p className="mb-4">
                Les cookies sont conservés pour des durées variables selon leur
                type et leur finalité :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Cookies de session :</strong> Supprimés à la fermeture
                  du navigateur
                </li>
                <li>
                  <strong>Cookies persistants :</strong> Conservés selon la
                  durée indiquée dans les tableaux ci-dessus
                </li>
                <li>
                  <strong>Données analytiques :</strong> Anonymisées après 13
                  mois maximum
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Vos droits</h2>
              <p className="mb-4">
                Concernant les données collectées via les cookies, vous disposez
                des mêmes droits que ceux décrits dans notre{" "}
                <a
                  href="/politique-confidentialite"
                  className="text-primary hover:underline"
                >
                  Politique de Confidentialité
                </a>{" "}
                :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Droit d&apos;accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l&apos;effacement</li>
                <li>Droit d&apos;opposition</li>
                <li>Droit à la portabilité</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                7. Cookies et mineurs
              </h2>
              <p className="mb-4">
                Les personnes de moins de 16 ans doivent obtenir
                l&apos;autorisation de leurs parents ou tuteurs légaux avant
                d&apos;accepter les cookies non essentiels.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                8. Mise à jour de cette politique
              </h2>
              <p className="mb-4">
                Cette politique des cookies peut être modifiée à tout moment
                pour refléter les évolutions technologiques ou réglementaires.
                La date de dernière mise à jour est indiquée en haut de cette
                page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant l&apos;utilisation des cookies
                sur FreeHunt :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Email :{" "}
                  <a
                    href="mailto:dpo@freehunt.fr"
                    className="text-primary hover:underline"
                  >
                    dpo@freehunt.fr
                  </a>
                </li>
                <li>
                  Adresse : FreeHunt SAS, 242 rue du Faubourg Saint-Antoine,
                  75012 Paris
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Liens utiles</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <a
                    href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CNIL - Guide des cookies
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.allaboutcookies.org/"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    All About Cookies (en anglais)
                  </a>
                </li>
                <li>
                  <a
                    href="/politique-confidentialite"
                    className="text-primary hover:underline"
                  >
                    Notre Politique de Confidentialité
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
