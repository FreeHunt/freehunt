import { api } from "@/lib/api";
import { Project } from "@/lib/interfaces";

export const getProject = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data as Project;
};
