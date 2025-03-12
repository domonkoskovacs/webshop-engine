import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form,} from "src/components/ui/Form"
import React from "react";
import {toast} from "../../../hooks/UseToast";
import {userService} from "../../../services/UserService";
import {TextInputField} from "../../ui/InputField";

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

    return (
        <div className="flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <TextInputField form={form} name="email" label="Email"
                                    placeholder="Please enter your email"
                                    description="Type in your email, we will shortly send you a message to renew your password."/>
                    <Button type="submit">Send</Button>
                </form>
            </Form>
        </div>
    );
}

export default ForgotPasswordForm