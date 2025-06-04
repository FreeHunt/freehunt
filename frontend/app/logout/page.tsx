"use client";

import { useEffect } from "react";
import { useAuth } from "@/actions/auth";

export default function LogoutPage() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Déconnexion en cours...</p>
      </div>
    </div>
  );
}
