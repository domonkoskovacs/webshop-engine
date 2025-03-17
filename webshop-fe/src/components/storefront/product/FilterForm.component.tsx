import React, {useEffect} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "../../../hooks/UseToast";
import {ComboBoxMultipleValueField} from "../../ui/fields/ComboBoxMultipleValueField";
import {useProductScroll} from "../../../hooks/useProductScroll";
import {GetAllSortTypeEnum} from "../../../shared/api";
import SheetFormContainer from "../../admin/shared/SheetFormContainer.componenet";
import {mapBrandsToOptions, mapEnumToOptions} from "../../../lib/options.utils";
import SliderField from "../../ui/fields/SliderField";
import {SwitchField} from "../../ui/fields/SwitchField";
import SelectField from "../../ui/fields/SelectField";

export const FormSchema = z.object({
    brands: z.array(z.string().min(1, "Brand is required"), {message: "Brands must be an array of strings"}).optional(),
    minPrice: z.number().min(0, {message: "Minimum price must be at least 0"}).optional(),
    maxPrice: z.number().min(0, {message: "Maximum price must be at least 0"}).optional(),
    minDiscountPercentage: z.number().min(0, {message: "Minimum discount must be at least 0%"}).max(100, {message: "Minimum discount cannot exceed 100%"}).optional(),
    maxDiscountPercentage: z.number().min(0, {message: "Maximum discount must be at least 0%"}).max(100, {message: "Maximum discount cannot exceed 100%"}).optional(),
    showOutOfStock: z.boolean().default(false).describe("Indicates whether out-of-stock products should be shown"),
    sortType: z.nativeEnum(GetAllSortTypeEnum).optional().describe("Sorting type for products"),
});

interface FilterFormProps {
    setIsOpen: (open: boolean) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({setIsOpen}) => {
    const {brands, filters, priceRange, discountRange} = useProductScroll();
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    useEffect(() => {
        form.reset({
            brands: filters.brands,
            maxPrice: filters.maxPrice,
            minPrice: filters.minPrice,
            maxDiscountPercentage: filters.maxDiscountPercentage,
            minDiscountPercentage: filters.minDiscountPercentage,
            showOutOfStock: filters.showOutOfStock,
            sortType: filters.sortType,
        });
    }, [filters.brands, filters.maxDiscountPercentage, filters.maxPrice, filters.minDiscountPercentage, filters.minPrice, filters.showOutOfStock, filters.sortType, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            description: "Filters has been successfully applied",
        })
        setIsOpen(false)
    }

    return <SheetFormContainer title="Filter Products" form={form} formId="productStoreFilterForm" onSubmit={onSubmit}
                               submitButtonText="Apply" secondaryButtonClick={() => {
        form.reset();
    }} secondaryButtonText="Reset">
        <ComboBoxMultipleValueField form={form} name="brands" label="Brands" options={mapBrandsToOptions(brands)}/>
        <SliderField form={form} nameMin="minPrice" nameMax="maxPrice" label="Price"
                     range={[priceRange[0], priceRange[1]]}/>
        <SliderField form={form} nameMin="minDiscountPercentage" nameMax="maxDiscountPercentage" label="Discount percentage"
                     range={[discountRange[0], discountRange[1]]}/>
        <SwitchField form={form} name="showOutOfStock" label="Show out of stock products?"/>
        <SelectField form={form} name="sortType" placeholder="Sorting" options={mapEnumToOptions(GetAllSortTypeEnum)}/>
    </SheetFormContainer>
}

export default FilterForm