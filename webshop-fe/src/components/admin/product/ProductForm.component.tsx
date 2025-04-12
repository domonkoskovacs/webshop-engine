import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {useToast} from "../../../hooks/UseToast";
import React, {useEffect} from "react";
import {ComboBoxField} from "../../ui/fields/ComboBoxField";
import {FileListInputField, NumberInputField, TextInputField} from "../../ui/fields/InputField";
import {TextareaField} from "../../ui/fields/TextareaField";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {UpdateGenderEnum} from "../../../shared/api";
import {mapBrandsToOptions, mapEnumToOptions, mapSubCategoriesToOptions} from "../../../lib/options.utils";
import ImageCard from "./ImageCard.component";
import {useCategories} from "../../../hooks/category/useCategories";
import {useCreateProduct} from "../../../hooks/product/useCreateProduct";
import {useUpdateProduct} from "../../../hooks/product/useUpdateProduct";
import {handleGenericApiError} from "../../../shared/ApiError";
import {useProductById} from "../../../hooks/product/useProductById";
import {useProductBrands} from "../../../hooks/product/useProductBrands";

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
    const {data: brands = []} = useProductBrands();
    const {mutateAsync: createProduct, isPending: isCreating} = useCreateProduct();
    const {mutateAsync: updateProduct, isPending: isUpdating} = useUpdateProduct();
    const {data: productData} = useProductById(productId ?? "");
    const {data: categories = []} = useCategories();
    const {toast} = useToast();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            discountPercentage: 0,
            images: [] as (File | string)[],
        },
    });

    useEffect(() => {
        if (productId && productData) {
            const existingImages = productData.imageUrls || [];
            form.reset({
                brand: productData.brand?.name || "",
                name: productData.name,
                description: productData.description,
                subCategoryId: productData.subCategory?.id,
                gender: productData.gender,
                count: productData.count,
                price: productData.price,
                discountPercentage: productData.discountPercentage,
                images: existingImages,
                itemNumber: productData.itemNumber,
            });
        }
    }, [productId, productData, form]);

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const newImages = data.images.filter((img) => img instanceof File) as File[];
        const existingImageIds = data.images.filter(
            (img) => typeof img === "string"
        ) as string[];
        try {
            if (productId) {
                await updateProduct({
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
                await createProduct({
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
        } catch (error) {
            handleGenericApiError(error);
        }
    }

    return (
        <SheetFormContainer
            title={productId ? "Edit product" : "Create product"}
            form={form}
            formId="createProductForm"
            onSubmit={onSubmit}
            submitButtonText={isCreating || isUpdating ? "Saving..." : "Save"}
            submitButtonDisabled={isCreating || isUpdating}
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
                key={brands.length}
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
            <FileListInputField
                form={form}
                name="images"
                label="Images"
                accept="image/png, image/jpg, image/jpeg"
                maxFiles={5}
            >
                {(files, removeFile) => (
                    <>
                        {files.map((file, index) => (
                            <ImageCard
                                key={index}
                                image={file}
                                onDelete={() => removeFile(index)}
                            />
                        ))}
                    </>
                )}
            </FileListInputField>
        </SheetFormContainer>
    );
};

export default ProductForm;
