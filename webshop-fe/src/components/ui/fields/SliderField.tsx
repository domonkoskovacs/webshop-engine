import React from "react";
import {Input} from "src/components/ui/Input";
import {UseFormReturn} from "react-hook-form";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../Form";
import {Slider} from "../Slider";

interface SliderInputFieldProps {
    form: UseFormReturn<any>;
    nameMin: string;
    nameMax: string;
    label: string;
    range: [number, number];
    step?: number;
}

const SliderInputField: React.FC<SliderInputFieldProps> = ({form, nameMin, nameMax, label, range, step = 1}) => {
    const minValue = form.watch(nameMin) ?? range[0];
    const maxValue = form.watch(nameMax) ?? range[1];

    const handleSliderChange = (values: number[]) => {
        form.setValue(nameMin, values[0], {shouldValidate: true});
        form.setValue(nameMax, values[1], {shouldValidate: true});
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
                                onChange={(e) => form.setValue(nameMin, Number(e.target.value), {shouldValidate: true})}
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
                                onChange={(e) => form.setValue(nameMax, Number(e.target.value), {shouldValidate: true})}
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
