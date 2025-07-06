"use client";

import { useAuth } from "@/actions/auth";
import { useEffect } from "react";

export default function LogoutPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-freehunt-main mx-auto mb-4"></div>
        <p className="text-muted-foreground">Déconnexion en cours...</p>
      </div>
    </div>
  );
}
