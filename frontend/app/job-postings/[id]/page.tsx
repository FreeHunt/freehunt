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
} from "lucide-react";
import { useEffect, useState } from "react";
import { getJobPosting } from "@/actions/jobPostings";
import { useParams } from "next/navigation";
import { Checkpoint, Company, JobPosting, Skill } from "@/lib/interfaces";
import { getCheckpoints } from "@/actions/checkPoints";
import { getCompany } from "@/actions/company";
import { useRouter } from "next/navigation";

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

  const displayedTechnicalSkills = showAllSkills
    ? technicalSkills
    : technicalSkills.slice(0, 4);
  const displayedSoftSkills = showAllSkills
    ? softSkills
    : softSkills.slice(0, 3);

  const totalBudget = checkpoints.reduce(
    (sum, checkpoint) => sum + checkpoint.amount,
    0,
  );

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
    fetchJobPosting();
  }, [id]);

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
                                {formatNumberToEuros(
                                  checkpoint.amount *
                                    (jobPosting?.averageDailyRate ?? 0),
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {checkpoint.amount} jour
                                {checkpoint.amount > 1 ? "s" : ""}
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
                        {formatNumberToEuros(
                          totalBudget * (jobPosting?.averageDailyRate ?? 0),
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 text-right">
                      {totalBudget} jour{totalBudget > 1 ? "s" : ""} à{" "}
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
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <FreeHuntButton className="w-full">
                    Postuler à cette offre
                  </FreeHuntButton>
                  <FreeHuntButton
                    variant="outline"
                    theme="secondary"
                    className="w-full"
                  >
                    Mettre en favoris
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
                  <span className="font-medium">{totalBudget} jours</span>
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
