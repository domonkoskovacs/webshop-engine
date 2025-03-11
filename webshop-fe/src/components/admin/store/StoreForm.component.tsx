import {z} from "zod"
import React, {useEffect} from "react";
import {useStore} from "../../../hooks/useStore";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {StoreRequest} from "../../../shared/api";
import {toast, unexpectedErrorToast} from "../../../hooks/UseToast";
import {Card, CardContent, CardFooter, CardHeader} from "../../ui/Card";
import {Form} from "../../ui/Form";
import {NumberInputField, TextInputField} from "../../ui/InputField";
import {Button} from "../../ui/Button";
import {Separator} from "../../ui/Separator";
import {SwitchField} from "../../ui/SwitchField";

export const FormSchema = z.object({
    name: z.string().min(1, "Store name is required"),
    minOrderPrice: z.number().min(0, "Minimum order price must be at least 0"),
    shippingPrice: z.number().min(0, "Shipping price must be at least 0"),
    returnPeriod: z.number().min(0, "Return period must be at least 0"),
    deleteOutOfStockProducts: z.boolean(),
    deleteUnusedPictures: z.boolean(),
    enableBuiltInMarketingEmails: z.boolean(),
});

const StoreForm: React.FC = () => {
    const {store, updateStore} = useStore()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    useEffect(() => {
        if (store) {
            form.reset({
                name: store.name,
                minOrderPrice: store.minOrderPrice,
                shippingPrice: store.shippingPrice,
                returnPeriod: store.returnPeriod,
                deleteOutOfStockProducts: store.deleteOutOfStockProducts,
                deleteUnusedPictures: store.deleteUnusedPictures,
                enableBuiltInMarketingEmails: store.enableBuiltInMarketingEmails,
            });
        }
    }, [form, store]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const storeRq: StoreRequest = {...data}
            await updateStore(storeRq);
            toast({description: "Store successfully updated."});
        } catch (error) {
            unexpectedErrorToast()
        }
    }

    return (
        <Card className="my-4">
            <CardHeader>
                <h1 className="font-bold">Store configuration</h1>
            </CardHeader>
            <Separator/>
            <CardContent className="flex flex-col justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="store-form"
                          className="w-full space-y-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                        <div className="flex flex-col gap-2">
                            <TextInputField form={form} name="name" label="Store name"
                                            placeholder="Add the name of your store"/>
                            <NumberInputField form={form} name="minOrderPrice" label="Minimum order price"
                                              placeholder="Add the minimum order price"/>
                            <NumberInputField form={form} name="shippingPrice" label="Shipping price"
                                              placeholder="Add the shipping price"/>
                            <NumberInputField form={form} name="returnPeriod" label="Return period"
                                              placeholder="Add the return period"/>
                        </div>
                        <div className="flex flex-col gap-2">
                            <SwitchField form={form} name="deleteOutOfStockProducts" label="Out of stock job"
                                         description="Delete out of stock products"/>
                            <SwitchField form={form} name="deleteUnusedPictures" label="Unused picture job"
                                         description="Delete unused pictures"/>
                            <SwitchField form={form} name="enableBuiltInMarketingEmails" label="Marketing email job"
                                         description="Enable marketing emails"/>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="p-0 border-t">
                <Button className="w-full rounded-t-none" type="submit"
                        form="store-form">Update</Button>
            </CardFooter>
        </Card>
    );
}

export default StoreForm