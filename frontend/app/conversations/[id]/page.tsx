"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * Page dynamique pour rediriger les URL /conversations/[id] vers /conversations?selected=[id]
 * Cette page assure la compatibilité avec les anciens liens directs vers des conversations spécifiques
 */
export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const conversationId = params.id as string;
    if (conversationId) {
      // Rediriger vers la page conversations principale avec le paramètre selected
      router.replace(`/conversations?selected=${conversationId}`);
    } else {
      // Si pas d'ID, rediriger vers la page conversations principale
      router.replace('/conversations');
    }
  }, [params.id, router]);

  // Affichage de chargement pendant la redirection
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-freehunt-main mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la conversation...</p>
      </div>
    </div>
  );
}
