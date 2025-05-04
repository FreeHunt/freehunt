"use server";

import { api } from "@/lib/api";
import { JobPostingSearchResult, JobPostingLocation } from "@/lib/interfaces";

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
