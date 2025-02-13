import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormField, FormItem, FormMessage,} from "src/components/ui/Form"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {useProductPagination} from "../../../hooks/UseProductPagination";
import {GetAllSortTypeEnum} from "../../../shared/api";
import {ComboBoxMultipleValue} from "../../ui/ComboBoxMultipleValue";
import {Input} from "../../ui/Input";
import {X} from "lucide-react";

const FormSchema = z.object({
    brands: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    subCategories: z.array(z.string()).optional(),
    types: z.array(z.string()).optional(),
    maxPrice: z.number().min(0, {message: "Max price must be a positive number"}).optional(),
    minPrice: z.number().min(0, {message: "Min price must be a positive number"}).optional(),
    maxDiscountPercentage: z.number().min(0).max(100, {message: "Discount must be between 0 and 100"}).optional(),
    minDiscountPercentage: z.number().min(0).max(100, {message: "Discount must be between 0 and 100"}).optional(),
    itemNumber: z.string().optional(),
    showOutOfStock: z.boolean().default(false),
    sortType: z.enum([GetAllSortTypeEnum.AscPrice, GetAllSortTypeEnum.DescPrice, GetAllSortTypeEnum.AscDiscount, GetAllSortTypeEnum.DescDiscount]).optional(),
    size: z.number().min(1, {message: "Size must be at least 1"}).default(10),
});

interface FilterFormProps {
    setIsOpen: (open: boolean) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({setIsOpen}) => {
    const {toast} = useToast()
    const {brands, filters, updateFilters, fetchProducts} = useProductPagination();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema)
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        //updateFilters(data);
        await fetchProducts();
        toast({
            description: "Filters applied successfully.",
        })
        setIsOpen(false);
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Filter Products</h2>
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5"/>
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <Form {...form}>
                    <form id="filter-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="brands"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <ComboBoxMultipleValue className="w-full"
                                                               options={brands.map((brand) => brand.name!)} type="brand"
                                                               selectedValues={filters.brands ?? []}
                                                               onChange={(newSelected) => updateFilters({brands: newSelected})}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="itemNumber"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Search for item No..." {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Back
                </Button>
                <Button type="submit" className="w-full" form="filter-form">
                    Apply
                </Button>
            </div>
        </div>
    );
}

export default FilterForm