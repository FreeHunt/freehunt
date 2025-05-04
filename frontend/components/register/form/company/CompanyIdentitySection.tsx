import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyIdentitySectionProps {
  name: string;
  siren: string;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSirenChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyIdentitySection({
  name,
  siren,
  onNameChange,
  onSirenChange,
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
      </div>
    </div>
  );
}