"use client";

import { useState } from "react";

interface CheckpointValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  checkpointName: string;
  isLastCheckpoint: boolean;
  isPending: boolean;
  isCompany: boolean;
}

export default function CheckpointValidationModal({
  isOpen,
  onClose,
  onConfirm,
  checkpointName,
  isLastCheckpoint,
  isPending,
  isCompany,
}: CheckpointValidationModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error validating checkpoint:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getModalContent = () => {
    if (isPending && isCompany) {
      return {
        title: "Confirmer la validation du checkpoint",
        message: `Voulez-vous confirmer la validation du checkpoint "${checkpointName}" ?`,
        warningMessage: isLastCheckpoint 
          ? "⚠️ Attention : Ce checkpoint est le dernier du projet. Le valider marquera le projet comme terminé."
          : null,
        confirmText: "Confirmer",
        confirmClass: "bg-green-600 hover:bg-green-700",
      };
    } else if (isCompany) {
      return {
        title: "Valider le checkpoint",
        message: `Voulez-vous valider directement le checkpoint "${checkpointName}" ?`,
        warningMessage: isLastCheckpoint 
          ? "⚠️ Attention : Ce checkpoint est le dernier du projet. Le valider marquera le projet comme terminé."
          : null,
        confirmText: "Valider",
        confirmClass: "bg-green-600 hover:bg-green-700",
      };
    } else {
      return {
        title: "Soumettre le checkpoint pour validation",
        message: `Voulez-vous soumettre le checkpoint "${checkpointName}" pour validation par la company ?`,
        warningMessage: "Le checkpoint sera marqué comme en attente de validation.",
        confirmText: "Soumettre",
        confirmClass: "bg-blue-600 hover:bg-blue-700",
      };
    }
  };

  const content = getModalContent();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">
                {content.title}
              </h3>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">
              {content.message}
            </p>
            
            {content.warningMessage && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-3">
                <p className="text-sm text-amber-700">
                  {content.warningMessage}
                </p>
              </div>
            )}
            
            {isLastCheckpoint && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                <p className="text-sm text-blue-700">
                  🎉 Une fois validé, le projet sera automatiquement marqué comme terminé et les paiements seront effectués.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 ${content.confirmClass}`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Traitement...
              </div>
            ) : (
              content.confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
