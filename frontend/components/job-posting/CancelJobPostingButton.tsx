"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cancelJobPosting, CancelJobPostingResponse } from "@/actions/jobPostings";
import { Loader2, XCircle } from "lucide-react";

interface CancelJobPostingButtonProps {
  jobPostingId: string;
  jobPostingTitle: string;
  isPaid: boolean;
  hasProject: boolean;
  onCancelSuccess?: () => void;
  disabled?: boolean;
}

export function CancelJobPostingButton({
  jobPostingId,
  jobPostingTitle,
  isPaid,
  hasProject,
  onCancelSuccess,
  disabled = false,
}: CancelJobPostingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");

  // Ne pas afficher le bouton si un projet existe déjà
  if (hasProject) {
    return null;
  }

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error("Veuillez indiquer une raison pour l'annulation");
      return;
    }

    setIsLoading(true);
    try {
      const response: CancelJobPostingResponse = await cancelJobPosting(
        jobPostingId,
        reason,
      );

      if (response.success) {
        toast.success(response.message);
        
        // Afficher les informations de remboursement si applicable
        if (response.refundId) {
          toast.success(
            `Remboursement traité : ${response.refundAmount}€ (${response.refundStatus})`,
            { duration: 8000 }
          );
        }
        
        setIsOpen(false);
        onCancelSuccess?.();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabled}
          className="gap-2"
        >
          <XCircle className="h-4 w-4" />
          Annuler l&apos;annonce
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Annuler l&apos;annonce</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point d&apos;annuler l&apos;annonce &quot;
            <span className="font-semibold">{jobPostingTitle}</span>&quot;.
            {isPaid && (
              <span className="block mt-2 text-green-600">
                Un remboursement sera automatiquement traité si vous avez effectué un paiement.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">
              Raison de l&apos;annulation <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Expliquez pourquoi vous souhaitez annuler cette annonce..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-sm text-gray-500">
              {reason.length}/500 caractères
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Annulation en cours...
              </>
            ) : (
              "Confirmer l&apos;annulation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
