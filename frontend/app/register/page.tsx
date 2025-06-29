"use client";

import { useRouter } from "next/navigation";
import Form from "next/form";
import { FieldError, register } from "@/actions/register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState, Suspense } from "react";
import { AuthFlowResponseError } from "@/actions/register";
import { useSearchParams } from "next/navigation";

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
    <div className="flex flex-col items-center gap-4 md:gap-8 lg:gap-20 my-6 md:my-10 lg:my-28">
      <div className="flex flex-col justify-center items-center gap-2 self-stretch px-4">
        <div className="flex p-3 md:p-5 justify-center items-center gap-2">
          <p className="text-xl md:text-2xl lg:text-4xl text-center font-bold">
            <span className="text-freehunt-main">Présentez</span>
            <span className="text-black font-normal">-vous !</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-4 md:gap-8 lg:gap-20 px-4 max-md:w-full">
        <Form
          action={async () => {
            await handleSubmit();
          }}
          className="flex p-4 md:p-6 lg:p-9 flex-col items-start gap-4 md:gap-6 lg:gap-8 self-stretch w-full md:w-[600px] lg:w-[700px] border-black border rounded-2xl md:rounded-3xl lg:rounded-4xl bg-white"
        >
          {errors.length > 0 && (
            <p className="text-red-500">{errors.join(", ")}</p>
          )}
          <div className="flex flex-col md:flex-row gap-2.5 md:gap-4 self-stretch w-full">
            <div className="flex flex-col gap-2.5 self-stretch w-full md:w-1/2">
              <Label className="text-freehunt-main text-sm md:text-base font-bold">
                Email
              </Label>
              <Input
                className="flex h-10 p-2 items-center gap-2.5 self-stretch w-full rounded-xl border-black border"
                placeholder="Email de l'entreprise"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorsEmail.length > 0 && (
                <p className="text-red-500">{errorsEmail.join(", ")}</p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 self-stretch w-full md:w-1/2">
              <Label className="text-freehunt-main text-sm md:text-base font-bold">
                Nom d&apos;utilisateur
              </Label>
              <Input
                className="flex h-10 p-2 items-center gap-2.5 self-stretch w-full rounded-xl border-black border"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errorsUsername.length > 0 && (
                <p className="text-red-500">{errorsUsername.join(", ")}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2.5 md:gap-4 self-stretch w-full">
            <div className="flex flex-col items-start gap-2 self-stretch w-full md:w-1/2">
              <Label className="text-freehunt-main text-sm md:text-base font-bold">
                Mot de passe
              </Label>
              <Input
                className="flex h-10 p-2 items-center gap-2.5 self-stretch w-full rounded-xl border-black border"
                placeholder="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorsPassword.length > 0 && (
                <p className="text-red-500">{errorsPassword.join(", ")}</p>
              )}
            </div>
            <div className="flex flex-col items-start gap-2 self-stretch w-full md:w-1/2">
              <Label className="text-freehunt-main text-sm md:text-base font-bold">
                Confirmation du mot de passe
              </Label>
              <Input
                className="flex h-10 p-2 items-center gap-2.5 self-stretch w-full rounded-xl border-black border"
                placeholder="Confirmation du mot de passe"
                type="password"
                value={password_repeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
              />
              {errorsPasswordRepeat.length > 0 && (
                <p className="text-red-500">
                  {errorsPasswordRepeat.join(", ")}
                </p>
              )}
            </div>
          </div>
        </Form>
        <div className="flex flex-row justify-end items-center gap-2.5 self-stretch w-full md:w-[600px] lg:w-[700px]">
          <Button
            className="flex p-2 items-center gap-2.5 self-stretch w-28 md:w-36 h-10 rounded-xl border-black border bg-transparent text-gray-500 text-base md:text-xl"
            onClick={() => router.back()}
          >
            Retour
          </Button>
          <Button
            className="flex w-28 md:w-36 h-10 p-2 items-center gap-2.5 self-stretch rounded-xl border-black border bg-freehunt-main text-white text-base md:text-xl"
            onClick={handleSubmit}
          >
            Continuer
          </Button>
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
