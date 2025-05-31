import type { User } from "@/models";
import { api } from "@/service/api";

export interface LoginResponse {
  access_token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", {
      email: email,
      password,
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  // register: (name, email, password) =>
  //   api.post("/users", { name, email, password }).then((res) => res.data),

  register: async (username: string, email: string, password: string) => {
    const response = await api.post<LoginResponse>("/users", {
      username: username,
      email: email,
      password,
    });
    return response.data;
  },
};
