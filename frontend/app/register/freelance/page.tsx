"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ProfileFormData,
  BlurStates,
  SectionTitle as SectionTitleType,
  RegisterFreelance,
} from "@/actions/register";
import { PreviewCard } from "@/components/common/card/PreviewCard";
import { SectionIndicator } from "@/components/common/Section/SectionIndicator";
import { NavigationButtons } from "@/components/common/Navigation/NavigatorButton";
import { SectionTitle } from "@/components/register/form/SectionTitle";
import { FormSection } from "@/components/register/form/FormSection";
import { IdentitySection } from "@/components/register/form/IdentitySection";
import { LocationRateSection } from "@/components/register/form/LocationSection";
import { SkillsSection } from "@/components/register/form/SkillSection";
import { AvatarSection } from "@/components/register/form/AvatarSection";
import { z } from "zod";
import { Skill } from "@/lib/interfaces";
import { useRouter } from "next/navigation";

const schemaFirstSection = z.object({
  firstName: z.string().min(1, "Le prénom est obligatoire"),
  lastName: z.string().min(1, "Le nom est obligatoire"),
  workField: z.string().min(1, "Le domaine est obligatoire"),
});

const schemaSecondSection = z.object({
  location: z.string().min(1, "La localisation est obligatoire"),
  averageDailyRate: z.number().min(1, "Le TJM est obligatoire"),
  experienceYear: z.number().min(1, "L'année d'expérience est obligatoire"),
});

const schemaThirdSection = z.object({
  skills: z
    .array(
      z.object({
        name: z.string().min(1, "La compétence est obligatoire"),
        type: z.enum(["TECHNICAL", "SOFT"]),
      }),
    )
    .min(1, "Vous devez sélectionner au moins une compétence"),
});

const schemaFourthSection = z.object({
  avatar: z.instanceof(File).refine((file) => file.size > 0, {
    message: "L'avatar est obligatoire",
  }),
});

const schema = [
  schemaFirstSection,
  schemaSecondSection,
  schemaThirdSection,
  schemaFourthSection,
];

function Page() {
  const router = useRouter();
  // État initial du formulaire
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    workField: "",
    location: "",
    averageDailyRate: 0,
    avatar: null,
    skills: [],
    experienceYear: 0,
  });
  const [errorFirstNameSection, setErrorFirstNameSection] =
    useState<z.ZodError | null>(null);
  const [errorLastNameSection, setErrorLastNameSection] =
    useState<z.ZodError | null>(null);
  const [errorWorkFieldSection, setErrorWorkFieldSection] =
    useState<z.ZodError | null>(null);
  const [errorLocationSection, setErrorLocationSection] =
    useState<z.ZodError | null>(null);
  const [errorAverageDailyRateSection, setErrorAverageDailyRateSection] =
    useState<z.ZodError | null>(null);
  const [errorSkillsSection, setErrorSkillsSection] =
    useState<z.ZodError | null>(null);
  const [errorAvatarSection, setErrorAvatarSection] =
    useState<z.ZodError | null>(null);
  const [errorExperienceYearSection, setErrorExperienceYearSection] =
    useState<z.ZodError | null>(null);

  // États pour l'affichage flou
  const [blurStates, setBlurStates] = useState<BlurStates>({
    isFirstNameBlurred: true,
    isLastNameBlurred: true,
    isWorkFieldBlurred: true,
    isLocationBlurred: true,
    isAverageDailyRateBlurred: true,
    isAvatarBlurred: true,
    isSkillsBlurred: true,
    isExperienceYearBlurred: true,
  });

  // État pour suivre la section active
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalSections = 4;

  // Titres dynamiques pour chaque section
  const sectionTitles: SectionTitleType[] = [
    { highlight: "Définissez", regular: "-vous !" },
    { highlight: "Quel est votre ", regular: " TJM ?" },
    { highlight: "Vos compétences", regular: " clés ?" },
    { highlight: "Mettons un visage", regular: " sur votre nom ?" },
  ];

  // Vérifier si c'est la dernière section
  const isLastSection = currentSection === totalSections - 1;
  const isFirstSection = currentSection === 0;

  // Gestionnaires pour les champs de formulaire
  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, firstName: e.target.value });
    setErrorFirstNameSection(null);
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, lastName: e.target.value });
    setErrorLastNameSection(null);
  };

  const handleWorkFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, workField: e.target.value });
    setErrorWorkFieldSection(null);
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, location: e.target.value });
    setErrorLocationSection(null);
  };

  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, averageDailyRate: Number(e.target.value) });
    setErrorAverageDailyRateSection(null);
  };

  const handleAvatarChange = (file: File) => {
    setFormData({ ...formData, avatar: file });
    setErrorAvatarSection(null);
  };

  const handleSkillsChange = (newSkills: Skill[]) => {
    setFormData({ ...formData, skills: newSkills });
    setErrorSkillsSection(null);
  };

  const handleExperienceYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, experienceYear: Number(e.target.value) });
    setErrorExperienceYearSection(null);
  };

  // Gérer la navigation entre les sections
  const goToNextSection = () => {
    const currentSchema = schema[currentSection];
    const result = currentSchema.safeParse(formData);
    if (currentSection === 0) {
      setErrorFirstNameSection(result.error || null);
      setErrorLastNameSection(result.error || null);
      setErrorWorkFieldSection(result.error || null);
    }
    if (currentSection === 1) {
      setErrorLocationSection(result.error || null);
      setErrorAverageDailyRateSection(result.error || null);
      setErrorExperienceYearSection(result.error || null);
    }
    if (currentSection === 2) {
      setErrorSkillsSection(result.error || null);
    }
    if (currentSection === 3) {
      setErrorAvatarSection(result.error || null);
    }
    if (!result.success) {
      return;
    }
    if (currentSection < totalSections - 1) {
      setDirection(1);
      setCurrentSection(currentSection + 1);
    } else {
      handleFormSubmit();
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setDirection(-1);
      setCurrentSection(currentSection - 1);
    }
  };

  // Naviguer vers une section spécifique
  const navigateToSection = (nextSection: number) => {
    setDirection(nextSection > currentSection ? 1 : -1);
    setCurrentSection(nextSection);
  };

  // Soumettre le formulaire
  const handleFormSubmit = async () => {
    await RegisterFreelance(formData);
    alert("Formulaire soumis avec succès!");
    router.push("/");
  };

  // Mettre à jour les états de floutage en fonction des valeurs
  useEffect(() => {
    setBlurStates({
      isFirstNameBlurred: formData.firstName.trim() === "",
      isLastNameBlurred: formData.lastName.trim() === "",
      isWorkFieldBlurred: formData.workField.trim() === "",
      isLocationBlurred: formData.location.trim() === "",
      isAverageDailyRateBlurred: formData.averageDailyRate === 0,
      isAvatarBlurred: formData.avatar === null,
      isSkillsBlurred: formData.skills.length === 0,
      isExperienceYearBlurred: formData.experienceYear === 0,
    });
  }, [formData]);

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 lg:gap-16 my-4 md:my-8 lg:my-20 px-4 md:px-8 lg:px-12">
      {/* Title Section */}
      <div className="flex flex-col justify-center items-center gap-2 self-stretch w-full">
        <div className="flex p-2 md:p-3 lg:p-5 justify-center items-center gap-2 h-12 md:h-16">
          <AnimatePresence mode="wait">
            <SectionTitle
              title={sectionTitles[currentSection]}
              currentSection={currentSection}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-8 lg:gap-12 w-full max-w-6xl">
        {/* Preview Card - Hidden on mobile, shown at top on tablet, left side on desktop */}
        <div className="hidden md:block md:w-1/3 lg:w-1/4 sticky top-24">
          <PreviewCard formData={formData} blurStates={blurStates} />
        </div>

        {/* Mobile-only Preview Card - Shown at top on mobile */}
        <div className="md:hidden w-full mb-4">
          <PreviewCard formData={formData} blurStates={blurStates} />
        </div>

        {/* Form sections with animations */}
        <div className="flex flex-col items-center gap-6 md:gap-8 w-full md:w-2/3 lg:w-3/4">
          <div className="w-full min-h-[400px] md:min-h-[450px] relative">
            <AnimatePresence custom={direction} mode="wait">
              <FormSection
                isActive={currentSection === 0}
                direction={direction}
                key="section1"
              >
                <IdentitySection
                  firstName={formData.firstName}
                  lastName={formData.lastName}
                  workField={formData.workField}
                  onFirstNameChange={handleFirstNameChange}
                  onLastNameChange={handleLastNameChange}
                  onWorkFieldChange={handleWorkFieldChange}
                  errorFirstNameSection={errorFirstNameSection || null}
                  errorLastNameSection={errorLastNameSection || null}
                  errorWorkFieldSection={errorWorkFieldSection || null}
                />
              </FormSection>

              <FormSection
                isActive={currentSection === 1}
                direction={direction}
                key="section2"
              >
                <LocationRateSection
                  location={formData.location}
                  averageDailyRate={formData.averageDailyRate}
                  experienceYear={formData.experienceYear}
                  onLocationChange={handleLocationChange}
                  onRateChange={handleRateChange}
                  onExperienceYearChange={handleExperienceYearChange}
                  errorLocationSection={errorLocationSection}
                  errorAverageDailyRateSection={errorAverageDailyRateSection}
                  errorExperienceYearSection={errorExperienceYearSection}
                />
              </FormSection>

              <FormSection
                isActive={currentSection === 2}
                direction={direction}
                key="section3"
              >
                <SkillsSection
                  skills={formData.skills}
                  onSkillsChange={handleSkillsChange}
                  errorSkillsSection={errorSkillsSection || null}
                />
              </FormSection>

              <FormSection
                isActive={currentSection === 3}
                direction={direction}
                key="section4"
              >
                <AvatarSection
                  onAvatarChange={handleAvatarChange}
                  errorAvatarSection={errorAvatarSection}
                />
              </FormSection>
            </AnimatePresence>
          </div>

          {/* Section indicator and Navigation */}
          <div className="w-full flex flex-col items-center gap-4 md:gap-6 mt-2 md:mt-4">
            <SectionIndicator
              currentSection={currentSection}
              totalSections={totalSections}
              onSectionChange={navigateToSection}
            />

            <NavigationButtons
              onPrevious={goToPreviousSection}
              onNext={goToNextSection}
              isFirstSection={isFirstSection}
              isLastSection={isLastSection}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
