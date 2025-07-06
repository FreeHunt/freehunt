export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card border border-border rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
            Politique de Confidentialité
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-6">
              Dernière mise à jour : 29 juin 2025
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                FreeHunt SAS, en tant que responsable de traitement, accorde une
                grande importance à la protection de vos données personnelles et
                au respect de votre vie privée.
              </p>
              <p className="mb-4">
                Cette politique de confidentialité vous informe sur la manière
                dont nous collectons, utilisons, stockons et protégeons vos
                données personnelles conformément au Règlement Général sur la
                Protection des Données (RGPD) et à la loi « Informatique et
                Libertés ».
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                2. Responsable de traitement
              </h2>
              <div className="mb-4">
                <p>
                  <strong>FreeHunt SAS</strong>
                </p>
                <p>242 rue du Faubourg Saint-Antoine, 75012 Paris</p>
                <p>SIREN : 123 456 789</p>
                <p>
                  Email :{" "}
                  <a
                    href="mailto:contact@freehunt.fr"
                    className="text-primary hover:underline"
                  >
                    contact@freehunt.fr
                  </a>
                </p>
              </div>
              <p className="mb-4">
                <strong>Délégué à la Protection des Données (DPO) :</strong>
                <a
                  href="mailto:dpo@freehunt.fr"
                  className="text-primary hover:underline"
                >
                  {" "}
                  dpo@freehunt.fr
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                3. Données collectées
              </h2>
              <h3 className="text-lg font-medium mb-3">
                3.1 Données d&apos;inscription
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Nom d&apos;utilisateur</li>
                <li>Mot de passe (chiffré)</li>
                <li>Type de compte (freelance ou entreprise)</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">
                3.2 Données de profil professionnel
              </h3>
              <p className="mb-2">
                <strong>Pour les freelances :</strong>
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Informations professionnelles (compétences, expérience,
                  tarifs)
                </li>
                <li>Localisation</li>
                <li>Documents et portfolio</li>
                <li>Photo de profil</li>
              </ul>

              <p className="mb-2">
                <strong>Pour les entreprises :</strong>
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Dénomination sociale</li>
                <li>Adresse</li>
                <li>Numéro SIREN</li>
                <li>Description de l&apos;activité</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">
                3.3 Données d&apos;utilisation
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Logs de connexion</li>
                <li>Adresses IP</li>
                <li>Données de navigation</li>
                <li>Messages échangés sur la plateforme</li>
                <li>Historique des transactions</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">
                3.4 Cookies et technologies similaires
              </h3>
              <p className="mb-4">
                Nous utilisons des cookies pour améliorer votre expérience et
                analyser l&apos;utilisation de notre site. Pour plus de détails,
                consultez notre{" "}
                <a href="/cookies" className="text-primary hover:underline">
                  Politique des Cookies
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                4. Finalités du traitement
              </h2>
              <p className="mb-4">
                Vos données sont traitées pour les finalités suivantes :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Gestion des comptes utilisateurs :</strong> création,
                  authentification, gestion des profils
                </li>
                <li>
                  <strong>Fourniture des services :</strong> mise en relation,
                  messagerie, gestion des projets
                </li>
                <li>
                  <strong>Traitement des paiements :</strong> commissions,
                  facturation, comptabilité
                </li>
                <li>
                  <strong>Communication :</strong> notifications, support
                  client, informations sur les services
                </li>
                <li>
                  <strong>Sécurité :</strong> prévention de la fraude,
                  protection contre les abus
                </li>
                <li>
                  <strong>Amélioration des services :</strong> analyses
                  statistiques, développement de nouvelles fonctionnalités
                </li>
                <li>
                  <strong>Respect des obligations légales :</strong>{" "}
                  conservation des factures, lutte contre le blanchiment
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                5. Base légale du traitement
              </h2>
              <p className="mb-4">Le traitement de vos données repose sur :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>L&apos;exécution du contrat :</strong> pour la
                  fourniture des services FreeHunt
                </li>
                <li>
                  <strong>L&apos;intérêt légitime :</strong> pour
                  l&apos;amélioration des services et la sécurité
                </li>
                <li>
                  <strong>Le consentement :</strong> pour les cookies non
                  essentiels et communications marketing
                </li>
                <li>
                  <strong>L&apos;obligation légale :</strong> pour la
                  conservation des données comptables et fiscales
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                6. Destinataires des données
              </h2>
              <p className="mb-4">Vos données peuvent être communiquées à :</p>
              <h3 className="text-lg font-medium mb-3">
                6.1 Services internes
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Équipes techniques et support client de FreeHunt</li>
                <li>Service comptabilité et administration</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">
                6.2 Prestataires et sous-traitants
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Authentik :</strong> gestion de
                  l&apos;authentification et des identités
                </li>
                <li>
                  <strong>Stripe :</strong> traitement des paiements
                </li>
                <li>
                  <strong>Matomo :</strong> analyses statistiques (données
                  anonymisées)
                </li>
                <li>
                  <strong>Cloudflare :</strong> sécurité et performance du site
                  web
                </li>
              </ul>

              <h3 className="text-lg font-medium mb-3">
                6.3 Autorités compétentes
              </h3>
              <p className="mb-4">
                En cas d&apos;obligation légale ou de décision de justice, vos
                données peuvent être communiquées aux autorités administratives
                ou judiciaires compétentes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                7. Transferts de données hors UE
              </h2>
              <p className="mb-4">
                Certains de nos prestataires peuvent être situés en dehors de
                l&apos;Union Européenne. Dans ce cas, nous nous assurons que des
                garanties appropriées sont mises en place :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Décision d&apos;adéquation de la Commission européenne</li>
                <li>
                  Clauses contractuelles types approuvées par la Commission
                  européenne
                </li>
                <li>Certifications et codes de conduite appropriés</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                8. Durée de conservation
              </h2>
              <p className="mb-4">
                Vos données sont conservées pendant les durées suivantes :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Données de compte actif :</strong> pendant toute la
                  durée d&apos;utilisation du service
                </li>
                <li>
                  <strong>Données de compte supprimé :</strong> 3 ans à compter
                  de la suppression
                </li>
                <li>
                  <strong>Données de facturation :</strong> 10 ans (obligation
                  légale)
                </li>
                <li>
                  <strong>Logs de connexion :</strong> 12 mois
                </li>
                <li>
                  <strong>Cookies :</strong> durée variable selon le type (voir
                  politique des cookies)
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Vos droits</h2>
              <p className="mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Droit d&apos;accès :</strong> obtenir une copie de vos
                  données personnelles
                </li>
                <li>
                  <strong>Droit de rectification :</strong> corriger des données
                  inexactes
                </li>
                <li>
                  <strong>Droit à l&apos;effacement :</strong> supprimer vos
                  données dans certains cas
                </li>
                <li>
                  <strong>Droit à la limitation :</strong> restreindre le
                  traitement de vos données
                </li>
                <li>
                  <strong>Droit à la portabilité :</strong> récupérer vos
                  données dans un format structuré
                </li>
                <li>
                  <strong>Droit d&apos;opposition :</strong> vous opposer au
                  traitement pour des raisons légitimes
                </li>
                <li>
                  <strong>Droit de retrait du consentement :</strong> pour les
                  traitements basés sur le consentement
                </li>
              </ul>

              <h3 className="text-lg font-medium mb-3">
                Comment exercer vos droits
              </h3>
              <p className="mb-4">Pour exercer vos droits, contactez-nous :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Par email :{" "}
                  <a
                    href="mailto:dpo@freehunt.fr"
                    className="text-primary hover:underline"
                  >
                    dpo@freehunt.fr
                  </a>
                </li>
                <li>
                  Par courrier : FreeHunt SAS - DPO, 242 rue du Faubourg
                  Saint-Antoine, 75012 Paris
                </li>
              </ul>
              <p className="mb-4">
                Nous vous répondrons dans un délai d&apos;un mois à compter de
                la réception de votre demande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                10. Sécurité des données
              </h2>
              <p className="mb-4">
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Chiffrement des données sensibles</li>
                <li>Authentification forte</li>
                <li>
                  Accès restreint aux données selon le principe du moindre
                  privilège
                </li>
                <li>Surveillance et détection des incidents de sécurité</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Formation du personnel à la sécurité des données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                11. Violations de données
              </h2>
              <p className="mb-4">
                En cas de violation de données personnelles susceptible
                d&apos;engendrer un risque élevé pour vos droits et libertés,
                nous vous en informerons dans les plus brefs délais conformément
                à la réglementation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">12. Modifications</h2>
              <p className="mb-4">
                Cette politique de confidentialité peut être modifiée pour
                refléter les évolutions de nos pratiques ou les changements
                réglementaires. Nous vous informerons de toute modification
                importante par email ou notification sur la plateforme.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">13. Réclamations</h2>
              <p className="mb-4">
                Si vous estimez que le traitement de vos données personnelles
                porte atteinte à vos droits, vous pouvez introduire une
                réclamation auprès de la CNIL :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  En ligne :{" "}
                  <a
                    href="https://www.cnil.fr/fr/plaintes"
                    className="text-primary hover:underline"
                  >
                    www.cnil.fr/fr/plaintes
                  </a>
                </li>
                <li>
                  Par courrier : CNIL, 3 Place de Fontenoy - TSA 80715, 75334
                  PARIS CEDEX 07
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">14. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant cette politique de
                confidentialité ou le traitement de vos données personnelles :
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
          </div>
        </div>
      </div>
    </div>
  );
}
