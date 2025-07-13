"use client";

import { api } from "@/lib/api";
import { Message } from "@/lib/interfaces";
import { io, Socket } from "socket.io-client";

// Socket.io client singleton
let socket: Socket | null = null;

// Initialize socket connection
export const initializeSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      withCredentials: true,
    });
    console.log("Socket connection initialized");
  }
  return socket;
};

// Get socket instance
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};
export const getConversation = async (conversationId: string) => {
  const response = await api.get(`/conversations/${conversationId}`);
  return response.data;
};

export const getConversationByProject = async (projectId: string) => {
  const response = await api.get(`/conversations/project/${projectId}`);
  return response.data;
};
export const getUserConversations = async (userId: string) => {
  const response = await api.get(`/conversations/user/${userId}`);
  return response.data;
};

export const getMessagesByConversation = async (conversationId: string) => {
  const response = await api.get(`/messages/conversation/${conversationId}`);
  return response.data;
};

export const sendMessage = async (message: Message) => {
  try {
    // Send message to server through API
    const response = await api.post(`/messages/`, {
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      conversationId: message.conversationId,
      documentId: message.documentId || null,
    });

    // Emit message via socket for real-time update
    const socket = getSocket();
    socket.emit("newMessage", { message: response.data });

    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const joinConversationRoom = (conversationId: string) => {
  const socket = getSocket();
  socket.emit("joinRoom", { roomId: conversationId });
};

export const leaveConversationRoom = (conversationId: string) => {
  const socket = getSocket();
  socket.emit("leaveRoom", { roomId: conversationId });
};

export const identifyUser = (userId: string) => {
  const socket = getSocket();
  socket.emit("identifyUser", { userId });
};

export const setTypingStatus = (
  conversationId: string,
  userId: string,
  isTyping: boolean,
) => {
  const socket = getSocket();
  socket.emit("typing", { conversationId, userId, isTyping });
};

export const getUserPicture = async (userId: string) => {
  const response = await api.get(`/documents/user/${userId}`);
  return response.data;
};

// Nouvelle fonction pour créer ou trouver une conversation
export const findOrCreateConversation = async (
  senderId: string,
  receiverId: string,
  projectId?: string,
) => {
  try {
    const response = await api.post("/conversations/find-or-create", {
      senderId,
      receiverId,
      projectId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating/finding conversation:", error);
    throw error;
  }
};

export const createConversation = async (
  senderId: string,
  receiverId: string,
  projectId?: string,
) => {
  try {
    const response = await api.post("/conversations", {
      senderId,
      receiverId,
      projectId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};
