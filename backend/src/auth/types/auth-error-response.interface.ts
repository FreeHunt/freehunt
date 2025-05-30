export interface NonFieldError {
  string: string;
  code: string;
}

export interface ResponseErrors {
  [field: string]: NonFieldError[];
}

export interface FlowInfo {
  title: string;
  background: string;
  cancel_url: string;
  layout: string;
}
export interface AuthFlowResponseError {
  flow_info: FlowInfo;
  component: string;
  response_errors: ResponseErrors | NonFieldError[];
  user_fields: string[];
  password_fields: boolean;
  allow_show_password: boolean;
  flow_designation: string;
  captcha_stage: string | null;
  enroll_url: string;
  primary_action: string;
  sources: any[];
  show_source_labels: boolean;
}
export interface AuthErrorResponse {
  success: boolean;
  cookies: string[];
  response: AuthFlowResponseError;
}
