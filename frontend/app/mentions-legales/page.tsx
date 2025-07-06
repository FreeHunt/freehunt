export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Mentions Légales
          </h1>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                1. Informations sur l&apos;éditeur
              </h2>
              <div className="mb-4">
                <p>
                  <strong>Dénomination sociale :</strong> FreeHunt SAS
                </p>
                <p>
                  <strong>Forme juridique :</strong> Société par Actions
                  Simplifiée (SAS)
                </p>
                <p>
                  <strong>Capital social :</strong> 10 000 euros
                </p>
                <p>
                  <strong>Siège social :</strong> 242 rue du Faubourg
                  Saint-Antoine, 75012 Paris
                </p>
                <p>
                  <strong>SIREN :</strong> 123 456 789
                </p>
                <p>
                  <strong>SIRET :</strong> 123 456 789 00012
                </p>
                <p>
                  <strong>RCS :</strong> Paris 123 456 789
                </p>
                <p>
                  <strong>Numéro de TVA intracommunautaire :</strong>{" "}
                  FR12123456789
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Contact</h2>
              <div className="mb-4">
                <p>
                  <strong>Email :</strong>{" "}
                  <a
                    href="mailto:contact@freehunt.fr"
                    className="text-primary hover:underline"
                  >
                    contact@freehunt.fr
                  </a>
                </p>
                <p>
                  <strong>Téléphone :</strong> +33 1 23 45 67 89
                </p>
                <p>
                  <strong>Adresse postale :</strong> FreeHunt SAS, 242 rue du
                  Faubourg Saint-Antoine, 75012 Paris
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                3. Direction de la publication
              </h2>
              <div className="mb-4">
                <p>
                  <strong>Directeur de publication :</strong> Jean Dupont
                </p>
                <p>
                  <strong>Qualité :</strong> Président de FreeHunt SAS
                </p>
                <p>
                  <strong>Email :</strong>{" "}
                  <a
                    href="mailto:contact@freehunt.fr"
                    className="text-primary hover:underline"
                  >
                    contact@freehunt.fr
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Hébergement</h2>
              <div className="mb-4">
                <p>
                  <strong>Mode d&apos;hébergement :</strong> Auto-hébergé
                </p>
                <p>
                  <strong>Infrastructure :</strong> Serveurs dédiés avec
                  protection Cloudflare Zero Trust
                </p>
                <p>
                  <strong>Localisation :</strong> France et Union Européenne
                </p>
                <p>
                  <strong>Responsable technique :</strong> FreeHunt SAS
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                5. Propriété intellectuelle
              </h2>
              <p className="mb-4">
                Le site internet FreeHunt et l&apos;ensemble de son contenu
                (textes, images, logos, structure, etc.) sont protégés par le
                droit de la propriété intellectuelle française et
                internationale.
              </p>
              <p className="mb-4">
                Toute reproduction, distribution, modification, adaptation,
                retransmission ou publication, même partielle, de ces différents
                éléments est strictement interdite sans l&apos;accord exprès par
                écrit de FreeHunt SAS.
              </p>
              <p className="mb-4">
                Les marques, logos, signes et autres éléments distinctifs
                reproduits sur le site sont protégés au titre du droit des
                marques et ne peuvent être reproduits sans autorisation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                6. Protection des données personnelles
              </h2>
              <p className="mb-4">
                Le traitement des données personnelles collectées sur le site
                FreeHunt est effectué conformément au Règlement Général sur la
                Protection des Données (RGPD) et à la loi « Informatique et
                Libertés ».
              </p>
              <p className="mb-4">
                <strong>Responsable de traitement :</strong> FreeHunt SAS
              </p>
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
              <p className="mb-4">
                Pour plus d&apos;informations sur le traitement de vos données
                personnelles, consultez notre{" "}
                <a
                  href="/politique-confidentialite"
                  className="text-primary hover:underline"
                >
                  Politique de Confidentialité
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Cookies</h2>
              <p className="mb-4">
                Le site FreeHunt utilise des cookies pour améliorer
                l&apos;expérience utilisateur et réaliser des statistiques de
                visite.
              </p>
              <p className="mb-4">
                Pour plus d&apos;informations sur l&apos;utilisation des
                cookies, consultez notre{" "}
                <a href="/cookies" className="text-primary hover:underline">
                  Politique des Cookies
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                8. Limitation de responsabilité
              </h2>
              <p className="mb-4">
                FreeHunt SAS s&apos;efforce d&apos;assurer l&apos;exactitude et
                la mise à jour des informations diffusées sur ce site, mais ne
                peut garantir l&apos;exactitude, la précision ou
                l&apos;exhaustivité des informations mises à disposition.
              </p>
              <p className="mb-4">
                En conséquence, FreeHunt SAS décline toute responsabilité :
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Pour toute imprécision, inexactitude ou omission portant sur
                  des informations disponibles sur le site
                </li>
                <li>
                  Pour tous dommages résultant d&apos;une intrusion frauduleuse
                  d&apos;un tiers ayant entraîné une modification des
                  informations
                </li>
                <li>
                  Pour tous dommages directs ou indirects résultant de
                  l&apos;utilisation du site
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                9. Droit applicable
              </h2>
              <p className="mb-4">
                Les présentes mentions légales sont régies par le droit
                français. En cas de litige, les tribunaux français seront seuls
                compétents.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">10. Crédits</h2>
              <p className="mb-4">
                <strong>Conception et développement :</strong> Équipe FreeHunt
              </p>
              <p className="mb-4">
                <strong>Technologies utilisées :</strong> Next.js, TypeScript,
                Tailwind CSS, NestJS, PostgreSQL
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">11. Mise à jour</h2>
              <p className="mb-4">
                Les présentes mentions légales peuvent être modifiées à tout
                moment. La version en vigueur est celle accessible en ligne sur
                le site FreeHunt.
              </p>
              <p className="mb-4">
                <strong>Dernière mise à jour :</strong> 29 juin 2025
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
