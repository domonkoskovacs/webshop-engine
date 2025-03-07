import {Button} from "src/components/ui/Button"
import React from "react";
import {Form} from "../../ui/Form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "../../../hooks/UseToast";
import {FormComboBoxMultipleValue} from "../../ui/FormComboBoxMultipleValue";
import {useProductScroll} from "../../../hooks/useProductScroll";

export const FormSchema = z.object({
    brands: z.array(z.string().min(1, "Brand is required"), {message: "Brands must be an array of strings"}).optional(),
    minPrice: z.number().min(0, {message: "Minimum price must be at least 0"}).optional(),
    maxPrice: z.number().min(0, {message: "Maximum price must be at least 0"}).optional(),
    minDiscountPercentage: z.number().min(0, {message: "Minimum discount must be at least 0%"}).max(100, {message: "Minimum discount cannot exceed 100%"}).optional(),
    maxDiscountPercentage: z.number().min(0, {message: "Maximum discount must be at least 0%"}).max(100, {message: "Maximum discount cannot exceed 100%"}).optional(),
    showOutOfStock: z.boolean().default(false).describe("Indicates whether out-of-stock products should be shown"),
    sortType: z.string().optional().describe("Sorting type for products"),
});

interface FilterFormProps {
    setIsOpen: (open: boolean) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({setIsOpen}) => {
    const {brands, resetFilters, updateFilters} = useProductScroll();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        updateFilters({brands: data.brands})
        toast({
            description: "Filters has been successfully applied",
        })
        setIsOpen(false)
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Filter products</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="storefrontFilterForm">
                        <div className="flex flex-col p-6 gap-4">
                            <FormComboBoxMultipleValue
                                name="brands"
                                form={form}
                                label="Brands"
                                options={brands.map((brand) => ({label: brand.name!, value: brand.name!}))}
                            />
                        </div>
                    </form>
                </Form>
            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => resetFilters()}>
                    Reset
                </Button>
                <Button type="submit" className="w-full" form="storefrontFilterForm">
                    Apply
                </Button>
            </div>
        </div>
    );
}

export default FilterForm