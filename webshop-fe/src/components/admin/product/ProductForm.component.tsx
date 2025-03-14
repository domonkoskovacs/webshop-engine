import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {FormControl, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import {useToast} from "../../../hooks/UseToast";
import React, {useEffect} from "react";
import {ComboBoxField} from "../../ui/ComboBoxField";
import {useProduct} from "../../../hooks/UseProduct";
import {useCategory} from "../../../hooks/UseCategory";
import {NumberInputField, TextInputField} from "../../ui/InputField";
import {TextareaField} from "../../ui/TextareaField";
import SheetFormContainer from "../shared/SheetFormContainer.componenet";
import {downloadImage} from "../../../lib/file.utils";

const MAX_IMAGES = 5

export const FormSchema = z.object({
    brand: z.string().min(1, "Brand is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    subCategoryId: z.string().uuid("Invalid SubCategory format"),
    type: z.string().min(1, "Type is required"),
    count: z.number().int().min(0, "Count must be a non-negative integer"),
    price: z.number().min(0, "Price must be a non-negative number"),
    discountPercentage: z.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100"),
    images: z
        .array(z.instanceof(File))
        .min(1, "At least one image is required")
        .max(5, "You can upload up to 5 images")
        .refine(
            (files) => files.every((file) => file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg"),
            "Only PNG and JPEG images are allowed"
        ),
    itemNumber: z.string().min(1, "Item Number is required"),
});


interface ProductFormProps {
    setIsOpen: (open: boolean) => void;
    productId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({setIsOpen, productId}) => {
    const {brands, create, update, getById} = useProduct()
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
        if (productId) {
            getById(productId)
                .then(async (product) => {
                    const imageFiles = await Promise.all(
                        (product.imageUrls || []).map((url) => downloadImage(url))
                    );
                    console.log(imageFiles)
                    console.log(product)
                    form.reset({
                        brand: product.brand!.name,
                        name: product.name,
                        description: product.description,
                        subCategoryId: product.subCategory!.id,
                        type: product.type,
                        count: product.count,
                        price: product.price,
                        discountPercentage: product.discountPercentage,
                        images: imageFiles,
                        itemNumber: product.itemNumber,
                    });
                    form.setValue("images", imageFiles)
                })
                .catch(() => toast({description: "Error fetching product."}))
        }
    }, [productId, form, getById, toast]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        if (productId) {
            update({
                id: productId,
                brand: data.brand,
                name: data.name,
                description: data.description,
                subCategoryId: data.subCategoryId,
                type: data.type,
                count: data.count,
                price: data.price,
                discountPercentage: data.discountPercentage,
                //images: data.images,
                itemNumber: data.itemNumber,
            })
            toast({
                description: "Product updated successfully.",
            })
        } else {
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
            toast({
                description: "Product created successfully.",
            })
        }
        setIsOpen(false)
    }

    const images = form.watch("images");

    return (
        <SheetFormContainer
            title={productId ? "Edit product" : "Create product"}
            form={form}
            formId="createProductForm"
            onSubmit={onSubmit}
            submitButtonText="Save"
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            <TextInputField form={form} name="itemNumber" label="Item Number"
                            placeholder="Item Number..."/>
            <ComboBoxField name="brand" control={form.control} label="Brand"
                           options={brands.map((brand) => ({label: brand.name!, value: brand.name!}))}
                           enableCreateOption={true}/>
            <ComboBoxField
                name="subCategoryId"
                control={form.control}
                label="Subcategory"
                options={categories.flatMap(category => category.subCategories?.map(subCategory => ({
                    label: subCategory.name!,
                    value: subCategory.id!
                })) || [])}
                enableCreateOption={false}
            />
            <TextInputField form={form} name="name" label="Product name" placeholder="Product name..."/>
            <TextareaField form={form} name="description" label="Description"
                           placeholder="Product description..."/>
            <TextInputField form={form} name="type" label="Product type" placeholder="Product type..."/>
            <NumberInputField form={form} name="count" label="Stock" placeholder="Stock..." min={0}/>
            <NumberInputField form={form} name="price" label="Price" placeholder="Price..." min={0}/>
            <NumberInputField form={form} name="discountPercentage" label="Discount"
                              placeholder="Discount..." min={0} max={100}/>

            {!productId && <FormField //todo better image handling
                control={form.control}
                name="images"
                render={() => (
                    <FormItem className="flex flex-col gap-2">
                        <FormLabel className="w-full">Images</FormLabel>
                        {Array.from({length: Math.min(images.length + 1, MAX_IMAGES)}).map((_, index) => (
                            <FormControl key={index}>
                                <Input
                                    type="file"
                                    accept="image/png, image/jpg, image/jpeg"
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
            />}
        </SheetFormContainer>
    );
}

export default ProductForm