"use client";

import { useEffect, useState } from "react";
import ProjectTimeline from "@/components/common/calendar/ProjectTimeline";
import Conversation from "@/components/common/conversation/conversation";
import { getCheckpoints, updateCheckpoint } from "@/actions/checkPoints";
import {
  Checkpoint,
  Conversation as ConversationInterface,
} from "@/lib/interfaces";
import CheckpointStats from "@/components/common/card/checkPointsStats";
import { Project } from "@/lib/interfaces";
import { getProject } from "@/actions/projects";
import {
  getConversationByProject,
  getUserPicture,
  joinConversationRoom,
  identifyUser,
} from "@/actions/conversations";
import { Document } from "@/lib/interfaces";
import { SocketProvider } from "@/hooks/useSocket";
import { getCurrentUser } from "@/actions/auth";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const projectId = params.id;
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "conversation">(
    "timeline",
  );

  // Check if the viewport is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const currentUserId = await getCurrentUser();
      setCurrentUserId(currentUserId);
    };
    fetchData();
  }, []);

  // Sample data with proper structure for the timeline component
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
    const fetchData = async () => {
      const project = await getProject(projectId);
      setProject(project);

      if (project) {
        const checkpoints = await getCheckpoints(project.jobPostingId);
        setCheckpoints(checkpoints);
        const conversation = await getConversationByProject(projectId);
        setConversation(conversation);
        const senderPicture = await getUserPicture(conversation.senderId);
        const receiverPicture = await getUserPicture(conversation.receiverId);

        // Déterminer quel avatar appartient à l'utilisateur actuel
        if (currentUserId === conversation.senderId) {
          setCurrentUserPicture(senderPicture);
          setOtherUserPicture(receiverPicture);
        } else {
          setCurrentUserPicture(receiverPicture);
          setOtherUserPicture(senderPicture);
        }

        // Join the conversation room
        if (conversation?.id && currentUserId) {
          identifyUser(currentUserId);
          joinConversationRoom(conversation.id);
        }
      }
    };

    fetchData();
  }, [projectId, currentUserId]);

  // Handle checkpoint click
  const handleCheckpointClick = async (checkpoint: Checkpoint) => {
    checkpoint.status = "DONE";
    await updateCheckpoint(checkpoint);

    // Mettre à jour la liste des checkpoints
    const updatedCheckpoints = checkpoints.map((cp) =>
      cp.id === checkpoint.id ? checkpoint : cp,
    );
    setCheckpoints(updatedCheckpoints);
  };

  // Mobile tabs toggle
  const tabButtonClass = (tab: "timeline" | "conversation") =>
    `flex-1 py-3 text-center font-medium text-sm border-b-2 ${
      activeTab === tab
        ? "border-freehunt-main text-freehunt-main"
        : "border-transparent text-gray-500 hover:text-gray-700"
    }`;

  return (
    <SocketProvider userId={currentUserId || ""}>
      <div className="flex w-full h-full p-2 md:p-4">
        <div className="flex w-full h-full flex-col items-start gap-2 md:gap-3">
          <div className="flex h-16 md:h-20 p-3 md:p-5 items-center md:items-start gap-2.5 self-stretch border-b border-gray-200">
            <h1 className="text-xl md:text-3xl font-bold truncate">
              Projet {project ? project.name : ""}
            </h1>
          </div>

          {/* Mobile Tabs */}
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
            {/* Timeline Section */}
            {(!isMobile || activeTab === "timeline") && (
              <div className="flex w-full md:w-2/3 flex-col items-start gap-2 md:gap-3">
                <div className="flex w-full flex-col items-start gap-2 md:gap-3 p-2 md:p-5">
                  <h1 className="text-lg md:text-2xl font-bold">Calendrier</h1>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[600px]">
                      <ProjectTimeline
                        checkpoints={checkpoints}
                        jobPostings={[]}
                        startDate={new Date().toISOString().split("T")[0]}
                        daysToShow={isMobile ? 7 : 14}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-start gap-2 md:gap-3 p-2 md:p-5">
                  <h1 className="text-lg md:text-2xl font-bold">
                    Statistiques
                  </h1>
                  <div className="w-full bg-gray-100 p-3 md:p-4 rounded">
                    <CheckpointStats checkpoints={checkpoints} />
                  </div>
                </div>
                <div className="flex w-full flex-col items-start gap-2 md:gap-3 p-2 md:p-5">
                  <h1 className="text-lg md:text-2xl font-bold">Checkpoints</h1>
                  <div className="w-full">
                    {checkpoints.map((checkpoint) => (
                      <div
                        key={checkpoint.id}
                        className="mb-2 p-2 md:p-3 border rounded bg-white flex flex-col md:flex-row md:justify-between md:items-start gap-2"
                      >
                        <div>
                          <div className="font-medium">{checkpoint.name}</div>
                          <div className="text-sm text-gray-600">
                            {checkpoint.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(checkpoint.date).toLocaleDateString(
                              "fr-FR",
                            )}
                            {checkpoint.status === "DONE" && (
                              <span className="text-sm text-green-500">
                                - Validé
                              </span>
                            )}
                            {checkpoint.status === "TODO" && (
                              <span className="text-sm text-red-500">
                                - Non validé
                              </span>
                            )}

                            {checkpoint.status === "IN_PROGRESS" && (
                              <span className="text-sm text-yellow-500">
                                - En cours
                              </span>
                            )}
                          </div>
                        </div>
                        {/* if checkpoint is not done, show the button */}
                        {checkpoint.status != "DONE" && (
                          <button
                            onClick={() => handleCheckpointClick(checkpoint)}
                            className="px-3 py-1.5 md:px-4 md:py-2 bg-freehunt-main text-white rounded-md hover:bg-freehunt-main/90 transition-colors duration-200 flex items-center gap-1 md:gap-2 text-sm font-medium shadow-sm cursor-pointer w-full md:w-auto justify-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Valider
                          </button>
                        )}

                        {/* if checkpoint is done, show the button */}
                        {checkpoint.status === "DONE" && (
                          <p className="text-sm text-green-500">
                            Checkpoint validé
                          </p>
                        )}
                      </div>
                    ))}

                    {checkpoints.length === 0 && (
                      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
                        Aucun checkpoint disponible
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Section */}
            {(!isMobile || activeTab === "conversation") && (
              <div className="flex w-full md:w-1/3 flex-col items-start gap-2 md:gap-3 h-full">
                <div className="flex w-full flex-col items-start gap-2 md:gap-3 p-2 md:p-5">
                  <h1 className="text-lg md:text-2xl font-bold">
                    Conversations
                  </h1>
                  <div className="w-full bg-gray-100 p-2 md:p-4 rounded">
                    {conversation ? (
                      <Conversation
                        conversation={conversation}
                        currentUserPicture={currentUserPicture}
                        otherUserPicture={otherUserPicture}
                      />
                    ) : (
                      <div className="p-4 text-center">
                        Chargement de la conversation...
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
