interface SectionIndicatorProps {
  currentSection: number;
  totalSections: number;
  onSectionChange: (index: number) => void;
}

export function SectionIndicator({
  currentSection,
  totalSections,
  onSectionChange,
}: SectionIndicatorProps) {
  return (
    <div className="flex justify-center items-center gap-3 mt-auto w-full">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-125 ${
            currentSection === index 
              ? "bg-freehunt-main shadow-sm" 
              : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
          }`}
          onClick={() => onSectionChange(index)}
          aria-label={`Aller à l'étape ${index + 1}`}
        />
      ))}
    </div>
  );
}
