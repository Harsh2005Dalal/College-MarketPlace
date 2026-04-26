import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiFetch } from "../lib/api";
import type { UserProfile } from "../types";

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  signUp: (payload: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch("/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      async signUp(payload) {
        const data = await apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
        localStorage.setItem("token", data.token);
        setUser(data.user);
      },
      async signIn(email, password) {
        const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
        localStorage.setItem("token", data.token);
        setUser(data.user);
      },
      signOut() {
        localStorage.removeItem("token");
        setUser(null);
      },
      async forgotPassword(email) {
        await apiFetch("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
      },
      async resetPassword(token, password) {
        await apiFetch("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) });
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
