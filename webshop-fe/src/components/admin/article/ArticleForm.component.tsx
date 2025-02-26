import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "src/components/ui/Form"
import {Input} from "src/components/ui/Input"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {useArticle} from "../../../hooks/UseArticle";

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
                    <form onSubmit={form.handleSubmit(onSubmit)} id="createProductForm">
                        <div className="flex flex-col p-6 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Title..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="buttonText"
                                render={({field}) => (
                                    <FormItem className="">
                                        <FormLabel className="w-full text-center">Button Text</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Button Text..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="buttonLink"
                                render={({field}) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="w-full text-center">Button Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Button Link..." {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="image"
                                render={() => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel className="w-full">Images</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="image/png, image/jpg, image/jpeg"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        form.setValue("image", file, {shouldValidate: true});
                                                    }
                                                }}
                                            />
                                        </FormControl>
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
                    Add
                </Button>
            </div>
        </div>
    );
}

export default ArticleForm