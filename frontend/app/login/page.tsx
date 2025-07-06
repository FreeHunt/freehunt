"use client";

import { login } from "@/actions/login";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      router.push("/");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-[calc(100svh-64px)] bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Bon retour sur{" "}
            <span className="text-freehunt-main">FreeHunt</span> ! 👋
          </h1>
          <p className="text-muted-foreground">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-xl shadow-xl border border-border/50 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-freehunt-main to-freehunt-main/90 p-6 text-center">
            <h2 className="text-xl font-semibold text-white">Connexion</h2>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-freehunt-main/20 focus:border-freehunt-main transition-all duration-200 placeholder:text-muted-foreground"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-border bg-background focus:ring-2 focus:ring-freehunt-main/20 focus:border-freehunt-main transition-all duration-200 placeholder:text-muted-foreground"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-freehunt-main transition-colors"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-freehunt-main hover:bg-freehunt-main/90 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                aria-label="Se connecter"
              >
                Se connecter <ArrowRight size={18} />
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-muted-foreground text-sm">
                Nouveau sur FreeHunt ?{" "}
                <Link
                  href="/register/choice"
                  className="font-medium text-freehunt-main hover:text-freehunt-main/80 transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
