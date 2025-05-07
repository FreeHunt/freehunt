import { useState, useCallback } from "react";

export function useMultiStepForm(totalSteps: number) {
  const [currentSection, setCurrentSection] = useState(0);
  const [direction, setDirection] = useState(1);

  const isLastSection = currentSection === totalSteps - 1;
  const isFirstSection = currentSection === 0;

  const goToNextSection = useCallback(
    (onSubmit?: () => void) => {
      if (currentSection < totalSteps - 1) {
        setDirection(1);
        setCurrentSection((prev) => prev + 1);
      } else if (onSubmit) {
        onSubmit();
      }
    },
    [currentSection, totalSteps],
  );

  const goToPreviousSection = useCallback(() => {
    if (currentSection > 0) {
      setDirection(-1);
      setCurrentSection((prev) => prev - 1);
    }
  }, [currentSection]);

  const navigateToSection = useCallback(
    (nextSection: number) => {
      setDirection(nextSection > currentSection ? 1 : -1);
      setCurrentSection(nextSection);
    },
    [currentSection],
  );

  return {
    currentSection,
    direction,
    isLastSection,
    isFirstSection,
    goToNextSection,
    goToPreviousSection,
    navigateToSection,
    setCurrentSection,
    setDirection,
  };
}
