export interface LoginResponse {
  token: string;
  message: string;
  success: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  message: string;
  success: boolean;
}

export interface RegisterCredentials {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}
