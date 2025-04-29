import {FieldValues, Path, UseFormReturn} from "react-hook-form";
import React from "react";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../form";
import {RadioGroup, RadioGroupItem} from "../radio-group";

interface RadioGroupFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string | React.ReactNode;
    options: { value: string; label: string }[];
}

const RadioGroupField = <T extends FieldValues>({
                                                    form,
                                                    name,
                                                    label,
                                                    options,
                                                }: RadioGroupFieldProps<T>) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem className="flex flex-col items-start justify-between rounded-lg border p-4">
                    <FormLabel className="my-2">{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1"
                        >
                            {options.map((option) => (
                                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={option.value}/>
                                    </FormControl>
                                    <FormLabel className="font-normal">{option.label}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};

export {RadioGroupField};
