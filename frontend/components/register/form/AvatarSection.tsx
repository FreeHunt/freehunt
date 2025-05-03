import { ProfileUploader } from "@/components/common/upload/ProfilUploader";
import { TipBox } from "@/components/common/banner/TipBox";
import { Montserrat } from "next/font/google";
import { ZodError, ZodIssue } from "zod";
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

interface AvatarSectionProps {
  onAvatarChange: (fileUrl: string) => void;
  errorAvatarSection: ZodError | null;
}

export function AvatarSection({
  onAvatarChange,
  errorAvatarSection,
}: AvatarSectionProps) {
  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <p
        className={`${montserrat.className} text-black text-center text-lg font-medium`}
      >
        Uploadez une photo de profil professionnel.
      </p>
      <ProfileUploader onFileChange={onAvatarChange} />
      {errorAvatarSection && (
        <div className="flex flex-col justify-center items-center gap-5 self-stretch w-full">
          <p
            className={`${montserrat.className} text-red-500 text-center text-lg font-medium`}
          >
            {
              errorAvatarSection.errors.find(
                (error: ZodIssue) => error.path[0] === "avatar",
              )?.message
            }
          </p>
        </div>
      )}
      <TipBox content="Une photo professionnelle et de bonne qualité augmente considérablement vos chances d'être contacté par les recruteurs." />
    </div>
  );
}
