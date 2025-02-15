import React from "react";
import {Input} from "src/components/ui/Input";
import {Slider} from "../../ui/Slider";

interface PriceFilterProps {
    handleMinInputChange: (value: string) => void;
    handleMaxInputChange: (value: string) => void;
    handleSliderChange: (values: number[]) => void;
    range: [number, number];
    minValue: number | undefined;
    maxValue: number | undefined;
}

const SliderFilter: React.FC<PriceFilterProps> = ({
                                                      handleMinInputChange,
                                                      handleMaxInputChange,
                                                      handleSliderChange,
                                                      range,
                                                      minValue,
                                                      maxValue
                                                  }) => {


    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Input
                    value={minValue ?? range[0]}
                    onChange={(e) => handleMinInputChange(e.target.value)}
                    className="text-center"
                />
                <span>-</span>
                <Input
                    value={maxValue ?? range[1]}
                    onChange={(e) => handleMaxInputChange(e.target.value)}
                    className="text-center"
                />
            </div>

            <Slider
                value={[minValue ?? range[0], maxValue ?? range[1]]}
                onValueChange={handleSliderChange}
                min={range[0]}
                max={range[1]}
                step={1}
            />
        </div>
    );
};

export default SliderFilter;

