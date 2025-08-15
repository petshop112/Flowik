import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createAuthService } from "../../api/authService";
import type { RootState } from "../../app/store";
import type { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse } from "../../types/auth";
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

export const registerUser = createAsyncThunk<RegisterResponse, RegisterCredentials>(
  "auth/registerUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Error al iniciar sesión");
    }
  }
);

interface AuthState {
  token: string | null;
  username: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  username: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.username = null;
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");
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
        } catch (e) {
          console.error("Error decoding token", e);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
