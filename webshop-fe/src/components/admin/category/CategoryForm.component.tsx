import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "@/hooks/useToast.ts";
import React from "react";
import {TextInputField} from "../../ui/fields/InputField";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {useCreateCategory} from "@/hooks/category/useCreateCategory.ts";
import {useAddSubCategory} from "@/hooks/category/useAddSubCategory.ts";
import {handleGenericApiError} from "@/shared/ApiError.ts";

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
    const {mutateAsync: createCategory} = useCreateCategory();
    const {mutateAsync: addSubCategory} = useAddSubCategory();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categoryName: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            if (id) {
                await addSubCategory({id, name: data.categoryName});
                toast.success("Subcategory created successfully.");
            } else {
                await createCategory(data.categoryName);
                toast.success("Category created successfully.");
            }
            setIsOpen(false);
        } catch (error) {
            handleGenericApiError(error);
        }
    }

    return (
        <SheetFormContainer
            title={id ? "Add Subcategory" : "Create Category"}
            form={form}
            formId="createCategoryForm"
            onSubmit={onSubmit}
            submitButtonText={id ? "Add" : "Save"}
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            <TextInputField form={form} name="categoryName"
                            label={id ? "Subcategory Name" : "Category Name"}
                            placeholder={`Enter ${id ? "subcategory" : "category"} name`}/>
        </SheetFormContainer>
    );
}

export default CategoryForm