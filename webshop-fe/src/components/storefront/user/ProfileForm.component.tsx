import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import React from "react";
import {Card, CardContent, CardHeader} from "../../ui/Card";

const FormSchema = z.object({
    password: z.string().min(1, {
        message: "Please add your password."
    }),
    passwordAgain: z.string().min(1, {
        message: "Please add your password."
    })
})

const ProfileForm: React.FC = () => {

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

    }

    return (
        <div className="w-full flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mb-6">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 md:gap-4">
                        <div className="md:flex flex-col gap-4">
                            <Card className="my-4">
                                <CardContent className="flex flex-col justify-center">
                                    <h1 className="font-bold">Profile Settings</h1>
                                    <h2 className="text-md">Update your information or change profile settings</h2>
                                </CardContent>
                            </Card>
                            <Card className="my-4">
                                <CardContent className="flex flex-col justify-center">
                                    <h1 className="font-bold">Security Settings</h1>
                                    <h2 className="text-md">Manage your passwords and authentication</h2>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:flex flex-col gap-4">
                            <Card className="md:my-4 flex-1">
                                <CardContent className="flex flex-col justify-center">
                                    <h1 className="font-bold">Account Preferences</h1>
                                    <h2 className="text-md">Customize your experience and preferences</h2>
                                </CardContent>
                            </Card>

                            <Card className="my-4 flex-1 flex flex-col justify-center">
                                <CardHeader>
                                    <h1 className="font-bold">Change your password</h1>
                                    <h2 className="text-md">We advise you to change it every year.</h2>
                                </CardHeader>
                                <CardContent className="flex flex-col justify-center">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mb-6">
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
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <Button variant="destructive">Delete</Button>
                        <Button variant="default" type="submit">Update</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default ProfileForm