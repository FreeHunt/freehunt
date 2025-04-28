import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

interface LocationRateSectionProps {
  location: string;
  averageDailyRate: number;
  onLocationChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRateChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function LocationRateSection({
  location,
  averageDailyRate,
  onLocationChange,
  onRateChange,
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
      </div>
      <div className="flex flex-col justify-center items-center gap-5 self-stretch">
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
      </div>
    </div>
  );
}
