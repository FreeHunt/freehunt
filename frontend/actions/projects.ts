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

export const checkProjectExistsForJobPosting = async (
  jobPostingId: string,
): Promise<boolean> => {
  try {
    const response = await api.get<boolean>(
      `/projects/exists/job-posting/${jobPostingId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error checking if project exists for job posting:", error);
    return false;
  }
};

/**
 * Récupérer un projet avec sa conversation et tous les détails
 */
export const getProjectWithConversation = async (projectId: string) => {
  try {
    const [project, conversation] = await Promise.all([
      getProject(projectId),
      api
        .get(`/conversations/project/${projectId}`)
        .then((res) => res.data)
        .catch(() => null),
    ]);

    return {
      project,
      conversation,
    };
  } catch (error) {
    console.error("Error fetching project with conversation:", error);
    throw error;
  }
};
