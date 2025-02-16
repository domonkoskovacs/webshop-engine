import {Button} from "src/components/ui/Button";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "src/components/ui/Form";
import {Popover, PopoverContent, PopoverTrigger} from "src/components/ui/Popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "src/components/ui/Command";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "src/lib/utils";
import React from "react";

interface SelectOption {
    label: string;
    value: string;
}


interface FormComboBoxProps {
    name: string;
    control: any
    label: string;
    description?: string;
    options: SelectOption[];
}

export const FormComboBox: React.FC<FormComboBoxProps> = ({name, control, label, description, options}) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem className="flex flex-col">
                    <FormLabel className="w-full">{label}</FormLabel>
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
                                        ? options.find(
                                            (option) => option.value === field.value
                                        )?.label
                                        : `Select ${label.toLowerCase()}`}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder={`Search ${label.toLowerCase()}...`}/>
                                <CommandList>
                                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                value={option.label}
                                                key={option.value}
                                                onSelect={() => field.onChange(option.value)}
                                            >
                                                {option.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        option.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};
