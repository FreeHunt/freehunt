"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Skill = Record<"value" | "label", string>;

// const SKILLS = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
//   {
//     value: "wordpress",
//     label: "WordPress",
//   },
//   {
//     value: "express.js",
//     label: "Express.js",
//   },
//   {
//     value: "nest.js",
//     label: "Nest.js",
//   },
// ] satisfies Skill[];

interface MultiSelectProps {
  options?: Skill[];
  selected?: Skill[];
  onChange?: (selected: Skill[]) => void;
  className?: string;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected = [],
  onChange,
  className,
  placeholder = "Selectionner un élément",
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // const selectedItems = options?.filter((opt) => selected.includes(opt.value));

  const handleUnselectItem = React.useCallback(
    (skill: Skill) => {
      const newSelected = selected.filter((val) => val.value !== skill.value);
      onChange?.(newSelected);
    },
    [selected, onChange],
  );

  const handleSelectItem = React.useCallback(
    (skill: Skill) => {
      const newSelected = [...selected, skill];
      onChange?.(newSelected);
      setInputValue("");
    },
    [selected, onChange],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          input.value === ""
        ) {
          onChange?.(selected.slice(0, -1));
        }
        if (e.key === "Escape") input.blur();
      }
    },
    [selected, onChange],
  );

  const selectablesItems = options?.filter(
    (skill) => !selected?.includes(skill),
  );

  // console.log("selectablesItems", selectablesItems);
  // console.log("selectedItems", selectedItems);
  // console.log("inputValue", inputValue);

  return (
    <Command
      onKeyDown={handleKeyDown}
      className={`overflow-visible bg-transparent ${className}`}
    >
      <div className="rounded-md border px-3 py-2 text-sm ring-offset-background focus-within:ring-[3px] focus-within:ring-ring/50">
        <div className="flex flex-wrap gap-1">
          {selected?.map((skill) => {
            return (
              <Badge key={skill.value} variant="secondary">
                {skill.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselectItem(skill);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselectItem(skill)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Just for delete the "Search" Icon, https://ui.shadcn.com/docs/components/command#2024-10-25-classes-for-icons */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => {
              setOpen(false);
              setInputValue("");
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectablesItems?.map((skill) => {
                  return (
                    <CommandItem
                      key={skill.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelectItem(skill)}
                      className={"cursor-pointer"}
                    >
                      {skill.label}
                    </CommandItem>
                  );
                })}

                {/* Add Item */}
                {inputValue && (
                  <CommandItem
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      handleSelectItem({
                        value: inputValue,
                        label: inputValue,
                      });
                    }}
                    className={"cursor-pointer"}
                  >
                    <span className="text-sm text-muted-foreground">
                      Add &quot;{inputValue}&quot;
                    </span>
                  </CommandItem>
                )}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
