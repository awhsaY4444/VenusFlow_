import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { applyAppearance } from "../utils/appearance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function refreshUser() {
    if (!localStorage.getItem("venusflow_token")) {
      setUser(null);
      setAuthLoading(false);
      return null;
    }

    try {
      const response = await api.me();
      setUser(response.user);
      localStorage.setItem("venusflow_user", JSON.stringify(response.user));
      return response.user;
    } catch {
      logout();
      return null;
    } finally {
      setAuthLoading(false);
    }
  }

  function setSession(result) {
    localStorage.setItem("venusflow_token", result.token);
    localStorage.setItem("venusflow_user", JSON.stringify(result.user));
    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem("venusflow_token");
    localStorage.removeItem("venusflow_user");
    setUser(null);
  }

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (!user) {
      applyAppearance({
        theme: "light",
        persist: false,
      });
      return;
    }

    applyAppearance({
      theme: user.theme || "light",
    });
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      authLoading,
      setUser,
      setSession,
      refreshUser,
      logout,
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
