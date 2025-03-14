import {Button} from "src/components/ui/Button";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "src/components/ui/Form";
import {Popover, PopoverContent, PopoverTrigger} from "src/components/ui/Popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "src/components/ui/Command";
import {Check, ChevronsUpDown} from "lucide-react";
import {cn} from "src/lib/utils";
import React, {useState} from "react";
import {UseFormReturn} from "react-hook-form";
import {SelectOption} from "../../types/select";

interface FormComboBoxProps {
    form: UseFormReturn<any>;
    name: string;
    label: string;
    description?: string;
    options: SelectOption[];
}

export const ComboBoxMultipleValueField: React.FC<FormComboBoxProps> = ({
                                                                           form,
                                                                           name,
                                                                           label,
                                                                           description,
                                                                           options
                                                                       }) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const toggleSelection = (value: string) => {
        const newSelected = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
    };
    return (
        <FormField
            control={form.control}
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
                                    {field.value?.length === 1
                                        ? options.find((option) => option.value === field.value[0])?.label
                                        : field.value?.length > 1
                                            ? `${label} (${field.value.length})`
                                            : `Select ${label.toLowerCase()}...`}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-9"/>
                                <CommandList>
                                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => {
                                            const isSelected = field.value?.includes(option.value);
                                            return (
                                                <CommandItem
                                                    value={option.label}
                                                    key={option.value}
                                                    onSelect={() => {
                                                        const newSelected = isSelected
                                                            ? field.value.filter((v: string) => v !== option.value)
                                                            : [...(field.value || []), option.value];
                                                        field.onChange(newSelected);
                                                        toggleSelection(newSelected)
                                                    }}
                                                >
                                                    {option.label}
                                                    <Check
                                                        className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")}/>
                                                </CommandItem>
                                            );
                                        })}
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
