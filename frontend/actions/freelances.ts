"use server";

import { api } from "@/lib/api";
import { Freelance, FreelanceSearchResult, Skill } from "@/lib/interfaces";

interface SearchFreelanceParams {
  query?: string;
  minimumAverageDailyRate?: number;
  maximumAverageDailyRate?: number;
  skills?: Skill[];
  minSeniority?: number;
  maxSeniority?: number;
  page?: number;
  pageSize?: number;
}

export const searchFreelances = async ({
  query,
  minimumAverageDailyRate,
  maximumAverageDailyRate,
  skills,
  minSeniority,
  maxSeniority,
  page = 1,
  pageSize = 10,
}: SearchFreelanceParams): Promise<FreelanceSearchResult> => {
  const skip = (page - 1) * pageSize;

  const response = await api.post("/freelances/search", {
    query,
    minDailyRate: minimumAverageDailyRate,
    maxDailyRate: maximumAverageDailyRate,
    skillNames: skills?.map((skill) => skill.name),
    minSeniority,
    maxSeniority,
    skip,
    take: pageSize,
  });

  return response.data;
};

export const getFreelanceByUserId = async (
  userId: string,
): Promise<Freelance> => {
  try {
    const response = await api.get(`/freelances/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
