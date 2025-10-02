"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  value: string;
  label: string;
}

interface CreatableComboboxProps {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
  onCreate?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  createText?: string;
}

export function CreatableCombobox({
  options: initialOptions,
  value,
  onValueChange,
  onCreate,
  placeholder = "Select option...",
  emptyText = "No option found.",
  createText = "Create",
}: CreatableComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Option[]>(initialOptions);
  const [searchValue, setSearchValue] = React.useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCreate = () => {
    if (!searchValue.trim()) return;

    const newOption: Option = {
      value: searchValue.toLowerCase().replace(/\s+/g, "-"),
      label: searchValue,
    };

    setOptions([...options, newOption]);
    onValueChange?.(newOption.value);
    onCreate?.(newOption.value);
    setSearchValue("");
    setOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search or create..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-6">
                <p className="text-sm text-muted-foreground">{emptyText}</p>
                {searchValue && (
                  <Button size="sm" onClick={handleCreate} className="gap-1">
                    <Plus className="h-4 w-4" />
                    {createText} "{searchValue}"
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setSearchValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
