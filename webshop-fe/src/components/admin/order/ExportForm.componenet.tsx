import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "../../../hooks/useToast";
import React from "react";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import DatePickerField from "../../ui/fields/DatePickerField";
import {useExportOrders} from "../../../hooks/order/useExportOrders";
import {handleGenericApiError} from "../../../shared/ApiError";

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
    const {mutateAsync: exportOrders, isPending} = useExportOrders();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            await exportOrders({
                from: data.from.toISOString().split("T")[0],
                to: data.to.toISOString().split("T")[0],
            });
            toast.success("Orders exported successfully.");
            setIsOpen(false);
        } catch (error) {
            handleGenericApiError(error);
        }
    };

    return (
        <SheetFormContainer
            title="Export"
            form={form}
            formId="exportOrderForm"
            onSubmit={onSubmit}
            submitButtonDisabled={isPending}
            submitButtonText={isPending ? "Exporting..." : "Export"}
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            <DatePickerField form={form} name="from" label="Start date"/>
            <DatePickerField form={form} name="to" label="End date"/>
        </SheetFormContainer>
    );
}

export default ExportForm