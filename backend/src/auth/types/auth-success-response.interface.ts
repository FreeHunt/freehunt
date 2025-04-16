import { AuthFlowResponse } from './auth-flow-response.interface';

export interface AuthSuccessResponse {
  success: boolean;
  cookies: string[];
  response: AuthFlowResponse;
}
