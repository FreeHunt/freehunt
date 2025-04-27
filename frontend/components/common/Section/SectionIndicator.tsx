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
    <div className="flex justify-center items-center gap-2 mt-auto w-full">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          className={`w-3 h-3 rounded-full ${
            currentSection === index ? "bg-freehunt-main" : "bg-gray-300"
          }`}
          onClick={() => onSectionChange(index)}
        />
      ))}
    </div>
  );
}
