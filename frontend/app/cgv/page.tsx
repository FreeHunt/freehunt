export default function CGV() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Conditions Générales de Vente
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Dernière mise à jour : 29 juin 2025
            </p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                1. Objet et champ d&apos;application
              </h2>
              <p className="mb-4">
                Les présentes Conditions Générales de Vente (CGV) régissent les
                relations commerciales entre FreeHunt SAS et ses utilisateurs
                dans le cadre de l&apos;utilisation des services payants de la
                plateforme.
              </p>
              <p className="mb-4">
                Ces CGV s&apos;appliquent à tous les services payants proposés
                par FreeHunt, notamment :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Les commissions sur les transactions</li>
                <li>Les services premium (à venir)</li>
                <li>Les options de mise en avant des profils ou annonces</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                2. Prix et tarification
              </h2>
              <h3 className="text-lg font-medium mb-3">
                2.1 Commission de service
              </h3>
              <p className="mb-4">
                FreeHunt prélève une commission de 5% (TTC) sur chaque
                transaction réalisée entre une entreprise et un freelance par
                l&apos;intermédiaire de la plateforme.
              </p>
              <p className="mb-4">
                Cette commission est automatiquement déduite du montant payé par
                l&apos;entreprise avant versement au freelance.
              </p>

              <h3 className="text-lg font-medium mb-3">2.2 Autres services</h3>
              <p className="mb-4">
                Les tarifs des autres services payants sont indiqués en euros
                toutes taxes comprises (TTC) et peuvent être consultés sur la
                plateforme au moment de la souscription.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                3. Modalités de paiement
              </h2>
              <h3 className="text-lg font-medium mb-3">
                3.1 Moyens de paiement acceptés
              </h3>
              <p className="mb-4">Les paiements sont acceptés par :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Carte bancaire (Visa, MasterCard, American Express)</li>
                <li>Virement bancaire SEPA</li>
                <li>Autres moyens proposés par notre partenaire Stripe</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">
                3.2 Sécurité des paiements
              </h3>
              <p className="mb-4">
                Les paiements sont traités par Stripe, société certifiée PCI-DSS
                niveau 1, garantissant le plus haut niveau de sécurité pour les
                transactions en ligne.
              </p>

              <h3 className="text-lg font-medium mb-3">
                3.3 Échéances de paiement
              </h3>
              <p className="mb-4">
                Les commissions sont prélevées automatiquement au moment de
                chaque transaction. Les autres services sont payables
                immédiatement à la commande.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                4. Exécution des services
              </h2>
              <p className="mb-4">
                FreeHunt s&apos;engage à fournir les services commandés dans les
                meilleurs délais. La mise à disposition des services numériques
                est généralement immédiate.
              </p>
              <p className="mb-4">
                En cas de difficulté technique empêchant la bonne exécution du
                service, FreeHunt en informe l&apos;utilisateur dans les plus
                brefs délais.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                5. Droit de rétractation
              </h2>
              <p className="mb-4">
                Conformément à l&apos;article L221-28 du Code de la
                consommation, le droit de rétractation ne s&apos;applique pas
                aux :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Services entièrement exécutés avant la fin du délai de
                  rétractation
                </li>
                <li>
                  Services numériques fournis immédiatement avec accord
                  préalable du consommateur
                </li>
                <li>
                  Commissions prélevées sur des transactions déjà réalisées
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Remboursements</h2>
              <h3 className="text-lg font-medium mb-3">
                6.1 Conditions de remboursement
              </h3>
              <p className="mb-4">
                Les remboursements peuvent être accordés dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Dysfonctionnement technique imputable à FreeHunt empêchant
                  l&apos;utilisation du service
                </li>
                <li>Erreur de facturation</li>
                <li>Annulation d&apos;un service premium non encore utilisé</li>
              </ul>

              <h3 className="text-lg font-medium mb-3">
                6.2 Procédure de remboursement
              </h3>
              <p className="mb-4">
                Les demandes de remboursement doivent être adressées par email à
                <a
                  href="mailto:contact@freehunt.fr"
                  className="text-blue-600 hover:underline"
                >
                  {" "}
                  contact@freehunt.fr
                </a>
                avec justification de la demande.
              </p>
              <p className="mb-4">
                Les remboursements approuvés sont effectués sous 14 jours ouvrés
                sur le moyen de paiement initial.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Facturation</h2>
              <p className="mb-4">
                Les factures sont générées automatiquement et envoyées par email
                à l&apos;adresse renseignée lors de l&apos;inscription.
              </p>
              <p className="mb-4">
                Les utilisateurs peuvent télécharger leurs factures depuis leur
                espace personnel sur la plateforme.
              </p>
              <p className="mb-4">
                Conformément à la réglementation, les factures mentionnent :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Les coordonnées complètes de FreeHunt SAS</li>
                <li>Le numéro de TVA intracommunautaire</li>
                <li>La description détaillée des services</li>
                <li>Les montants HT, TVA et TTC</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Garanties</h2>
              <p className="mb-4">
                FreeHunt garantit la conformité de ses services aux
                spécifications annoncées et s&apos;engage à corriger tout
                dysfonctionnement dans les meilleurs délais.
              </p>
              <p className="mb-4">Toutefois, FreeHunt ne peut garantir :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>L&apos;obtention de missions pour les freelances</li>
                <li>La qualité des prestations réalisées par les freelances</li>
                <li>Le succès commercial des projets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Responsabilité</h2>
              <p className="mb-4">
                La responsabilité de FreeHunt est limitée au montant des sommes
                versées par l&apos;utilisateur au cours des 12 mois précédant la
                survenance du dommage.
              </p>
              <p className="mb-4">
                FreeHunt ne peut être tenue responsable des dommages indirects,
                perte de chiffre d&apos;affaires, perte de clientèle ou perte de
                données.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                10. Réclamations et service client
              </h2>
              <p className="mb-4">
                Pour toute réclamation concernant nos services, vous pouvez nous
                contacter :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Par email :{" "}
                  <a
                    href="mailto:contact@freehunt.fr"
                    className="text-blue-600 hover:underline"
                  >
                    contact@freehunt.fr
                  </a>
                </li>
                <li>
                  Par courrier : FreeHunt SAS, 242 rue du Faubourg
                  Saint-Antoine, 75012 Paris
                </li>
              </ul>
              <p className="mb-4">
                Nous nous engageons à traiter votre réclamation dans un délai de
                48 heures ouvrés.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                11. Droit applicable et juridiction
              </h2>
              <p className="mb-4">
                Les présentes CGV sont soumises au droit français. Tout litige
                sera de la compétence exclusive des tribunaux français.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
