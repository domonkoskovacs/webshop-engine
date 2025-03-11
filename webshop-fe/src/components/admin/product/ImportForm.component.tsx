import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "src/components/ui/Button"
import {Form,} from "src/components/ui/Form"
import {unexpectedErrorToast, useToast} from "../../../hooks/UseToast";
import React from "react";
import {useProduct} from "../../../hooks/UseProduct";
import {ApiError} from "../../../shared/ApiError";
import {ResultEntryReasonCodeEnum} from "../../../shared/api";
import {FileInputField} from "../../ui/InputField";

export const FormSchema = z.object({
    csv: z
        .instanceof(File)
        .refine(
            (file) => file.type === "text/csv",
            "Only CSV files are allowed"
        ),
});

interface ImportFormProps {
    setIsOpen: (open: boolean) => void;
}

const ImportForm: React.FC<ImportFormProps> = ({setIsOpen}) => {
    const {importProducts} = useProduct()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = (reader.result as string).split(",")[1];
                resolve(base64String);
            };
            reader.onerror = (error) => {
                form.setError("csv", {
                    type: "manual",
                    message: "Failed to convert file to Base64. Please try again.",
                }, {shouldFocus: true});

                reject(error);
            };
        });
    };

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const base64Csv = await fileToBase64(data.csv);
            importProducts(base64Csv);
            toast({
                description: "Products imported successfully.",
            })
            setIsOpen(false)
        } catch (error) {
            console.log("helloka")
            if (error instanceof ApiError && error.error) {
                const csvErrors = error.error.filter(err => err.reasonCode === ResultEntryReasonCodeEnum.CsvUploadError);
                if (csvErrors.length > 0) {
                    csvErrors.forEach((err, index) => {
                        const errorMessage = err.message || `CSV upload failed: Error ${index + 1}`;

                        form.setError("csv", {
                            type: "manual",
                            message: errorMessage,
                        }, {shouldFocus: index === 0});
                    });
                }
            } else {
                console.log(error)
                unexpectedErrorToast()
            }
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">Import products</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id="createProductForm">
                        <div className="flex flex-col p-6 gap-4">
                            <FileInputField form={form} name="csv" label="Csv file"
                                            accept="text/csv" description="Please select product upload csv! Download the example if you
                                            need help."/>
                        </div>
                    </form>
                </Form>
            </div>
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                    Back
                </Button>
                <Button type="submit" className="w-full" form="createProductForm">
                    Import
                </Button>
            </div>
        </div>
    );
}

export default ImportForm