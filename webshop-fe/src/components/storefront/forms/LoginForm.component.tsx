import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import React from "react";
import {useAuth} from "../../../hooks/UseAuth";
import {Link} from "react-router-dom";
import {ApiError} from "../../../shared/ApiError";
import {ResultEntryReasonCodeEnum} from "../../../shared/api";
import {unexpectedErrorToast} from "../../../hooks/UseToast";
import {TextInputField} from "../../ui/InputField";
import FormCardContainer from "../../shared/FormCardContainer.component";

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
        } catch (error: any) {
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
                              singleColumn={true}
                              className="w-full">
        <TextInputField form={form} name="email" label="Email"
                        placeholder="Please enter your email"/>
        <TextInputField form={form} name="password" label="Password"
                        placeholder="*****"
                        description={<Link to="/forgot-password">I forgot my password!</Link>}
                        type="password"/>
    </FormCardContainer>
}

export default LoginForm