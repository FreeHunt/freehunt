"use client";

import { api } from "@/lib/api";
import { Candidate, CreateCandidate } from "@/lib/interfaces";

export const getCandidates = async (
  jobPostingId: string,
): Promise<Candidate[]> => {
  try {
    const response = await api.get<Candidate[]>(
      `/candidates/job-posting/${jobPostingId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
};

export const getCandidateByFreelanceIdAndJobPostingId = async (
  freelanceId: string,
  jobPostingId: string,
): Promise<Candidate | null> => {
  try {
    const response = await api.get<Candidate>(
      `/candidates/freelance/${freelanceId}/job-posting/${jobPostingId}`,
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

export const createCandidate = async (
  createCandidate: CreateCandidate,
): Promise<Candidate> => {
  try {
    const response = await api.post<Candidate>("/candidates/", {
      freelanceId: createCandidate.freelanceId,
      jobPostingId: createCandidate.jobPostingId,
      status: createCandidate.status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCandidatesByCompany = async (
  companyId: string,
): Promise<Candidate[]> => {
  try {
    const response = await api.get<Candidate[]>(
      `/candidates/company/${companyId}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching company candidates:", error);
    throw error;
  }
};

export const updateCandidateStatus = async (
  candidateId: string,
  status: string,
): Promise<Candidate> => {
  try {
    const response = await api.put<Candidate>(
      `/candidates/${candidateId}/company`,
      { status },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error updating candidate status:", error);
    throw error;
  }
};

export const deleteCandidate = async (candidateId: string): Promise<void> => {
  try {
    await api.delete(`/candidates/${candidateId}`);
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};
