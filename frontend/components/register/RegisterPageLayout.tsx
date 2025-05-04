import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { SectionTitle as SectionTitleType } from "@/actions/register";
import { SectionTitle } from "@/components/register/form/SectionTitle";

interface RegisterPageLayoutProps {
  children: ReactNode;
  sectionTitles: SectionTitleType[];
  currentSection: number;
}

export function RegisterPageLayout({ 
  children, 
  sectionTitles, 
  currentSection 
}: RegisterPageLayoutProps) {
  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 lg:gap-20 my-6 md:my-10 lg:my-28">
      <div className="flex flex-col justify-center items-center gap-2 self-stretch px-4">
        <div className="flex p-3 md:p-5 justify-center items-center gap-2 h-16">
          <AnimatePresence mode="wait">
            <SectionTitle
              title={sectionTitles[currentSection]}
              currentSection={currentSection}
            />
          </AnimatePresence>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 md:gap-8 lg:gap-20 p-4 max-md:w-full">
        {children}
      </div>
    </div>
  );
}