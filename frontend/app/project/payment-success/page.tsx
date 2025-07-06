"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get("session_id");
    const jobPostingIdParam = searchParams.get("job_posting_id");

    if (sessionIdParam && jobPostingIdParam) {
      setSessionId(sessionIdParam);
    } else {
      // Si pas de session_id ou job_posting_id, rediriger vers le dashboard
      setTimeout(() => {
        router.push("/dashboard/job-postings");
      }, 3000);
    }
    setIsLoading(false);
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-freehunt-main mx-auto mb-4" />
          <p className="text-gray-600">
            Vérification du paiement et création du projet...
          </p>
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
            Votre annonce a été payée avec succès et est maintenant publiée.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-700">
            <strong>ID de session :</strong>
          </p>
          <p className="text-xs text-green-600 font-mono break-all bg-green-100 p-2 rounded mt-1 mb-2">
            {sessionId}
          </p>
          <p className="text-sm text-green-700 mt-1">
            Votre annonce est maintenant <strong>publiée</strong> et visible par
            les freelances.
          </p>
          <p className="text-sm text-green-700 mt-1">
            Les freelances peuvent désormais postuler à votre offre.
          </p>
          <p className="text-sm text-green-700 mt-1">
            Un <strong>projet</strong> et une <strong>conversation</strong>{" "}
            seront créés automatiquement lorsque vous accepterez la candidature
            d&apos;un freelance.
          </p>
        </div>

        <div className="space-y-3">
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
