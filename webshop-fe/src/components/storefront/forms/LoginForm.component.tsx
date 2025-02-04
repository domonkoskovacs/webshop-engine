import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import React from "react";
import {useAuth} from "../../../hooks/UseAuth";
import {Link} from "react-router-dom";
import {ApiError} from "../../../shared/ApiError";
import {ResultEntryReasonCodeEnum} from "../../../shared/api";
import {unexpectedErrorToast} from "../../../hooks/UseToast";

const FormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(1, {
        message: "Please add your password."
    })
})

const LoginForm: React.FC = () => {
    const {login} = useAuth();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await login(data.email,data.password)
        } catch (error: any) {
            if(error instanceof ApiError && error.error) {
                const errorMap = new Map(
                    error.error.map(err => [err.reasonCode, true])
                );

                if (errorMap.get(ResultEntryReasonCodeEnum.UnverifiedUser)) {
                    form.setError("email", {
                        type: "manual",
                        message: "Your account is not verified, please use the verification email."
                    }, {shouldFocus: true});
                }
                if (errorMap.get(ResultEntryReasonCodeEnum.EmailNotExists)) {
                    form.setError("email", {
                        type: "manual",
                        message: "No user is associated with this email."
                    }, {shouldFocus: true});
                }
                if (errorMap.get(ResultEntryReasonCodeEnum.WrongPassword)) {
                    form.setError("password", {
                        type: "manual",
                        message: "Wrong password or email. Please try again."
                    }, {shouldFocus: true});
                }
            } else {
                unexpectedErrorToast()
            }
        }
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
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*****" {...field} />
                                </FormControl>
                                <FormDescription>
                                    <Link to="/forgot-password">
                                        I forgot my password!
                                    </Link>
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Login</Button>
                </form>
            </Form>
        </div>
    );
}

export default LoginForm