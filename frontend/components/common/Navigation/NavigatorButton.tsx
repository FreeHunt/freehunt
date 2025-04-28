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
        className="flex p-2 items-center gap-2.5 self-stretch w-28 md:w-36 h-10 rounded-xl border-black border bg-transparent text-gray-500 text-base md:text-xl"
        onClick={onPrevious}
        disabled={isFirstSection}
      >
        Retour
      </Button>
      <Button
        className="flex w-28 md:w-36 h-10 p-2 items-center gap-2.5 self-stretch rounded-xl border-black border bg-freehunt-main text-white text-base md:text-xl"
        onClick={onNext}
      >
        {isLastSection ? "Valider" : "Continuer"}
      </Button>
    </div>
  );
}
