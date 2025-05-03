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
    <div className="flex flex-col items-center gap-10 w-full">
      <div className="flex flex-row items-center gap-10 self-stretch">
        <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-black text-center text-lg font-medium`}
          >
            Votre prénom
          </p>
          <Input
            type="text"
            className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
            value={firstName}
            onChange={onFirstNameChange}
          />
          {errorFirstNameSection && (
            <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
              <p
                className={`${montserrat.className} text-red-500 text-center text-lg font-medium`}
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
        <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-black text-center text-lg font-medium`}
          >
            Votre nom
          </p>
          <Input
            type="text"
            className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
            value={lastName}
            onChange={onLastNameChange}
          />
          {errorLastNameSection && (
            <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
              <p
                className={`${montserrat.className} text-red-500 text-center text-lg font-medium`}
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
      <div className="flex flex-col justify-center items-center gap-5 self-stretch">
        <p
          className={`${montserrat.className} text-black text-center text-lg font-medium`}
        >
          Quel est le nom du métier qui représente votre expertise ? <br />
          (les recruteurs vous trouveront via ces informations)
        </p>
        <Input
          type="text"
          className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
          value={workField}
          onChange={onWorkFieldChange}
        />
      </div>
      {errorWorkFieldSection && (
        <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-red-500 text-center text-lg font-medium`}
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
  );
}
