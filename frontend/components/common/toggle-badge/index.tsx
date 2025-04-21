"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";

function ToggleBadge({
  value,
  onClick,
  isActive = false,
}: {
  value: string;
  onClick?: (value: string, newState: boolean) => void;
  isActive?: boolean;
}) {
  const [localIsActive, setLocalIsActive] = useState(isActive);

  const handleClick = () => {
    const newState = !localIsActive;
    setLocalIsActive(newState);
    if (onClick) {
      onClick(value, newState);
    }
  };

  return (
    <Badge
      className={`${
        isActive
          ? "bg-freehunt-main text-white border-none"
          : "text-freehunt-black-two"
      } cursor-pointer`}
      variant="outline"
      onClick={handleClick}
    >
      {value}
    </Badge>
  );
}

export { ToggleBadge };
