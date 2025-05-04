import { ReactNode } from "react";

interface FormContainerProps {
  previewCard: ReactNode;
  formContent: ReactNode;
}

export function FormContainer({ previewCard, formContent }: FormContainerProps) {
  return (
    <div className="flex justify-end self-start gap-5">
      {/* Preview card */}
      {previewCard}

      {/* Form content */}
      <div className="flex flex-col items-center gap-10 self-stretch w-full md:w-[600px] lg:w-[700px] relative min-h-[500px]">
        {formContent}
      </div>
    </div>
  );
}