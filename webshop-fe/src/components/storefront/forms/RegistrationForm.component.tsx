import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import React, {useState} from "react";
import {RadioGroup, RadioGroupItem} from "src/components/ui/RadioGroup"
import {Switch} from "../../ui/Switch"
import {apiService} from "../../../shared/ApiService";
import {useToast} from "../../../hooks/UseToast";
import {Link} from "react-router-dom";

const FormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    firstname: z.string().min(1, {
        message: "Please add your firstname."
    }),
    lastname: z.string().min(1, {
        message: "Please add your lastname."
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    passwordAgain: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    phoneNumber: z.string().min(1, {
        message: "Please add your phone number.",
    }),
    gender: z.enum(["men", "women"], {
        required_error: "You need to select your gender.",
    }).optional(),
    subscribe: z.boolean().default(false).optional(),
    privacyPolicy: z.boolean().default(false).refine(value => value, {
        message: "You must accept the privacy policy.",
    }),
    termsAndConditions: z.boolean().default(false).refine(value => value, {
        message: "You must accept the terms and conditions.",
    }),
})

const RegistrationForm: React.FC = () => {
    const [emailTaken, setEmailTaken] = useState<boolean>(false)
    const {toast} = useToast()

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

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const gender = data.gender === "men" ? "MALE" :
                data.gender === "women" ? "FEMALE" : null
            const response = await apiService.register({
                email: data.email,
                firstname: data.firstname,
                lastname: data.lastname,
                password: data.password,
                phoneNumber: data.phoneNumber,
                ...(gender && {gender}),
                subscribedToEmail: data.subscribe,
            })
            toast({
                description: "Successful registration.",
            })
            setEmailTaken(false)
        } catch (error) {
            // @ts-ignore
            const errorData = error.response.data;

            if (errorData.error[0].reasonCode === "EMAIL_TAKEN") {
                setEmailTaken(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(errorData, null, 2)}</code>
                    </pre>
                    ),
                })
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
                                                <RadioGroupItem value="women"/>
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
                                        Receive emails about new products, features, and more. If you don't accept this
                                        you will still get emails based on your orders.
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
                    <FormField
                        control={form.control}
                        name="privacyPolicy"
                        render={({field}) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        <Link to={"/privacy-policy"}>
                                            Privacy Policy
                                        </Link>
                                    </FormLabel>
                                    <FormDescription>
                                        Accept the <Link to={"/privacy-policy"}>privacy policy</Link>.
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
                    <FormField
                        control={form.control}
                        name="termsAndConditions"
                        render={({field}) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        <Link to={"/terms-and-conditions"}>
                                            Terms and Conditions
                                        </Link>
                                    </FormLabel>
                                    <FormDescription>
                                        Accept the <Link to={"/terms-and-conditions"}>terms and conditions</Link>.
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
                    {emailTaken && (
                        <FormMessage>
                            <span className="text-red-600">Email is already taken. Please try again.</span>
                        </FormMessage>
                    )}
                    <Button type="submit">Register</Button>
                </form>
            </Form>
        </div>
    )
}

export default RegistrationForm