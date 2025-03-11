import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form,} from "src/components/ui/Form"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {useCategory} from "../../../hooks/UseCategory";
import {TextInputField} from "../../ui/InputField";

const FormSchema = z.object({
    categoryName: z.string().min(1, {
        message: "Please add the name of the category."
    })
})

interface CategoryFormProps {
    setIsOpen: (open: boolean) => void;
    id?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({setIsOpen, id}) => {
    const {toast} = useToast()
    const {create, addSubCategory} = useCategory();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categoryName: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (id) {
            await addSubCategory(id, data.categoryName);
            toast({description: "SubCategory created successfully."});
        } else {
            await create(data.categoryName);
            toast({description: "Category created successfully."});
        }
        setIsOpen(false)
    }

    return (

        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">{id ? "Add Subcategory" : "Create Category"}</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="createCategoryForm">
                        <div className="flex flex-col p-6 gap-4">
                            <TextInputField form={form} name="categoryName"
                                            label={id ? "Subcategory Name" : "Category Name"}
                                            placeholder={`Enter ${id ? "subcategory" : "category"} name`}/>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Back
                </Button>
                <Button type="submit" className="w-full" form="createCategoryForm">
                    {id ? "Add" : "Save"}
                </Button>
            </div>
        </div>
    )
        ;
}

export default CategoryForm