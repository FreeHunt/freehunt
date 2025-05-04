import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyAddressSectionProps {
  address: string;
  onAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyAddressSection({
  address,
  onAddressChange,
}: CompanyAddressSectionProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-2">
        <Label htmlFor="companyAddress">Adresse complète</Label>
        <Input
          id="companyAddress"
          placeholder="Ex: 123 Avenue des Champs-Élysées, 75008 Paris"
          value={address}
          onChange={onAddressChange}
          required
        />
        <p className="text-sm text-gray-500">
          Indiquez l&apos;adresse complète du siège social de votre entreprise.
        </p>
      </div>
    </div>
  );
}