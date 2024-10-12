import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import React from "react";
import {RadioGroup, RadioGroupItem} from "src/components/ui/RadioGroup"
import {Switch} from "./ui/Switch"

const FormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    firstname: z.string(),
    lastname: z.string(),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    passwordAgain: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    phoneNumber: z.string(),
    gender: z.enum(["men", "women"], {
        required_error: "You need to select your gender.",
    }),
    subscribe: z.boolean().default(false).optional()
})

const RegistrationForm: React.FC = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            firstname: "",
            lastname: "",
            password: "",
            passwordAgain: "",
            phoneNumber: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {

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
                                    <Input placeholder="email" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your email.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Firstname</FormLabel>
                                <FormControl>
                                    <Input placeholder="firstname" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Lastname</FormLabel>
                                <FormControl>
                                    <Input placeholder="lastname" {...field} />
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
                                    This is your password.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="passwordAgain"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password Again</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="*****" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your password again.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Phone number</FormLabel>
                                <FormControl>
                                    <Input placeholder="0123" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your phone number.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({field}) => (
                            <FormItem className="space-y-3">
                                <FormLabel>What type of clothes do we recommend for you?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="men"/>
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Men
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="woman"/>
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Woman
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subscribe"
                        render={({field}) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Marketing emails
                                    </FormLabel>
                                    <FormDescription>
                                        Receive emails about new products, features, and more.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Register</Button>
                </form>
            </Form>
        </div>
    )
}

export default RegistrationForm