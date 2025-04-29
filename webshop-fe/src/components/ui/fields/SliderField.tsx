import {Input} from "@/components/ui/input";
import {FieldValues, Path, PathValue, UseFormReturn} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../form";
import {Slider} from "../slider";

interface SliderInputFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    nameMin: Path<T>;
    nameMax: Path<T>;
    label: string;
    range: [number, number];
    step?: number;
}

const SliderInputField = <T extends FieldValues>({
                                                     form,
                                                     nameMin,
                                                     nameMax,
                                                     label,
                                                     range,
                                                     step = 1,
                                                 }: SliderInputFieldProps<T>) => {
    const minValue = form.watch(nameMin) ?? range[0];
    const maxValue = form.watch(nameMax) ?? range[1];

    const handleSliderChange = (values: number[]) => {
        form.setValue(nameMin, values[0] as PathValue<T, typeof nameMin>, {shouldValidate: true});
        form.setValue(nameMax, values[1] as PathValue<T, typeof nameMax>, {shouldValidate: true});
    };

    return (
        <FormItem className="flex flex-col gap-2">
            {label && <FormLabel>{label}</FormLabel>}
            <div className="flex items-center gap-2">
                <FormField
                    control={form.control}
                    name={nameMin}
                    render={({field}) => (
                        <FormControl>
                            <Input
                                type="number"
                                value={field.value ?? range[0]}
                                onChange={(e) => {
                                    const value = e.target.value === "" ? undefined : Number(e.target.value);
                                    form.setValue(nameMin, value as PathValue<T, typeof nameMin>, {shouldValidate: true});
                                }}
                                className="text-center"
                            />
                        </FormControl>
                    )}
                />
                <span>-</span>
                <FormField
                    control={form.control}
                    name={nameMax}
                    render={({field}) => (
                        <FormControl>
                            <Input
                                type="number"
                                value={field.value ?? range[1]}
                                onChange={(e) => {
                                    const value = e.target.value === "" ? undefined : Number(e.target.value);
                                    form.setValue(nameMax, value as PathValue<T, typeof nameMax>, {shouldValidate: true});
                                }}
                                className="text-center"
                            />
                        </FormControl>
                    )}
                />
            </div>
            <Slider
                value={[minValue, maxValue]}
                onValueChange={handleSliderChange}
                min={range[0]}
                max={range[1]}
                step={step}
            />
            <FormMessage/>
        </FormItem>
    );
};

export default SliderInputField;
