import {FieldValues, Path, UseFormReturn} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../select";
import {SelectOption} from "@/types/select";

interface SelectFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    placeholder: string;
    description?: string;
    options: SelectOption[];
}

const SelectField = <T extends FieldValues>({
                                                form,
                                                name,
                                                label,
                                                placeholder,
                                                description,
                                                options,
                                            }: SelectFieldProps<T>) => {
    return <FormField
        control={form.control}
        name={name}
        render={({field}) => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={placeholder}/>
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
};

export default SelectField