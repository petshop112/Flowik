import type { MakeRequestFunction } from "../types/api";
import type { 
  LoginCredentials, 
  LoginResponse, 
  RegisterCredentials, 
  RegisterResponse, 
  RecoverPasswordRequest, 
  RecoverPasswordResponse,
  NewPasswordRequest,
  NewPasswordResponse
} from "../types/auth";

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

  async recoverPassword(credentials: RecoverPasswordRequest): Promise<RecoverPasswordResponse> {
    const response = await fetch(`${API_AUTH_URL}auth/forgot_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud de recuperación");
    }

    const message = await response.text();
    return { message }; // Lo normalizamos a un objeto
  }

  async newPassword(credentials: NewPasswordRequest): Promise<NewPasswordResponse> {
    const response = await fetch(`${API_AUTH_URL}auth/reset_password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Error en cambio de contraseña");
    }

    const data: NewPasswordResponse = await response.json();
    return data;
  }
}

export const createAuthService = (makeRequest: MakeRequestFunction) =>
  new AuthService(makeRequest);
