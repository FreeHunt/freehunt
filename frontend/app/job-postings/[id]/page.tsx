"use client";

import { Badge } from "@/components/ui/badge";
import { Button as FreeHuntButton } from "@/components/common/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumberToEuros } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Euro,
  Calendar,
  Building2,
  Mail,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getJobPosting } from "@/actions/jobPostings";
import { useParams } from "next/navigation";
import {
  Candidate,
  CandidateStatus,
  Checkpoint,
  Company,
  Freelance,
  JobPosting,
  Skill,
  User,
  UserRole,
} from "@/lib/interfaces";
import { getCheckpoints } from "@/actions/checkPoints";
import { getCompany } from "@/actions/company";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import {
  createCandidate,
  deleteCandidate,
  getCandidateByFreelanceIdAndJobPostingId,
} from "@/actions/candidates";
import { getFreelanceByUserId } from "@/actions/freelances";
import { checkProjectExistsForJobPosting } from "@/actions/projects";
import { showToast } from "@/lib/toast";

const getLocationLabel = (location: string) => {
  switch (location) {
    case "REMOTE":
      return "Télétravail";
    case "ONSITE":
      return "Sur site";
    case "HYBRID":
      return "Hybride";
    default:
      return location;
  }
};

const getSeniorityLabel = (years: number) => {
  if (years <= 2) return "Junior (0-2 ans)";
  if (years <= 5) return "Intermédiaire (2-5 ans)";
  if (years <= 10) return "Senior (7-10 ans)";
  return "Expert (10+ ans)";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DONE":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "IN_PROGRESS":
      return <Clock className="w-5 h-5 text-blue-500" />;
    default:
      return <Circle className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "DONE":
      return "Terminé";
    case "IN_PROGRESS":
      return "En cours";
    case "PENDING":
      return "En attente";
    default:
      return status;
  }
};

export default function JobPostingDetail() {
  const router = useRouter();

  const [showAllSkills, setShowAllSkills] = useState(false);
  const { id } = useParams();
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<Skill[]>([]);
  const [softSkills, setSoftSkills] = useState<Skill[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [freelance, setFreelance] = useState<Freelance | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null); // Si une candidature est créé pour l'utilisateur connecté
  const [isApplying, setIsApplying] = useState(false);
  const [projectExists, setProjectExists] = useState(false);

  const displayedTechnicalSkills = showAllSkills
    ? technicalSkills
    : technicalSkills.slice(0, 4);
  const displayedSoftSkills = showAllSkills
    ? softSkills
    : softSkills.slice(0, 3);

  // Calculer le budget total : utiliser totalAmount du jobPosting si disponible, sinon sommer les checkpoints
  const totalBudget =
    jobPosting?.totalAmount ??
    checkpoints.reduce((sum, checkpoint) => sum + checkpoint.amount, 0);

  // Calculer le nombre total de jours basé sur le budget total et le TJM
  const totalDays =
    jobPosting?.averageDailyRate && jobPosting.averageDailyRate > 0
      ? Math.round(totalBudget / jobPosting.averageDailyRate)
      : 0;

  useEffect(() => {
    const fetchJobPosting = async () => {
      const jobPosting = await getJobPosting(id as string);
      setJobPosting(jobPosting);

      if (jobPosting) {
        setTechnicalSkills(
          jobPosting.skills?.filter((skill) => skill.type === "TECHNICAL") ??
            [],
        );
        setSoftSkills(
          jobPosting.skills?.filter((skill) => skill.type === "SOFT") ?? [],
        );
        const checkpoints = await getCheckpoints(id as string);
        setCheckpoints(checkpoints);

        const company = await getCompany(jobPosting.company?.id ?? "");
        setCompany(company);
      }
    };

    const fetchFreelanceUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return;
      }
      setUser(currentUser);

      if (currentUser.role == UserRole.FREELANCE) {
        const currentFreelance = await getFreelanceByUserId(currentUser.id);
        if (!currentFreelance) {
          console.log("No freelance profile found for the current user.");
          return;
        }
        setFreelance(currentFreelance);
      }
    };

    fetchJobPosting();
    fetchFreelanceUser();
  }, [id]);

  // Récupération de la candidature de l'utilisateur connecté pour cette offre
  useEffect(() => {
    const fetchApplicationForUser = async () => {
      if (!user || !jobPosting || !freelance) return;

      const application = await getCandidateByFreelanceIdAndJobPostingId(
        freelance.id,
        jobPosting.id,
      );

      if (application) {
        setCandidate(application);
      } else {
        setCandidate(null);
      }
    };

    fetchApplicationForUser();
  }, [user, jobPosting, freelance]);

  // Vérifier si un projet existe déjà pour cette offre
  useEffect(() => {
    const checkProject = async () => {
      if (!jobPosting) return;
      const exists = await checkProjectExistsForJobPosting(jobPosting.id);
      setProjectExists(exists);
    };

    checkProject();
  }, [jobPosting]);

  // Permet de postuler une candidature ou de la supprimer si elle existe déjà
  const handleApply = async () => {
    if (!user || !jobPosting || !freelance) return;

    // Vérifier que le freelance a un compte Stripe connecté avant de postuler
    if (!candidate && !freelance.stripeAccountId) {
      showToast.error(
        "Vous devez connecter votre compte Stripe avant de pouvoir candidater. Veuillez compléter votre profil.",
      );
      return;
    }

    setIsApplying(true);

    if (candidate) {
      try {
        await deleteCandidate(candidate.id);
        setCandidate(null);
        showToast.success("Candidature retirée avec succès");
      } catch (error) {
        console.error(error);
        showToast.error("Erreur lors du retrait de la candidature");
      }
    } else {
      try {
        const createdCandidate = await createCandidate({
          freelanceId: freelance.id,
          jobPostingId: jobPosting.id,
          status: CandidateStatus.PENDING,
        });
        setCandidate(createdCandidate);
        showToast.success("Candidature envoyée avec succès");
      } catch (error: unknown) {
        console.error(error);
        if (error && typeof error === "object" && "response" in error) {
          const apiError = error as {
            response?: { data?: { message?: string } };
          };
          if (
            apiError?.response?.data?.message?.includes(
              "has already been selected",
            )
          ) {
            showToast.error(
              "Impossible de candidater : un freelance a déjà été sélectionné pour cette offre",
            );
          } else if (
            apiError?.response?.data?.message?.includes(
              "must connect your Stripe account",
            )
          ) {
            showToast.error(
              "Vous devez connecter votre compte Stripe avant de pouvoir candidater. Veuillez compléter votre profil.",
            );
          } else {
            showToast.error("Erreur lors de l'envoi de la candidature");
          }
        } else {
          showToast.error("Erreur lors de l'envoi de la candidature");
        }
        setCandidate(null);
      }
    }

    setIsApplying(false);
  };

  // Variables booléennes calculées pour éviter les erreurs TypeScript
  const hasStripeAccount =
    freelance?.stripeAccountId !== null &&
    freelance?.stripeAccountId !== undefined &&
    freelance?.stripeAccountId !== "";
  const showStripeConnectButton = freelance && !hasStripeAccount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header avec bouton retour */}
        <div className="mb-6">
          <FreeHuntButton
            variant="outline"
            theme="secondary"
            className="mb-4 flex items-center gap-2"
            onClick={() => router.push("/job-postings/search")}
          >
            <ArrowLeft size={16} />
            Retour aux offres
          </FreeHuntButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* En-tête de l'offre */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-freehunt-black-two mb-2">
                      {jobPosting?.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        {getLocationLabel(jobPosting?.location ?? "")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {getSeniorityLabel(jobPosting?.seniority ?? 0)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro size={16} />
                        {formatNumberToEuros(
                          jobPosting?.averageDailyRate ?? 0,
                        )}{" "}
                        / jour
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        Publié le{" "}
                        {new Date(
                          jobPosting?.createdAt ?? "",
                        ).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                  {jobPosting?.isPromoted && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Sponsorisé
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-freehunt-black-two">
                  Description du poste
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {jobPosting?.description}
                </p>
              </CardContent>
            </Card>

            {/* Compétences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-freehunt-black-two">
                  Compétences requises
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {technicalSkills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Compétences techniques
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {displayedTechnicalSkills.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 border-blue-200"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {softSkills.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Compétences transversales
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {displayedSoftSkills.map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="bg-green-100 text-green-800 border-green-200"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {!showAllSkills &&
                  (technicalSkills.length > 4 || softSkills.length > 3) && (
                    <FreeHuntButton
                      variant="outline"
                      theme="secondary"
                      size="sm"
                      onClick={() => setShowAllSkills(true)}
                    >
                      Voir toutes les compétences
                    </FreeHuntButton>
                  )}
              </CardContent>
            </Card>

            {/* Jalons du projet */}
            {checkpoints.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-freehunt-black-two">
                    Jalons du projet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {checkpoints.map((checkpoint) => (
                      <div
                        key={checkpoint.id}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(checkpoint.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {checkpoint.name}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1">
                                {checkpoint.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>
                                  Échéance:{" "}
                                  {new Date(checkpoint.date).toLocaleDateString(
                                    "fr-FR",
                                  )}
                                </span>
                                <span>
                                  Statut: {getStatusLabel(checkpoint.status)}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-freehunt-main">
                                {formatNumberToEuros(checkpoint.amount)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {jobPosting?.averageDailyRate &&
                                jobPosting.averageDailyRate > 0
                                  ? (() => {
                                      const days = Math.round(
                                        checkpoint.amount /
                                          jobPosting.averageDailyRate,
                                      );
                                      return `${days} jour${
                                        days > 1 ? "s" : ""
                                      }`;
                                    })()
                                  : "Montant fixe"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">
                        Budget total estimé:
                      </span>
                      <span className="font-bold text-xl text-freehunt-main">
                        {formatNumberToEuros(totalBudget)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      {totalDays} jour{totalDays > 1 ? "s" : ""} à{" "}
                      {formatNumberToEuros(jobPosting?.averageDailyRate ?? 0)}{" "}
                      /jour
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Carte de l'entreprise */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-freehunt-black-two flex items-center gap-2">
                  <Building2 size={20} />À propos de l&apos;entreprise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {company?.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    {company?.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{company?.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    <span>{company?.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={14} />
                    <span>SIREN: {company?.siren}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {user?.role !== UserRole.COMPANY && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {/* Avertissement Stripe */}
                    {showStripeConnectButton && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center space-y-2">
                        <p className="text-red-800 text-sm font-medium">
                          ⚠️ Compte Stripe requis
                        </p>
                        <p className="text-red-700 text-xs">
                          Vous devez connecter votre compte Stripe pour
                          candidater
                        </p>
                        <FreeHuntButton
                          variant="outline"
                          size="sm"
                          onClick={() => router.push("/profile/freelance")}
                          className="w-full mt-2"
                        >
                          Configurer mon compte Stripe
                        </FreeHuntButton>
                      </div>
                    )}

                    <FreeHuntButton
                      className="w-full"
                      onClick={handleApply}
                      disabled={
                        isApplying ||
                        (projectExists && !candidate) ||
                        (!candidate &&
                          !!freelance &&
                          !freelance.stripeAccountId)
                      }
                    >
                      {isApplying ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          {projectExists && !candidate
                            ? "Offre pourvue"
                            : candidate
                            ? "Annuler ma candidature"
                            : showStripeConnectButton
                            ? "Connecter Stripe pour postuler"
                            : "Postuler à cette offre"}
                        </>
                      )}
                    </FreeHuntButton>
                    {projectExists && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                        <p className="text-amber-800 text-sm font-medium">
                          ⚠️ Cette offre a déjà été pourvue
                        </p>
                        <p className="text-amber-700 text-xs mt-1">
                          Un freelance a déjà été sélectionné pour cette mission
                        </p>
                      </div>
                    )}
                    <FreeHuntButton
                      variant="outline"
                      theme="secondary"
                      className="w-full"
                    >
                      Ajouter aux favoris
                    </FreeHuntButton>
                    <FreeHuntButton
                      variant="outline"
                      theme="secondary"
                      className="w-full"
                    >
                      Contacter l&apos;entreprise
                    </FreeHuntButton>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informations supplémentaires */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-freehunt-black-two">
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">Mission freelance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span className="font-medium">
                    {totalDays} jour{totalDays > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux journalier:</span>
                  <span className="font-medium">
                    {formatNumberToEuros(jobPosting?.averageDailyRate ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Localisation:</span>
                  <span className="font-medium">
                    {getLocationLabel(jobPosting?.location ?? "")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expérience:</span>
                  <span className="font-medium">
                    {jobPosting?.seniority} ans
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
