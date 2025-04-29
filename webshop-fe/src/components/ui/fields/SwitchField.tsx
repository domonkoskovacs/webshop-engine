import {FieldValues, Path, UseFormReturn} from "react-hook-form";
import React from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../form";
import {Switch} from "../switch";

interface SwitchFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string | React.ReactNode;
    description?: string | React.ReactNode;
}

const SwitchField = <T extends FieldValues>({
                                                form,
                                                name,
                                                label,
                                                description
                                            }: SwitchFieldProps<T>) => {
    return <FormField
        control={form.control}
        name={name}
        render={({field}) => (
            <FormItem>
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        {label && <FormLabel className="text-base">{label}</FormLabel>}
                        {description && <FormDescription>{description}</FormDescription>}
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </div>
                <FormMessage/>
            </FormItem>
        )}
    />
};

export {SwitchField}