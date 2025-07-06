"use client";

import {
  AuthFlowResponseError,
  FieldError,
  register,
} from "@/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Form from "next/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Create a client component that safely uses useSearchParams
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<"freelance" | "company" | null>(
    null,
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_repeat, setPasswordRepeat] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [errorsUsername, setErrorsUsername] = useState<string[]>([]);
  const [errorsEmail, setErrorsEmail] = useState<string[]>([]);
  const [errorsPassword, setErrorsPassword] = useState<string[]>([]);
  const [errorsPasswordRepeat, setErrorsPasswordRepeat] = useState<string[]>(
    [],
  );

  // Extract type from search params directly in the component
  useEffect(() => {
    const type = searchParams.get("type") as "freelance" | "company";
    if (type) {
      setUserType(type);
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    setErrors([]);
    setErrorsUsername([]);
    setErrorsEmail([]);
    setErrorsPassword([]);
    setErrorsPasswordRepeat([]);
    const response = await register(
      username,
      email,
      password,
      password_repeat,
      userType === "company" ? "COMPANY" : "FREELANCE",
    );
    if (response.success === true) {
      router.push(`/register/${userType}`);
    } else {
      const errors = response.response as AuthFlowResponseError;
      Object.entries(errors.response_errors).forEach(([field, fieldErrors]) => {
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach((err: FieldError) => {
            switch (field) {
              case "username":
                setErrorsUsername((prevErrors) => [...prevErrors, err.string]);
                break;
              case "email":
                setErrorsEmail((prevErrors) => [...prevErrors, err.string]);
                break;
              case "password":
                setErrorsPassword((prevErrors) => [...prevErrors, err.string]);
                break;
              case "password_repeat":
                setErrorsPasswordRepeat((prevErrors) => [
                  ...prevErrors,
                  err.string,
                ]);
                break;
              default:
                setErrors((prevErrors) => [...prevErrors, err.string]);
                break;
            }
          });
        }
      });
    }
  };

  return (
    <div className="min-h-[calc(100svh-64px)] bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Créons votre{" "}
            <span className="text-freehunt-main">profil FreeHunt</span> ! 🚀
          </h1>
          <p className="text-lg text-muted-foreground">
            Quelques informations pour commencer votre aventure
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="bg-gradient-to-r from-freehunt-main to-freehunt-main/90 p-6">
            <h2 className="text-xl font-semibold text-white text-center">
              Informations de base
            </h2>
          </div>

          <Form
            action={async () => {
              await handleSubmit();
            }}
            className="p-6 space-y-6"
          >
            {errors.length > 0 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {errors.join(", ")}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">
                  Adresse e-mail
                </Label>
                <Input
                  className="rounded-lg"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errorsEmail.length > 0 && (
                  <p className="text-destructive text-xs">
                    {errorsEmail.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">
                  Nom d&apos;utilisateur
                </Label>
                <Input
                  className="rounded-lg"
                  placeholder="nom_utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errorsUsername.length > 0 && (
                  <p className="text-destructive text-xs">
                    {errorsUsername.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">
                  Mot de passe
                </Label>
                <Input
                  className="rounded-lg"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errorsPassword.length > 0 && (
                  <p className="text-destructive text-xs">
                    {errorsPassword.join(", ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium">
                  Confirmer le mot de passe
                </Label>
                <Input
                  className="rounded-lg"
                  placeholder="••••••••"
                  type="password"
                  value={password_repeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                />
                {errorsPasswordRepeat.length > 0 && (
                  <p className="text-destructive text-xs">
                    {errorsPasswordRepeat.join(", ")}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => router.back()}
              >
                Retour
              </Button>
              <Button
                type="submit"
                className="bg-freehunt-main hover:bg-freehunt-main/90 text-white rounded-lg"
              >
                Continuer →
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

// Main page component with suspense boundary
function Page() {
  return (
    <Suspense
      fallback={<div className="flex justify-center p-10">Chargement...</div>}
    >
      <RegisterForm />
    </Suspense>
  );
}

export default Page;
