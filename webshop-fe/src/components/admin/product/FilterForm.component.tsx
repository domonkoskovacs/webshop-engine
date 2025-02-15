import {Button} from "src/components/ui/Button"
import React, {useState} from "react";
import {useProduct} from "../../../hooks/UseProductPagination";
import {ComboBoxMultipleValue} from "../../ui/ComboBoxMultipleValue";
import {X} from "lucide-react";
import {useCategory} from "../../../hooks/UseCategory";
import {Slider} from "../../ui/Slider";
import {Input} from "../../ui/Input";

interface FilterFormProps {
    setIsOpen: (open: boolean) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({setIsOpen}) => {
    const {brands, filters, updateFilters, resetFilters} = useProduct();
    const {categories} = useCategory()






    const [priceRange, setPriceRange] = useState<[number, number]>( [0, 100]);

    const handleSliderChange = (values: number[]) => {
        setPriceRange([values[0], values[1]]);
    };

    const handleInputChange = (index: number, value: string) => {
        const newValue = Number(value);
        if (!isNaN(newValue)) {
            const newRange: [number, number] = [...priceRange] as [number, number];
            newRange[index] = newValue;
            setPriceRange(newRange);
        }
    };






    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Filter Products</h2>
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5"/>
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                <ComboBoxMultipleValue className="w-full"
                                       options={brands.map((brand) => brand.name!)} type="brand"
                                       selectedValues={filters.brands ?? []}
                                       onChange={(newSelected) => updateFilters({brands: newSelected})}/>

                <ComboBoxMultipleValue className="w-full"
                                       options={categories.map((category) => category.name!)} type="category"
                                       selectedValues={filters.categories ?? []}
                                       onChange={(newSelected) => updateFilters({categories: newSelected})}/>

                <ComboBoxMultipleValue className="w-full"
                                       options={categories.flatMap(category =>
                                           category.subCategories?.map(subCategory => subCategory.name!) || []
                                       )} type="subcategory"
                                       selectedValues={filters.subCategories ?? []}
                                       onChange={(newSelected) => updateFilters({subCategories: newSelected})}/>

                <div className="w-full flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Input
                            value={priceRange[0]}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                            className="text-center"
                        />
                        <span>-</span>
                        <Input
                            value={priceRange[1]}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                            className="text-center"
                        />
                    </div>

                    <Slider
                        value={priceRange}
                        defaultValue={[0, 100]}
                        onValueChange={handleSliderChange}
                        min={0}
                        max={100}
                        step={1}
                    />
                </div>

            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Back
                </Button>
                <Button className="w-full" onClick={() => resetFilters()}>
                    Reset
                </Button>
            </div>
        </div>
    );
}

export default FilterForm