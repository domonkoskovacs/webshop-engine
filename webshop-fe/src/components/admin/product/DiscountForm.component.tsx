import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form,} from "src/components/ui/Form"
import {useToast} from "../../../hooks/UseToast";
import React, {useEffect} from "react";
import {useProduct} from "../../../hooks/UseProduct";
import {NumberInputField} from "../../ui/InputField";

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
            description: "Product created successfully.",
        })
        setIsOpen(false)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Set discount</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="createProductForm">
                        <div className="flex flex-col p-6 gap-4">
                            <NumberInputField form={form} name="discountPercentage" label="Discount" min={0} max={100}
                                              placeholder="Discount..." description="The discount will apply for all selected
                                            products!"/>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Back
                </Button>
                <Button type="submit" className="w-full" form="createProductForm">
                    Save
                </Button>
            </div>
        </div>
    );
}

export default DiscountForm