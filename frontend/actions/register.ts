import { api } from "@/lib/api";
import { getCurrentUser } from "./auth";
import { Skill } from "@/lib/interfaces";

export interface RegisterResponse {
  success: boolean;
  cookies: string[];
  response: AuthFlowResponse | AuthFlowResponseError;
}
export interface AuthFlowResponse {
  component: string;
  to: string;
}

export interface AuthFlowResponseError {
  flow_info: FlowInfo;
  component: string;
  response_errors: ResponseErrors[];
  user_fields: string[];
  password_fields: boolean;
  allow_show_password: boolean;
  flow_designation: string;
  captcha_stage: string | null;
  enroll_url: string;
  primary_action: string;
  sources: string[];
  show_source_labels: boolean;
}

export interface NonFieldError {
  string: string;
  code: string;
}

export interface FieldError {
  string: string;
  code: string;
}

export interface ResponseErrors {
  [field: string]: FieldError[];
}

export interface FlowInfo {
  title: string;
  background: string;
  cancel_url: string;
  layout: string;
}

export const register = async (
  username: string,
  email: string,
  password: string,
  password_repeat: string,
  role: string,
): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", {
    username,
    email,
    password,
    password_repeat,
    role,
  });
  return response.data;
};

export const handleError = (
  response: AuthFlowResponseError,
  setError: (error: string) => void,
) => {
  response.response_errors.forEach((error) => {
    error.errors.forEach((error) => {
      setError(error.string);
    });
  });

  if (response.response_errors.length === 0) {
    setError("Une erreur est survenue");
  }
};

// types.ts
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  workField: string;
  location: string;
  averageDailyRate: number;
  avatar: string;
  skills: Skill[];
  experienceYear: number;
}

export interface BlurStates {
  isFirstNameBlurred: boolean;
  isLastNameBlurred: boolean;
  isWorkFieldBlurred: boolean;
  isLocationBlurred: boolean;
  isAverageDailyRateBlurred: boolean;
  isAvatarBlurred: boolean;
  isSkillsBlurred: boolean;
  isExperienceYearBlurred: boolean;
}

export interface SectionTitle {
  highlight: string;
  regular: string;
}
export const RegisterFreelance = async (formData: ProfileFormData) => {
  const user = await getCurrentUser();
  const response = await api.post("/freelances", {
    firstName: formData.firstName,
    lastName: formData.lastName,
    jobTitle: formData.workField,
    averageDailyRate: formData.averageDailyRate,
    location: formData.location,
    seniority: formData.experienceYear,
    userId: user.id,
    skillIds: formData.skills.map((skill) => skill.id),
  });

  return response.data;
};
