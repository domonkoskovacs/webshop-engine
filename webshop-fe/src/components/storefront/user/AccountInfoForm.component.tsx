import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Card, CardContent, CardFooter, CardHeader} from "../../ui/Card";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../../ui/Form";
import React, {useEffect} from "react";
import {useUser} from "../../../hooks/UseUser";
import {toast, unexpectedErrorToast} from "../../../hooks/UseToast";
import {Button} from "../../ui/Button";
import {TextInputField} from "../../ui/InputField";
import {UpdateUserRequestGenderEnum} from "../../../shared/api";
import {Link} from "react-router-dom";
import {Switch} from "../../ui/Switch";

const FormSchema = z.object({
    email: z.string().email({message: "Invalid email format."}),
    firstname: z.string().min(1, {message: "Firstname is required."}),
    lastname: z.string().min(1, {message: "Lastname is required."}),
    phoneNumber: z.string().min(1, {message: "Phone number is required."}),
    gender: z.enum([UpdateUserRequestGenderEnum.Female, UpdateUserRequestGenderEnum.Male]),
    subscribedToEmail: z.boolean(),
});

const AccountInfoForm: React.FC = () => {
    const {user, updateUserUserInfo} = useUser()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    useEffect(() => {
        if (user) {
            form.reset({
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                subscribedToEmail: user.subscribedToEmail,
            });
        }
    }, [form, user]);


    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await updateUserUserInfo(
                data.email, data.firstname, data.lastname, data.phoneNumber, data.gender, data.subscribedToEmail
            )
            toast({
                description: "Your account information was successfully updated.",
            })
        } catch (error) {
            unexpectedErrorToast()
        }
    }

    return (
        <Card className="my-4 flex-1 flex flex-col justify-center">
            <CardHeader>
                <h1 className="font-bold">Update account information</h1>
                <h2 className="text-md">Keep your info up to date!</h2>
            </CardHeader>
            <CardContent className="flex flex-col justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="renew-password-form"
                          className="w-full space-y-6 mb-6">
                        <TextInputField form={form} name="email" label="Email" placeholder="Add your email"/>
                        <TextInputField form={form} name="firstname" label="Firstname"
                                        placeholder="Add your firstname"/>
                        <TextInputField form={form} name="lastname" label="Lastname" placeholder="Add your lastname"/>
                        <TextInputField form={form} name="phoneNumber" label="PhoneNumber"
                                        placeholder="Add your phoneNumber"/>
                        <TextInputField form={form} name="gender" label="Gender" placeholder="Add your gender"/>
                        <FormField
                            control={form.control}
                            name="subscribedToEmail"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Subscribe to email list.
                                            </FormLabel>
                                            <FormDescription>
                                                You can change this anytime for more information please
                                                <Link to={"/terms-and-conditions"}>contact us</Link>.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </div>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
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

export default AccountInfoForm;