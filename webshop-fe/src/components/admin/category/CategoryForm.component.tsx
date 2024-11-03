import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import {useToast} from "../../../hooks/UseToast";
import {apiService} from "src/shared/ApiService"
import React from "react";

const FormSchema = z.object({
    categoryName: z.string().min(1, {
        message: "Please add the name of the category."
    })
})

interface CategoryFormProps {
    setIsOpen: (open: boolean) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({setIsOpen}) => {
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categoryName: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await apiService.createCategory({
                name: data.categoryName
            });
            toast({
                description: "Category created successfully.",
            })
        } catch (error) {
            // @ts-ignore
            const errorData = error.response.data;

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

    return (
        <div className="flex items-center justify-center">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                    <div className="flex items-center space-x-2">
                        <FormField
                            control={form.control}
                            name="categoryName"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Please the name of the category" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="self-end" onClick={() => setIsOpen(false)}>Create</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CategoryForm