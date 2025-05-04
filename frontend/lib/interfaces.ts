export interface User {
  id: string;
  email: string;
  role: "FREELANCE" | "COMPANY";
}

export interface Skill {
  id: string;
  name: string;
  normalizedName: string;
  aliases: string[];
  type: "TECHNICAL" | "SOFT";
}

export interface Freelance {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  jobTitle: string;
  skills: Skill[];
  averageDailyRate: number;
  description: string;
  user: User;
  userId: string;
}

export interface FreelanceSearchResult {
  data: Freelance[];
  total: number;
}

// Job Posting Related Types

export enum JobPostingLocation {
  ONSITE = "ONSITE",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  user?: User;
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  location: JobPostingLocation;
  isPromoted: boolean;
  averageDailyRate: number;
  seniority: number;
  company?: Company;
  skills?: Skill[];
  createdAt: string;
  updatedAt: string;
}

export interface JobPostingSearchResult {
  data: JobPosting[];
  total: number;
}
