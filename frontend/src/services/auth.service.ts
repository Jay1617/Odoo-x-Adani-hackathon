import { api } from "./api";
import type { User, RegisterData } from "@/types/user";

export interface LoginCredentials {
  email_id: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await api.post<{ user: User; token: string }>("/users/register", data);
    const result = {
      user: response.data.user,
      token: response.data.token,
    };
    if (result.token) {
      localStorage.setItem("token", result.token);
    }
    return result;
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<{ user: User; token: string }>("/users/login", credentials);
    const result = {
      user: response.data.user,
      token: response.data.token,
    };
    if (result.token) {
      localStorage.setItem("token", result.token);
    }
    return result;
  },

  logout: async (): Promise<void> => {
    await api.post("/users/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<{ user: User }>("/users/profile");
    return response.data.user;
  },
};

