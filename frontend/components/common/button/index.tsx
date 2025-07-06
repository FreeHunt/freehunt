import { Button as ShadcnButton } from "@/components/ui/button";
import React from "react";

type ButtonProps = React.ComponentProps<typeof ShadcnButton> & {
  theme?: "primary" | "secondary";
};

function Button({
  className,
  theme = "primary",
  children,
  ...props
}: ButtonProps) {
  const colorClasses = {
    primary: "bg-freehunt-main text-white hover:bg-freehunt-main/80",
    secondary: "bg-white text-freehunt-main hover:bg-gray-100",
  };

  return (
    <ShadcnButton
      className={`${colorClasses[theme]} cursor-pointer rounded-lg ${className}`}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
}

export { Button };
