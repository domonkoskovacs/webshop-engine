import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "../../../hooks/UseToast";
import {userService} from "../../../services/UserService";
import {TextInputField} from "../../ui/InputField";
import FormCardContainer from "../../shared/FormCardContainer.component";

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

const NewPasswordForm: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: "",
            passwordAgain: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const id = searchParams.get("id");
        if (id) {
            await userService.newPassword(id, data.password);
            toast({
                variant: "success",
                description: "Password renewed.",
            })
        } else {
            navigate("/");
        }
    }

    return <FormCardContainer title="Add new password"
                              form={form}
                              formId="new-password-form"
                              onSubmit={onSubmit}
                              submitButtonText="Renew Password"
                              singleColumn={true}
                              className="w-full sm:w-1/2 md:w-1/3 mx-6">
        <TextInputField form={form} name="password" label="Password"
                        placeholder="Add new password" type="password"/>
        <TextInputField form={form} name="passwordAgain" label="Password again"
                        placeholder="Password again" type="password"/>
    </FormCardContainer>
}

export default NewPasswordForm