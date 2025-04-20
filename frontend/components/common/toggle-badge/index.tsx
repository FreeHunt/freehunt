"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";

function ToggleBadge({
  value,
  onClick,
}: {
  value: string;
  onClick?: (value: string, newState: boolean) => void;
}) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
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
