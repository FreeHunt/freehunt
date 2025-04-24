"use client";

import { ComponentProps, useState } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../button";

function SearchInput({
  className,
  buttonText = "Rechercher",
  buttonClassName,
  ...props
}: ComponentProps<typeof ShadcnInput> & {
  buttonText?: string; // Optional prop for button text
  buttonClassName?: string; // Optional prop for button class
}) {
  const { onChange } = props;

  const [value, setValue] = useState("");

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
          "rounded-full h-16 px-12 text-freehunt-black-two font-bold placeholder:text-freehunt-black-two placeholder:font-bold focus-visible:ring-0 border border-freehunt-black-two focus-visible:border-freehunt-black-two",
          className,
        )}
        value={value}
        onChange={handleChange}
        name="search"
        {...props}
      />
      <Button
        variant="secondary"
        className={cn(
          "absolute top-1/2 right-4 -translate-y-1/2  rounded-full font-semibold lg:px-8 lg:py-5",
          buttonClassName,
        )}
      >
        <Search size={20} className="lg:hidden" />
        <span className="hidden lg:block">{buttonText}</span>
      </Button>
    </div>
  );
}

export { SearchInput };
