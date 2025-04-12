import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import React, {useEffect} from "react";
import {toast, unexpectedErrorToast} from "../../../hooks/UseToast";
import {TextInputField} from "../../ui/fields/InputField";
import {UpdateUserRequestGenderEnum} from "../../../shared/api";
import {Link} from "react-router-dom";
import {SwitchField} from "../../ui/fields/SwitchField";
import FormCardContainer from "../../shared/FormCardContainer.component";
import {useUser} from "../../../hooks/user/useUser";
import {useUpdateUser} from "../../../hooks/user/useUpdateUser";

const FormSchema = z.object({
    email: z.string().email({message: "Invalid email format."}),
    firstname: z.string().min(1, {message: "Firstname is required."}),
    lastname: z.string().min(1, {message: "Lastname is required."}),
    phoneNumber: z.string().min(1, {message: "Phone number is required."}),
    gender: z.enum([UpdateUserRequestGenderEnum.Female, UpdateUserRequestGenderEnum.Male]),
    subscribedToEmail: z.boolean(),
});

const AccountInfoForm: React.FC = () => {
    const { data: user } = useUser();
    const { updateUserUserInfo, isPending } = useUpdateUser();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    useEffect(() => {
        if (user) {
            form.reset({
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                subscribedToEmail: user.subscribedToEmail,
            });
        }
    }, [form, user]);


    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await updateUserUserInfo(
                data.email,
                data.firstname,
                data.lastname,
                data.phoneNumber,
                data.gender,
                data.subscribedToEmail
            );
            toast({description: "Your account information was successfully updated.",})
        } catch (error) {
            unexpectedErrorToast()
        }
    }

    return <FormCardContainer title="Update account information"
                              description="Keep your info up to date!"
                              form={form}
                              formId="account-info-form"
                              onSubmit={onSubmit}
                              submitButtonText={isPending ? "Updating..." : "Update"}
                              submitButtonDisabled={isPending}
                              singleColumn={true}>
        <TextInputField form={form} name="email" label="Email" placeholder="Add your email"/>
        <TextInputField form={form} name="firstname" label="Firstname"
                        placeholder="Add your firstname"/>
        <TextInputField form={form} name="lastname" label="Lastname" placeholder="Add your lastname"/>
        <TextInputField form={form} name="phoneNumber" label="PhoneNumber"
                        placeholder="Add your phoneNumber"/>
        <TextInputField form={form} name="gender" label="Gender" placeholder="Add your gender"/>
        <SwitchField form={form} name="subscribedToEmail" label="Subscribe to email list."
                     description={<>You can change this anytime for more information please<Link
                         to={"/terms-and-conditions"}>contact us</Link>.</>}/>
    </FormCardContainer>
}

export default AccountInfoForm;