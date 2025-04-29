import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import React from "react";
import {useAuth} from "@/hooks/useAuth.ts";
import {Link} from "react-router-dom";
import {ApiError} from "@/shared/ApiError.ts";
import {ResultEntryReasonCodeEnum} from "@/shared/api";
import {unexpectedErrorToast} from "@/hooks/useToast.ts";
import {TextInputField} from "../../ui/fields/InputField";
import FormCardContainer from "../../shared/FormCardContainer.component";
import {AppPaths} from "@/routing/AppPaths.ts";

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
            await login(data.email, data.password)
        } catch (error) {
            if (error instanceof ApiError && error.error) {
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

    return <FormCardContainer title="Login"
                              description="Please use your email and password to authenticate yourself."
                              form={form}
                              formId="login-form"
                              onSubmit={onSubmit}
                              submitButtonText="Login"
                              singleColumn={false}
                              className="w-full">
        <div className="flex flex-col gap-2">
            <TextInputField form={form} name="email" label="Email"
                            placeholder="Please enter your email" autoComplete="email"/>
            <TextInputField form={form} name="password" label="Password"
                            placeholder="*****" autoComplete="current-password"
                            description={<Link to={AppPaths.FORGOT_PASSWORD}>I forgot my password!</Link>}
                            type="password"/>
        </div>
        <div className="hidden sm:flex flex-col justify-center items-center p-4">
            <h2 className="text-xl font-semibold text-center">Welcome Back!</h2>
            <p className="text-center">Sign in to start shopping.</p>
        </div>
    </FormCardContainer>
}

export default LoginForm