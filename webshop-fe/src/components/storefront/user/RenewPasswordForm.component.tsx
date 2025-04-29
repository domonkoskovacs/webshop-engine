import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import React from "react";
import {toast, unexpectedErrorToast} from "@/hooks/useToast.ts";
import {TextInputField} from "../../ui/fields/InputField";
import FormCardContainer from "../../shared/FormCardContainer.component";
import {useChangePassword} from "@/hooks/user/useChangePassword.ts";

const FormSchema = z.object({
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    passwordAgain: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
}).refine((data) => data.password === data.passwordAgain, {
    message: "Passwords must match.",
    path: ["passwordAgain"]
});
const PasswordForm: React.FC = () => {
    const {mutateAsync: changePassword} = useChangePassword()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange"
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await changePassword(data.password)
            toast.success("Your password was successfully renewed.");
        } catch (error) {
            unexpectedErrorToast(error)
        }
    }

    return <FormCardContainer title="Change your password"
                              description="We advise you to change it every year."
                              form={form}
                              formId="renew-password-form"
                              onSubmit={onSubmit}
                              submitButtonText="Update"
                              singleColumn={true}>
        <input
            type="text"
            name="username"
            autoComplete="username"
            className="hidden"
        />
        <TextInputField form={form} name="password" label="Password" placeholder="Add new password"
                        type="password" autoComplete="new-password"/>
        <TextInputField form={form} name="passwordAgain" label="Password again"
                        placeholder="Password again" type="password" autoComplete="new-password"/>
    </FormCardContainer>
}

export default PasswordForm;