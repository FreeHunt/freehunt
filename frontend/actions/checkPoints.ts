import { api } from "@/lib/api";
import { Checkpoint, CheckpointCreate } from "@/lib/interfaces";

export const getCheckpoints = async (jobPostingId: string) => {
  const response = await api.get(`/checkpoints/job-posting/${jobPostingId}`);
  return response.data;
};

export const createCheckpoint = async (
  checkpoint: CheckpointCreate,
): Promise<Checkpoint> => {
  const response = await api.post("/checkpoints", {
    name: checkpoint.name,
    description: checkpoint.description,
    date: checkpoint.date,
    status: checkpoint.status,
    jobPostingId: checkpoint.jobPostingId,
    // quoteId: checkpoint.quoteId,
    // freelanceId: checkpoint.freelanceId,
    amount: checkpoint.amount,
  });
  return response.data;
};

export const updateCheckpoint = async (checkpoint: Checkpoint, userId?: string) => {
  const response = await api.put(`/checkpoints/${checkpoint.id}`, {
    status: checkpoint.status,
    quoteId: checkpoint.quoteId,
    date: checkpoint.date,
    name: checkpoint.name,
    description: checkpoint.description,
    jobPostingId: checkpoint.jobPostingId,
    freelanceId: checkpoint.freelanceId,
    amount: checkpoint.amount,
    userId: userId, // Ajout de l'userId pour identifier qui fait l'action
    submittedAt: checkpoint.submittedAt,
    validatedAt: checkpoint.validatedAt,
    submittedBy: checkpoint.submittedBy,
    validatedBy: checkpoint.validatedBy,
  });
  return response.data;
};

// Nouvelle fonction pour valider un checkpoint avec gestion du projet
export const validateCheckpoint = async (
  checkpointId: string, 
  userId: string,
  isCompany: boolean = false
) => {
  const response = await api.put(`/checkpoints/${checkpointId}`, {
    status: 'DONE', // Sera ajusté côté backend selon qui fait la demande
    userId: userId,
  });
  return response.data;
};

// Fonction pour vérifier si c'est le dernier checkpoint d'un projet
export const checkIfLastCheckpoint = async (jobPostingId: string, checkpointId: string) => {
  const allCheckpoints = await getCheckpoints(jobPostingId);
  const remainingCheckpoints = allCheckpoints.filter((cp: Checkpoint) => 
    cp.id !== checkpointId && cp.status !== 'DONE'
  );
  return remainingCheckpoints.length === 0;
};
