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
  avatar: File | null;
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

export interface CompanyBlurStates {
  isNameBlurred: boolean;
  isSirenBlurred: boolean;
  isDescriptionBlurred: boolean;
  isAddressBlurred: boolean;
  isLogoBlurred: boolean;
}

export interface CompanyFormData {
  name: string;
  siren: string;
  description: string;
  address: string;
  logo: File | null;
}

export interface CompanyPreviewCardProps {
  formData: CompanyFormData;
  companyBlurStates: CompanyBlurStates;
}
export const RegisterFreelance = async (formData: ProfileFormData) => {
  try {
    // Create a FormData object for the file upload
    const fileFormData = new FormData();
    const bucketName = "freehunt-avatar";

    // Append the file if it exists
    if (formData.avatar) {
      fileFormData.append("file", formData.avatar);
    }

    // Upload the file first
    let avatarUrl = null;
    fileFormData.append("bucketName", bucketName);
    // Get the current user
    const user = await getCurrentUser();
    if (formData.avatar) {
      const uploadResponse = await api.post("/upload", fileFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      avatarUrl = uploadResponse.data.url; // Assuming the server returns the URL of the uploaded file

      // Create a document for the avatar
      await api.post("/documents", {
        name: formData.avatar.name,
        url: avatarUrl,
        type: "AVATAR",
        userId: user.id,
      });
    }

    // Now send the rest of the profile data
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
  } catch (error) {
    console.error("Error during freelance registration:", error);
    throw error;
  }
};

export const RegisterCompany = async (formData: CompanyFormData) => {
  try {
    const fileFormData = new FormData();
    const bucketName = "freehunt-avatar";

    // Append the file if it exists
    if (formData.logo) {
      fileFormData.append("file", formData.logo);
    }
    let logoUrl: string | null = null;
    fileFormData.append("bucketName", bucketName);
    const user = await getCurrentUser();
    if (formData.logo) {
      const uploadResponse = await api.post("/upload", fileFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      logoUrl = uploadResponse.data.url; // Assuming the server returns the URL of the uploaded file

      // Create a document for the avatar
      await api.post("/documents", {
        name: formData.logo.name,
        url: logoUrl,
        type: "AVATAR",
        userId: user.id,
      });
    }
    const response = await api.post("/companies", {
      name: formData.name,
      siren: formData.siren,
      description: formData.description,
      address: formData.address,
      userId: user.id,
    });
    return response.data;
  } catch (error) {
    console.error("Error during company registration:", error);
    throw error;
  }
};
