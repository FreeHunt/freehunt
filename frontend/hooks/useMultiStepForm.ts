import { useState } from "react";

export function useMultiStepForm(totalSteps: number) {
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(1);
  
  const isLastSection = currentSection === totalSteps - 1;
  const isFirstSection = currentSection === 0;

  const goToNextSection = (onSubmit?: () => void) => {
    if (currentSection < totalSteps - 1) {
      setDirection(1);
      setCurrentSection(currentSection + 1);
    } else if (onSubmit) {
      onSubmit();
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setDirection(-1);
      setCurrentSection(currentSection - 1);
    }
  };

  const navigateToSection = (nextSection: number) => {
    setDirection(nextSection > currentSection ? 1 : -1);
    setCurrentSection(nextSection);
  };

  return {
    currentSection,
    direction,
    isLastSection,
    isFirstSection,
    goToNextSection,
    goToPreviousSection,
    navigateToSection
  };
}