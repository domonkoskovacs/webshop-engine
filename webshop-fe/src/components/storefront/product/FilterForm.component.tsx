import {Button} from "src/components/ui/Button"
import React from "react";
import {useProduct} from "../../../hooks/UseProductPagination";
import {ComboBoxMultipleValue} from "../../ui/ComboBoxMultipleValue";
import {Switch} from "../../ui/Switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../ui/Select";
import {GetAllSortTypeEnum} from "../../../shared/api";
import SliderFilter from "../../admin/product/SliderFilter.component";

interface FilterFormProps {
    setIsOpen: (open: boolean) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({setIsOpen}) => {
    const {brands, filters, updateFilters, resetFilters, priceRange, discountRange, totalElements} = useProduct();

    const handlePriceSliderChange = (values: number[]) => {
        updateFilters({minPrice: values[0], maxPrice: values[1]})
    };

    const handlePriceMinInputChange = (value: string) => {
        const newValue = Number(value);
        if (!isNaN(newValue)) {
            updateFilters({minPrice: newValue})
        }
    };

    const handlePriceMaxInputChange = (value: string) => {
        const newValue = Number(value);
        if (!isNaN(newValue)) {
            updateFilters({maxPrice: newValue})
        }
    };

    const handleDiscountSliderChange = (values: number[]) => {
        updateFilters({minDiscountPercentage: values[0], maxDiscountPercentage: values[1]})
    };

    const handleDiscountMinInputChange = (value: string) => {
        const newValue = Number(value);
        if (!isNaN(newValue)) {
            updateFilters({minDiscountPercentage: newValue})
        }
    };

    const handleDiscountMaxInputChange = (value: string) => {
        const newValue = Number(value);
        if (!isNaN(newValue)) {
            updateFilters({maxDiscountPercentage: newValue})
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Filter Products</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar">
                <ComboBoxMultipleValue className="w-full"
                                       options={brands.map((brand) => brand.name!)} type="brand"
                                       selectedValues={filters.brands ?? []}
                                       onChange={(newSelected) => updateFilters({brands: newSelected})}/>

                <SliderFilter handleMinInputChange={handlePriceMinInputChange}
                              handleMaxInputChange={handlePriceMaxInputChange}
                              handleSliderChange={handlePriceSliderChange} range={[priceRange[0], priceRange[1]]}
                              minValue={filters.minPrice} maxValue={filters.maxPrice}/>

                <SliderFilter handleMinInputChange={handleDiscountMinInputChange}
                              handleMaxInputChange={handleDiscountMaxInputChange}
                              handleSliderChange={handleDiscountSliderChange}
                              range={[discountRange[0], discountRange[1]]}
                              minValue={filters.minDiscountPercentage} maxValue={filters.maxDiscountPercentage}/>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        Show out of stock products?
                    </div>
                    <Switch
                        checked={filters.showOutOfStock}
                        onCheckedChange={() => updateFilters({showOutOfStock: !filters.showOutOfStock})}
                    />
                </div>

                <Select value={filters.sortType}
                        onValueChange={(value) => updateFilters({sortType: value as GetAllSortTypeEnum})}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select sorting..."/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={GetAllSortTypeEnum.AscPrice}>Asc Price</SelectItem>
                        <SelectItem value={GetAllSortTypeEnum.DescPrice}>Desc Price</SelectItem>
                        <SelectItem value={GetAllSortTypeEnum.AscDiscount}>Asc Discount</SelectItem>
                        <SelectItem value={GetAllSortTypeEnum.DescDiscount}>Desc Discount</SelectItem>
                    </SelectContent>
                </Select>

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