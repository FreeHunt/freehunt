"use client";

import { ReactNode } from "react";
import NavigationMenu from "@/components/navigation-menu";

function BasePage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      <NavigationMenu />
      {children}
    </div>
  );
}

export { BasePage };
