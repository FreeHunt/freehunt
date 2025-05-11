"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, X, Send, Paperclip } from "lucide-react";
import Image from "next/image";
import {
  getMessagesByConversation,
  sendMessage,
} from "@/actions/conversations";
import { getCurrentUser } from "@/actions/auth";
import { io, Socket } from "socket.io-client";
import { Conversation, Message, User, Document } from "@/lib/interfaces";

export default function ConversationComponent({
  conversation,
  currentUserPicture,
  otherUserPicture,
}: {
  conversation: Conversation;
  currentUserPicture: Document | null;
  otherUserPicture: Document | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // Connect to socket when component mounts
  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
    );

    // Join conversation room
    if (conversation?.id) {
      socketRef.current.emit("joinRoom", { roomId: conversation.id });
    }

    // Listen for new messages
    socketRef.current.on("newMessage", (message) => {
      if (message.conversationId === conversation?.id) {
        setMessages((prevMessages: Message[]) => {
          // Vérifier si le message existe déjà
          const messageExists = prevMessages.some(
            (msg) => msg.id === message.id,
          );
          if (messageExists) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      }
    });

    // Cleanup on unmount
    return () => {
      if (conversation?.id) {
        socketRef.current?.emit("leaveRoom", { roomId: conversation.id });
      }
      socketRef.current?.disconnect();
    };
  }, [conversation?.id]);

  // Fetch initial messages and current user
  useEffect(() => {
    const fetchMessages = async () => {
      if (conversation?.id) {
        setLoading(true);
        try {
          const data = await getMessagesByConversation(conversation.id);
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchMessages();
    fetchUser();
  }, [conversation?.id]);

  // Scroll to bottom when messages change or when view is expanded
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, expanded]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversation) return;

    try {
      const messageToSend = {
        content: message,
        senderId: user?.id || conversation.senderId,
        receiverId: conversation.receiverId,
        conversationId: conversation.id,
      };

      await sendMessage(messageToSend as Message);
      // Socket will handle the state update, but let's clear the input
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format the timestamp for messages
  const formatMessageTime = (dateString: string) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to determine if a message is from the current user
  const isCurrentUserMessage = (msg: Message) => {
    console.log(msg.senderId, user?.id);
    return msg.senderId === user?.id; // Doit correspondre à currentUserId
  };

  // Get the appropriate avatar based on who sent the message
  const getCurrentUserAvatar = () =>
    currentUserPicture?.url || "/images/default-avatar.png";
  const getOtherUserAvatar = () =>
    otherUserPicture?.url || "/images/default-avatar.png";

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        Chargement des messages...
      </div>
    );
  }

  // On mobile, always use full height version but in a fixed modal style when expanded
  // For desktop, keep the original approach with expanded/collapsed states

  return (
    <div className="relative">
      {expanded ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-lg shadow-xl flex flex-col ${
              isMobile ? "w-full h-full" : "w-2/3 h-3/4 max-w-4xl"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                  <Image
                    src={getOtherUserAvatar()}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
                <span className="font-medium text-sm md:text-base">
                  Conversation
                </span>
              </div>
              <button
                onClick={toggleExpand}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X size={isMobile ? 18 : 20} />
              </button>
            </div>

            {/* Messages with scroll */}
            <div className="flex-grow overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4">
              {/* Date Divider */}
              <div className="flex items-center justify-center my-2 md:my-4">
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs md:text-sm rounded-full mx-2">
                  Aujourd&apos;hui
                </span>
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
              </div>

              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-gray-500 text-sm md:text-base">
                  Aucun message dans cette conversation
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id}>
                    <div
                      className={`flex ${
                        isCurrentUserMessage(msg)
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!isCurrentUserMessage(msg) ? (
                        <div className="flex items-end space-x-1 md:space-x-2">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={getOtherUserAvatar()}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              width={32}
                              height={32}
                            />
                          </div>
                          <div className="bg-gray-200 rounded-2xl py-1.5 md:py-2 px-3 md:px-4 max-w-[75vw] md:max-w-xs">
                            <p className="text-xs md:text-sm">{msg.content}</p>
                            <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 text-right">
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end space-x-1 md:space-x-2">
                          <div className="bg-blue-500 text-white rounded-2xl py-1.5 md:py-2 px-3 md:px-4 max-w-[75vw] md:max-w-xs">
                            <p className="text-xs md:text-sm">{msg.content}</p>
                            <p className="text-[10px] md:text-xs text-blue-100 mt-0.5 md:mt-1">
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={getCurrentUserAvatar()}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              width={32}
                              height={32}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Invisible element for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex items-center p-2 md:p-3 border-t">
              <button
                type="button"
                className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
              >
                <Paperclip size={isMobile ? 18 : 20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-grow px-2 md:px-3 py-1.5 md:py-2 outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
                disabled={!message.trim()}
              >
                <Send size={isMobile ? 18 : 20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex flex-col rounded-lg shadow-lg bg-white overflow-hidden w-full h-[300px] md:h-[745px]">
            {/* Header */}
            <div className="flex items-center justify-between p-3 md:p-4 border-b">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden">
                  <Image
                    src={otherUserPicture?.url || "/images/default-avatar.png"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
              </div>
              <button
                onClick={toggleExpand}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Agrandir"
              >
                <ArrowUpRight size={isMobile ? 18 : 20} />
              </button>
            </div>

            {/* Messages (mini version with scroll) */}
            <div className="flex-grow overflow-y-auto p-2 md:p-4 space-y-3 md:space-y-4">
              {/* Date Divider */}
              <div className="flex items-center justify-center my-2 md:my-4">
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs md:text-sm rounded-full mx-2">
                  Aujourd&apos;hui
                </span>
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
              </div>

              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-gray-500 text-sm md:text-base">
                  Aucun message dans cette conversation
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id}>
                    <div
                      className={`flex ${
                        isCurrentUserMessage(msg)
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {!isCurrentUserMessage(msg) ? (
                        <div className="flex items-end space-x-1 md:space-x-2">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={getOtherUserAvatar()}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              width={32}
                              height={32}
                            />
                          </div>
                          <div className="bg-gray-200 rounded-2xl py-1.5 md:py-2 px-3 md:px-4 max-w-[75vw] md:max-w-xs">
                            <p className="text-xs md:text-sm">{msg.content}</p>
                            <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 text-right">
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end space-x-1 md:space-x-2">
                          <div className="bg-blue-500 text-white rounded-2xl py-1.5 md:py-2 px-3 md:px-4 max-w-[75vw] md:max-w-xs">
                            <p className="text-xs md:text-sm">{msg.content}</p>
                            <p className="text-[10px] md:text-xs text-blue-100 mt-0.5 md:mt-1">
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={getCurrentUserAvatar()}
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              width={32}
                              height={32}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Invisible element for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex items-center p-2 md:p-3 border-t">
              <button
                type="button"
                className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
              >
                <Paperclip size={isMobile ? 18 : 20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-grow px-2 md:px-3 py-1.5 md:py-2 outline-none text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700"
                disabled={!message.trim()}
              >
                <Send size={isMobile ? 18 : 20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
