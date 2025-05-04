"use client";

import { AnimatePresence } from "framer-motion";
import { SectionTitle as SectionTitleType } from "@/actions/register";
import { CompanyPreviewCard } from "@/components/common/card/CompanyPreviewCard";
import { FormSection } from "@/components/register/form/FormSection";
import { CompanyIdentitySection } from "@/components/register/form/company/CompanyIdentitySection";
import { CompanyAddressSection } from "@/components/register/form/company/CompanyAddressSection";
import { CompanyDescriptionSection } from "@/components/register/form/company/CompanyDescriptionSection";
import { CompanyLogoSection } from "@/components/register/form/company/CompanyLogoSection";
import { RegisterPageLayout } from "@/components/register/RegisterPageLayout";
import { FormContainer } from "@/components/register/FormContainer";
import { FormNavigator } from "@/components/register/FormNavigator";
import { useMultiStepForm } from "@/hooks/useMultiStepForm";
import { useCompanyFormData } from "@/hooks/useCompanyFormData";

export default function CompanyRegisterPage() {
  {/* Utilisation des hooks faits maison pour gérer les états du formulaire et la navigation */}
  const totalSections = 4;

  const {
    formData,
    companyBlurStates,
    handleNameChange,
    handleSirenChange,
    handleAddressChange,
    handleDescriptionChange,
    handleLogoChange,
  } = useCompanyFormData();

  const {
    currentSection,
    direction,
    isFirstSection,
    isLastSection,
    goToNextSection,
    goToPreviousSection,
    navigateToSection,
  } = useMultiStepForm(totalSections);

  const sectionTitles: SectionTitleType[] = [
    { highlight: "Identifiez", regular: " votre entreprise" },
    { highlight: "Où se situe", regular: " votre entreprise ?" },
    { highlight: "Décrivez", regular: " votre activité" },
    { highlight: "Ajoutez votre", regular: " logo d'entreprise" },
  ];

  const handleFormSubmit = () => {
    console.log("Formulaire entreprise soumis", formData);
    alert("Inscription de l'entreprise soumise avec succès!");
  };

  const handleNext = () =>
    goToNextSection(isLastSection ? handleFormSubmit : undefined);

  return (
    <RegisterPageLayout
      sectionTitles={sectionTitles}
      currentSection={currentSection}
    >
      <FormContainer
        previewCard={
          <CompanyPreviewCard formData={formData} companyBlurStates={companyBlurStates} />
        }
        formContent={
          <>
            <AnimatePresence custom={direction} mode="wait">
              <FormSection
                isActive={currentSection === 0}
                direction={direction}
                key="section1"
              >
                <CompanyIdentitySection
                  name={formData.name}
                  siren={formData.siren}
                  onNameChange={handleNameChange}
                  onSirenChange={handleSirenChange}
                />
              </FormSection>

              <FormSection
                isActive={currentSection === 1}
                direction={direction}
                key="section2"
              >
                <CompanyAddressSection
                  address={formData.address}
                  onAddressChange={handleAddressChange}
                />
              </FormSection>

              <FormSection
                isActive={currentSection === 2}
                direction={direction}
                key="section3"
              >
                <CompanyDescriptionSection
                  description={formData.description}
                  onDescriptionChange={handleDescriptionChange}
                />
              </FormSection>

              <FormSection
                isActive={currentSection === 3}
                direction={direction}
                key="section4"
              >
                <CompanyLogoSection onAvatarChange={handleLogoChange} />
              </FormSection>
            </AnimatePresence>

            <FormNavigator
              currentSection={currentSection}
              totalSections={totalSections}
              onSectionChange={navigateToSection}
              onPrevious={goToPreviousSection}
              onNext={handleNext}
              isFirstSection={isFirstSection}
              isLastSection={isLastSection}
            />
          </>
        }
      />
    </RegisterPageLayout>
  );
}
