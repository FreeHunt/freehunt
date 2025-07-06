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
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
          <div className="h-10 bg-muted rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Bienvenue, {user.username}
          </h1>
          <p className="text-muted-foreground">
            Trouvez les freelances parfaits pour vos projets
          </p>
        </header>

        <div className="space-y-8">
          {/* Section: Gestion des annonces - Priority actions */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              📝 Gestion des annonces
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  ➕ Créer une annonce
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Publiez une nouvelle offre de mission freelance
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
                >
                  <Link href="/job-postings/new">Créer une annonce</Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  📋 Gérer mes annonces
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Paiements, publications, annulations - Gestion complète
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
                >
                  <Link href="/dashboard/job-postings">Gérer mes annonces</Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  👁️ Mes annonces publiées
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Consultez vos annonces visibles par les freelances
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg text-white mt-auto"
                >
                  <Link href="/job-postings">Voir mes annonces publiées</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Section: Suivi des candidatures et projets */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              👥 Candidatures & projets
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  📥 Candidatures reçues
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Consultez et gérez les candidatures pour vos postes
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
                >
                  <Link href="/dashboard/company/candidates">
                    Voir les candidatures
                  </Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  🚀 Mes projets
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Suivez vos projets en cours et terminés
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
                >
                  <Link href="/dashboard/company/projects">
                    Voir mes projets
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Section: Recherche et communication */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              🔍 Recherche & communication
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  🔍 Rechercher des freelances
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Découvrez les profils de freelances disponibles
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
                >
                  <Link href="/freelances/search">Voir les freelances</Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  💬 Mes conversations
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Gérez vos conversations avec les freelances
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
                >
                  <Link href="/conversations">Voir mes conversations</Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  ⚙️ Mon profil
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Gérez vos informations d&apos;entreprise
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
                >
                  <Link href="/profile/company">Voir mon profil</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
