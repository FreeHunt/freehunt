"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, X, Send, Paperclip } from "lucide-react";
import Image from "next/image";
import {
  getMessagesByConversation,
  sendMessage,
} from "@/actions/conversations";
import { getCurrentUser } from "@/actions/auth";
import { io } from "socket.io-client";

export default function ConversationComponent({
  conversation,
  senderPicture,
  receiverPicture,
}) {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

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
        setMessages((prevMessages) => {
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
        socketRef.current.emit("leaveRoom", { roomId: conversation.id });
      }
      socketRef.current.disconnect();
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

      await sendMessage(messageToSend);
      // Socket will handle the state update, but let's clear the input
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format the timestamp for messages
  const formatMessageTime = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to determine if a message is from the current user
  const isCurrentUserMessage = (msg) => {
    // Vérifier si l'utilisateur actuel est soit l'expéditeur soit le destinataire
    return msg.senderId === user?.id;
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        Chargement des messages...
      </div>
    );
  }

  return (
    <div className="relative">
      {expanded ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl flex flex-col w-2/3 h-3/4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={senderPicture?.url || "/images/default-avatar.png"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
                <span className="font-medium">Conversation</span>
              </div>
              <button
                onClick={toggleExpand}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages with scroll */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {/* Date Divider */}
              <div className="flex items-center justify-center my-4">
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                <span className="px-4 py-1 bg-gray-100 text-gray-600 text-sm rounded-full mx-2">
                  Aujourd&apos;hui
                </span>
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
              </div>

              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-gray-500">
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
                        <div className="flex items-end space-x-2">
                          <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-gray-500 mt-1 text-right">
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                receiverPicture?.url ||
                                "/images/default-avatar.png"
                              }
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end space-x-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                senderPicture?.url ||
                                "/images/default-avatar.png"
                              }
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatMessageTime(msg.createdAt)}
                            </p>
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
            <div className="flex items-center p-3 border-t">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-grow px-3 py-2 outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={!message.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="flex flex-col rounded-lg shadow-lg bg-white overflow-hidden w-full h-[745px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={senderPicture?.url || "/images/default-avatar.png"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Conversation</span>
                </div>
              </div>
              <button
                onClick={toggleExpand}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Agrandir"
              >
                <ArrowUpRight size={20} />
              </button>
            </div>

            {/* Messages (mini version with scroll) */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {/* Date Divider */}
              <div className="flex items-center justify-center my-4">
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
                <span className="px-4 py-1 bg-gray-100 text-gray-600 text-sm rounded-full mx-2">
                  Aujourd&apos;hui
                </span>
                <div className="h-px bg-gray-200 flex-grow max-w-xs"></div>
              </div>

              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-gray-500">
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
                        <div className="flex items-end space-x-2">
                          <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-gray-500 mt-1 text-right">
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                receiverPicture?.url ||
                                "/images/default-avatar.png"
                              }
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end space-x-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                senderPicture?.url ||
                                "/images/default-avatar.png"
                              }
                              alt="Avatar"
                              className="w-full h-full object-cover"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="bg-gray-200 rounded-2xl py-2 px-4 max-w-xs">
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatMessageTime(msg.createdAt)}
                            </p>
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
            <div className="flex items-center p-3 border-t">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-grow px-3 py-2 outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 text-gray-500 hover:text-gray-700"
                disabled={!message.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
