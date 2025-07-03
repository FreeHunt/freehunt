"use client";

import { useAuth } from "@/actions/auth";
import { getProjectsByFreelance } from "@/actions/projects";
import { getCurrentFreelance } from "@/actions/freelances";
import { Button } from "@/components/common/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/interfaces";
import { showToast } from "@/lib/toast";
import {
  Briefcase,
  Building,
  Calendar,
  DollarSign,
  MessageSquare,
  Eye,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export default function FreelanceProjectsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Récupérer les informations du freelance
      const freelanceData = await getCurrentFreelance(user.id);

      // Récupérer les projets
      const projectsData = await getProjectsByFreelance(freelanceData.id);
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading projects:", error);
      showToast.error("Erreur lors du chargement des projets");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "FREELANCE") {
      router.push("/dashboard");
      return;
    }

    if (user) {
      loadProjects();
    }
  }, [user, isLoading, router, loadProjects]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getProjectStatus = (project: Project) => {
    const now = new Date();
    const startDate = new Date(project.startDate);
    const endDate = project.endDate ? new Date(project.endDate) : null;

    if (endDate && now > endDate) {
      return { label: "Terminé", variant: "secondary" as const };
    } else if (now >= startDate && (!endDate || now <= endDate)) {
      return { label: "En cours", variant: "default" as const };
    } else {
      return { label: "À venir", variant: "outline" as const };
    }
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
              Mes projets
            </h1>
            <p className="text-freehunt-black-two opacity-70">
              Consultez vos projets en cours et terminés
            </p>
          </div>
          <Button variant="outline" theme="secondary" asChild>
            <Link href="/dashboard/freelance">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-[30px] border border-freehunt-grey p-12 text-center">
            <Briefcase className="w-12 h-12 text-freehunt-black-two opacity-40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-freehunt-black-two mb-2">
              Aucun projet
            </h3>
            <p className="text-freehunt-black-two opacity-70 mb-4">
              Vous n&apos;avez pas encore de projets. Les projets sont créés
              automatiquement quand une entreprise accepte votre candidature.
            </p>
            <Button asChild>
              <Link href="/job-postings">Rechercher des offres</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const status = getProjectStatus(project);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-[30px] border border-freehunt-grey overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-freehunt-main/10 to-freehunt-main/5 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-xl lg:text-2xl font-bold text-freehunt-black-two mb-2">
                          {project.name}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-freehunt-black-two opacity-70 mb-2">
                          <span className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {project.jobPosting?.company?.name || "Entreprise"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Du {formatDate(project.startDate)}
                            {project.endDate &&
                              ` au ${formatDate(project.endDate)}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {project.amount}€
                          </span>
                        </div>
                        <p className="text-freehunt-black-two opacity-80 mb-2 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={
                            status.variant === "default"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : status.variant === "secondary"
                              ? "bg-gray-100 text-gray-800 border-gray-200"
                              : "bg-blue-100 text-blue-800 border-blue-200"
                          }
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        <span className="text-xs text-freehunt-black-two opacity-50">
                          Créé le {formatDate(project.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Informations de l'entreprise */}
                    {project.jobPosting?.company && (
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-freehunt-black-two mb-3">
                          Entreprise cliente
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-freehunt-black-two opacity-70">
                          <span>{project.jobPosting.company.name}</span>
                          <span>•</span>
                          <span>{project.jobPosting.company.address}</span>
                        </div>
                        {project.jobPosting.company.description && (
                          <p className="text-sm text-freehunt-black-two opacity-70 mt-3 line-clamp-2">
                            {project.jobPosting.company.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Compétences requises */}
                    {project.jobPosting?.skills &&
                      project.jobPosting.skills.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-freehunt-black-two mb-3">
                            Compétences utilisées
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.jobPosting.skills
                              .slice(0, 5)
                              .map((skill) => (
                                <Badge
                                  key={skill.id}
                                  className="bg-freehunt-main/10 text-freehunt-black-two border-freehunt-main/20"
                                >
                                  {skill.name}
                                </Badge>
                              ))}
                            {project.jobPosting.skills.length > 5 && (
                              <Badge className="bg-freehunt-main/10 text-freehunt-black-two border-freehunt-main/20">
                                +{project.jobPosting.skills.length - 5}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Actions */}
                    <div className="pt-6 border-t border-freehunt-grey flex items-center justify-between">
                      <div className="flex gap-3">
                        <Button variant="outline" theme="secondary" asChild>
                          <Link href={`/project/${project.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Voir le projet
                          </Link>
                        </Button>
                        {project.jobPosting && (
                          <Button variant="outline" theme="secondary" asChild>
                            <Link
                              href={`/job-postings/${project.jobPosting.id}`}
                            >
                              <Briefcase className="w-4 h-4 mr-1" />
                              Offre d&apos;origine
                            </Link>
                          </Button>
                        )}
                      </div>

                      {project.conversation && (
                        <Button asChild>
                          <Link
                            href={`/messages?conversationId=${project.conversationId}`}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Discussion
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
