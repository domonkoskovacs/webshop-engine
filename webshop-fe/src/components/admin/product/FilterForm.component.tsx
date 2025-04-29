import React, {useEffect} from "react";
import {GetAll1SortTypeEnum, ProductServiceApiGetAll1Request, UpdateGenderEnum} from "@/shared/api";

import {z} from "zod";
import {toast} from "@/hooks/useToast.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {ComboBoxMultipleValueField} from "../../ui/fields/ComboBoxMultipleValueField";
import {
    mapBrandsToOptions,
    mapCategoryNamesToOptions,
    mapEnumToOptions,
    mapSubCategoryNamesToOptions
} from "@/lib/options.utils.ts";
import SliderField from "../../ui/fields/SliderField";
import {NumberInputField, TextInputField} from "../../ui/fields/InputField";
import {SwitchField} from "../../ui/fields/SwitchField";
import SelectField from "../../ui/fields/SelectField";
import {useCategories} from "@/hooks/category/useCategories.ts";
import {useProductBrands} from "@/hooks/product/useProductBrands.ts";
import {useProducts} from "@/hooks/product/useProducts.ts";

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
    sortType: z.nativeEnum(GetAll1SortTypeEnum).optional(),
    size: z.number().int().min(1, "Size must be non-negative"),
});

interface FilterFormProps {
    setIsOpen: (val: boolean) => void;
    filters: ProductServiceApiGetAll1Request;
    updateFilters: (newFilters: Partial<ProductServiceApiGetAll1Request>) => void;
    resetFilters: () => void;
}


const FilterForm: React.FC<FilterFormProps> = ({setIsOpen, updateFilters, filters, resetFilters}) => {
    const {data} = useProducts(filters);
    const priceRange: [number, number] = [data?.minPrice ?? 0, data?.maxPrice ?? 0];
    const discountRange: [number, number] = [data?.minDiscount ?? 0, data?.maxDiscount ?? 0];
    const {data: brands = []} = useProductBrands();
    const {data: categories = []} = useCategories();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            showOutOfStock: false,
            size: filters.size,
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
    }, [filters, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        updateFilters({...data});
        toast.info("Filters applied successfully.")
        setIsOpen(false)
    }

    return <SheetFormContainer title="Filter Products" form={form} formId="productFilterForm" onSubmit={onSubmit}
                               submitButtonText="Apply" secondaryButtonClick={() => {
        resetFilters();
        form.reset();
    }} secondaryButtonText="Reset">
        <ComboBoxMultipleValueField key={brands.length} form={form} name="brands" label="Brands"
                                    options={mapBrandsToOptions(brands)}/>
        <ComboBoxMultipleValueField form={form} name="categories" label="Categories"
                                    options={mapCategoryNamesToOptions(categories)}/>
        <ComboBoxMultipleValueField form={form} name="subCategories" label="Subcategories"
                                    options={mapSubCategoryNamesToOptions(categories)}/>
        <ComboBoxMultipleValueField form={form} name="genders" label="Genders"
                                    options={mapEnumToOptions(UpdateGenderEnum)}/>
        <SliderField form={form} nameMin="minPrice" nameMax="maxPrice" label="Price"
                     range={[priceRange[0], priceRange[1]]}/>
        <SliderField form={form} nameMin="minDiscountPercentage" nameMax="maxDiscountPercentage" label="Discount"
                     range={[discountRange[0], discountRange[1]]}/>
        <TextInputField form={form} name="itemNumber" placeholder="Item number..."/>
        <SwitchField form={form} name="showOutOfStock" label="Show out of stock products?"/>
        <SelectField form={form} name="sortType" placeholder="Sorting" options={mapEnumToOptions(GetAll1SortTypeEnum)}/>
        <NumberInputField form={form} name="size" label="Page size" placeholder="Add page size..." min={1}/>
    </SheetFormContainer>
}

export default FilterForm