import { Label } from "@/components/ui/label";
import { ProfileUploader } from "@/components/common/upload/ProfilUploader";
import { TipBox } from "@/components/common/banner/TipBox";

interface CompanyLogoSectionProps {
  onAvatarChange: (fileUrl: string) => void;
}

export function CompanyLogoSection({ onAvatarChange }: CompanyLogoSectionProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-4">
        <Label htmlFor="companyLogo" className="text-black text-lg font-medium">
          Logo de l&apos;entreprise
        </Label>
        <ProfileUploader onFileChange={onAvatarChange} />
        <TipBox content="Ajouter votre logo renforce la visibilité de votre entreprise auprès de vos interlocuteurs." />
      </div>
    </div>
  );
}