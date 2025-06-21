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

export const updateCheckpoint = async (checkpoint: Checkpoint) => {
  const response = await api.put(`/checkpoints/${checkpoint.id}`, {
    status: checkpoint.status,
    quoteId: checkpoint.quoteId,
    date: checkpoint.date,
    name: checkpoint.name,
    description: checkpoint.description,
    jobPostingId: checkpoint.jobPostingId,
    freelanceId: checkpoint.freelanceId,
    amount: checkpoint.amount,
  });
  return response.data;
};
