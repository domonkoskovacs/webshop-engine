import {Textarea} from "./Textarea";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "./Form";

interface TextareaFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label: string;
    placeholder: string;
    min?: number;
    description?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({form, name, label, placeholder, description}) => {
    return <FormField
        control={form.control}
        name={name}
        render={({field}) => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        className="resize-none scrollbar"
                        {...field}
                    />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
};

export {TextareaField};

