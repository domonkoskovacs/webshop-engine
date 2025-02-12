import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {useCategory} from "../../../hooks/UseCategory";

const FormSchema = z.object({
    categoryName: z.string().min(1, {
        message: "Please add the name of the subcategory."
    })
})

interface SubCategoryFormProps {
    id: string
    setIsOpen: (open: boolean) => void;
}

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({id, setIsOpen}) => {
    const {toast} = useToast()
    const {addSubCategory} = useCategory();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categoryName: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await addSubCategory(id, data.categoryName);
        toast({
            description: "SubCategory created successfully.",
        })
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
                                    <FormLabel>SubCategory Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Please the name of the subcategory" {...field} />
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

export default SubCategoryForm