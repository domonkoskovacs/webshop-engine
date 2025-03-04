import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Card, CardContent, CardFooter, CardHeader} from "../../ui/Card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/Form";
import {Input} from "../../ui/Input";
import React, {useEffect} from "react";
import {useUser} from "../../../hooks/UseUser";
import {toast, unexpectedErrorToast} from "../../../hooks/UseToast";
import {Button} from "../../ui/Button";
import {AddressRequest} from "../../../shared/api";

export const FormSchema = z.object({
    country: z.string().min(1, {message: "Country is required."}),
    zipCode: z.number().int().nonnegative({message: "Zip code must be a valid number."}),
    city: z.string().min(1, {message: "City is required."}),
    street: z.string().min(1, {message: "Street is required."}),
    streetNumber: z.number().int().nonnegative({message: "Street number must be a valid number."}),
    floorNumber: z.string().min(1, {message: "Floor number is required."})
});


const AddressForm: React.FC = () => {
    const {user, updateShippingAddress} = useUser()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            country: "",
            zipCode: 0,
            city: "",
            street: "",
            streetNumber: 0,
            floorNumber: "",
        },
    })

    useEffect(() => {
        if (user) {
            form.reset({
                country: user.shippingAddress?.country,
                zipCode: user.shippingAddress?.zipCode,
                city: user.shippingAddress?.city,
                street: user.shippingAddress?.street,
                streetNumber: user.shippingAddress?.streetNumber,
                floorNumber: user.shippingAddress?.floorNumber,
            });
        }
    }, [form, user]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const addressRq: AddressRequest = {
                country: data.country,
                zipCode: data.zipCode,
                city: data.city,
                street: data.street,
                streetNumber: data.streetNumber,
                floorNumber: data.floorNumber
            }
            await updateShippingAddress(addressRq)
            toast({
                description: "Your shipping address was successfully updated.",
            })
        } catch (error) {
            unexpectedErrorToast()
        }
    }

    return (
        <Card className="my-4">
            <CardHeader>
                <h1 className="font-bold">Change your shipping address</h1>
            </CardHeader>
            <CardContent className="flex flex-col justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="shipping-address-form"
                          className="w-full space-y-6 mb-6">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Add country" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="zipCode"
                            render={({field: {onChange, value, ...rest}}) => (
                                <FormItem>
                                    <FormLabel>Zipcode</FormLabel>
                                    <FormControl>
                                        <Input type="number"
                                               placeholder="Add your zipcode"
                                               min={0}
                                               value={value ?? ""}
                                               onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                                               {...rest} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Add your city" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="street"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Street</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Add your street" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="streetNumber"
                            render={({field: {onChange, value, ...rest}}) => (
                                <FormItem>
                                    <FormLabel>Street number</FormLabel>
                                    <FormControl>
                                        <Input type="number"
                                               placeholder="Add your street number"
                                               min={0}
                                               value={value ?? ""}
                                               onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                                               {...rest} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="floorNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Floor number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Add your floorNumber" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="p-0 border-t">
                <Button className="w-full rounded-t-none" variant="secondary" type="submit"
                        form="shipping-address-form">Update</Button>
            </CardFooter>
        </Card>
    );
}

export default AddressForm;