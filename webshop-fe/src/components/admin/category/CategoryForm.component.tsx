import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {useCategory} from "../../../hooks/UseCategory";
import {TextInputField} from "../../ui/fields/InputField";
import SheetFormContainer from "../shared/SheetFormContainer.componenet";

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