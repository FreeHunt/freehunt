import { SectionIndicator } from "@/components/common/Section/SectionIndicator";
import { NavigationButtons } from "@/components/common/Navigation/NavigatorButton";

interface FormNavigatorProps {
  currentSection: number;
  totalSections: number;
  onSectionChange: (section: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
}

export function FormNavigator({
  currentSection,
  totalSections,
  onSectionChange,
  onPrevious,
  onNext,
  isFirstSection,
  isLastSection,
}: FormNavigatorProps) {
  return (
    <>
      <SectionIndicator
        currentSection={currentSection}
        totalSections={totalSections}
        onSectionChange={onSectionChange}
      />
      <NavigationButtons
        onPrevious={onPrevious}
        onNext={onNext}
        isFirstSection={isFirstSection}
        isLastSection={isLastSection}
      />
    </>
  );
}