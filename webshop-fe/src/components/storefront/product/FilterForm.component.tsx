import React, {useEffect, useRef} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "../../../hooks/useToast";
import {ComboBoxMultipleValueField} from "../../ui/fields/ComboBoxMultipleValueField";
import {GetAllSortTypeEnum, ProductServiceApiGetAllRequest} from "../../../shared/api";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {mapBrandsToOptions, mapEnumToOptions} from "../../../lib/options.utils";
import SliderField from "../../ui/fields/SliderField";
import {SwitchField} from "../../ui/fields/SwitchField";
import SelectField from "../../ui/fields/SelectField";
import {useLocation, useNavigate} from "react-router-dom";
import {useProductBrands} from "../../../hooks/product/useProductBrands";
import {useProductScroll} from "../../../hooks/product/useProductScroll";

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
    filters: ProductServiceApiGetAllRequest;
    updateFilters: (newFilters: Partial<ProductServiceApiGetAllRequest>) => void;
    setUrlFiltersApplied: (applied: boolean) => void;
    resetFilters: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
                                                   setIsOpen,
                                                   filters,
                                                   updateFilters,
                                                   setUrlFiltersApplied,
                                                   resetFilters
                                               }) => {
    const {priceRange, discountRange} = useProductScroll(filters);
    const {data: brands = []} = useProductBrands();
    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    const prevFiltersRef = useRef<string | null>(null);

    useEffect(() => {
        const prev = prevFiltersRef.current;
        const next = JSON.stringify(filters);

        if (prev !== next) {
            form.reset({
                brands: filters.brands,
                maxPrice: filters.maxPrice,
                minPrice: filters.minPrice,
                maxDiscountPercentage: filters.maxDiscountPercentage,
                minDiscountPercentage: filters.minDiscountPercentage,
                showOutOfStock: filters.showOutOfStock,
                sortType: filters.sortType,
            });
            prevFiltersRef.current = next;
        }
    }, [filters, form]);


    async function onSubmit(data: z.infer<typeof FormSchema>) {
        toast.info("Filters has been successfully applied",)
        setUrlFiltersApplied(false);
        setIsOpen(false)
        const queryParams = new URLSearchParams();

        if (data.brands && data.brands.length > 0) {
            queryParams.set("brands", data.brands.join(","));
        }
        if (data.minPrice !== undefined) {
            queryParams.set("minPrice", data.minPrice.toString());
        }
        if (data.maxPrice !== undefined) {
            queryParams.set("maxPrice", data.maxPrice.toString());
        }
        if (data.minDiscountPercentage !== undefined) {
            queryParams.set("minDiscountPercentage", data.minDiscountPercentage.toString());
        }
        if (data.maxDiscountPercentage !== undefined) {
            queryParams.set("maxDiscountPercentage", data.maxDiscountPercentage.toString());
        }
        queryParams.set("showOutOfStock", data.showOutOfStock ? "true" : "false");
        if (data.sortType) {
            queryParams.set("sortType", data.sortType);
        }

        updateFilters({
            brands: data.brands,
            maxPrice: data.maxPrice,
            minPrice: data.minPrice,
            maxDiscountPercentage: data.maxDiscountPercentage,
            minDiscountPercentage: data.minDiscountPercentage,
            showOutOfStock: data.showOutOfStock,
            sortType: data.sortType,
        });
        setUrlFiltersApplied(true);
        navigate(
            {
                pathname: location.pathname,
                search: queryParams.toString(),
            },
            {replace: true}
        );
    }

    return <SheetFormContainer title="Filter Products" form={form} formId="productStoreFilterForm" onSubmit={onSubmit}
                               submitButtonText="Apply"
                               secondaryButtonClick={() => {
                                   resetFilters();
                                   form.reset();
                                   navigate({
                                       pathname: location.pathname,
                                       search: "",
                                   }, {replace: true});
                               }}
                               secondaryButtonText="Reset">
        <ComboBoxMultipleValueField form={form} name="brands" label="Brands" options={mapBrandsToOptions(brands)}/>
        <SliderField form={form} nameMin="minPrice" nameMax="maxPrice" label="Price"
                     range={[priceRange[0], priceRange[1]]}/>
        <SliderField form={form} nameMin="minDiscountPercentage" nameMax="maxDiscountPercentage"
                     label="Discount percentage"
                     range={[discountRange[0], discountRange[1]]}/>
        <SwitchField form={form} name="showOutOfStock" label="Show out of stock products?"/>
        <SelectField form={form} name="sortType" placeholder="Sorting" options={mapEnumToOptions(GetAllSortTypeEnum)}/>
    </SheetFormContainer>
}

export default FilterForm