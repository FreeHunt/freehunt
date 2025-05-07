import { Label } from "@/components/ui/label";
import { ProfileUploader } from "@/components/common/upload/ProfilUploader";
import { TipBox } from "@/components/common/banner/TipBox";
import { ZodError, ZodIssue } from "zod";

interface CompanyLogoSectionProps {
  onAvatarChange: (file: File) => void;
  errorLogoSection: ZodError | null;
}

export function CompanyLogoSection({
  onAvatarChange,
  errorLogoSection,
}: CompanyLogoSectionProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="space-y-4">
        <Label htmlFor="companyLogo" className="text-black text-lg font-medium">
          Logo de l&apos;entreprise
        </Label>
        <ProfileUploader onFileChange={onAvatarChange} />
        <TipBox content="Ajouter votre logo renforce la visibilité de votre entreprise auprès de vos interlocuteurs." />
        {errorLogoSection && (
          <p className="text-sm text-red-500">
            {
              errorLogoSection.errors.find(
                (error: ZodIssue) => error.path[0] === "logo",
              )?.message
            }
          </p>
        )}
      </div>
    </div>
  );
}
