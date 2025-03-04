import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Card, CardContent, CardFooter, CardHeader} from "../../ui/Card";
import {Form} from "../../ui/Form";
import React from "react";
import {useUser} from "../../../hooks/UseUser";
import {toast, unexpectedErrorToast} from "../../../hooks/UseToast";
import {Button} from "../../ui/Button";
import {TextInputField} from "../../ui/InputField";

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
    const {changePassword} = useUser()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange"
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await changePassword(data.password)
            toast({
                description: "Your password was successfully renewed.",
            })
        } catch (error) {
            unexpectedErrorToast()
        }
    }

    return (
        <Card className="my-4 flex-1 flex flex-col justify-center">
            <CardHeader>
                <h1 className="font-bold">Change your password</h1>
                <h2 className="text-md">We advise you to change it every year.</h2>
            </CardHeader>
            <CardContent className="flex flex-col justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="renew-password-form"
                          className="w-full space-y-6 mb-6">
                        <TextInputField form={form} name="password" label="Password" placeholder="Add new password"
                                        type="password"/>
                        <TextInputField form={form} name="passwordAgain" label="Password again"
                                        placeholder="Password again" type="password"/>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="p-0 border-t">
                <Button className="w-full rounded-t-none" variant="secondary" type="submit"
                        form="renew-password-form">Update</Button>
            </CardFooter>
        </Card>
    );
}

export default PasswordForm;