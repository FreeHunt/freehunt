import { api } from "@/lib/api";
import { Checkpoint } from "@/lib/interfaces";

export const getCheckpoints = async (jobPostingId: string) => {
  const response = await api.get(`/checkpoints/job-posting/${jobPostingId}`);
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
