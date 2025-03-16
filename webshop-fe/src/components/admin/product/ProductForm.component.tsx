import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form";
import {Input} from "src/components/ui/Input";
import {useToast} from "../../../hooks/UseToast";
import React, {useEffect} from "react";
import {ComboBoxField} from "../../ui/fields/ComboBoxField";
import {useProduct} from "../../../hooks/UseProduct";
import {useCategory} from "../../../hooks/UseCategory";
import {NumberInputField, TextInputField} from "../../ui/fields/InputField";
import {TextareaField} from "../../ui/fields/TextareaField";
import SheetFormContainer from "../shared/SheetFormContainer.componenet";
import {UpdateGenderEnum} from "../../../shared/api";
import {mapBrandsToOptions, mapEnumToOptions, mapSubCategoriesToOptions} from "../../../lib/options.utils";
import ImageCard from "./ImageCard.component";

const MAX_IMAGES = 5;

export const FormSchema = z.object({
    brand: z.string().min(1, "Brand is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    subCategoryId: z.string().uuid("Invalid SubCategory format"),
    gender: z.nativeEnum(UpdateGenderEnum, {
        required_error: "You must select a gender",
    }),
    count: z.number().int().min(0, "Count must be a non-negative integer"),
    price: z.number().min(0, "Price must be a non-negative number"),
    discountPercentage: z
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100"),
    images: z
        .array(z.union([z.instanceof(File), z.string()]))
        .min(1, "At least one image is required")
        .max(MAX_IMAGES, `You can upload up to ${MAX_IMAGES} images`)
        .refine(
            (files) =>
                files.every((file) =>
                    typeof file === "string"
                        ? true
                        : file.type === "image/png" ||
                        file.type === "image/jpeg" ||
                        file.type === "image/jpg"
                ),
            "Only PNG and JPEG images are allowed"
        ),
    itemNumber: z.string().min(1, "Item Number is required"),
});

interface ProductFormProps {
    setIsOpen: (open: boolean) => void;
    productId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({setIsOpen, productId}) => {
    const {brands, create, update, getById} = useProduct();
    const {categories} = useCategory();
    const {toast} = useToast();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            discountPercentage: 0,
            images: [] as (File | string)[],
        },
    });

    useEffect(() => {
        if (productId) {
            getById(productId)
                .then((product) => {
                    const existingImages = product.imageUrls || [];
                    form.reset({
                        brand: product.brand?.name || "",
                        name: product.name,
                        description: product.description,
                        subCategoryId: product.subCategory?.id,
                        gender: product.gender,
                        count: product.count,
                        price: product.price,
                        discountPercentage: product.discountPercentage,
                        images: existingImages,
                        itemNumber: product.itemNumber,
                    });
                })
                .catch(() =>
                    toast({description: "Error fetching product."})
                );
        }
    }, [productId, form, getById, toast]);

    const removeImage = (index: number) => {
        const currentImages = form.getValues("images");
        const updatedImages = currentImages.filter((_, i) => i !== index);
        form.setValue("images", updatedImages, {shouldValidate: true});
    };

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const newImages = data.images.filter((img) => img instanceof File) as File[];
        const existingImageIds = data.images.filter(
            (img) => typeof img === "string"
        ) as string[];

        if (productId) {
            update({
                id: productId,
                brand: data.brand,
                name: data.name,
                description: data.description,
                subCategoryId: data.subCategoryId,
                gender: data.gender,
                count: data.count,
                price: data.price,
                discountPercentage: data.discountPercentage,
                newImages: newImages,
                existingImageIds: existingImageIds,
                itemNumber: data.itemNumber,
            });
            toast({description: "Product updated successfully."});
        } else {
            create({
                brand: data.brand,
                name: data.name,
                description: data.description,
                subCategoryId: data.subCategoryId,
                gender: data.gender,
                count: data.count,
                price: data.price,
                discountPercentage: data.discountPercentage,
                images: data.images as File[],
                itemNumber: data.itemNumber,
            });
            toast({description: "Product created successfully."});
        }
        setIsOpen(false);
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
            <TextInputField
                form={form}
                name="itemNumber"
                label="Item Number"
                placeholder="Item Number..."
            />
            <ComboBoxField
                form={form}
                name="brand"
                label="Brand"
                options={mapBrandsToOptions(brands)}
                enableCreateOption={true}
            />
            <ComboBoxField
                form={form}
                name="subCategoryId"
                label="Subcategory"
                options={mapSubCategoriesToOptions(categories)}
                enableCreateOption={false}
            />
            <TextInputField
                form={form}
                name="name"
                label="Product name"
                placeholder="Product name..."
            />
            <TextareaField
                form={form}
                name="description"
                label="Description"
                placeholder="Product description..."
            />
            <ComboBoxField
                form={form}
                name={"gender"}
                label={"Gender"}
                options={mapEnumToOptions(UpdateGenderEnum)}
            />
            <NumberInputField
                form={form}
                name="count"
                label="Stock"
                placeholder="Stock..."
                min={0}
            />
            <NumberInputField
                form={form}
                name="price"
                label="Price"
                placeholder="Price..."
                min={0}
            />
            <NumberInputField
                form={form}
                name="discountPercentage"
                label="Discount"
                placeholder="Discount..."
                min={0}
                max={100}
            />
            <FormField
                control={form.control}
                name="images"
                render={() => (
                    <FormItem className="flex flex-col gap-2">
                        <FormLabel className="w-full">Images</FormLabel>
                        <div className="flex flex-wrap gap-2">
                            {images.map((img, index) => (
                                <ImageCard
                                    key={index}
                                    image={img}
                                    onDelete={() => removeImage(index)}
                                />
                            ))}
                            {images.length < MAX_IMAGES && (
                                <div className="mt-2">
                                    <FormLabel className="w-full">Add more images</FormLabel>
                                    <Input
                                        type="file"
                                        accept="image/png, image/jpg, image/jpeg"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                form.setValue("images", [...images, file], {
                                                    shouldValidate: true,
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </SheetFormContainer>
    );
};

export default ProductForm;
