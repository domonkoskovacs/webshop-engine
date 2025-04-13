import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useFieldArray, useForm} from "react-hook-form";
import React from "react";
import {useRefundOrder} from "../../../hooks/order/useRefundOrder";
import {toast} from "../../../hooks/useToast";
import {handleGenericApiError} from "../../../shared/ApiError";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {SelectOption} from "../../../types/select";
import SelectField from "../../ui/fields/SelectField";
import {OrderItemResponse} from "../../../shared/api";

const FormSchema = z.object({
    items: z.array(z.object({
        orderItemId: z.string(),
        count: z.coerce.number().min(1, "Must refund at least one item"),
    }))
});

type RefundFormProps = {
    orderId: string;
    items: OrderItemResponse[];
    setIsOpen: (open: boolean) => void;
};

const RefundForm: React.FC<RefundFormProps> = ({orderId, items, setIsOpen}) => {
    const {mutateAsync: refund} = useRefundOrder();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: items.map((item) => ({
                orderItemId: item.id!,
                count: undefined,
            })),
        },
    });

    const {fields} = useFieldArray({
        control: form.control,
        name: "items",
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
            await refund({id: orderId, refund: data.items});
            toast.success("Refund successful and status updated to RETURN_RECEIVED.");
            setIsOpen(false);
        } catch (error) {
            handleGenericApiError(error);
        }
    };

    return (
        <SheetFormContainer
            title="Refund Order"
            form={form}
            formId="refundOrderForm"
            onSubmit={form.handleSubmit(onSubmit)}
            submitButtonText="Refund"
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            {fields.map((field, index) => {
                const item = items.find(i => i.id === field.orderItemId);

                const options: SelectOption[] =
                    item?.count
                        ? Array.from({length: item.count}, (_, i) => ({
                            value: (i + 1).toString(),
                            label: `${i + 1}`,
                        }))
                        : [];

                return (
                    <div key={field.id} className="flex flex-col gap-2">
                        <div className="flex flex-row gap-4 items-start">
                            {item?.thumbNailUrl && (
                                <img
                                    src={item.thumbNailUrl}
                                    alt={item.productName}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            )}
                            <div className="flex-1">
                                <div className="font-semibold">{item?.productName}</div>
                                <div className="text-sm text-muted-foreground">
                                    Refundable quantity: {item?.count}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Individual price: ${item?.individualPrice?.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div>
                            <SelectField
                                form={form}
                                name={`items.${index}.count`}
                                label="Refund Quantity"
                                placeholder="Select quantity"
                                options={options}
                            />
                        </div>
                    </div>
                );
            })}
        </SheetFormContainer>
    );
};

export default RefundForm;
