"use server";

import { api } from "@/lib/api"; // Use the exported axios instance
import { JobPostingSearchResult, JobPostingLocation } from "@/lib/interfaces"; // Assuming these exist or will be created

// Define the structure for search parameters, mirroring backend DTO
interface SearchJobPostingsParams {
  title?: string;
  skillNames?: string[];
  location?: JobPostingLocation | "any"; // Allow 'any' for no filter
  minimumAverageDailyRate?: number; // Renamed to match frontend state
  maximumAverageDailyRate?: number; // Renamed to match frontend state
  minSeniority?: number;
  maxSeniority?: number;
  page?: number;
  pageSize?: number;
}

export async function searchJobPostings(
  params: SearchJobPostingsParams,
): Promise<JobPostingSearchResult> {
  try {
    // Prepare the payload, removing 'any' location if present
    const payload: Record<string, unknown> = { ...params };
    if (payload.location === "any") {
      delete payload.location;
    }

    // Adjust pagination parameters (skip/take) based on page/pageSize
    if (params.page && params.pageSize) {
      payload.skip = (params.page - 1) * params.pageSize;
      payload.take = params.pageSize;
      delete payload.page;
      delete payload.pageSize;
    } else {
      // Default pagination if not provided
      payload.skip = payload.skip ?? 0;
      payload.take = payload.take ?? 10; // Default page size
    }

    // Use axios instance for the POST request
    const response = await api.post<JobPostingSearchResult>(
      "/job-postings/search",
      payload,
      {
        // Axios config if needed, e.g., headers
      },
    );

    const result = response.data;

    // Ensure result conforms to expected structure, provide defaults if necessary
    return {
      data: result?.data ?? [],
      total: result?.total ?? 0,
    };
  } catch (error) {
    console.error("Error searching job postings:", error);
    // Return an empty result in case of error
    return {
      data: [],
      total: 0,
    };
  }
}
