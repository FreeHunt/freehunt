"use server";

import { api } from "@/lib/api";
import { Freelance } from "@/lib/interfaces";

interface SearchFreelanceParams {
  query: string;
  minimumAverageDailyRate?: number;
  maximumAverageDailyRate?: number;
}

export const searchFreelances = async ({
  query,
  minimumAverageDailyRate,
  maximumAverageDailyRate,
}: SearchFreelanceParams): Promise<Freelance[]> => {
  const response = await api.post("/freelances/search", {
    jobTitle: query,
    minDailyRate: minimumAverageDailyRate,
    maxDailyRate: maximumAverageDailyRate,
  });

  return response.data;
};
