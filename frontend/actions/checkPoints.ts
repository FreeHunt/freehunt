import { api } from "@/lib/api";

export const getCheckpoints = async (jobPostingId: string) => {
  const response = await api.get(`/checkpoints/job-posting/${jobPostingId}`);
  return response.data;
};
