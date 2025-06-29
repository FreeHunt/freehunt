import { Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">FreeHunt</h3>
            <p className="text-gray-600 text-sm">
              Où entreprises et freelances se rencontrent
            </p>
            <div className="flex space-x-4 mt-4">
              <Link
                href="https://linkedin.com/company/freehunt-official"
                className="text-gray-600 hover:text-blue-600"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/freehunt_fr"
                className="text-gray-600 hover:text-blue-500"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com/freehunt_official"
                className="text-gray-600 hover:text-pink-600"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Informations légales</h4>
            <nav className="space-y-2">
              <Link
                href="/cgu"
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                Conditions générales d&apos;utilisation
              </Link>
              <Link
                href="/cgv"
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                Conditions générales de vente
              </Link>
              <Link
                href="/mentions-legales"
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                Mentions légales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/cookies"
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                Politique des cookies
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>FreeHunt SAS</p>
              <p>242 rue du Faubourg Saint-Antoine</p>
              <p>75012 Paris</p>
              <p className="mt-2">
                <Link
                  href="mailto:contact@freehunt.fr"
                  className="hover:text-gray-900"
                >
                  contact@freehunt.fr
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
          <p>&copy; 2025 FreeHunt SAS. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
