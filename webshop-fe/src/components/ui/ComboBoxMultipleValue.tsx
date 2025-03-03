"use client"

import * as React from "react"
import {useState} from "react"
import {Check, ChevronsUpDown} from "lucide-react"

import {cn} from "src/lib/utils"
import {Button} from "src/components/ui/Button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "src/components/ui/Command"
import {Popover, PopoverContent, PopoverTrigger,} from "src/components/ui/Popover"

interface ComboBoxMultipleProps {
    options: string[];
    type: string;
    className?:string;
    selectedValues: string[];
    onChange: (values: string[]) => void;
}

export function ComboBoxMultipleValue({ options, type, className, selectedValues, onChange }: ComboBoxMultipleProps) {
    const [open, setOpen] = useState(false)

    const toggleSelection = (value: string) => {
        const newSelected = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
        onChange(newSelected);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                >
                    {selectedValues.length === 1
                        ? options.find((option) => option === selectedValues[0])
                        : selectedValues.length > 1
                            ? `${type.charAt(0).toUpperCase() + type.slice(1)} (${selectedValues.length})`
                            : `Select ${type}...`}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={`Search ${type}...`} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No {type.toLowerCase()} found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option}
                                    value={option}
                                    onSelect={() => toggleSelection(option)}
                                >
                                    {option}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedValues.includes(option) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
