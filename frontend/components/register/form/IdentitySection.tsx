import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Montserrat } from "next/font/google";
import { ZodError, ZodIssue } from "zod";
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

interface IdentitySectionProps {
  firstName: string;
  lastName: string;
  workField: string;
  onFirstNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onWorkFieldChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorFirstNameSection: ZodError | null;
  errorLastNameSection: ZodError | null;
  errorWorkFieldSection: ZodError | null;
}

export function IdentitySection({
  firstName,
  lastName,
  workField,
  onFirstNameChange,
  onLastNameChange,
  onWorkFieldChange,
  errorFirstNameSection,
  errorLastNameSection,
  errorWorkFieldSection,
}: IdentitySectionProps) {
  return (
    <div className="flex flex-col items-center gap-6 md:gap-10 w-full">
      {/* Première ligne (nom et prénom) - empilés sur mobile, côte à côte sur tablette/desktop */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 self-stretch w-full">
        {/* Champ prénom */}
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-black text-center text-base md:text-lg font-medium`}
          >
            Votre prénom
          </p>
          <Input
            type="text"
            className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
            value={firstName}
            onChange={onFirstNameChange}
            placeholder="Prénom"
          />
          {errorFirstNameSection && (
            <div className="flex flex-col justify-center items-center self-stretch w-full">
              <p
                className={`${montserrat.className} text-red-500 text-center text-sm md:text-base font-medium`}
              >
                {
                  errorFirstNameSection.errors.find(
                    (error: ZodIssue) => error.path[0] === "firstName",
                  )?.message
                }
              </p>
            </div>
          )}
        </div>

        {/* Champ nom */}
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-black text-center text-base md:text-lg font-medium`}
          >
            Votre nom
          </p>
          <Input
            type="text"
            className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
            value={lastName}
            onChange={onLastNameChange}
            placeholder="Nom"
          />
          {errorLastNameSection && (
            <div className="flex flex-col justify-center items-center self-stretch w-full">
              <p
                className={`${montserrat.className} text-red-500 text-center text-sm md:text-base font-medium`}
              >
                {
                  errorLastNameSection.errors.find(
                    (error: ZodIssue) => error.path[0] === "lastName",
                  )?.message
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Champ métier */}
      <div className="flex flex-col justify-center items-center gap-3 md:gap-5 self-stretch w-full mt-2 md:mt-0">
        <p
          className={`${montserrat.className} text-black text-center text-base md:text-lg font-medium px-2`}
        >
          Quel est le nom du métier qui représente votre expertise ?{" "}
          <span className="hidden md:inline">
            <br />
            (les recruteurs vous trouveront via ces informations)
          </span>
          <span className="inline md:hidden text-xs text-gray-600 block mt-1">
            (les recruteurs vous trouveront via ces informations)
          </span>
        </p>
        <Input
          type="text"
          className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
          value={workField}
          onChange={onWorkFieldChange}
          placeholder="Ex: Développeur web, UX Designer, etc."
        />
        {errorWorkFieldSection && (
          <div className="flex flex-col justify-center items-center self-stretch w-full">
            <p
              className={`${montserrat.className} text-red-500 text-center text-sm md:text-base font-medium`}
            >
              {
                errorWorkFieldSection.errors.find(
                  (error: ZodIssue) => error.path[0] === "workField",
                )?.message
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
