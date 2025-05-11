import { api } from "@/lib/api";
import { Message } from "@/lib/interfaces";
import { io } from "socket.io-client";

// Socket.io client singleton
let socket;

// Initialize socket connection
export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3001");
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

export const getConversationByProject = async (projectId) => {
  const response = await api.get(`/conversations/project/${projectId}`);
  return response.data;
};

export const getMessagesByConversation = async (conversationId) => {
  const response = await api.get(`/messages/conversation/${conversationId}`);
  return response.data;
};

export const sendMessage = async (message) => {
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

export const joinConversationRoom = (conversationId) => {
  const socket = getSocket();
  socket.emit("joinRoom", { roomId: conversationId });
};

export const leaveConversationRoom = (conversationId) => {
  const socket = getSocket();
  socket.emit("leaveRoom", { roomId: conversationId });
};

export const identifyUser = (userId) => {
  const socket = getSocket();
  socket.emit("identifyUser", { userId });
};

export const setTypingStatus = (conversationId, userId, isTyping) => {
  const socket = getSocket();
  socket.emit("typing", { conversationId, userId, isTyping });
};

export const getUserPicture = async (userId) => {
  const response = await api.get(`/documents/user/${userId}`);
  return response.data;
};
