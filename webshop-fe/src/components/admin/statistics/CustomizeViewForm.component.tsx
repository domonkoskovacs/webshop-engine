import React, {useEffect} from "react";
import {useProduct} from "../../../hooks/UseProduct";
import {useCategory} from "../../../hooks/UseCategory";
import {GetAllSortTypeEnum, UpdateGenderEnum} from "../../../shared/api";

import {z} from "zod";
import {useToast} from "../../../hooks/UseToast";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
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
import {useStatistics} from "../../../hooks/UseStatistics";
import DatePickerField from "../../ui/fields/DatePickerField";

export const FormSchema = z.object({
    from: z.date({
        required_error: "Start date is required.",
    }),
    to: z.date({
        required_error: "End date is required.",
    }),
    topCount: z.number().min(1, "top count must be positive")
}).refine((data) => data.to >= data.from, {
    message: "End date must be after start date.",
    path: ["to"],
});

interface FilterFormProps {
    setIsOpen: (open: boolean) => void;
}

const CustomizeViewForm: React.FC<FilterFormProps> = ({setIsOpen}) => {
    const {statisticsRequest, updateRequest} = useStatistics();
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    useEffect(() => {
        form.reset({
            from: statisticsRequest.from ? new Date(statisticsRequest.from) : undefined,
            to: statisticsRequest.to ? new Date(statisticsRequest.to) : undefined,
            topCount: statisticsRequest.topCount,
        });
    }, [form, statisticsRequest.from, statisticsRequest.to, statisticsRequest.topCount])

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        updateRequest(data.from.toISOString().split("T")[0], data.to.toISOString().split("T")[0], data.topCount)
        toast({
            description: "Filters applied successfully.",
        })
        setIsOpen(false)
    }

    return (
        <SheetFormContainer
            title="Customize View"
            form={form}
            formId="customizeViewForm"
            onSubmit={onSubmit}
            submitButtonText="Apply"
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            <DatePickerField form={form} name="from" label="Start date"/>
            <DatePickerField form={form} name="to" label="End date"/>
            <NumberInputField form={form} name="topCount" label="Top Count" placeholder="Add top count..." min={1}/>
        </SheetFormContainer>
    );
}

export default CustomizeViewForm