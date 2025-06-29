"use client";

import { useEffect, useState } from "react";
import { User, MessageCircle, Briefcase, Search } from "lucide-react";
import Image from "next/image";
import Conversation from "@/components/common/conversation/conversation";
import {
  getUserConversations,
  getUserPicture,
  getConversation,
} from "@/actions/conversations";
import { getCurrentUser } from "@/actions/auth";
import {
  Conversation as ConversationInterface,
  User as UserInterface,
  Document,
  Project,
} from "@/lib/interfaces";
import { SocketProvider } from "@/hooks/useSocket";

type ConversationType = "all" | "project" | "normal";

interface ConversationWithDetails extends ConversationInterface {
  otherUser?: UserInterface;
  otherUserPicture?: Document;
  project?: Project;
  lastMessage?: {
    content: string;
    createdAt: string;
    senderId: string;
  };
}

export default function ConversationsPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationWithDetails[]>(
    [],
  );
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationWithDetails[]
  >([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationWithDetails | null>(null);
  const [currentUserPicture, setCurrentUserPicture] = useState<Document | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState<ConversationType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile viewport
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUserId(user.id);
          const userPicture = await getUserPicture(user.id);
          setCurrentUserPicture(userPicture);
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch conversations
  useEffect(() => {
    if (!currentUserId) return;

    const fetchConversations = async () => {
      setLoading(true);
      try {
        const userConversations = await getUserConversations(currentUserId);

        // Enrich conversations with additional data
        const enrichedConversations = await Promise.all(
          userConversations.map(async (conv: ConversationInterface) => {
            const otherUserId =
              conv.senderId === currentUserId ? conv.receiverId : conv.senderId;
            const otherUserPicture = await getUserPicture(otherUserId);

            // Récupérer le dernier message
            const lastMessage =
              conv.messages && conv.messages.length > 0
                ? conv.messages[conv.messages.length - 1]
                : null;

            // Vous pouvez aussi implémenter getUserById si nécessaire
            // const otherUser = await getUserById(otherUserId);

            return {
              ...conv,
              otherUserPicture,
              // otherUser,
              lastMessage: lastMessage
                ? {
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt,
                    senderId: lastMessage.senderId,
                  }
                : undefined,
              // Le projet est déjà inclus dans les données du backend
              projectId: conv.projectId || null,
            } as ConversationWithDetails;
          }),
        );

        setConversations(enrichedConversations);
        setFilteredConversations(enrichedConversations);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUserId]);

  // Filter conversations
  useEffect(() => {
    let filtered = conversations;

    // Filter by type
    switch (activeFilter) {
      case "project":
        // Filtrer les conversations qui ont un projet associé
        filtered = conversations.filter(
          (conv) => conv.project || conv.projectId,
        );
        break;
      case "normal":
        // Filtrer les conversations qui n'ont pas de projet associé
        filtered = conversations.filter(
          (conv) => !conv.project && !conv.projectId,
        );
        break;
      default:
        filtered = conversations;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((conv) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          // Recherche dans le contenu du dernier message
          conv.lastMessage?.content?.toLowerCase().includes(searchLower) ||
          // Recherche dans le nom du projet si présent
          conv.project?.name?.toLowerCase().includes(searchLower) ||
          // Recherche dans le nom de l'autre utilisateur si présent
          conv.otherUser?.username?.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredConversations(filtered);
  }, [conversations, activeFilter, searchQuery]);

  const handleConversationSelect = async (
    conversation: ConversationWithDetails,
  ) => {
    try {
      // Fetch full conversation details if needed
      const fullConversation = await getConversation(conversation.id);
      setSelectedConversation({
        ...conversation,
        ...fullConversation,
      });
    } catch (error) {
      console.error("Failed to fetch conversation details:", error);
      setSelectedConversation(conversation);
    }
  };

  const getFilterButtonClass = (filter: ConversationType) => {
    return `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      activeFilter === filter
        ? "bg-freehunt-main text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;
  };

  const formatLastMessageTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { day: "numeric", month: "short" });
    }
  };

  const getProjectConversationsCount = () => {
    return conversations.filter((c) => c.project || c.projectId).length;
  };

  const getNormalConversationsCount = () => {
    return conversations.filter((c) => !c.project && !c.projectId).length;
  };

  if (loading) {
    return (
      <div className="flex w-full h-full p-2 md:p-4 items-center justify-center">
        <div>Chargement des conversations...</div>
      </div>
    );
  }

  return (
    <SocketProvider userId={currentUserId || ""}>
      <div className="flex w-full h-full p-2 md:p-4">
        <div className="flex w-full h-full flex-col items-start gap-2 md:gap-3">
          {/* Header */}
          <div className="flex h-16 md:h-20 p-3 md:p-5 items-center justify-between self-stretch border-b border-gray-200">
            <h1 className="text-xl md:text-3xl font-bold">Conversations</h1>
          </div>

          <div className="flex w-full h-full gap-2 md:gap-4">
            {/* Conversations List */}
            <div
              className={`${
                isMobile && selectedConversation ? "hidden" : "flex"
              } ${isMobile ? "w-full" : "w-1/3"} flex-col gap-3`}
            >
              {/* Filters */}
              <div className="flex flex-wrap gap-2 p-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={getFilterButtonClass("all")}
                >
                  <MessageCircle size={16} />
                  Toutes ({conversations.length})
                </button>
                <button
                  onClick={() => setActiveFilter("project")}
                  className={getFilterButtonClass("project")}
                >
                  <Briefcase size={16} />
                  Projets ({getProjectConversationsCount()})
                </button>
                <button
                  onClick={() => setActiveFilter("normal")}
                  className={getFilterButtonClass("normal")}
                >
                  <User size={16} />
                  Normales ({getNormalConversationsCount()})
                </button>
              </div>

              {/* Search */}
              <div className="relative p-2">
                <Search
                  className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-freehunt-main focus:border-transparent"
                />
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto space-y-2 p-2">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                    <MessageCircle size={48} className="mb-4 opacity-50" />
                    <p className="text-center">
                      {searchQuery
                        ? "Aucune conversation trouvée"
                        : "Aucune conversation"}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id
                          ? "bg-freehunt-main/10 border-freehunt-main"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              conversation.otherUserPicture?.url ||
                              "/images/default-avatar.png"
                            }
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={48}
                            height={48}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">
                                {conversation.otherUser?.username ||
                                  "Utilisateur"}{" "}
                              </span>
                              {conversation.projectId && (
                                <Briefcase
                                  size={12}
                                  className="text-freehunt-main flex-shrink-0"
                                />
                              )}
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatLastMessageTime(
                                conversation.lastMessage?.createdAt,
                              )}
                            </span>
                          </div>

                          {conversation.project && (
                            <p className="text-xs text-freehunt-main mb-1 truncate">
                              Projet: {conversation.project.name}
                            </p>
                          )}

                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage?.content ||
                              "Aucun message"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Conversation View */}
            <div
              className={`${
                isMobile && !selectedConversation ? "hidden" : "flex"
              } ${isMobile ? "w-full" : "w-2/3"} flex-col`}
            >
              {selectedConversation ? (
                <div className="flex flex-col h-full">
                  {/* Mobile back button */}
                  {isMobile && (
                    <div className="flex items-center p-3 border-b border-gray-200">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="mr-3 p-2 rounded-full hover:bg-gray-100"
                      >
                        ←
                      </button>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={
                              selectedConversation.otherUserPicture?.url ||
                              "/images/default-avatar.png"
                            }
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div>
                          <span className="font-medium text-sm">
                            {selectedConversation.otherUser?.username ||
                              "Utilisateur"}
                          </span>
                          {selectedConversation.project && (
                            <p className="text-xs text-freehunt-main">
                              {selectedConversation.project.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <Conversation
                      conversation={selectedConversation}
                      currentUserPicture={currentUserPicture}
                      otherUserPicture={
                        selectedConversation.otherUserPicture || null
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <MessageCircle size={64} className="mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-center">
                    Choisissez une conversation dans la liste pour commencer à
                    discuter
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
}
