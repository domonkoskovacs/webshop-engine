import {FieldValues, Path, UseFormReturn} from "react-hook-form";
import React from "react";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../form";
import {Popover, PopoverContent, PopoverTrigger} from "../popover";
import {Button} from "../button";
import {cn} from "@/lib/utils.ts";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "../calendar";
import {format} from "date-fns";

interface DatePickerFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    description?: string | React.ReactNode;
}

const DatePickerField = <T extends FieldValues>({
                                                    form,
                                                    name,
                                                    label,
                                                    description,
                                                }: DatePickerFieldProps<T>) => {
    return <FormField
        control={form.control}
        name={name}
        render={({field}) => (
            <FormItem className="flex flex-col">
                {label && <FormLabel>{label}</FormLabel>}
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                        />
                    </PopoverContent>
                </Popover>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
};

export default DatePickerField