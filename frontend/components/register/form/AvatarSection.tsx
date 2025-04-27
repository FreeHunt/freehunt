import { ProfileUploader } from "@/components/common/upload/ProfilUploader";
import { TipBox } from "@/components/common/banner/TipBox";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

interface AvatarSectionProps {
  onAvatarChange: (fileUrl: string) => void;
}

export function AvatarSection({ onAvatarChange }: AvatarSectionProps) {
  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <p
        className={`${montserrat.className} text-black text-center text-lg font-medium`}
      >
        Uploadez une photo de profil professionnel.
      </p>
      <ProfileUploader onFileChange={onAvatarChange} />
      <TipBox content="Une photo professionnelle et de bonne qualité augmente considérablement vos chances d'être contacté par les recruteurs." />
    </div>
  );
}
