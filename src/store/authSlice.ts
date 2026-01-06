import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
  fullName: string;
  company?: string | null;
  phone?: string | null;
  role: "super_admin" | "staff" | "client";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const normalizeRole = (role: string): User["role"] => {
  const lower = role.toLowerCase();
  if (lower === "super_admin") return "super_admin";
  if (lower === "staff") return "staff";
  return "client";
};

const normalizeUser = (user: User): User => ({
  ...user,
  role: normalizeRole(user.role),
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = normalizeUser(action.payload.user);
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = normalizeUser(action.payload.user);
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
});

export const { login, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
