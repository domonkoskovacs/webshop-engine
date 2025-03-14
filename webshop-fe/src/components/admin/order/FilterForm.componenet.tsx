import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {useToast} from "../../../hooks/UseToast";
import React, {useEffect} from "react";
import SheetFormContainer from "../shared/SheetFormContainer.componenet";
import {useOrder} from "../../../hooks/UseOrder";
import {GetAll1PaymentMethodsEnum, GetAll1SortTypeEnum, GetAll1StatusesEnum} from "../../../shared/api";
import DatePickerField from "../../ui/DatePickerField";
import SliderField from "../../ui/SliderField";
import {ComboBoxMultipleValueField} from "../../ui/ComboBoxMultipleValueField";
import {mapEnumToOptions} from "../../../lib/options.utils";
import SelectField from "../../ui/SelectField";
import {NumberInputField} from "../../ui/InputField";

export const FormSchema = z.object({
    minDate: z.date().optional(),
    maxDate: z.date().refine((date) => date <= new Date(), {
        message: "Max date must be today or earlier"
    }).optional(),
    minPrice: z.number().min(0, {message: "Min price must be at least 0"}).optional(),
    maxPrice: z.number().optional(),
    paymentMethods: z.array(z.nativeEnum(GetAll1PaymentMethodsEnum)).optional(),
    statuses: z.array(z.nativeEnum(GetAll1StatusesEnum)).optional(),
    sortType: z.nativeEnum(GetAll1SortTypeEnum).optional(),
    size: z.number().positive({message: "Size must be a positive number"}).optional()
});

interface ProductFormProps {
    setIsOpen: (open: boolean) => void;
}

const FilterForm: React.FC<ProductFormProps> = ({setIsOpen}) => {
    const {updateFilters, filters, resetFilters, priceRange} = useOrder()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    useEffect(() => {
        form.reset({
            minDate: filters.minDate ? new Date(filters.minDate) : undefined,
            maxDate: filters.maxDate ? new Date(filters.maxDate) : undefined,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            paymentMethods: filters.paymentMethods,
            statuses: filters.statuses,
            sortType: filters.sortType,
            size: filters.size,
        });
    }, [filters.maxDate, filters.maxPrice, filters.minDate, filters.minPrice, filters.paymentMethods, filters.size, filters.sortType, filters.statuses, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        updateFilters({
            minDate: data.minDate?.toISOString().split("T")[0],
            maxDate: data.maxDate?.toISOString().split("T")[0],
            minPrice: data.minPrice,
            maxPrice: data.maxPrice,
            paymentMethods: data.paymentMethods,
            statuses: data.statuses,
            sortType: data.sortType,
            size: data.size,
        })
        toast({
            description: "Filters applied successfully.",
        })
        setIsOpen(false)
    }

    return (
        <SheetFormContainer
            title="Filter"
            form={form}
            formId="orderFilterForm"
            onSubmit={onSubmit}
            submitButtonText="Filter"
            secondaryButtonClick={() => {
                resetFilters();
                form.reset();
            }}
            secondaryButtonText="Reset"
        >
            <DatePickerField form={form} name="minDate" label="Ealiest date"/>
            <DatePickerField form={form} name="maxDate" label="Latest date"/>
            <SliderField form={form} nameMin="minPrice" nameMax="maxPrice" label="Price"
                         range={[priceRange[0], priceRange[1]]}/>
            <ComboBoxMultipleValueField form={form} name="paymentMethods" label="Payment Methods"
                                        options={mapEnumToOptions(GetAll1PaymentMethodsEnum)}/>
            <ComboBoxMultipleValueField form={form} name="statuses" label="Statuses"
                                        options={mapEnumToOptions(GetAll1StatusesEnum)}/>
            <SelectField form={form} name="sortType" label="Sorting" placeholder="Select sorting..." options={mapEnumToOptions(GetAll1SortTypeEnum)}/>
            <NumberInputField form={form} name="size" label="Pgae size" placeholder="Add page size..."/>
        </SheetFormContainer>
    );
}

export default FilterForm