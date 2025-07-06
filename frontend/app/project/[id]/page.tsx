"use client";

import { getCurrentUser } from "@/actions/auth";
import { getCheckpoints, validateCheckpoint } from "@/actions/checkPoints";
import {
  getConversation,
  getUserPicture,
  identifyUser,
  joinConversationRoom,
} from "@/actions/conversations";
import { getProject } from "@/actions/projects";
import ProjectTimeline from "@/components/common/calendar/ProjectTimeline";
import CheckpointStats from "@/components/common/card/checkPointsStats";
import Conversation from "@/components/common/conversation/conversation";
import { SocketProvider } from "@/hooks/useSocket";
import {
  Checkpoint,
  Conversation as ConversationInterface,
  Document,
  Project,
} from "@/lib/interfaces";
import { useEffect, useState } from "react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "conversation">(
    "timeline",
  );

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setProjectId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return;
      }
      setCurrentUserId(currentUser.id);
    };
    fetchData();
  }, []);

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [conversation, setConversation] =
    useState<ConversationInterface | null>(null);
  const [currentUserPicture, setCurrentUserPicture] = useState<Document | null>(
    null,
  );
  const [otherUserPicture, setOtherUserPicture] = useState<Document | null>(
    null,
  );

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      const project = await getProject(projectId);
      setProject(project);

      if (project) {
        const checkpoints = await getCheckpoints(project.jobPostingId);
        setCheckpoints(checkpoints);
        const conversation = await getConversation(project.conversationId);
        setConversation(conversation);
        const senderPicture = await getUserPicture(conversation.senderId);
        const receiverPicture = await getUserPicture(conversation.receiverId);

        if (currentUserId === conversation.senderId) {
          setCurrentUserPicture(senderPicture);
          setOtherUserPicture(receiverPicture);
        } else {
          setCurrentUserPicture(receiverPicture);
          setOtherUserPicture(senderPicture);
        }

        if (conversation?.id && currentUserId) {
          identifyUser(currentUserId);
          joinConversationRoom(conversation.id);
        }
      }
    };

    fetchData();
  }, [projectId, currentUserId]);

  const handleCheckpointClick = async (checkpoint: Checkpoint) => {
    if (!currentUserId) {
      console.error('User ID not available');
      alert('Erreur: Utilisateur non identifié');
      return;
    }

    try {
      // Utiliser la nouvelle API de validation
      const updatedCheckpoint = await validateCheckpoint(checkpoint.id, currentUserId);
      
      // Mettre à jour l'état local avec le checkpoint modifié
      const updatedCheckpoints = checkpoints.map((cp) =>
        cp.id === checkpoint.id ? { ...cp, ...updatedCheckpoint } : cp,
      );
      setCheckpoints(updatedCheckpoints);
      
      console.log('Checkpoint validé avec succès:', updatedCheckpoint);
      
      // Notification de succès
      if (updatedCheckpoint.status === 'PENDING_COMPANY_APPROVAL') {
        alert('Checkpoint soumis pour validation par l\'entreprise');
      } else if (updatedCheckpoint.status === 'DONE') {
        alert('Checkpoint validé avec succès !');
      }
      
    } catch (error: unknown) {
      console.error('Erreur lors de la validation du checkpoint:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la validation du checkpoint';
      alert(`Erreur lors de la validation: ${errorMessage}`);
    }
  };

  const tabButtonClass = (tab: "timeline" | "conversation") =>
    `flex-1 py-3 text-center font-medium text-sm border-b-2 ${
      activeTab === tab
        ? "border-freehunt-main text-freehunt-main"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`;

  if (!projectId) {
    return (
      <div className="flex w-full h-full p-2 md:p-4 items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <SocketProvider userId={currentUserId || ""}>
      <div className="flex w-full h-full p-2 md:p-4">
        <div className="flex w-full h-full flex-col items-start gap-2 md:gap-3">
          <div className="flex h-16 md:h-20 p-3 md:p-5 items-center md:items-start gap-2.5 self-stretch bg-gradient-to-r from-freehunt-main to-freehunt-main/90 text-white rounded-lg shadow-lg mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold">
                  {project ? project.name : "Chargement..."}
                </h1>
                {project && (
                  <p className="text-white/80 text-sm md:text-base">
                    Projet géré avec FreeHunt
                  </p>
                )}
              </div>
            </div>
          </div>

          {isMobile && (
            <div className="flex w-full border-b border-gray-200">
              <button
                className={tabButtonClass("timeline")}
                onClick={() => setActiveTab("timeline")}
              >
                Calendrier & Checkpoints
              </button>
              <button
                className={tabButtonClass("conversation")}
                onClick={() => setActiveTab("conversation")}
              >
                Conversation
              </button>
            </div>
          )}

          <div className="flex w-full h-full flex-col md:flex-row items-start gap-2 md:gap-3">
            {(!isMobile || activeTab === "timeline") && (
              <div className="flex w-full md:w-2/3 flex-col items-start gap-2 md:gap-3">
                <div className="flex w-full flex-col items-start gap-2 md:gap-3 p-2 md:p-5 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-freehunt-main to-freehunt-main/90 rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                      Calendrier du projet
                    </h1>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[600px] bg-gray-50 rounded-lg p-4">
                      <ProjectTimeline
                        checkpoints={checkpoints}
                        jobPostings={[]}
                        daysToShow={isMobile ? 7 : 30}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-start gap-2 md:gap-3 p-2 md:p-5 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                      </svg>
                    </div>
                    <h1 className="text-lg md:text-2xl font-bold text-foreground">
                      Statistiques du projet
                    </h1>
                  </div>
                  <div className="w-full bg-muted p-4 rounded-lg border border-border">
                    <CheckpointStats checkpoints={checkpoints} />
                  </div>
                </div>
                <div className="flex w-full flex-col items-start gap-2 md:gap-3 p-2 md:p-5 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h1 className="text-lg md:text-2xl font-bold text-foreground">
                      Liste des checkpoints
                    </h1>
                    <div className="ml-auto">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary">
                        {checkpoints.length} checkpoint
                        {checkpoints.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="w-full space-y-4">
                    {checkpoints.map((checkpoint) => (
                      <div
                        key={checkpoint.id}
                        className="p-4 md:p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          {/* Informations principales */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold text-foreground">
                                {checkpoint.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                {/* Badge de statut */}
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                    checkpoint.status === "DONE"
                                      ? "bg-green-100 text-green-800"
                                      : checkpoint.status === "IN_PROGRESS"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {checkpoint.status === "DONE" && (
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                  {checkpoint.status === "IN_PROGRESS" && (
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                  {checkpoint.status === "TODO" && (
                                    <svg
                                      className="w-3 h-3 mr-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                  {checkpoint.status === "DONE"
                                    ? "Terminé"
                                    : checkpoint.status === "IN_PROGRESS"
                                    ? "En cours"
                                    : "À faire"}
                                </span>
                              </div>
                            </div>

                            {/* Description */}
                            {checkpoint.description && (
                              <p className="text-gray-600 mb-3 leading-relaxed">
                                {checkpoint.description}
                              </p>
                            )}

                            {/* Détails (Date et montant) */}
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center text-gray-500">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">
                                  Date d&apos;échéance:
                                </span>
                                <span className="ml-1">
                                  {new Date(checkpoint.date).toLocaleDateString(
                                    "fr-FR",
                                    {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center text-gray-500">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-medium">Montant:</span>
                                <span className="ml-1 font-semibold text-gray-900">
                                  {checkpoint.amount?.toLocaleString("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                  }) || "Non défini"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end gap-2">
                            {checkpoint.status !== "DONE" ? (
                              <button
                                onClick={() =>
                                  handleCheckpointClick(checkpoint)
                                }
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-freehunt-main to-freehunt-main/90 text-white rounded-lg hover:from-freehunt-main/90 hover:to-freehunt-main/80 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm min-w-[120px] justify-center"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Valider
                              </button>
                            ) : (
                              <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Validé
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {checkpoints.length === 0 && (
                      <div className="p-8 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <svg
                          className="w-12 h-12 mx-auto text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucun checkpoint
                        </h3>
                        <p className="text-gray-500">
                          Aucun checkpoint n&apos;a été défini pour ce projet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {(!isMobile || activeTab === "conversation") && (
              <div className="flex w-full md:w-1/3 flex-col items-start gap-2 md:gap-3 h-full">
                <div className="flex w-full flex-col items-start gap-2 md:gap-3 p-2 md:p-5 bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-600 rounded-lg">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                      Conversation
                    </h1>
                  </div>
                  <div className="w-full bg-muted p-3 md:p-4 rounded-lg border border-border flex-1">
                    {conversation ? (
                      <Conversation
                        conversation={conversation}
                        currentUserPicture={currentUserPicture}
                        otherUserPicture={otherUserPicture}
                      />
                    ) : (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                        <p className="text-gray-500">
                          Chargement de la conversation...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SocketProvider>
  );
}
