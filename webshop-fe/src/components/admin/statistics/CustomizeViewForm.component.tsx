import React, {useEffect} from "react";

import {z} from "zod";
import {toast} from "@/hooks/useToast.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {NumberInputField} from "../../ui/fields/InputField";
import DatePickerField from "../../ui/fields/DatePickerField";
import {StatisticsServiceApiGetStatisticsRequest} from "@/shared/api";

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
    currentRequest: StatisticsServiceApiGetStatisticsRequest;
    setRequest: React.Dispatch<React.SetStateAction<StatisticsServiceApiGetStatisticsRequest>>;
}

const CustomizeViewForm: React.FC<FilterFormProps> = ({
                                                          setIsOpen,
                                                          currentRequest,
                                                          setRequest,
                                                      }) => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    useEffect(() => {
        form.reset({
            from: currentRequest.from ? new Date(currentRequest.from) : undefined,
            to: currentRequest.to ? new Date(currentRequest.to) : undefined,
            topCount: currentRequest.topCount,
        });
    }, [form, currentRequest]);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const formattedRequest = {
            from: data.from.toISOString().split("T")[0],
            to: data.to.toISOString().split("T")[0],
            topCount: data.topCount,
        };

        setRequest(formattedRequest);
        toast.info("Filters applied successfully.");
        setIsOpen(false);
    };

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