import { Controller } from "react-hook-form";
import { Button } from "src/components/ui/Button";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "src/components/ui/Form";
import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/Popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "src/components/ui/Command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "src/lib/utils";
import React from "react";

interface FormComboBoxProps {
    name: string;
    control: any;
    label: string;
    description?: string;
    options: string[];
}

export const FormComboBox: React.FC<FormComboBoxProps> = ({ name, control, label, description, options }) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "justify-between w-full",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? options.find((option) => option === field.value)
                                        : `Select ${label.toLowerCase()}`}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                                <CommandList>
                                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option}
                                                value={option}
                                                onSelect={() => field.onChange(option)}
                                            >
                                                {option}
                                                <Check className={cn("ml-auto", option === field.value ? "opacity-100" : "opacity-0")} />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
