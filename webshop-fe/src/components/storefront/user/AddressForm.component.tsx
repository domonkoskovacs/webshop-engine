import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import React, {useEffect} from "react";
import {toast, unexpectedErrorToast} from "@/hooks/useToast.ts";
import {AddressRequest} from "@/shared/api";
import {NumberInputField, TextInputField} from "../../ui/fields/InputField";
import {useAuth} from "@/hooks/useAuth.ts";
import FormCardContainer from "../../shared/FormCardContainer.component";
import {useUpdateUser} from "@/hooks/user/useUpdateUser.ts";
import {useUser} from "@/hooks/user/useUser.ts";

export const FormSchema = z.object({
    country: z.string().min(1, {message: "Country is required."}),
    zipCode: z.number().int().nonnegative({message: "Zip code must be a valid number."}),
    city: z.string().min(1, {message: "City is required."}),
    street: z.string().min(1, {message: "Street is required."}),
    streetNumber: z.number().int().nonnegative({message: "Street number must be a valid number."}),
    floorNumber: z.string().min(1, {message: "Floor number is required."})
});

interface AddressFormProps {
    type: "shipping" | "billing";
}

const AddressForm: React.FC<AddressFormProps> = ({type}) => {
    const {data: user} = useUser();
    const {loggedIn} = useAuth();
    const {updateBillingAddress, updateShippingAddress} = useUpdateUser();
    const profileChangesNeeded = loggedIn && (
        (type === "billing" && !user?.billingAddress) ||
        (type === "shipping" && !user?.shippingAddress)
    );

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
            if (type === "shipping" && user.shippingAddress) {
                form.reset({
                    country: user.shippingAddress.country,
                    zipCode: user.shippingAddress.zipCode,
                    city: user.shippingAddress.city,
                    street: user.shippingAddress.street,
                    streetNumber: user.shippingAddress.streetNumber,
                    floorNumber: user.shippingAddress.floorNumber,
                });
            } else if (type === "billing" && user.billingAddress) {
                form.reset({
                    country: user.billingAddress.country,
                    zipCode: user.billingAddress.zipCode,
                    city: user.billingAddress.city,
                    street: user.billingAddress.street,
                    streetNumber: user.billingAddress.streetNumber,
                    floorNumber: user.billingAddress.floorNumber,
                });
            }
        }
    }, [form, user, type]);

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
            if (type === "shipping" && user) {
                await updateShippingAddress(addressRq);
                toast.success("Your shipping address was successfully updated.");
            } else if (type === "billing" && user) {
                await updateBillingAddress(addressRq);
                toast.success("Your billing address was successfully updated.");
            }
        } catch (error) {
            unexpectedErrorToast(error)
        }
    }

    return <FormCardContainer title={`Change your ${type === "shipping" ? "shipping" : "billing"} address`}
                              form={form}
                              formId={`${type}-address-form`}
                              onSubmit={onSubmit}
                              submitButtonText="Update"
                              singleColumn={true}
                              profileChangesNeeded={profileChangesNeeded}>
        <TextInputField form={form} name="country" label="Country" placeholder="Add country"/>
        <NumberInputField form={form} name="zipCode" label="Zipcode" placeholder="Add your zipcode"/>
        <TextInputField form={form} name="city" label="City" placeholder="Add your city"/>
        <TextInputField form={form} name="street" label="Street" placeholder="Add your street"/>
        <NumberInputField form={form} name="streetNumber" label="Street number"
                          placeholder="Add your street number"/>
        <TextInputField form={form} name="floorNumber" label="Floor number"
                        placeholder="Add your floorNumber"/>
    </FormCardContainer>
}

export default AddressForm;