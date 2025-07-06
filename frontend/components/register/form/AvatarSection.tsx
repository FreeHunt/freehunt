import { TipBox } from "@/components/common/banner/TipBox";
import { ProfileUploader } from "@/components/common/upload/ProfilUploader";
import { Montserrat } from "next/font/google";
import { ZodError, ZodIssue } from "zod";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

interface AvatarSectionProps {
  onAvatarChange: (file: File) => void;
  errorAvatarSection: ZodError | null;
}

export function AvatarSection({
  onAvatarChange,
  errorAvatarSection,
}: AvatarSectionProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8 md:gap-10 w-full px-2 sm:px-0">
      <p
        className={`${montserrat.className} text-foreground text-center text-base sm:text-lg font-medium mt-2 sm:mt-0`}
      >
        Ajoutez une photo qui vous représente bien !
      </p>

      {/* ProfileUploader centered with appropriate spacing */}
      <div className="w-full flex justify-center">
        <ProfileUploader onFileChange={onAvatarChange} />
      </div>

      {errorAvatarSection && (
        <div className="flex flex-col justify-center items-center gap-2 sm:gap-4 md:gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-destructive text-center text-sm sm:text-base md:text-lg font-medium`}
          >
            {
              errorAvatarSection.errors.find(
                (error: ZodIssue) => error.path[0] === "avatar",
              )?.message
            }
          </p>
        </div>
      )}

      <div className="w-full mt-1 sm:mt-2">
        <TipBox content="Une photo professionnelle et de bonne qualité augmente considérablement vos chances d'être contacté par les recruteurs." />
      </div>
    </div>
  );
}
