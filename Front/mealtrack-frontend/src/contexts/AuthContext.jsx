import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { AUTH_STORAGE_KEY } from "@/config/app";
import * as authService from "@/services/authService";

export const AuthContext = createContext(null);

function readStoredSession() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [isLoading, setIsLoading] = useState(false);

  // Logout automático quando o interceptor do Axios recebe 401.
  useEffect(() => {
    function handleUnauthorized() {
      setSession(null);
    }
    window.addEventListener("mealtrack:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("mealtrack:unauthorized", handleUnauthorized);
  }, []);

  const login = useCallback(async (email, senha) => {
    setIsLoading(true);
    try {
      const loginResponse = await authService.login({ email, senha });
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loginResponse));
      setSession(loginResponse);
      return loginResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user: session
        ? { id: session.id, nome: session.nome, email: session.email, nivelAcesso: session.nivelAcesso }
        : null,
      isAuthenticated: Boolean(session?.token),
      isLoading,
      login,
      logout,
    }),
    [session, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
