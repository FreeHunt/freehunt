"use client";

import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";
import { Button } from "../button";

function SearchInput({
  className,
  buttonText,
  buttonClassName,
  defaultValue = "",
  value: externalValue,
  onChange,
  ...props
}: ComponentProps<typeof ShadcnInput> & {
  buttonText?: string; // Optional prop for button text
  buttonClassName?: string; // Optional prop for button class
}) {
  const [value, setValue] = useState(defaultValue);

  // Sync with external value if provided
  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="relative">
      <Search
        size={20}
        className="hidden lg:block absolute top-1/2 left-4 -translate-y-1/2 text-freehunt-black-two"
      />
      <ShadcnInput
        className={cn(
          "rounded-lg h-16 px-12 text-freehunt-black-two font-bold placeholder:text-freehunt-black-two placeholder:font-bold focus-visible:ring-0 border border-freehunt-black-two focus-visible:border-freehunt-black-two",
          className,
        )}
        value={value}
        onChange={handleChange}
        name="search"
        {...props}
      />
      {buttonText && (
        <Button
          variant="secondary"
          className={cn(
            "absolute top-1/2 right-4 -translate-y-1/2 rounded-lg font-semibold lg:px-8 lg:py-5",
            buttonClassName,
          )}
        >
          <Search size={20} className="lg:hidden" />
          <span className="hidden lg:block">{buttonText}</span>
        </Button>
      )}
    </div>
  );
}

export { SearchInput };
