"use client";

import { AnimatePresence } from "framer-motion";
import {
  RegisterCompany,
  SectionTitle as SectionTitleType,
} from "@/actions/register";
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
import { useRouter } from "next/navigation";

export default function CompanyRegisterPage() {
  const router = useRouter();

  const totalSections = 4;

  const {
    formData,
    companyBlurStates,
    errorNameSection,
    errorSirenSection,
    errorAddressSection,
    errorDescriptionSection,
    errorLogoSection,
    handleNameChange,
    handleSirenChange,
    handleAddressChange,
    handleDescriptionChange,
    handleLogoChange,
    setErrorNameSection,
    setErrorSirenSection,
    setErrorAddressSection,
    setErrorDescriptionSection,
    setErrorLogoSection,
    schema,
  } = useCompanyFormData();

  const {
    currentSection,
    direction,
    isFirstSection,
    isLastSection,
    goToPreviousSection,
    navigateToSection,
    setDirection,
    setCurrentSection,
  } = useMultiStepForm(totalSections);

  const sectionTitles: SectionTitleType[] = [
    { highlight: "Identifiez", regular: " votre entreprise" },
    { highlight: "Où se situe", regular: " votre entreprise ?" },
    { highlight: "Décrivez", regular: " votre activité" },
    { highlight: "Ajoutez votre", regular: " logo d'entreprise" },
  ];

  const handleFormSubmit = async () => {
    console.log("Formulaire entreprise soumis", formData);
    await RegisterCompany(formData);
    alert("Inscription de l'entreprise soumise avec succès!");
    router.push("/");
  };

  const goToNextSection = () => {
    const currentSchema = schema[currentSection];
    const result = currentSchema.safeParse(formData);
    if (currentSection === 0) {
      setErrorNameSection(result.error || null);
      setErrorSirenSection(result.error || null);
    }
    if (currentSection === 1) {
      setErrorAddressSection(result.error || null);
    }
    if (currentSection === 2) {
      setErrorDescriptionSection(result.error || null);
    }
    if (currentSection === 3) {
      setErrorLogoSection(result.error || null);
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

  return (
    <RegisterPageLayout
      sectionTitles={sectionTitles}
      currentSection={currentSection}
    >
      <FormContainer
        previewCard={
          <CompanyPreviewCard
            formData={formData}
            companyBlurStates={companyBlurStates}
          />
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
                  errorNameSection={errorNameSection}
                  errorSirenSection={errorSirenSection}
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
                  errorAddressSection={errorAddressSection}
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
                  errorDescriptionSection={errorDescriptionSection}
                />
              </FormSection>

              <FormSection
                isActive={currentSection === 3}
                direction={direction}
                key="section4"
              >
                <CompanyLogoSection
                  onAvatarChange={handleLogoChange}
                  errorLogoSection={errorLogoSection}
                />
              </FormSection>
            </AnimatePresence>

            <FormNavigator
              currentSection={currentSection}
              totalSections={totalSections}
              onSectionChange={navigateToSection}
              onPrevious={goToPreviousSection}
              onNext={goToNextSection}
              isFirstSection={isFirstSection}
              isLastSection={isLastSection}
            />
          </>
        }
      />
    </RegisterPageLayout>
  );
}
