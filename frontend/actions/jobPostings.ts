"use server";

import { api } from "@/lib/api";
import {
  JobPostingSearchResult,
  JobPostingLocation,
  JobPosting,
  JobPostingsCreate,
  Checkpoint,
} from "@/lib/interfaces";

interface SearchJobPostingsParams {
  title?: string;
  skillNames?: string[];
  location?: JobPostingLocation | "any";
  minimumAverageDailyRate?: number;
  maximumAverageDailyRate?: number;
  minSeniority?: number;
  maxSeniority?: number;
  page?: number;
  pageSize?: number;
}

export async function searchJobPostings(
  params: SearchJobPostingsParams,
): Promise<JobPostingSearchResult> {
  try {
    const payload: Record<string, unknown> = { ...params };

    if (payload.minimumAverageDailyRate !== undefined) {
      payload.minDailyRate = payload.minimumAverageDailyRate;
      delete payload.minimumAverageDailyRate;
    }

    if (payload.maximumAverageDailyRate !== undefined) {
      payload.maxDailyRate = payload.maximumAverageDailyRate;
      delete payload.maximumAverageDailyRate;
    }

    if (payload.location === "any") {
      delete payload.location;
    }

    if (params.page && params.pageSize) {
      payload.skip = (params.page - 1) * params.pageSize;
      payload.take = params.pageSize;
      delete payload.page;
      delete payload.pageSize;
    } else {
      payload.skip = payload.skip ?? 0;
      payload.take = payload.take ?? 10;
    }

    const response = await api.post<JobPostingSearchResult>(
      "/job-postings/search",
      payload,
    );

    const result = response.data;

    return {
      data: result?.data ?? [],
      total: result?.total ?? 0,
    };
  } catch (error) {
    console.error("Error searching job postings:", error);
    return {
      data: [],
      total: 0,
    };
  }
}

export async function getJobPostingsByUserId(
  userId: string,
): Promise<JobPosting[]> {
  const response = await api.get<JobPosting[]>(`/job-postings/user/${userId}`);
  return response.data;
}

export async function submitJobPosting(
  formData: JobPostingsCreate,
  checkpoints: Checkpoint[],
) {
  try {
    const response = await api.post<JobPosting>("/job-postings/", formData);

    // Si des checkpoints sont fournis, les soumettre avec le job posting id
    if (checkpoints && checkpoints.length > 0) {
      const checkpointPromises = checkpoints.map((checkpoint) =>
        api.post<Checkpoint>("/checkpoints", {
          name: checkpoint.name,
          description: checkpoint.description,
          date: checkpoint.date,
          status: checkpoint.status,
          jobPostingId: response.data.id,
          amount: checkpoint.amount,
        }),
      );
      await Promise.all(checkpointPromises);
    }

    return {
      success: true,
      data: response.data,
      message: "Formulaire soumis avec succès!",
    };
  } catch (error) {
    console.error("Erreur lors de la soumission du formulaire:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la soumission du formulaire",
      message: "Une erreur est survenue. Veuillez réessayer plus tard.",
    };
  }
}
