"use client";

import { useAuth } from "@/actions/auth";
import { getCandidatesByCompany, updateCandidateStatus } from "@/actions/candidates";
import { getCurrentCompany } from "@/actions/company";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Candidate, CandidateStatus } from "@/lib/interfaces";
import { showToast } from "@/lib/toast";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MapPin, 
  DollarSign, 
  Calendar,
  MessageSquare,
  Eye
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function CompanyCandidatesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingCandidate, setUpdatingCandidate] = useState<string | null>(null);

  const loadCandidates = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Récupérer les informations de l'entreprise
      const companyData = await getCurrentCompany(user.id);
      
      // Récupérer les candidatures
      const candidatesData = await getCandidatesByCompany(companyData.id);
      setCandidates(candidatesData);
    } catch (error) {
      console.error("Error loading candidates:", error);
      showToast.error("Erreur lors du chargement des candidatures");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "COMPANY") {
      router.push("/dashboard");
      return;
    }

    if (user) {
      loadCandidates();
    }
  }, [user, isLoading, router, loadCandidates]);

  const handleStatusUpdate = async (candidateId: string, newStatus: string) => {
    try {
      setUpdatingCandidate(candidateId);
      await updateCandidateStatus(candidateId, newStatus);
      
      // Mettre à jour l'état local
      setCandidates(candidates.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, status: newStatus as CandidateStatus }
          : candidate
      ));
      
      const statusText = newStatus === "ACCEPTED" ? "acceptée" : "refusée";
      showToast.success(`Candidature ${statusText} avec succès`);
    } catch (error) {
      console.error("Error updating candidate status:", error);
      showToast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingCandidate(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          En attente
        </Badge>;
      case "ACCEPTED":
        return <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Acceptée
        </Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Refusée  
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Candidatures reçues</h1>
            <p className="text-gray-600">
              Gérez les candidatures pour vos offres d&apos;emploi
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/company">Retour au tableau de bord</Link>
          </Button>
        </div>

        {candidates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune candidature
              </h3>
              <p className="text-gray-500 mb-4">
                Vous n&apos;avez pas encore reçu de candidatures pour vos offres d&apos;emploi.
              </p>
              <Button asChild>
                <Link href="/job-postings/create">Publier une offre</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {candidate.freelance?.user?.username || "Freelance"}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {candidate.freelance?.firstName} {candidate.freelance?.lastName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {candidate.freelance?.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {candidate.freelance?.averageDailyRate}€/jour
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {candidate.freelance?.seniority} ans d&apos;expérience
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">
                        <strong>Poste :</strong> {candidate.jobPosting?.title}
                      </p>
                      <p className="text-gray-600 mb-3">
                        {candidate.freelance?.jobTitle}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(candidate.status)}
                      <span className="text-xs text-gray-500">
                        Candidature du {formatDate(candidate.createdAt)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Compétences */}
                  {candidate.freelance?.skills && candidate.freelance.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Compétences</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.freelance.skills.map((skill) => (
                          <Badge key={skill.id} variant="outline" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Separator className="my-4" />
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/freelances/${candidate.freelance?.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          Voir le profil
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/messages?freelanceId=${candidate.freelance?.id}`}>
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contacter
                        </Link>
                      </Button>
                    </div>
                    
                    {candidate.status === "PENDING" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(candidate.id, "REJECTED")}
                          disabled={updatingCandidate === candidate.id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Refuser
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(candidate.id, "ACCEPTED")}
                          disabled={updatingCandidate === candidate.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {updatingCandidate === candidate.id ? "..." : "Accepter"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
