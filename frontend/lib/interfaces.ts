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
