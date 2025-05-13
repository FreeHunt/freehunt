import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ZodError, ZodIssue } from "zod";

interface CompanyIdentitySectionProps {
  name: string;
  siren: string;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSirenChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errorNameSection: ZodError | null;
  errorSirenSection: ZodError | null;
}

export function CompanyIdentitySection({
  name,
  siren,
  onNameChange,
  onSirenChange,
  errorNameSection,
  errorSirenSection,
}: CompanyIdentitySectionProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-2">
        <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
        <Input
          id="companyName"
          placeholder="Ex: Acme Inc"
          value={name}
          onChange={onNameChange}
          required
        />
        {errorNameSection && (
          <p className="text-sm text-red-500">
            {
              errorNameSection.errors.find(
                (error: ZodIssue) => error.path[0] === "name",
              )?.message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="companySiren">Numéro SIREN (9 chiffres)</Label>
        <Input
          id="companySiren"
          placeholder="Ex: 123456789"
          value={siren}
          onChange={onSirenChange}
          maxLength={9}
          pattern="[0-9]{9}"
          required
        />
        <p className="text-sm text-gray-500">
          Le numéro SIREN est un identifiant unique à 9 chiffres attribué à
          chaque entreprise française.
        </p>
        {errorSirenSection && (
          <p className="text-sm text-red-500">
            {
              errorSirenSection.errors.find(
                (error: ZodIssue) => error.path[0] === "siren",
              )?.message
            }
          </p>
        )}
      </div>
    </div>
  );
}
