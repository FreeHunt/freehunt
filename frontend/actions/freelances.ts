"use server";

import { api } from "@/lib/api";
import { Freelance, Skill } from "@/lib/interfaces";

interface SearchFreelanceParams {
  query: string;
  minimumAverageDailyRate?: number;
  maximumAverageDailyRate?: number;
  skills?: Skill[];
}

export const searchFreelances = async ({
  query,
  minimumAverageDailyRate,
  maximumAverageDailyRate,
  skills,
}: SearchFreelanceParams): Promise<Freelance[]> => {
  const response = await api.post("/freelances/search", {
    query,
    minDailyRate: minimumAverageDailyRate,
    maxDailyRate: maximumAverageDailyRate,
    skillNames: skills?.map((skill) => skill.name),
  });

  return response.data;
};
