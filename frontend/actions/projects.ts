import { api } from "@/lib/api";
import { Project } from "@/lib/interfaces";

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await api.get<Project>(`/projects/${projectId}`);
  return response.data;
};

export const getProjectsByCompany = async (
  companyId: string,
): Promise<Project[]> => {
  try {
    const response = await api.get<Project[]>(
      `/projects/company/${companyId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company projects:", error);
    throw error;
  }
};

export const getProjectsByFreelance = async (
  freelanceId: string,
): Promise<Project[]> => {
  try {
    const response = await api.get<Project[]>(
      `/projects/freelance/${freelanceId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching freelance projects:", error);
    throw error;
  }
};
