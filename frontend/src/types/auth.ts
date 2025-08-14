export interface LoginResponse {
  token: string;
  message: string;
  success: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
