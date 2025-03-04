import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Card, CardContent, CardFooter, CardHeader} from "../../ui/Card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/Form";
import {Input} from "../../ui/Input";
import React from "react";
import {useUser} from "../../../hooks/UseUser";
import {toast, unexpectedErrorToast} from "../../../hooks/UseToast";
import {Button} from "../../ui/Button";

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
        mode: "onChange",
        defaultValues: {
            password: ""
        },
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password"
                                               placeholder="Add new password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passwordAgain"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password again</FormLabel>
                                    <FormControl>
                                        <Input type="password"
                                               placeholder="Password again" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="p-0 border-t">
                <Button className="w-full rounded-t-none" variant="secondary" type="submit" form="renew-password-form">Update</Button>
            </CardFooter>
        </Card>
    );
}

export default PasswordForm;