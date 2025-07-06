import { CompanyPreviewCardProps } from "@/actions/register";
import { Button } from "@/components/common/button";
import { LocationIcon } from "@/components/common/icons/LocationIcon";
import { BuildingIcon } from "lucide-react";
import Image from "next/image";

export function CompanyPreviewCard({
  formData,
  companyBlurStates,
}: CompanyPreviewCardProps) {
  const trimmedName = formData.name.trim();
  const trimmedSiren = formData.siren.trim();
  const trimmedAddress = formData.address.trim();
  const trimmedDescription = formData.description.trim();

  const displayName = () => (trimmedName === "" ? "Acme Inc" : trimmedName);

  const displaySiren = () => (trimmedSiren === "" ? "123456789" : trimmedSiren);

  const displayAddress = () =>
    trimmedAddress === "" ? "Paris, France" : trimmedAddress;

  const displayDescription = () =>
    trimmedDescription === ""
      ? "Une entreprise innovante qui façonne l'avenir avec passion et expertise."
      : trimmedDescription;

  const fileUrl = formData.logo ? URL.createObjectURL(formData.logo) : "";

  return (
    <div className="flex w-80 h-full flex-col align-start border border-border rounded-xl bg-card shadow-lg overflow-hidden">
      <div className="flex p-6 flex-col items-start gap-5 self-stretch">
        <div className="flex justify-start gap-5">
          <div
            className={`w-14 h-14 rounded-full bg-freehunt-main/10 overflow-hidden ring-2 ring-freehunt-main/20 flex-shrink-0 ${
              companyBlurStates.isLogoBlurred ? "blur-sm" : ""
            }`}
          >
            {formData.logo ? (
              <div className="w-full h-full relative">
                <Image
                  src={fileUrl}
                  alt="Logo de l'entreprise"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-freehunt-main/10 flex items-center justify-center">
                <BuildingIcon size={28} className="text-freehunt-main" />
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-row items-start gap-2">
                <p
                  className={`text-foreground text-xl font-bold ${
                    companyBlurStates.isNameBlurred ? "blur-sm" : ""
                  } text-wrap`}
                >
                  {displayName()}
                </p>
              </div>
              <p
                className={`text-freehunt-main text-sm font-medium ${
                  companyBlurStates.isSirenBlurred ? "blur-sm" : ""
                }`}
              >
                SIREN: {displaySiren()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <LocationIcon />
              <p
                className={`text-muted-foreground text-sm font-normal ${
                  companyBlurStates.isAddressBlurred ? "blur-sm" : ""
                }`}
              >
                {displayAddress()}
              </p>
            </div>
          </div>
        </div>

        {/* Description de l'entreprise */}
        <div
          className={`w-full text-sm text-foreground ${
            companyBlurStates.isDescriptionBlurred ? "blur-sm" : ""
          }`}
        >
          <p className="line-clamp-3 leading-relaxed">{displayDescription()}</p>
        </div>
      </div>
      <div className="flex h-16 p-6 justify-between items-center self-stretch border-t border-border bg-muted/30">
        <div></div>
        <div className="flex p-2 justify-center items-center gap-3">
          <Button className="bg-freehunt-main hover:bg-freehunt-main/90 text-xs font-medium text-white rounded-lg px-3 py-2 transition-colors">
            Aperçu du profil
          </Button>
        </div>
      </div>
    </div>
  );
}
