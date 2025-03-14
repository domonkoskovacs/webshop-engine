import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {useToast} from "../../../hooks/UseToast";
import React, {useEffect} from "react";
import {useProduct} from "../../../hooks/UseProduct";
import {NumberInputField} from "../../ui/fields/InputField";
import SheetFormContainer from "../shared/SheetFormContainer.componenet";

export const FormSchema = z.object({
    discountPercentage: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100").optional(),
});

interface DiscountFormProps {
    setIsOpen: (open: boolean) => void;
    productIds: string[];
}

const DiscountForm: React.FC<DiscountFormProps> = ({setIsOpen, productIds}) => {
    const {setDiscounts, getById} = useProduct()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            discountPercentage: 0,
        },
    })

    useEffect(() => {
        if (productIds.length === 1) {
            getById(productIds[0])
                .then(async (product) => {
                    form.reset({
                        discountPercentage: product.discountPercentage,
                    });
                })
                .catch(() => toast({description: "Error fetching product."}))
        }
    }, [form, getById, productIds, toast]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setDiscounts(productIds.map(id => ({
            id,
            discount: data.discountPercentage,
        })));
        toast({
            description: "Discount applied successfully.",
        })
        setIsOpen(false)
    }

    return (
        <SheetFormContainer
            title="Set discount"
            form={form}
            formId="discountForm"
            onSubmit={onSubmit}
            submitButtonText="Save"
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