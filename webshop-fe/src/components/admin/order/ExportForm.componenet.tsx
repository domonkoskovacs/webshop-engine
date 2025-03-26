import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {useOrder} from "../../../hooks/UseOrder";
import DatePickerField from "../../ui/fields/DatePickerField";

export const FormSchema = z.object({
    from: z.date({
        required_error: "Start date is required.",
    }),
    to: z.date({
        required_error: "End date is required.",
    }),
}).refine((data) => data.to >= data.from, {
    message: "End date must be after start date.",
    path: ["to"],
});

interface ExportFormProps {
    setIsOpen: (open: boolean) => void;
}

const ExportForm: React.FC<ExportFormProps> = ({setIsOpen}) => {
    const {exportOrders} = useOrder()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await exportOrders(
            data.from.toISOString().split("T")[0],
            data.to.toISOString().split("T")[0])
        toast({
            description: "Orders exported successfully.",
        })
        setIsOpen(false)
    }

    return (
        <SheetFormContainer
            title="Export"
            form={form}
            formId="exportOrderForm"
            onSubmit={onSubmit}
            submitButtonText="Export"
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            <DatePickerField form={form} name="from" label="Start date"/>
            <DatePickerField form={form} name="to" label="End date"/>
        </SheetFormContainer>
    );
}

export default ExportForm