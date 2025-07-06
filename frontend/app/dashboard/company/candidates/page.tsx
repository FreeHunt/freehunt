"use client";

import { useAuth } from "@/actions/auth";
import {
  getCandidatesByCompany,
  updateCandidateStatus,
} from "@/actions/candidates";
import { getCurrentCompany } from "@/actions/company";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/ui/badge";
import ContactUserButton from "@/components/common/ContactUserButton";
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
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function CompanyCandidatesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingCandidate, setUpdatingCandidate] = useState<string | null>(
    null,
  );

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
      const result = await updateCandidateStatus(candidateId, newStatus);

      // Mettre à jour l'état local
      if (newStatus === "ACCEPTED") {
        // Quand on accepte une candidature, toutes les autres en attente sont refusées
        setCandidates(
          candidates.map((candidate) =>
            candidate.id === candidateId
              ? {
                  ...candidate,
                  status: newStatus as CandidateStatus,
                  projectId: result.projectId,
                }
              : candidate.status === "PENDING"
              ? { ...candidate, status: "REJECTED" as CandidateStatus }
              : candidate,
          ),
        );
      } else {
        // Pour les autres statuts, juste mettre à jour la candidature concernée
        setCandidates(
          candidates.map((candidate) =>
            candidate.id === candidateId
              ? { ...candidate, status: newStatus as CandidateStatus }
              : candidate,
          ),
        );
      }

      if (newStatus === "ACCEPTED") {
        if (result.projectId) {
          showToast.successWithAction(
            "Candidature acceptée ! Un projet a été créé et les autres candidatures ont été refusées.",
            "Voir le projet",
            () => router.push(`/dashboard/company/projects`),
          );
        } else {
          showToast.success("Candidature acceptée avec succès");
        }
      } else {
        showToast.success("Candidature refusée avec succès");
      }
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
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            En attente
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Acceptée
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Refusée
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading || loading) {
    return (
      <div className="px-4 lg:px-5 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-[30px]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="px-4 lg:px-5 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-freehunt-black-two mb-2">
              Candidatures reçues
            </h1>
            <p className="text-freehunt-black-two opacity-70">
              Gérez les candidatures pour vos offres d&apos;emploi
            </p>
          </div>
          <Button variant="outline" theme="secondary" asChild>
            <Link href="/dashboard/company">Retour au tableau de bord</Link>
          </Button>
        </div>

        {candidates.length === 0 ? (
          <div className="bg-white rounded-[30px] border border-freehunt-grey p-12 text-center">
            <User className="w-12 h-12 text-freehunt-black-two opacity-40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-freehunt-black-two mb-2">
              Aucune candidature
            </h3>
            <p className="text-freehunt-black-two opacity-70 mb-4">
              Vous n&apos;avez pas encore reçu de candidatures pour vos offres
              d&apos;emploi.
            </p>
            <Button asChild>
              <Link href="/job-postings/create">Publier une offre</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white rounded-[30px] border border-freehunt-grey overflow-hidden"
              >
                <div className="bg-gradient-to-r from-freehunt-main/10 to-freehunt-main/5 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl lg:text-2xl font-bold text-freehunt-black-two mb-2">
                        {candidate.freelance?.user?.username || "Freelance"}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-freehunt-black-two opacity-70 mb-2">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {candidate.freelance?.firstName}{" "}
                          {candidate.freelance?.lastName}
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
                      <p className="text-freehunt-black-two opacity-80 mb-2">
                        <strong>Poste :</strong> {candidate.jobPosting?.title}
                      </p>
                      <p className="text-freehunt-black-two opacity-70">
                        {candidate.freelance?.jobTitle}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(candidate.status)}
                      <span className="text-xs text-freehunt-black-two opacity-50">
                        Candidature du {formatDate(candidate.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Compétences */}
                  {candidate.freelance?.skills &&
                    candidate.freelance.skills.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-freehunt-black-two mb-3">
                          Compétences
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.freelance.skills.map((skill) => (
                            <Badge
                              key={skill.id}
                              className="bg-freehunt-main/10 text-freehunt-black-two border-freehunt-main/20"
                            >
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="pt-6 border-t border-freehunt-grey flex items-center justify-between">
                    <div className="flex gap-3">
                      <Button variant="outline" theme="secondary" asChild>
                        <Link href={`/freelances/${candidate.freelance?.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          Voir le profil
                        </Link>
                      </Button>
                      <ContactUserButton
                        currentUserId={user?.id || ""}
                        targetUserId={candidate.freelance?.user?.id || ""}
                        targetUserName={`${candidate.freelance?.firstName} ${candidate.freelance?.lastName}`}
                        buttonText="Contacter"
                        variant="outline"
                        theme="secondary"
                      />
                    </div>

                    {candidate.status === "PENDING" && (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          theme="secondary"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          onClick={() =>
                            handleStatusUpdate(candidate.id, "REJECTED")
                          }
                          disabled={updatingCandidate === candidate.id}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Refuser
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() =>
                            handleStatusUpdate(candidate.id, "ACCEPTED")
                          }
                          disabled={updatingCandidate === candidate.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {updatingCandidate === candidate.id
                            ? "..."
                            : "Accepter"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
