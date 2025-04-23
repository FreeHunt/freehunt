import { api } from "@/lib/api";

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
  role: string
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
  setError: (error: string) => void
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
