import {UseFormReturn} from "react-hook-form";
import React from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "./Form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./Select";


interface SelectOption {
    label: string;
    value: string;
}

interface SelectFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label?: string;
    placeholder: string;
    description?: string;
    options: SelectOption[];
}

const SelectField: React.FC<SelectFieldProps> = ({form, name, label, placeholder, description, options}) => {
    return <FormField
        control={form.control}
        name={name}
        render={({field}) => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                        <SelectTrigger>
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