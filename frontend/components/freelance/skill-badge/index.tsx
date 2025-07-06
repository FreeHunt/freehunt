import { Badge as ShadcnBadge } from "@/components/ui/badge";
import React from "react";

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
      className={`bg-freehunt-grey-light text-freehunt-black-two rounded-md self-start ${className}`}
      {...props}
    >
      {children}
    </ShadcnBadge>
  );
}

export { SkillBadge };
