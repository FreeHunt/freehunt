export interface User {
  id: string;
  email: string;
  role: "FREELANCE" | "COMPANY";
}

export interface SkillCreate {
  name: string;
  aliases: string[];
  type: "TECHNICAL" | "SOFT";
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

export enum CheckpointStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  DELAYED = "DELAYED",
  CANCELED = "CANCELED",
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  address: string;
  siren: string;
  user?: User;
}

export interface JobPostingsCreate {
  title: string;
  description: string;
  location: string;
  isPromoted: boolean;
  averageDailyRate: number;
  seniority: number;
  companyId: string;
  skillIds: string[];
  checkpointIds?: string[];
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

export interface Project {
  id: string;
  name: string;
  description: string;
  endDate: string;
  freelanceId: string;
  companyId: string;
  conversationId: string;
  jobPostingId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckpointCreate {
  name: string;
  description?: string;
  date: string | Date;
  status: CheckpointStatus;
  jobPostingId: string;
  quoteId?: string;
  freelanceId?: string;
  amount: number;
}

export interface Checkpoint {
  id: string;
  name: string;
  description?: string;
  date: string | Date;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "DELAYED" | "CANCELED";
  jobPostingId: string;
  quoteId?: string;
  freelanceId?: string;
  amount: number;
}

export interface Conversation {
  id: string;
  receiverId: string;
  senderId: string;
  projectId: string;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  documentId?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobPosting {
  id: string;
  name: string;
}

export interface Quote {
  id: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  userId: string;
  messageId: string;
  quoteId: string;
  invoiceId: string;
}
