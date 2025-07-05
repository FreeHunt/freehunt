"use client";

import { useAuth } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FreelanceDashboard() {
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
            Découvrez les dernières opportunités et gérez votre activité
            freelance
          </p>
        </header>

        <div className="space-y-8">
          {/* Section: Recherche & Candidatures - Priority actions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🔍 Recherche & Candidatures
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  🎯 Rechercher des jobs
                </h3>
                <p className="text-blue-700 mb-4 text-sm">
                  Explorez les offres d&apos;emploi disponibles
                </p>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Link href="/job-postings/search">Voir les jobs</Link>
                </Button>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-2 border-orange-200 p-6">
                <h3 className="text-lg font-semibold mb-3 text-orange-800">
                  📋 Mes candidatures
                </h3>
                <p className="text-orange-700 mb-4 text-sm">
                  Suivez l&apos;état de vos candidatures
                </p>
                <Button
                  asChild
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled
                >
                  Bientôt disponible
                </Button>
              </div>
            </div>
          </div>

          {/* Section: Projets & Activité */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🚀 Projets & Activité
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200 p-6">
                <h3 className="text-lg font-semibold mb-3 text-green-800">
                  💼 Mes projets
                </h3>
                <p className="text-green-700 mb-4 text-sm">
                  Consultez vos projets en cours et terminés
                </p>
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Link href="/dashboard/freelance/projects">
                    Voir mes projets
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Section: Communication & Profil */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              💬 Communication & Profil
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 p-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-800">
                  💬 Mes conversations
                </h3>
                <p className="text-purple-700 mb-4 text-sm">
                  Gérez vos conversations avec les entreprises
                </p>
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Link href="/conversations">Voir mes conversations</Link>
                </Button>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg border-2 border-indigo-200 p-6">
                <h3 className="text-lg font-semibold mb-3 text-indigo-800">
                  ⚙️ Mon profil
                </h3>
                <p className="text-indigo-700 mb-4 text-sm">
                  Gérez vos informations personnelles
                </p>
                <Button
                  asChild
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Link href="/profile/freelance">Voir mon profil</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
