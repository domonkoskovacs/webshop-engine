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
    max?: number;
    description?: string;
}

interface FileInputFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label: string;
    accept: string;
    description?: string;
}

const TextInputField: React.FC<TextInputFieldProps> = ({form, name, label, placeholder, description, type}) => {
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
                                                               max,
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
                           max={max}
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

const FileInputField: React.FC<FileInputFieldProps> = ({
                                                           form,
                                                           name,
                                                           label,
                                                           accept,
                                                           description,
                                                       }) => {
    return <FormField
        control={form.control}
        name={name}
        render={() => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input
                        type="file"
                        accept={accept}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                form.setValue(name, file, {shouldValidate: true});
                            }
                        }}
                    />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
};

export {TextInputField, NumberInputField, FileInputField};
