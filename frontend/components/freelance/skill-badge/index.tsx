import React from "react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";

function SkillBadge({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <ShadcnBadge
      className={`bg-freehunt-grey-light text-freehunt-black-two rounded-[6px] ${className}`}
      {...props}
    >
      {children}
    </ShadcnBadge>
  );
}

export { SkillBadge };
