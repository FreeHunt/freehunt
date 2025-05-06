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
    <div className="flex flex-col items-center gap-6 md:gap-10 w-full">
      {/* Section Localisation */}
      <div className="flex flex-col justify-center items-center gap-3 md:gap-5 self-stretch w-full">
        <p
          className={`${montserrat.className} text-black text-center text-base md:text-lg font-medium px-2`}
        >
          Quelle est votre localisation ?{" "}
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
          value={location}
          onChange={onLocationChange}
          placeholder="Ex: Paris, Lyon, Bordeaux..."
        />
        {errorLocationSection && (
          <div className="w-full">
            <p
              className={`${montserrat.className} text-red-500 text-center text-sm md:text-base font-medium`}
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

      {/* Section Taux journalier et années d'expérience */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-5 self-stretch w-full">
        {/* Taux journalier */}
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-black text-center text-base md:text-lg font-medium`}
          >
            Quel est votre taux journalier ?
          </p>
          <Input
            type="number"
            className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
            value={averageDailyRate || ""}
            onChange={onRateChange}
            placeholder="€ / jour"
            min="0"
          />
          {errorAverageDailyRateSection && (
            <div className="w-full">
              <p
                className={`${montserrat.className} text-red-500 text-center text-sm md:text-base font-medium`}
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

        {/* Années d'expérience */}
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-black text-center text-base md:text-lg font-medium`}
          >
            Années d&apos;expérience
          </p>
          <Input
            type="number"
            className="w-full h-10 rounded-lg border border-freehunt-black-two text-freehunt-black-two text-sm font-normal"
            value={experienceYear || ""}
            onChange={onExperienceYearChange}
            placeholder="Nombre d'années"
            min="0"
          />
          {errorExperienceYearSection && (
            <div className="w-full">
              <p
                className={`${montserrat.className} text-red-500 text-center text-sm md:text-base font-medium`}
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
