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
    <div className="flex w-80 h-full flex-col align-start border-black border rounded-xl bg-white">
      <div className="flex p-6 flex-col items-start gap-5 self-stretch">
        <div className="flex justify-start gap-5">
          <div
            className={`flex w-14 h-14 rounded-full bg-freehunt-main overflow-hidden ${
              blurStates.isAvatarBlurred ? "blur-sm" : ""
            }`}
          >
            <Image
              src={fileUrl}
              alt="Avatar"
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex flex-col items-start gap-2">
              <div className="flex flex-row items-start gap-2">
                <p
                  className={`text-freehunt-black-two text-xl font-bold ${
                    blurStates.isFirstNameBlurred ? "blur-sm" : ""
                  } text-wrap`}
                >
                  {displayFirstName()}
                </p>
                <p
                  className={`text-freehunt-black-two text-xl font-bold text-wrap ${
                    blurStates.isLastNameBlurred ? "blur-sm" : ""
                  }`}
                >
                  {displayLastName()}
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <p
                  className={`text-freehunt-black-two text-sm font-normal ${
                    blurStates.isWorkFieldBlurred ? "blur-sm" : ""
                  }`}
                >
                  {displayWorkField()}
                </p>
                <span className="text-gray-500">•</span>
                <p
                  className={`text-freehunt-black-two text-sm font-normal ${
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
                className={`text-freehunt-black-two text-sm font-normal ${
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
          <div className="flex flex-col w-full gap-1">
            <p className="text-xs font-semibold text-gray-500">
              COMPÉTENCES TECHNIQUES
            </p>
            <div className="flex justify-start items-center gap-2 flex-wrap">
              {technicalSkills.length > 0
                ? technicalSkills.map((skill, index) => (
                    <div
                      key={`tech-${index}`}
                      className="flex py-1.5 px-2.5 justify-center items-center rounded-md border border-freehunt-black-two bg-muted mb-2"
                    >
                      <p className="text-freehunt-black-two text-xs font-normal truncate max-w-16">
                        {skill}
                      </p>
                    </div>
                  ))
                : defaultTechnicalSkills.map((skill, index) => (
                    <div
                      key={`tech-${index}`}
                      className={`flex py-1.5 px-2.5 justify-center items-center rounded-md border border-freehunt-black-two bg-muted mb-2 ${
                        blurStates.isSkillsBlurred ? "blur-sm" : ""
                      }`}
                    >
                      <p className="text-freehunt-black-two text-xs font-normal truncate max-w-16">
                        {skill}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* Soft Skills Section */}
        {(softSkills.length > 0 || defaultSoftSkills.length > 0) && (
          <div className="flex flex-col w-full gap-1">
            <p className="text-xs font-semibold text-gray-500">SOFT SKILLS</p>
            <div className="flex justify-start items-center gap-2 flex-wrap">
              {softSkills.length > 0
                ? softSkills.map((skill, index) => (
                    <div
                      key={`soft-${index}`}
                      className="flex py-1.5 px-2.5 justify-center items-center rounded-md border border-freehunt-black-two bg-accent mb-2"
                    >
                      <p className="text-freehunt-black-two text-xs font-normal truncate max-w-16">
                        {skill}
                      </p>
                    </div>
                  ))
                : defaultSoftSkills.map((skill, index) => (
                    <div
                      key={`soft-${index}`}
                      className={`flex py-1.5 px-2.5 justify-center items-center rounded-md border border-freehunt-black-two bg-accent mb-2 ${
                        blurStates.isSkillsBlurred ? "blur-sm" : ""
                      }`}
                    >
                      <p className="text-freehunt-black-two text-xs font-normal truncate max-w-16">
                        {skill}
                      </p>
                    </div>
                  ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex h-16 p-6 justify-between items-center self-stretch border-t border-black">
        <div
          className={`flex items-start ${
            blurStates.isAverageDailyRateBlurred ? "blur-sm" : ""
          }`}
        >
          <p className="text-freehunt-black-two text-sm font-bold">
            {displayAverageDailyRate()} €
          </p>
          <p className="text-freehunt-black-two text-sm font-normal">/ jour</p>
        </div>
        <div className="flex p-2 justify-center items-center gap-3">
          <Button className="bg-freehunt-main text-sm font-bold border border-freehunt-main text-white rounded-full px-4 py-2">
            Voir votre profil
          </Button>
        </div>
      </div>
    </div>
  );
}
