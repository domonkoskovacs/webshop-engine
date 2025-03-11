import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form,} from "src/components/ui/Form"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {useArticle} from "../../../hooks/UseArticle";
import {FileInputField, TextInputField} from "../../ui/InputField";

export const FormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    buttonText: z.string().min(1, "Button text is required"),
    buttonLink: z.string().min(1, "Button link is required"),
    image: z
        .instanceof(File)
        .refine(
            (file) => file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg",
            "Only PNG and JPEG images are allowed"
        ),
});

interface ProductFormProps {
    setIsOpen: (open: boolean) => void;
}

const ArticleForm: React.FC<ProductFormProps> = ({setIsOpen}) => {
    const {create} = useArticle()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })


    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await create(data.name, data.title, data.buttonText, data.buttonLink, data.image)
        toast({
            description: "Slide created successfully.",
        })
        setIsOpen(false)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Add slide</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="createArticleForm">
                        <div className="flex flex-col p-6 gap-4">
                            <TextInputField form={form} name="name" label="Name" placeholder="Name..."/>
                            <TextInputField form={form} name="title" label="Title" placeholder="Title..."/>
                            <TextInputField form={form} name="buttonText" label="Button Text"
                                            placeholder="Button Text..."/>
                            <TextInputField form={form} name="buttonLink" label="Button Link"
                                            placeholder="Button Link..."/>
                            <FileInputField form={form} name="image" label="Images"
                                            accept="image/png, image/jpg, image/jpeg"/>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Back
                </Button>
                <Button type="submit" className="w-full" form="createArticleForm">
                    Add
                </Button>
            </div>
        </div>
    );
}

export default ArticleForm