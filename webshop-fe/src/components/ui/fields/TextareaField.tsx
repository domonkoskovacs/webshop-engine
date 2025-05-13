import {Textarea} from "../textarea.tsx";
import {FieldValues, Path, UseFormReturn} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../form.tsx";

interface TextareaFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder: string;
    min?: number;
    description?: string;
}

const TextareaField = <T extends FieldValues>({
                                                  form,
                                                  name,
                                                  label,
                                                  placeholder,
                                                  description,
                                              }: TextareaFieldProps<T>) => {
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

