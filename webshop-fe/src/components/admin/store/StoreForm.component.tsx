import {z} from "zod"
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {StoreRequest} from "@/shared/api";
import {toast, unexpectedErrorToast} from "@/hooks/useToast.ts";
import {NumberInputField, TextInputField} from "../../ui/fields/InputField";
import {SwitchField} from "../../ui/fields/SwitchField";
import FormCardContainer from "../../shared/FormCardContainer.component";
import {useStore} from "@/hooks/store/useStore.ts";
import {useUpdateStore} from "@/hooks/store/useUpdateStore.ts";

export const FormSchema = z.object({
    name: z.string().min(1, "Store name is required"),
    minOrderPrice: z.number().min(0, "Minimum order price must be at least 0"),
    shippingPrice: z.number().min(0, "Shipping price must be at least 0"),
    returnPeriod: z.number().min(0, "Return period must be at least 0"),
    deleteOutOfStockProducts: z.boolean(),
    enableBuiltInMarketingEmails: z.boolean(),
    unpaidOrderCancelHours: z.number().min(1, "Unpaid order cancel hours is at least 1"),
});

const StoreForm: React.FC = () => {
    const {data: store, isLoading} = useStore();
    const {mutateAsync: updateStore, isPending} = useUpdateStore();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            minOrderPrice: 0,
            shippingPrice: 0,
            returnPeriod: 0,
            deleteOutOfStockProducts: false,
            enableBuiltInMarketingEmails: false,
        }
    })

    useEffect(() => {
        if (store) {
            form.reset({
                name: store.name,
                minOrderPrice: store.minOrderPrice,
                shippingPrice: store.shippingPrice,
                returnPeriod: store.returnPeriod,
                deleteOutOfStockProducts: store.deleteOutOfStockProducts,
                enableBuiltInMarketingEmails: store.enableBuiltInMarketingEmails,
                unpaidOrderCancelHours: store.unpaidOrderCancelHours,
            });
        }
    }, [form, store]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const storeRq: StoreRequest = {...data}
            await updateStore(storeRq);
            toast.success("Store successfully updated.");
        } catch (error) {
            unexpectedErrorToast(error)
        }
    }

    if (isLoading) {
        return <p className="text-center py-10 text-gray-500">Loading store settings...</p>;
    }

    return <FormCardContainer title="Store configuration" form={form} formId="store-form" onSubmit={onSubmit}
                              submitButtonText={isPending ? "Updating..." : "Update"} submitButtonDisabled={isPending}>
        <div className="flex flex-col gap-2">
            <TextInputField form={form} name="name" label="Store name"
                            placeholder="Add the name of your store"/>
            <NumberInputField form={form} name="minOrderPrice" label="Minimum order price"
                              placeholder="Add the minimum order price"/>
            <NumberInputField form={form} name="shippingPrice" label="Shipping price"
                              placeholder="Add the shipping price"/>
            <NumberInputField form={form} name="returnPeriod" label="Return period (day)"
                              placeholder="Add the return period"/>

        </div>
        <div className="flex flex-col gap-2">
            <NumberInputField form={form} name="unpaidOrderCancelHours" label="Unpaid order wait period (h)"
                              placeholder="Add hours"/>
            <SwitchField form={form} name="deleteOutOfStockProducts" label="Out of stock job"
                         description="Delete out of stock products"/>
            <SwitchField form={form} name="enableBuiltInMarketingEmails" label="Marketing email job"
                         description="Enable marketing emails"/>
        </div>
    </FormCardContainer>
}

export default StoreForm