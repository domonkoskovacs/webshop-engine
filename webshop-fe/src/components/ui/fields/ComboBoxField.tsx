import {Button} from "@/components/ui/button";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Check, ChevronsUpDown, Plus} from "lucide-react";
import {cn} from "@/lib/utils";
import {SelectOption} from "@/types/select";
import {ControllerRenderProps, FieldValues, Path, UseFormReturn} from "react-hook-form";
import {useState} from "react";

interface FormComboBoxProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    description?: string;
    options: SelectOption[];
    enableCreateOption?: boolean;
    onCreateOption?: (newValue: string) => void;
}

export function ComboBoxField<T extends FieldValues>({
                                                         form,
                                                         name,
                                                         label,
                                                         description,
                                                         options,
                                                         enableCreateOption = false,
                                                         onCreateOption
                                                     }: FormComboBoxProps<T>) {
    const [localOptions, setLocalOptions] = useState<SelectOption[]>(options);
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddOption = (newValue: string, field: ControllerRenderProps<T, Path<T>>) => {
        if (!newValue.trim()) return;
        const newOption = {label: newValue, value: newValue};
        setLocalOptions((prev) => [...prev, newOption]);
        field.onChange(newOption.value);

        if (enableCreateOption && onCreateOption) {
            onCreateOption(newValue);
        }
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
                                    {field.value
                                        ? localOptions.find((option) => option.value === field.value
                                        )?.label
                                        : `Select ${label.toLowerCase()}`}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder={localOptions.length === 0 && enableCreateOption ? `Create ${label.toLowerCase()}...` : `Search ${label.toLowerCase()}...`}
                                    onValueChange={setSearchTerm}
                                />
                                <CommandList>
                                    {localOptions.length > 0 ? (
                                        <CommandGroup>
                                            {localOptions.map((option) => (
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
                                    ) : (
                                        localOptions.length > 0 &&
                                        <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                                    )}

                                    {enableCreateOption && searchTerm && !localOptions.some((o) => o.label === searchTerm) && (
                                        <CommandItem
                                            value={searchTerm}
                                            onSelect={() => handleAddOption(searchTerm, field)}
                                            className="flex items-center justify-between"
                                        >
                                            Add "{searchTerm}" <Plus className="h-4 w-4"/>
                                        </CommandItem>
                                    )}
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
}
