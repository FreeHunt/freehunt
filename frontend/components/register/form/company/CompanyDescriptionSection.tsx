import { ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ZodError, ZodIssue } from "zod";

interface CompanyDescriptionSectionProps {
  description: string;
  onDescriptionChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  errorDescriptionSection: ZodError | null;
}

export function CompanyDescriptionSection({
  description,
  onDescriptionChange,
  errorDescriptionSection,
}: CompanyDescriptionSectionProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-2">
        <Label htmlFor="companyDescription">
          Description de l&apos;entreprise
        </Label>
        <Textarea
          id="companyDescription"
          placeholder="Décrivez l'activité de votre entreprise, vos services, votre histoire..."
          value={description}
          onChange={onDescriptionChange}
          rows={5}
          required
        />
        <p className="text-sm text-gray-500">
          Cette description sera visible sur votre profil et aidera les
          freelances à comprendre votre activité.
        </p>
        {errorDescriptionSection && (
          <p className="text-sm text-red-500">
            {
              errorDescriptionSection.errors.find(
                (error: ZodIssue) => error.path[0] === "description",
              )?.message
            }
          </p>
        )}
      </div>
    </div>
  );
}
