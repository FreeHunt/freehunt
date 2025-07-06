import { SectionTitle as SectionTitleType } from "@/actions/register";
import { SectionTitle } from "@/components/register/form/SectionTitle";
import { AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface RegisterPageLayoutProps {
  children: ReactNode;
  sectionTitles: SectionTitleType[];
  currentSection: number;
}

export function RegisterPageLayout({
  children,
  sectionTitles,
  currentSection,
}: RegisterPageLayoutProps) {
  return (
    <div className="min-h-[calc(100svh-64px)] bg-gradient-to-br from-background to-muted/30 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="text-center">
          <AnimatePresence mode="wait">
            <SectionTitle
              title={sectionTitles[currentSection]}
              currentSection={currentSection}
            />
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
