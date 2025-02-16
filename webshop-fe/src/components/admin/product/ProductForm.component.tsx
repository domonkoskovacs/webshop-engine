import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import {useToast} from "../../../hooks/UseToast";
import React, {useEffect} from "react";
import {FormComboBox} from "../../ui/FormComboBox";
import {useProduct} from "../../../hooks/UseProductPagination";
import {Textarea} from "../../ui/Textarea";
import {useCategory} from "../../../hooks/UseCategory";

const MAX_IMAGES = 5

export const FormSchema = z.object({
    brand: z.string().min(1, "Brand is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    subCategoryId: z.string().uuid("Invalid SubCategory format"),
    type: z.string().min(1, "Type is required"),
    count: z.number().int().min(1, "Count must be a positive integer"),
    price: z.number().min(0, "Price must be a non-negative number"),
    discountPercentage: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100").optional(),
    images: z
        .array(z.instanceof(File))
        .min(1, "At least one image is required")
        .max(5, "You can upload up to 5 images")
        .refine(
            (files) => files.every((file) => file.type === "image/png" || file.type === "image/jpeg"),
            "Only PNG and JPEG images are allowed"
        ),
    itemNumber: z.string().min(1, "Item Number is required"),
});


interface ProductFormProps {
    setIsOpen: (open: boolean) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({setIsOpen}) => {
    const {brands, create} = useProduct()
    const {categories} = useCategory()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            discountPercentage: 0,
            images: [] as File[],
        },
    })

    useEffect(() => {
        console.log("Form errors:", form.formState.errors);
    }, [form.formState.errors]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        create({
            brand: data.brand,
            name: data.name,
            description: data.description,
            subCategoryId: data.subCategoryId,
            type: data.type,
            count: data.count,
            price: data.price,
            discountPercentage: data.discountPercentage,
            images: data.images,
            itemNumber: data.itemNumber,
        })
        setIsOpen(false)
        toast({
            description: "Product created successfully.",
        })
    }

    const images = form.watch("images");

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Create product</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="createProductForm">
                        <div className="flex flex-col p-6 gap-4">
                            <FormField
                                control={form.control}
                                name="itemNumber"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Item Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Item Number..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormComboBox
                                name="brand"
                                control={form.control}
                                label="Brand"
                                options={brands.map((brand) => ({label: brand.name!, value: brand.name!}))}
                            />

                            <FormComboBox
                                name="subCategoryId"
                                control={form.control}
                                label="Subcategory"
                                options={categories.flatMap(category =>
                                    category.subCategories?.map(subCategory => ({
                                        label: subCategory.name!,
                                        value: subCategory.id!
                                    })) || []
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Product name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Product name..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="w-full text-center">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Product description..."
                                                className="resize-none scrollbar"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Product type</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Product type..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="count"
                                render={({ field: { onChange, value, ...rest } }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Stock..."
                                                min={1}
                                                value={value ?? ""}
                                                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                {...rest}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field: { onChange, value, ...rest } }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Price..."
                                                min={0}
                                                value={value ?? ""}
                                                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                {...rest}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="discountPercentage"
                                render={({ field: { onChange, value, ...rest } }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Discount</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={value ?? ""}
                                                onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                {...rest}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="images"
                                render={() => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel className="w-full">Images</FormLabel>
                                        {Array.from({length: Math.min(images.length + 1, MAX_IMAGES)}).map((_, index) => (
                                            <FormControl key={index}>
                                                <Input
                                                    type="file"
                                                    accept="image/png, image/jpeg"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            form.setValue("images", [...images, file], {shouldValidate: true});
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                        ))}
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Back
                </Button>
                <Button type="submit" className="w-full" form="createProductForm">
                    Save
                </Button>
            </div>
        </div>
    );
}

export default ProductForm