import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {useCategory} from "../../../hooks/UseCategory";

const FormSchema = z.object({
    categoryName: z.string().min(1, {
        message: "Please add the name of the category."
    })
})

interface UpdateCategoryFormProps {
    id: string
    placeholder: string
    toggleEdit: () => void;
}

const UpdateCategoryForm: React.FC<UpdateCategoryFormProps> = ({id, placeholder, toggleEdit}) => {
    const {toast} = useToast()
    const {update} = useCategory();


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categoryName: placeholder
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await update(id, data.categoryName);
        toggleEdit()
        toast({
            description: "Category updated successfully.",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id={`updateCategoryForm-${id}`}>
                <FormField
                    control={form.control}
                    name="categoryName"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder={placeholder} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}

export default UpdateCategoryForm