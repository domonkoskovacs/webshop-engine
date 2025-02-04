import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import React from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {toast} from "../../../hooks/UseToast";
import {userService} from "../../../services/UserService";

const FormSchema = z.object({
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
})

const NewPasswordForm: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: ""
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

    return (
        <div className="flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
                                    Please type in your new password!
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Renew Password</Button>
                </form>
            </Form>
        </div>
    );
}

export default NewPasswordForm