"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Button as FreeHuntButton } from "@/components/common/button";
import { findOrCreateConversation } from "@/actions/conversations";
import { showToast } from "@/lib/toast";

interface ContactUserButtonProps {
  currentUserId: string;
  targetUserId: string;
  targetUserName?: string;
  projectId?: string;
  buttonText?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  theme?: "primary" | "secondary";
  className?: string;
  size?: "sm" | "default" | "lg";
  fullWidth?: boolean;
}

export default function ContactUserButton({
  currentUserId,
  targetUserId,
  targetUserName,
  projectId,
  buttonText,
  variant = "default",
  theme = "primary",
  className = "",
  size = "default",
  fullWidth = false,
}: ContactUserButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContact = async () => {
    if (!currentUserId) {
      showToast.error("Vous devez être connecté pour contacter un utilisateur.");
      router.push("/login");
      return;
    }

    if (currentUserId === targetUserId) {
      showToast.error("Vous ne pouvez pas vous contacter vous-même.");
      return;
    }

    setIsLoading(true);

    try {
      const conversation = await findOrCreateConversation(
        currentUserId,
        targetUserId,
        projectId,
      );

      if (conversation) {
        // Rediriger vers la page de conversation individuelle qui va rediriger vers la liste avec sélection
        router.push(`/conversations/${conversation.id}`);
        
        const message = projectId 
          ? `Conversation du projet ouverte${targetUserName ? ` avec ${targetUserName}` : ""}`
          : `Conversation ouverte${targetUserName ? ` avec ${targetUserName}` : ""}`;
        
        showToast.success(message);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error);
      showToast.error("Impossible de créer la conversation. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultButtonText = projectId 
    ? `Contacter${targetUserName ? ` ${targetUserName}` : ""} (Projet)`
    : `Contacter${targetUserName ? ` ${targetUserName}` : ""}`;

  // Si c'est un bouton avec le thème FreeHunt
  if (theme === "secondary" || variant === "outline") {
    return (
      <FreeHuntButton
        variant={variant}
        theme={theme}
        className={`${fullWidth ? "w-full" : ""} ${className}`}
        onClick={handleContact}
        disabled={isLoading}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        {isLoading ? "..." : (buttonText || defaultButtonText)}
      </FreeHuntButton>
    );
  }

  // Bouton standard
  return (
    <Button
      variant={variant}
      size={size}
      className={`${fullWidth ? "w-full" : ""} ${className}`}
      onClick={handleContact}
      disabled={isLoading}
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      {isLoading ? "..." : (buttonText || defaultButtonText)}
    </Button>
  );
}
