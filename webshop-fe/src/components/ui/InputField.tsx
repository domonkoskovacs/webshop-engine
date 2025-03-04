import React from "react";

import {UseFormReturn} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "./Form";
import {Input} from "./Input";

interface TextInputFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label?: string;
    placeholder: string;
    description?: string;
    type?: string
}

interface NumberInputFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label: string;
    placeholder: string;
    min?: number;
    description?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({form, name, label, placeholder, description,type}) => {
    return <FormField
        control={form.control}
        name={name}
        render={({field}) => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input type={type} placeholder={placeholder} {...field} />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
};

const NumberInputField: React.FC<NumberInputFieldProps> = ({
                                                               form,
                                                               name,
                                                               label,
                                                               placeholder,
                                                               min = 0,
                                                               description,
                                                           }) => {
    return <FormField
        control={form.control}
        name={name}
        render={({field: {onChange, value, ...rest}}) => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input type="number"
                           placeholder={placeholder}
                           min={min}
                           value={value ?? ""}
                           onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                           {...rest} />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
};

export {TextInputField, NumberInputField};
