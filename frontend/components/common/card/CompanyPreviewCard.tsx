import Image from "next/image";
import { Button } from "@/components/common/button";
import { LocationIcon } from "@/components/common/icons/LocationIcon";
import { CompanyPreviewCardProps } from "@/actions/register";
import { BuildingIcon } from "lucide-react";

export function CompanyPreviewCard({ formData, companyBlurStates }: CompanyPreviewCardProps) {
  const trimmedName = formData.name.trim();
  const trimmedSiren = formData.siren.trim();
  const trimmedAddress = formData.address.trim();
  const trimmedDescription = formData.description.trim();
  
  const displayName = () =>
    trimmedName === "" ? "Acme Inc" : trimmedName;

  const displaySiren = () =>
    trimmedSiren === "" ? "123456789" : trimmedSiren;

  const displayAddress = () =>
    trimmedAddress === "" ? "Paris, France" : trimmedAddress;

  const displayDescription = () =>
    trimmedDescription === "" 
      ? "Description de l'entreprise"
      : trimmedDescription;
      
  const displayLogo = () =>
    formData.logo === "" ? "/images/company-logo.png" : formData.logo;

  return (
    <div className="flex w-80 h-full flex-col align-start border-black border rounded-2xl md:rounded-3xl lg:rounded-4xl bg-zinc-50">
      <div className="flex p-6 flex-col items-start gap-5 self-stretch">
        <div className="flex justify-start gap-5">
          <div
            className={`flex w-14 h-14 rounded-full bg-freehunt-main overflow-hidden ${
              companyBlurStates.isLogoBlurred ? "blur-sm" : ""
            }`}
          >
            {formData.logo ? (
              <Image
                src={displayLogo()}
                alt="Logo de l'entreprise"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <BuildingIcon size={28} className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-row items-start gap-2">
                <p
                  className={`text-freehunt-black-two text-xl font-bold ${
                    companyBlurStates.isNameBlurred ? "blur-sm" : ""
                  }`}
                >
                  {displayName()}
                </p>
              </div>
              <p
                className={`text-freehunt-black-two text-sm font-normal ${
                  companyBlurStates.isSirenBlurred ? "blur-sm" : ""
                }`}
              >
                SIREN: {displaySiren()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <LocationIcon />
              <p
                className={`text-freehunt-black-two text-sm font-normal ${
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
          className={`w-full text-sm text-freehunt-black-two ${
            companyBlurStates.isDescriptionBlurred ? "blur-sm" : ""
          }`}
        >
          <p className="line-clamp-3">{displayDescription()}</p>
        </div>
      </div>
      <div className="flex h-16 p-6 justify-between items-center self-stretch border-t border-black">
        <div></div>
        <div className="flex p-2 justify-center items-center gap-3">
          <Button className="bg-freehunt-main text-sm font-bold border border-freehunt-main text-white rounded-full px-4 py-2">
            Voir le profil
          </Button>
        </div>
      </div>
    </div>
  );
}