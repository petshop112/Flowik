import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthService } from "../../api/authService";
import type { RootState } from "../../app/store";
import type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  RecoverPasswordRequest,
  RecoverPasswordResponse,
  NewPasswordRequest,
  NewPasswordResponse,
} from "../../types/auth";
import { makeRequest } from "../../utils/makeRequest";

const authService = createAuthService(makeRequest);

export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Error al iniciar sesión");
    }
  }
);

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterCredentials
>("auth/registerUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.register(credentials);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Error al iniciar sesión");
  }
});

export const recoverPassword = createAsyncThunk<
  RecoverPasswordResponse,
  RecoverPasswordRequest
>("auth/recoverPassword", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.recoverPassword(credentials);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Error al recuperar contraseña");
  }
});

export const newPassword = createAsyncThunk<
  NewPasswordResponse,
  NewPasswordRequest
>("auth/recoverPassword", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.newPassword(credentials);
    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Error al cambiar contraseña");
  }
});

interface AuthState {
  token: string | null;
  username: string | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
  recoveryMessage: string | null;
}

const initialState: AuthState = {
  token: null,
  username: null,
  userId: null,
  loading: false,
  error: null,
  recoveryMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.username = null;
      state.userId = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        sessionStorage.setItem("token", action.payload.token);

        try {
          const payload = JSON.parse(atob(action.payload.token.split(".")[1]));
          if (payload?.userName) {
            state.username = payload.userName;
            sessionStorage.setItem("username", payload.userName);
          }
          if (payload?.userId || payload?.id) {
            state.userId = payload.userId || payload.id;
            sessionStorage.setItem("userId", payload.userId || payload.id);
          }
        } catch (e) {
          console.error("Error decoding token", e);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //Recover password
      .addCase(recoverPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.recoveryMessage = null;
      })
      .addCase(recoverPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.recoveryMessage = action.payload.message; // 👈 guardamos mensaje backend
      })
      .addCase(recoverPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
