import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {TextInputField} from "../../ui/InputField";
import SheetFormContainer from "../shared/SheetFormContainer.componenet";
import {useOrder} from "../../../hooks/UseOrder";

export const FormSchema = z.object({});

interface ProductFormProps {
    setIsOpen: (open: boolean) => void;
}

const FilterForm: React.FC<ProductFormProps> = ({setIsOpen}) => {
    const {updateFilters, resetFilters} = useOrder()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await updateFilters({})
        toast({
            description: "Filters applied successfully.",
        })
        setIsOpen(false)
    }

    return (
        <SheetFormContainer
            title="Filter"
            form={form}
            formId="orderFilterForm"
            onSubmit={onSubmit}
            submitButtonText="Filter"
            secondaryButtonClick={() => resetFilters()}
            secondaryButtonText="Reset"
        >
            <TextInputField form={form} name={"name"} placeholder={"Name..."} label={"Name"}/>
        </SheetFormContainer>
    );
}

export default FilterForm