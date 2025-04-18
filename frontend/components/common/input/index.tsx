"use client";

import { ComponentProps, useState } from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../button";

function SearchInput({
  className,
  ...props
}: ComponentProps<typeof ShadcnInput>) {
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
        className="absolute top-1/2 left-4 -translate-y-1/2 text-freehunt-black-two"
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
        className="absolute top-1/2 right-4 -translate-y-1/2  rounded-full font-semibold px-8 py-5"
      >
        Rechercher
      </Button>
    </div>
  );
}

export { SearchInput };
