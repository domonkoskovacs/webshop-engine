import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import React, {useState} from "react";
import {apiService} from "../shared/ApiService";
import {useAuth} from "../hooks/UseAuth";
import {useNavigate} from "react-router-dom";
import {useToast} from "../hooks/UseToast";

const FormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(1, {
        message: "Please add your password."
    })
})

const LoginForm: React.FC = () => {
    const {setAccessToken, setRole} = useAuth();
    const [wrongPassword, setWrongPassword] = useState<boolean>(false)
    const navigate = useNavigate();
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const response = await apiService.login({
                email: data.email,
                password: data.password
            });
            const {accessToken, role} = response
            if (accessToken) {
                setAccessToken(accessToken);
            }
            if (role) {
                setRole(role);
            }
            //todo refresh token logic
            if (role === "ROLE_ADMIN") {
                navigate("/admin/dashboard")
            } else {
                //todo user navigate
            }
            toast({
                description: "You are successfully logged in.",
            })
            setWrongPassword(false)
        } catch (error) {
            // @ts-ignore
            const errorData = error.response.data;

            if (errorData.error[0].reasonCode === "WRONG_PASSWORD") {
                setWrongPassword(true);
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
                                    <Input placeholder="Please enter your email" {...field} />
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
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    {wrongPassword && (
                        <FormMessage>
                            <span className="text-red-600">Wrong password or email. Please try again.</span>
                        </FormMessage>
                    )}
                    <Button type="submit">Login</Button>
                </form>
            </Form>
        </div>
    );
}

export default LoginForm