"use client";

import { useEffect, useState } from "react";
import ProjectTimeline from "@/components/common/calendar/ProjectTimeline";
import Conversation from "@/components/common/conversation/conversation";
import { getCheckpoints } from "@/actions/checkPoints";
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
  const [senderPicture, setSenderPicture] = useState<Document | null>(null);
  const [receiverPicture, setReceiverPicture] = useState<Document | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const project = await getProject(projectId);
      setProject(project);

      if (project) {
        const checkpoints = await getCheckpoints(project.jobPostingId);
        setCheckpoints(checkpoints);
        const conversation = await getConversationByProject(projectId);
        console.log("Conversation récupérée:", conversation);
        setConversation(conversation);
        const senderPicture = await getUserPicture(conversation.senderId);
        const receiverPicture = await getUserPicture(conversation.receiverId);

        setSenderPicture(senderPicture);
        setReceiverPicture(receiverPicture);

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
  const handleCheckpointClick = (checkpoint: Checkpoint) => {
    console.log("Checkpoint clicked:", checkpoint);
    // Add your logic here
  };

  return (
    <SocketProvider userId={currentUserId}>
      <div className="flex w-full h-full p-4">
        <div className="flex w-full h-full flex-col items-start gap-3">
          <div className="flex h-20 p-5 items-start gap-2.5 self-stretch border-b border-gray-200">
            <h1 className="text-3xl font-bold">
              Projet {project ? project.name : ""}
            </h1>
          </div>
          <div className="flex w-full h-full items-start gap-3">
            <div className="flex w-2/3 flex-col items-start gap-3">
              <div className="flex w-full flex-col items-start gap-3 p-5">
                <h1 className="text-2xl font-bold">Calendrier</h1>
                <ProjectTimeline
                  checkpoints={checkpoints}
                  jobPostings={[]}
                  startDate={new Date().toISOString().split("T")[0]}
                  daysToShow={14}
                  onCheckpointClick={handleCheckpointClick}
                />
              </div>
              <div className="flex w-full flex-col items-start gap-3 p-5">
                <h1 className="text-2xl font-bold">Statistiques</h1>
                {/* Add your statistics components here */}
                <div className="w-full bg-gray-100 p-4 rounded">
                  <CheckpointStats checkpoints={checkpoints} />
                </div>
              </div>
              <div className="flex w-full flex-col items-start gap-3 p-5">
                <h1 className="text-2xl font-bold">Checkpoints</h1>
                {/* Simple checkpoint list */}
                <div className="w-full">
                  {checkpoints.map((checkpoint) => (
                    <div
                      key={checkpoint.id}
                      className="mb-2 p-3 border rounded bg-white"
                    >
                      <div className="font-medium">{checkpoint.name}</div>
                      <div className="text-sm text-gray-600">
                        {checkpoint.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(checkpoint.date).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex w-1/3 flex-col items-start gap-3 h-full">
              <div className="flex w-full flex-col items-start gap-3 p-5">
                <h1 className="text-2xl font-bold">Conversations</h1>
                <div className="w-full bg-gray-100 p-4 rounded">
                  {conversation ? (
                    <Conversation
                      conversation={conversation}
                      senderPicture={senderPicture || null}
                      receiverPicture={receiverPicture || null}
                    />
                  ) : (
                    <div>Chargement de la conversation...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
}
