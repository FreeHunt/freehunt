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
            Découvrez les dernières opportunités et gérez votre activité
            freelance
          </p>
        </header>

        <div className="space-y-8">
          {/* Section: Recherche & Candidatures - Priority actions */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              🔍 Recherche & candidatures
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  🎯 Rechercher des jobs
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Explorez les offres d&apos;emploi disponibles et trouvez votre
                  prochaine mission
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
                >
                  <Link href="/job-postings/search">Voir les jobs</Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  📋 Mes candidatures
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Suivez l&apos;état de vos candidatures et restez informé des
                  réponses
                </p>
                <Button
                  asChild
                  className="w-full bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg mt-auto"
                  disabled
                >
                  Bientôt disponible
                </Button>
              </div>
            </div>
          </div>

          {/* Section: Activité & Gestion */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              💼 Activité & gestion
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  🚀 Mes projets
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Consultez vos projets en cours et terminés
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
                >
                  <Link href="/dashboard/freelance/projects">
                    Voir mes projets
                  </Link>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  💬 Mes conversations
                </h3>
                <p className="text-muted-foreground mb-4 text-sm flex-1">
                  Gérez vos conversations avec les entreprises
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
                  Gérez vos informations personnelles et votre visibilité
                </p>
                <Button
                  asChild
                  className="w-full bg-freehunt-main hover:bg-freehunt-main/90 rounded-lg mt-auto"
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
