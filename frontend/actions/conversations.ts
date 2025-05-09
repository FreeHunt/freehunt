import { api } from "@/lib/api";
import { Message } from "@/lib/interfaces";

export const getConversationByProject = async (projectId: string) => {
  const response = await api.get(`/conversations/project/${projectId}`);
  return response.data;
};

export const getMessagesByConversation = async (conversationId: string) => {
  const response = await api.get(`/messages/conversation/${conversationId}`);
  return response.data;
};

export const sendMessage = async (message: Message) => {
  const response = await api.post(`/messages/`, {
    content: message.content,
    senderId: message.senderId,
    receiverId: message.receiverId,
    conversationId: message.conversationId,
    documentId: message.documentId,
  });

  // Le backend émettra automatiquement l'événement 'newMessage' via le ChatService
  return response.data;
};

export const getUserPicture = async (userId: string) => {
  const response = await api.get(`/documents/user/${userId}`);
  return response.data;
};
