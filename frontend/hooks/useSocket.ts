"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define interface for context
interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (message: string) => void;
  setTyping: (data: { roomId: string; isTyping: boolean }) => void;
}

// Create context with type
const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
}> = ({ children, userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection with environment variable
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const socketInstance = io(socketUrl, {
      withCredentials: true,
    });

    // Set up event listeners
    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);

      // Identify user to server
      if (userId) {
        socketInstance.emit("identifyUser", { userId });
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setConnected(false);
    });

    // Store socket instance
    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  // Define value with correct type
  const value: SocketContextType = {
    socket,
    connected,
    joinRoom: (roomId: string) => {
      if (socket && connected) {
        socket.emit("joinRoom", { roomId });
      }
    },
    leaveRoom: (roomId: string) => {
      if (socket && connected) {
        socket.emit("leaveRoom", { roomId });
      }
    },
    sendMessage: (message: string) => {
      if (socket && connected) {
        socket.emit("newMessage", { message });
      }
    },
    setTyping: (data: { roomId: string; isTyping: boolean }) => {
      if (socket && connected) {
        socket.emit("typing", data);
      }
    },
  };

  return React.createElement(SocketContext.Provider, { value }, children);
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketProvider;
