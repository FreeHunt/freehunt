"use client";

import { useAuth } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CompanyDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bienvenue, {user.username}
          </h1>
          <p className="text-gray-600">
            Trouvez les freelances parfaits pour vos projets
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-3">
              Rechercher des freelances
            </h2>
            <p className="text-gray-600 mb-4">
              Découvrez les profils de freelances disponibles
            </p>
            <Button asChild className="w-full">
              <Link href="/freelances/search">Voir les freelances</Link>
            </Button>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-3">Mes conversations</h2>
            <p className="text-gray-600 mb-4">
              Gérez vos conversations avec les freelances
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/conversations">Voir mes conversations</Link>
            </Button>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-3">Mon profil</h2>
            <p className="text-gray-600 mb-4">
              Gérez vos informations d&apos;entreprise
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/profile/company">Voir mon profil</Link>
            </Button>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-3">Mes annonces</h2>
            <p className="text-gray-600 mb-4">
              Gérez vos offres d&apos;emploi publiées
            </p>
            <Button variant="outline" className="w-full" disabled>
              Bientôt disponible
            </Button>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-3">Candidatures reçues</h2>
            <p className="text-gray-600 mb-4">
              Consultez les candidatures pour vos postes
            </p>
            <Button variant="outline" className="w-full" disabled>
              Bientôt disponible
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
