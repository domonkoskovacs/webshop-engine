import React, {useEffect} from "react";
import {useProduct} from "../../../hooks/UseProduct";
import {useCategory} from "../../../hooks/UseCategory";
import {GetAllSortTypeEnum, UpdateGenderEnum} from "../../../shared/api";

import {z} from "zod";
import {useToast} from "../../../hooks/UseToast";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import SheetFormContainer from "../shared/SheetFormContainer.componenet";
import {ComboBoxMultipleValueField} from "../../ui/fields/ComboBoxMultipleValueField";
import {
    mapBrandsToOptions,
    mapCategoryNamesToOptions,
    mapEnumToOptions,
    mapSubCategoryNamesToOptions
} from "../../../lib/options.utils";
import SliderField from "../../ui/fields/SliderField";
import {NumberInputField, TextInputField} from "../../ui/fields/InputField";
import {SwitchField} from "../../ui/fields/SwitchField";
import SelectField from "../../ui/fields/SelectField";

const FormSchema = z.object({
    brands: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    subCategories: z.array(z.string()).optional(),
    genders: z.array(z.nativeEnum(UpdateGenderEnum)).optional(),
    maxPrice: z.number().min(0, "Price must be non-negative").optional(),
    minPrice: z.number().min(0, "Price must be non-negative").optional(),
    maxDiscountPercentage: z.number().min(0, "Discount percentage must be non-negative").max(100, "Discount percentage can't be bigger than 100").optional(),
    minDiscountPercentage: z.number().min(0, "Discount percentage must be non-negative").max(100, "Discount percentage can't be bigger than 100").optional(),
    itemNumber: z.string().optional(),
    showOutOfStock: z.boolean(),
    sortType: z.nativeEnum(GetAllSortTypeEnum).optional(),
    size: z.number().int().min(1, "Size must be non-negative"),
});

interface FilterFormProps {
    setIsOpen: (open: boolean) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({setIsOpen}) => {
    const {brands, filters, updateFilters, resetFilters, priceRange, discountRange} = useProduct();
    const {categories} = useCategory()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            showOutOfStock: false
        },
    })

    useEffect(() => {
        form.reset({
            brands: filters.brands,
            categories: filters.categories,
            subCategories: filters.subCategories,
            genders: filters.genders,
            maxPrice: filters.maxPrice,
            minPrice: filters.minPrice,
            maxDiscountPercentage: filters.maxDiscountPercentage,
            minDiscountPercentage: filters.minDiscountPercentage,
            itemNumber: filters.itemNumber,
            showOutOfStock: filters.showOutOfStock,
            sortType: filters.sortType,
            size: filters.size,
        });
    }, [filters.brands, filters.categories, filters.genders, filters.itemNumber, filters.maxDiscountPercentage,
        filters.maxPrice, filters.minDiscountPercentage, filters.minPrice, filters.showOutOfStock, filters.size, filters.sortType, filters.subCategories, form])

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        updateFilters({
            brands: data.brands,
            categories: data.categories,
            subCategories: data.subCategories,
            genders: data.genders,
            maxPrice: data.maxPrice,
            minPrice: data.minPrice,
            maxDiscountPercentage: data.maxDiscountPercentage,
            minDiscountPercentage: data.minDiscountPercentage,
            itemNumber: data.itemNumber,
            showOutOfStock: data.showOutOfStock,
            sortType: data.sortType,
            size: data.size,
        })
        toast({
            description: "Filters applied successfully.",
        })
        setIsOpen(false)
    }

    return <SheetFormContainer title="Filter Products" form={form} formId="productFilterForm" onSubmit={onSubmit}
                               submitButtonText="Apply" secondaryButtonClick={() => {
        resetFilters();
        form.reset();
    }} secondaryButtonText="Reset">
        <ComboBoxMultipleValueField form={form} name="brands" label="Brands" options={mapBrandsToOptions(brands)}/>
        <ComboBoxMultipleValueField form={form} name="categories" label="Categories"
                                    options={mapCategoryNamesToOptions(categories)}/>
        <ComboBoxMultipleValueField form={form} name="subCategories" label="Subcategories"
                                    options={mapSubCategoryNamesToOptions(categories)}/>
        <ComboBoxMultipleValueField form={form} name="genders" label="Genders"
                                    options={mapEnumToOptions(UpdateGenderEnum)}/>
        <SliderField form={form} nameMin="minPrice" nameMax="maxPrice" label="Price"
                     range={[priceRange[0], priceRange[1]]}/>
        <SliderField form={form} nameMin="minDiscountPercentage" nameMax="maxDiscountPercentage" label="Price"
                     range={[discountRange[0], discountRange[1]]}/>
        <TextInputField form={form} name="itemNumber" placeholder="Item number..."/>
        <SwitchField form={form} name="showOutOfStock" label="Show out of stock products?"/>
        <SelectField form={form} name="sortType" placeholder="Sorting" options={mapEnumToOptions(GetAllSortTypeEnum)}/>
        <NumberInputField form={form} name="size" label="Page size" placeholder="Add page size..." min={1}/>
    </SheetFormContainer>
}

export default FilterForm