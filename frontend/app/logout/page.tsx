"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await api.post("/auth/logout", {}, { withCredentials: true });
        router.refresh();
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      } finally {
        router.push("/login");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Déconnexion en cours...</p>
      </div>
    </div>
  );
}
