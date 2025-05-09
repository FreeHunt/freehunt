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

export interface Project {
  id: string;
  name: string;
  description: string;
  endDate: string;
  freelancerId: string;
  companyId: string;
  conversationId: string;
  jobPostingId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Checkpoint {
  id: string;
  name: string;
  description?: string;
  date: string | Date;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "DELAYED" | "CANCELED";
  jobPostingId: string;
  quoteId?: string;
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
