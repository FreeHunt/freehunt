"use client";

import { useEffect, useState } from "react";
import { JobPosting } from "@/lib/interfaces";
import { getJobPostingsByUserId } from "@/actions/jobPostings";
import { getCurrentUser } from "@/actions/auth";
import { JobPostingCard } from "@/components/job-posting/card";
import { Banner } from "@/components/common/banner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/common/button";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export default function MyJobPostingsPage() {
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

        // Récupérer les offres d'emploi de l'utilisateur
        const userJobPostings = await getJobPostingsByUserId(currentUser.id);
        setJobPostings(userJobPostings);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger vos offres d'emploi");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndJobPostings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner text="Gérez vos offres d'emploi" redPointerClassName="right-0" />

      <div className="max-w-7xl mx-auto px-4 lg:px-5 py-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-freehunt-black-two">
              Mes offres d&apos;emploi
            </h1>
            {!loading && (
              <Badge className="bg-freehunt-main font-bold text-white">
                {jobPostings.length}
              </Badge>
            )}
          </div>

          <Link href="/job-postings/new">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Créer une offre
            </Button>
          </Link>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="w-full max-w-[340px] h-[300px] rounded-[30px]"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Erreur de chargement, veuillez vous reconnecter
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        ) : jobPostings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune offre d&apos;emploi
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-4">
              Vous n&apos;avez pas encore publié d&apos;offres d&apos;emploi.
              Créez votre première offre pour commencer à attirer des talents.
            </p>
            <Link href="/job-postings/new">
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Créer ma première offre
              </Button>
            </Link>
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
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                💡 Conseils pour améliorer vos offres
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Ajoutez des descriptions détaillées pour attirer plus de
                  candidats
                </li>
                <li>• Utilisez des mots-clés pertinents dans le titre</li>
                <li>
                  • Mettez vos offres en avant pour augmenter leur visibilité
                </li>
                <li>
                  • Répondez rapidement aux candidatures pour maintenir
                  l&apos;engagement
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
