/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from "@/models";
import { authService } from "@/service/auth";
import Cookies from "js-cookie";
import type { FC } from "react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const cookiesExpirationDays = 1;

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  fetchUser: async () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);

    Cookies.set("token", response.access_token, {
      expires: cookiesExpirationDays,
      path: "/",
      secure: import.meta.env.MODE === "production",
    });

    setToken(response.access_token);
    await fetchUser();

    await new Promise((resolve) => setTimeout(resolve, 50));

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    const safeRedirect =
      redirect && redirect.startsWith("/") && !redirect.startsWith("/login")
        ? redirect
        : "/movieList";

    console.log("Redirecionando para:", safeRedirect);
    navigate(safeRedirect);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register(name, email, password);

    Cookies.set("token", response.access_token, {
      expires: cookiesExpirationDays,
      path: "/",
      secure: import.meta.env.MODE === "production",
    });

    await setToken(response.access_token);

    await fetchUser();

    await new Promise((resolve) => setTimeout(resolve, 50));

    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    const safeRedirect =
      redirect && redirect.startsWith("/") && !redirect.startsWith("/login")
        ? redirect
        : "/movieList";

    console.log(
      "Usuário registrado e logado. Redirecionando para:",
      safeRedirect
    );
    navigate(safeRedirect);
  };

  const logout = useCallback(() => {
    Cookies.remove("token");
    Cookies.remove("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const fetchUser = useCallback(async () => {
    const storedToken = Cookies.get("token");
    if (!storedToken) return;

    try {
      const response = await authService.getMe();

      Cookies.set("user", encodeURIComponent(JSON.stringify(response)), {
        path: "/",
        secure: import.meta.env.MODE === "production",
        expires: cookiesExpirationDays,
      });

      setUser(response);
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [fetchUser, token]);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUser = Cookies.get("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        const decoded = decodeURIComponent(storedUser);
        setUser(JSON.parse(decoded));
      } catch (err) {
        console.error("Erro ao ler cookie 'user':", err);
        Cookies.remove("user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
