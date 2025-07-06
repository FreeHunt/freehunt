import { BlurStates, ProfileFormData } from "@/actions/register";
import { Button } from "@/components/common/button";
import { LocationIcon } from "@/components/common/icons/LocationIcon";
import Image from "next/image";

interface PreviewCardProps {
  formData: ProfileFormData;
  blurStates: BlurStates;
}

export function PreviewCard({ formData, blurStates }: PreviewCardProps) {
  // Fonctions d'affichage pour les champs
  const displayFirstName = () =>
    formData.firstName.trim() === "" ? "John" : formData.firstName.trim();
  const displayLastName = () =>
    formData.lastName.trim() === "" ? "Doe" : formData.lastName.trim();
  const displayWorkField = () =>
    formData.workField.trim() === ""
      ? "Développeur Full Stack"
      : formData.workField.trim();
  const displayLocation = () =>
    formData.location.trim() === ""
      ? "Paris, France"
      : formData.location.trim();
  const displayAverageDailyRate = () =>
    formData.averageDailyRate === 0 ? "" : `${formData.averageDailyRate}`;
  const displayExperience = () =>
    formData.experienceYear === 0 ? "1" : `${formData.experienceYear}`;

  // Compétences par défaut
  const defaultTechnicalSkills = ["React", "TypeScript", "Node.js"];
  const defaultSoftSkills = ["Communication", "Leadership"];

  // Récupérer les compétences techniques et soft
  const technicalSkills = formData.skills
    ? formData.skills
        .filter((skill) => skill.type === "TECHNICAL")
        .map((skill) => skill.name)
    : [];

  const softSkills = formData.skills
    ? formData.skills
        .filter((skill) => skill.type === "SOFT")
        .map((skill) => skill.name)
    : [];

  const fileUrl = formData.avatar ? URL.createObjectURL(formData.avatar) : "";

  return (
    <div className="flex w-80 h-full flex-col align-start border border-border rounded-xl bg-card shadow-lg overflow-hidden">
      <div className="flex p-6 flex-col items-start gap-5 self-stretch">
        <div className="flex justify-start gap-5">
          <div
            className={`w-14 h-14 rounded-full bg-freehunt-main/10 overflow-hidden ring-2 ring-freehunt-main/20 flex-shrink-0 ${
              blurStates.isAvatarBlurred ? "blur-sm" : ""
            }`}
          >
            {fileUrl ? (
              <div className="w-full h-full relative">
                <Image
                  src={fileUrl}
                  alt="Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-freehunt-main/10 flex items-center justify-center">
                <span className="text-freehunt-main text-lg font-semibold">
                  {displayFirstName().charAt(0)}
                  {displayLastName().charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-row items-start gap-2">
                <p
                  className={`text-foreground text-xl font-bold ${
                    blurStates.isFirstNameBlurred ? "blur-sm" : ""
                  } text-wrap`}
                >
                  {displayFirstName()}
                </p>
                <p
                  className={`text-foreground text-xl font-bold text-wrap ${
                    blurStates.isLastNameBlurred ? "blur-sm" : ""
                  }`}
                >
                  {displayLastName()}
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <p
                  className={`text-freehunt-main text-sm font-medium ${
                    blurStates.isWorkFieldBlurred ? "blur-sm" : ""
                  }`}
                >
                  {displayWorkField()}
                </p>
                <p
                  className={`text-muted-foreground text-sm font-normal ${
                    blurStates.isExperienceYearBlurred ? "blur-sm" : ""
                  }`}
                >
                  {displayExperience()}{" "}
                  {parseInt(displayExperience()) > 1 ? "ans" : "an"}{" "}
                  d&apos;expérience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <LocationIcon />
              <p
                className={`text-muted-foreground text-sm font-normal ${
                  blurStates.isLocationBlurred ? "blur-sm" : ""
                }`}
              >
                {displayLocation()}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Skills Section */}
        {(technicalSkills.length > 0 || defaultTechnicalSkills.length > 0) && (
          <div className="flex flex-col w-full gap-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Compétences techniques
            </p>
            <div className="flex justify-start items-center gap-2 flex-wrap">
              {technicalSkills.length > 0
                ? technicalSkills.map((skill, index) => (
                    <div
                      key={`tech-${index}`}
                      className="flex py-1.5 px-3 justify-center items-center rounded-md bg-freehunt-main/10 border border-freehunt-main/20 mb-2"
                    >
                      <p className="text-freehunt-main text-xs font-medium truncate max-w-20">
                        {skill}
                      </p>
                    </div>
                  ))
                : defaultTechnicalSkills.map((skill, index) => (
                    <div
                      key={`tech-${index}`}
                      className={`flex py-1.5 px-3 justify-center items-center rounded-md bg-freehunt-main/10 border border-freehunt-main/20 mb-2 ${
                        blurStates.isSkillsBlurred ? "blur-sm" : ""
                      }`}
                    >
                      <p className="text-freehunt-main text-xs font-medium truncate max-w-20">
                        {skill}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* Soft Skills Section */}
        {(softSkills.length > 0 || defaultSoftSkills.length > 0) && (
          <div className="flex flex-col w-full gap-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Soft Skills
            </p>
            <div className="flex justify-start items-center gap-2 flex-wrap">
              {softSkills.length > 0
                ? softSkills.map((skill, index) => (
                    <div
                      key={`soft-${index}`}
                      className="flex py-1.5 px-3 justify-center items-center rounded-md bg-muted border border-border mb-2"
                    >
                      <p className="text-foreground text-xs font-medium truncate max-w-20">
                        {skill}
                      </p>
                    </div>
                  ))
                : defaultSoftSkills.map((skill, index) => (
                    <div
                      key={`soft-${index}`}
                      className={`flex py-1.5 px-3 justify-center items-center rounded-md bg-muted border border-border mb-2 ${
                        blurStates.isSkillsBlurred ? "blur-sm" : ""
                      }`}
                    >
                      <p className="text-foreground text-xs font-medium truncate max-w-20">
                        {skill}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex h-16 p-6 justify-between items-center self-stretch border-t border-border bg-muted/30">
        <div
          className={`flex items-baseline gap-1 ${
            blurStates.isAverageDailyRateBlurred ? "blur-sm" : ""
          }`}
        >
          <p className="text-freehunt-main text-lg font-bold">
            {displayAverageDailyRate()} €
          </p>
          <p className="text-muted-foreground text-sm font-normal">/ jour</p>
        </div>
        <div className="flex p-2 justify-center items-center gap-3">
          <Button className="bg-freehunt-main hover:bg-freehunt-main/90 text-xs font-medium text-white rounded-lg px-3 py-2 transition-colors">
            Aperçu du profil
          </Button>
        </div>
      </div>
    </div>
  );
}
