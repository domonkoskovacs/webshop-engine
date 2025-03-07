import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {useEmail} from "../../../hooks/UseEmail";
import {PromotionEmailRequestDayOfWeekEnum} from "../../../shared/api";

export const FormSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    text: z.string().min(1, { message: "Text content is required." }),
    subject: z.string().min(1, { message: "Subject is required." }),
    imageUrl: z.string().url({ message: "Invalid image URL format." }),
    dayOfWeek: z.array(z.enum(Object.values(PromotionEmailRequestDayOfWeekEnum) as [string, ...string[]]), {
        message: "Invalid day of the week.",
    }).nonempty({ message: "At least one day of the week is required." }),
    hour: z.number().int().min(0, { message: "Hour must be at least 0." }).max(23, { message: "Hour must be at most 23." }).optional(),
    minute: z.number().int().min(0, { message: "Minute must be at least 0." }).max(59, { message: "Minute must be at most 59." }).optional(),
});

interface ProductFormProps {
    setIsOpen: (open: boolean) => void;
}

const EmailForm: React.FC<ProductFormProps> = ({setIsOpen}) => {
    const {createEmail} = useEmail()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })


    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await createEmail({
            name: data.name,
            text: data.text,
            subject: data.subject,
            imageUrl: data.imageUrl,
            dayOfWeek: data.dayOfWeek.map((day) =>
                PromotionEmailRequestDayOfWeekEnum[day as keyof typeof PromotionEmailRequestDayOfWeekEnum]
            ),
            hour: data.hour,
            minute: data.minute
        })
        toast({
            description: "Slide created successfully.",
        })
        setIsOpen(false)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Create Email</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="createEmailForm">
                        <div className="flex flex-col p-6 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                        </div>
                    </form>
                </Form>
            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Back
                </Button>
                <Button type="submit" className="w-full" form="createEmailForm">
                    Create
                </Button>
            </div>
        </div>
    );
}

export default EmailForm