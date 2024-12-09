import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import React from "react";
import {apiService} from "../../../shared/ApiService";
import {Link} from "react-router-dom";
import {toast} from "../../../hooks/UseToast";

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
        await apiService.sendForgotPasswordEmail({email: data.email})
        toast({
            variant: "success",
            description: "The password renewal email will arrive shortly, please check your inbox.",
        })
    }

    return (
        <div className="flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Please enter your email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Type in your email, we will shortly send you a message to renew your password.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Send</Button>
                </form>
            </Form>
        </div>
    );
}

export default ForgotPasswordForm