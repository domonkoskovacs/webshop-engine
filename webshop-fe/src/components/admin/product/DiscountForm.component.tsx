import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "../../../hooks/useToast";
import React, {useEffect} from "react";
import {NumberInputField} from "../../ui/fields/InputField";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {useProductById} from "../../../hooks/product/useProductById";
import {useSetProductDiscounts} from "../../../hooks/product/useSetProductDiscounts";
import {handleGenericApiError} from "../../../shared/ApiError";

export const FormSchema = z.object({
    discountPercentage: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100").optional(),
});

interface DiscountFormProps {
    setIsOpen: (open: boolean) => void;
    productIds: string[];
}

const DiscountForm: React.FC<DiscountFormProps> = ({setIsOpen, productIds}) => {
    const {mutateAsync: setDiscounts, isPending} = useSetProductDiscounts();
    const singleProductId = productIds.length === 1 ? productIds[0] : "";
    const {data: productData} = useProductById(singleProductId);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            discountPercentage: 0,
        },
    })

    useEffect(() => {
        if (productIds.length === 1 && productData) {
            form.reset({
                discountPercentage: productData.discountPercentage,
            });
        }
    }, [productIds, productData, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await setDiscounts(productIds.map(id => ({
                id,
                discount: data.discountPercentage,
            })));
            toast.success("Discount applied successfully.",);
            setIsOpen(false);
        } catch (error) {
            handleGenericApiError(error)
        }
    }

    return (
        <SheetFormContainer
            title="Set discount"
            form={form}
            formId="discountForm"
            onSubmit={onSubmit}
            submitButtonText={isPending ? "Saving..." : "Save"}
            submitButtonDisabled={isPending}
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            <NumberInputField form={form} name="discountPercentage" label="Discount" min={0} max={100}
                              placeholder="Discount..."
                              description="The discount will apply for all selected products!"/>
        </SheetFormContainer>
    );
}

export default DiscountForm