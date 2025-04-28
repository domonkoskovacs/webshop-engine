import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "../../../hooks/useToast";
import React, {useEffect} from "react";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {GetAll4PaymentTypesEnum, GetAll4SortTypeEnum, GetAll4StatusesEnum} from "../../../shared/api";
import DatePickerField from "../../ui/fields/DatePickerField";
import SliderField from "../../ui/fields/SliderField";
import {ComboBoxMultipleValueField} from "../../ui/fields/ComboBoxMultipleValueField";
import {mapEnumToOptions} from "../../../lib/options.utils";
import SelectField from "../../ui/fields/SelectField";
import {NumberInputField} from "../../ui/fields/InputField";
import {useOrdersPagination} from "../../../hooks/order/useOrdersPagination";

export const FormSchema = z.object({
    minDate: z.date().optional(),
    maxDate: z.date().refine((date) => date <= new Date(), {
        message: "Max date must be today or earlier"
    }).optional(),
    minPrice: z.number().min(0, {message: "Min price must be at least 0"}).optional(),
    maxPrice: z.number().optional(),
    paymentTypes: z.array(z.nativeEnum(GetAll4PaymentTypesEnum)).optional(),
    statuses: z.array(z.nativeEnum(GetAll4StatusesEnum)).optional(),
    sortType: z.nativeEnum(GetAll4SortTypeEnum).optional(),
    size: z.number().positive({message: "Size must be a positive number"}).optional()
});

interface ProductFormProps {
    setIsOpen: (open: boolean) => void;
}

const FilterForm: React.FC<ProductFormProps> = ({setIsOpen}) => {
    const {updateFilters, filters, resetFilters, priceRange} = useOrdersPagination()

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
            paymentTypes: filters.paymentTypes,
            statuses: filters.statuses,
            sortType: filters.sortType,
            size: filters.size,
        });
    }, [filters.maxDate, filters.maxPrice, filters.minDate, filters.minPrice, filters.paymentTypes, filters.size, filters.sortType, filters.statuses, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        updateFilters({
            minDate: data.minDate?.toISOString().split("T")[0],
            maxDate: data.maxDate?.toISOString().split("T")[0],
            minPrice: data.minPrice,
            maxPrice: data.maxPrice,
            paymentTypes: data.paymentTypes,
            statuses: data.statuses,
            sortType: data.sortType,
            size: data.size,
        })
        toast.info("Filters applied successfully.")
        setIsOpen(false)
    }

    return (
        <SheetFormContainer
            title="Filter Orders"
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
                                        options={mapEnumToOptions(GetAll4PaymentTypesEnum)}/>
            <ComboBoxMultipleValueField form={form} name="statuses" label="Statuses"
                                        options={mapEnumToOptions(GetAll4StatusesEnum)}/>
            <SelectField form={form} name="sortType" label="Sorting" placeholder="Select sorting..."
                         options={mapEnumToOptions(GetAll4SortTypeEnum)}/>
            <NumberInputField form={form} name="size" label="Pgae size" min={1} placeholder="Add page size..."/>
        </SheetFormContainer>
    );
}

export default FilterForm