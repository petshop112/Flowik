import type { MakeRequestFunction } from "../types/api";
import type { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from "../types/auth";

export const API_AUTH_URL = import.meta.env.VITE_API_URL;

export class AuthService {
  private makeRequest: MakeRequestFunction;

  constructor(makeRequest: MakeRequestFunction) {
    this.makeRequest = makeRequest;
  }

  async login(credentials: LoginCredentials) {
    return this.makeRequest<LoginResponse>(`${API_AUTH_URL}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  }

  async register(credentials: RegisterCredentials) {
    return this.makeRequest<RegisterResponse>(`${API_AUTH_URL}auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  }
}

export const createAuthService = (makeRequest: MakeRequestFunction) =>
  new AuthService(makeRequest);
