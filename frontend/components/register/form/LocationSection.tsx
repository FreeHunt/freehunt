import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Montserrat } from "next/font/google";
import { ZodIssue } from "zod";
import { ZodError } from "zod";
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

interface LocationRateSectionProps {
  location: string;
  averageDailyRate: number;
  experienceYear: number;
  onLocationChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onExperienceYearChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorLocationSection: ZodError | null;
  errorAverageDailyRateSection: ZodError | null;
  errorExperienceYearSection: ZodError | null;
}

export function LocationRateSection({
  location,
  averageDailyRate,
  experienceYear,
  onLocationChange,
  onRateChange,
  onExperienceYearChange,
  errorLocationSection,
  errorAverageDailyRateSection,
  errorExperienceYearSection,
}: LocationRateSectionProps) {
  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <div className="flex flex-col justify-center items-center gap-5 self-stretch">
        <p
          className={`${montserrat.className} text-black text-center text-lg font-medium`}
        >
          Quelle est votre localisation ? <br />
          (les recruteurs vous trouveront via ces informations)
        </p>
        <Input
          type="text"
          className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
          value={location}
          onChange={onLocationChange}
        />
        {errorLocationSection && (
          <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
            <p
              className={`${montserrat.className} text-red-500 text-center text-lg font-medium`}
            >
              {
                errorLocationSection.errors.find(
                  (error: ZodIssue) => error.path[0] === "location",
                )?.message
              }
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-row justify-center items-center gap-5 self-stretch">
        <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-black text-center text-lg font-medium`}
          >
            Quel est votre taux journalier ?
          </p>
          <Input
            type="number"
            className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
            value={averageDailyRate || ""}
            onChange={onRateChange}
          />
          {errorAverageDailyRateSection && (
            <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
              <p
                className={`${montserrat.className} text-red-500 text-center text-lg font-medium`}
              >
                {
                  errorAverageDailyRateSection.errors.find(
                    (error: ZodIssue) => error.path[0] === "averageDailyRate",
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
            Quel est votre année d&apos;expérience ?
          </p>
          <Input
            type="number"
            className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
            value={experienceYear || ""}
            onChange={onExperienceYearChange}
          />
          {errorExperienceYearSection && (
            <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
              <p
                className={`${montserrat.className} text-red-500 text-center text-lg font-medium`}
              >
                {
                  errorExperienceYearSection.errors.find(
                    (error: ZodIssue) => error.path[0] === "experienceYear",
                  )?.message
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
