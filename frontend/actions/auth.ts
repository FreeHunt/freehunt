import { api } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";

export const getCurrentUser = async () => {
  const response = await api.get("/auth/getme", {
    withCredentials: true,
  });
  return response.data;
};

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Utilisation de useCallback pour éviter les re-créations inutiles
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error,
      );
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = "/login";
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    checkAuth,
    logout,
  };
};
