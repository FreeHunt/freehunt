import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "@/lib/interfaces";

export const useSocket = (
  conversationId: string,
  onNewMessage: (message: Message) => void,
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connexion au serveur WebSocket
    socketRef.current = io("http://localhost:3001");

    // Rejoindre la room de la conversation
    socketRef.current.emit("joinRoom", { roomId: conversationId });

    // Écouter les nouveaux messages
    socketRef.current.on("newMessage", (message: Message) => {
      if (message.conversationId === conversationId) {
        onNewMessage(message);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leaveRoom", { roomId: conversationId });
        socketRef.current.disconnect();
      }
    };
  }, [conversationId, onNewMessage]);

  return socketRef.current;
};
