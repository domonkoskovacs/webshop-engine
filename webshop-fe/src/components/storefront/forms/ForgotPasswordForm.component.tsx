import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import React from "react";
import {toast} from "../../../hooks/UseToast";
import {userService} from "../../../services/UserService";
import {TextInputField} from "../../ui/fields/InputField";
import FormCardContainer from "../../shared/FormCardContainer.component";

const FormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    })
})

const ForgotPasswordForm: React.FC = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await userService.sendForgotPasswordEmail(data.email)
        toast({
            variant: "success",
            description: "The password renewal email will arrive shortly, please check your inbox.",
        })
    }

    return <FormCardContainer title="Forgot password"
                              form={form}
                              formId="forgot-password-form"
                              onSubmit={onSubmit}
                              submitButtonText="Send"
                              singleColumn={true}
                              className="w-full sm:w-1/2 md:w-1/3 mx-6">
        <TextInputField form={form} name="email" label="Email"
                        placeholder="Please enter your email"
                        description="Type in your email, we will shortly send you a message to renew your password."/>
    </FormCardContainer>
}

export default ForgotPasswordForm