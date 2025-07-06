import { ReactNode } from "react";

interface FormContainerProps {
  previewCard: ReactNode;
  formContent: ReactNode;
}

export function FormContainer({ previewCard, formContent }: FormContainerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Preview card */}
      <div className="flex justify-center lg:justify-end">
        {previewCard}
      </div>

      {/* Form content */}
      <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto lg:mx-0 relative min-h-[500px]">
        {formContent}
      </div>
    </div>
  );
}