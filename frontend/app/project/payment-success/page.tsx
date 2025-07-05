"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { getJobPostingProject } from "@/actions/jobPostings";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id");
    const jobPostingIdParam = searchParams.get("job_posting_id");

    if (sessionIdParam && jobPostingIdParam) {
      setSessionId(sessionIdParam);
      
      // Récupérer l'ID du projet créé automatiquement
      fetchProjectId(jobPostingIdParam);
    } else {
      // Si pas de session_id ou job_posting_id, rediriger vers le dashboard
      setTimeout(() => {
        router.push("/dashboard/job-postings");
      }, 3000);
      setIsLoading(false);
    }
  }, [searchParams, router]);

  const fetchProjectId = async (jobPostingId: string) => {
    try {
      const projectId = await getJobPostingProject(jobPostingId);
      setProjectId(projectId);
    } catch (error) {
      console.error("Erreur lors de la récupération du projet:", error);
      setError("Erreur lors de la récupération du projet");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirection automatique vers le projet après 5 secondes si projectId est disponible
  useEffect(() => {
    if (projectId && !isLoading) {
      const timer = setTimeout(() => {
        router.push(`/project/${projectId}`);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [projectId, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-freehunt-main mx-auto mb-4" />
          <p className="text-gray-600">Vérification du paiement et création du projet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Paiement réussi !
          </h1>
          <p className="text-gray-600">
            Votre annonce a été payée avec succès et un projet a été créé automatiquement.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-700">
            <strong>ID de session :</strong> {sessionId}
          </p>
          <p className="text-sm text-green-700 mt-1">
            Votre annonce est maintenant <strong>publiée</strong> et visible par
            les freelances.
          </p>
          {projectId ? (
            <>
              <p className="text-sm text-green-700 mt-1">
                Un <strong>projet</strong> a été créé automatiquement pour gérer cette mission.
              </p>
              <p className="text-sm text-green-700 mt-1">
                Vous serez redirigé vers votre projet dans quelques secondes...
              </p>
            </>
          ) : (
            <p className="text-sm text-green-700 mt-1">
              Création du projet en cours...
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {projectId ? (
            <Button asChild className="w-full">
              <Link href={`/project/${projectId}`}>
                Accéder au projet
              </Link>
            </Button>
          ) : (
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Création du projet...
            </Button>
          )}

          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard/job-postings">
              Retour à la gestion des annonces
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/job-postings">Voir mes annonces publiées</Link>
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Vous recevrez un email de confirmation sous peu.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-freehunt-main mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
