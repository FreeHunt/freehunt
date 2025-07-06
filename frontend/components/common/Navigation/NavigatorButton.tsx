import { Button } from "@/components/common/button";

interface NavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
}

export function NavigationButtons({
  onPrevious,
  onNext,
  isFirstSection,
  isLastSection,
}: NavigationButtonsProps) {
  return (
    <div className="flex flex-row justify-end items-center gap-2.5 self-stretch w-full">
      <Button
        className="flex p-2 items-center gap-2.5 self-stretch w-28 md:w-36 h-10 rounded-lg border bg-secondary text-secondary-foreground hover:bg-secondary/80 text-base md:text-lg"
        onClick={onPrevious}
        disabled={isFirstSection}
      >
        Retour
      </Button>
      <Button
        className="flex w-28 md:w-36 h-10 p-2 items-center gap-2.5 self-stretch rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-base md:text-lg"
        onClick={onNext}
      >
        {isLastSection ? "Valider" : "Continuer"}
      </Button>
    </div>
  );
}
