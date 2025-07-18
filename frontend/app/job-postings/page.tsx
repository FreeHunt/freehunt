"use client";

import { getCurrentUser } from "@/actions/auth";
import { getJobPostingsByUserIdAndStatus } from "@/actions/jobPostings";
import { Banner } from "@/components/common/banner";
import { Button } from "@/components/common/button";
import { JobPostingCard } from "@/components/job-posting/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { JobPosting } from "@/lib/interfaces";
import { AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export default function MyPublishedJobPostingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndJobPostings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer l'utilisateur courant
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Récupérer SEULEMENT les annonces publiées
        const publishedJobPostings = await getJobPostingsByUserIdAndStatus(
          currentUser.id,
          "PUBLISHED",
        );
        setJobPostings(publishedJobPostings);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger vos offres d'emploi publiées");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndJobPostings();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Banner
        text="Mes annonces publiées et visibles"
        redPointerClassName="right-0"
      />

      <div className="max-w-7xl mx-auto px-4 lg:px-5 py-6">
        {/* Note explicative */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            👁️ Consultation des annonces publiées
          </h2>
          <p className="text-foreground text-sm mb-2">
            <strong>Cette page montre uniquement vos annonces publiées</strong>{" "}
            - celles que les freelances peuvent voir et pour lesquelles ils
            peuvent postuler.
          </p>
          <p className="text-muted-foreground text-sm">
            💡 Pour gérer vos paiements, publications ou annuler des annonces,
            utilisez la <strong>&quot;Gestion des annonces&quot;</strong> depuis
            votre dashboard.
          </p>
        </div>

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              Mes annonces publiées
            </h1>
            {!loading && (
              <Badge className="bg-freehunt-main font-bold text-white">
                {jobPostings.length}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Link href="/dashboard/job-postings">
              <Button variant="outline" className="flex items-center gap-2">
                📋 Gérer mes annonces
              </Button>
            </Link>
            <Link href="/job-postings/new">
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Créer une annonce
              </Button>
            </Link>
          </div>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full max-w-[340px] h-[300px] rounded-xl"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Erreur de chargement, veuillez vous reconnecter
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              {error}
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        ) : jobPostings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plus className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune annonce publiée
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Vous n&apos;avez pas encore d&apos;annonces publiées et visibles
              par les freelances. Créez et publiez votre première annonce pour
              commencer à recevoir des candidatures.
            </p>
            <div className="flex gap-2">
              <Link href="/job-postings/new">
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Créer une annonce
                </Button>
              </Link>
              <Link href="/dashboard/job-postings">
                <Button variant="outline" className="flex items-center gap-2">
                  📋 Gérer mes annonces
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...jobPostings]
                .sort((a, b) => {
                  // Trier par promues d'abord, puis par date de création (plus récentes en premier)
                  if (a.isPromoted && !b.isPromoted) return -1;
                  if (!a.isPromoted && b.isPromoted) return 1;
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                })
                .map((jobPosting) => (
                  <JobPostingCard key={jobPosting.id} {...jobPosting} />
                ))}
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">
                ✅ Vos annonces sont en ligne !
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>
                  • Ces annonces sont visibles par tous les freelances de la
                  plateforme
                </li>
                <li>
                  • Les freelances peuvent postuler et vous envoyer des
                  candidatures
                </li>
                <li>
                  • Consultez vos candidatures reçues depuis votre dashboard
                </li>
                <li>
                  • Pour modifier, annuler ou gérer le paiement, utilisez la
                  &quot;Gestion des annonces&quot;
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
