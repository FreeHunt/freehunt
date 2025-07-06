import { TipBox } from "@/components/common/banner/TipBox";
import { ProfileUploader } from "@/components/common/upload/ProfilUploader";
import { Label } from "@/components/ui/label";
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
        <Label
          htmlFor="companyLogo"
          className="text-foreground text-lg font-medium"
        >
          Logo de l&apos;entreprise
        </Label>
        <ProfileUploader onFileChange={onAvatarChange} />
        <TipBox content="Votre logo permet aux freelances de vous identifier facilement et renforce votre professionnalisme ! 🎯" />
        {errorLogoSection && (
          <p className="text-sm text-destructive">
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
