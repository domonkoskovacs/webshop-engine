import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form,} from "@/components/ui/form.tsx"
import React from "react";
import {TextInputField} from "../../ui/fields/InputField";
import {useUpdateCategory} from "@/hooks/category/useUpdateCategory.ts";
import {handleGenericApiError} from "@/shared/ApiError.ts";
import {toast} from "@/hooks/useToast.ts";

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
    const {mutateAsync: updateCategory} = useUpdateCategory();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categoryName: placeholder
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            await updateCategory({id, name: data.categoryName});
            toggleEdit();
            toast.success("Category updated successfully.",);
        } catch (error) {
            handleGenericApiError(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id={`updateCategoryForm-${id}`}>
                <TextInputField form={form} name="categoryName" placeholder={placeholder}/>
            </form>
        </Form>
    );
}

export default UpdateCategoryForm