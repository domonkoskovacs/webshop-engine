import {UseFormReturn} from "react-hook-form";
import React from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "./Form";
import {Switch} from "./Switch";

interface SwitchFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label: string;
    description?: string;
}

const SwitchField: React.FC<SwitchFieldProps> = ({form, name, label, description}) => {
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