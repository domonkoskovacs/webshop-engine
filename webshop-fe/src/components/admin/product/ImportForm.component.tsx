import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {unexpectedErrorToast, useToast} from "../../../hooks/UseToast";
import React from "react";
import {useProduct} from "../../../hooks/UseProduct";
import {ApiError} from "../../../shared/ApiError";
import {ResultEntryReasonCodeEnum} from "../../../shared/api";
import {FileInputField} from "../../ui/InputField";
import SheetFormContainer from "../shared/SheetFormContainer.componenet";

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
                unexpectedErrorToast()
            }
        }
    }

    return (
        <SheetFormContainer
            title="Import products"
            form={form}
            formId="importProductForm"
            onSubmit={onSubmit}
            submitButtonText="Import"
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            <FileInputField form={form} name="csv" label="Csv file"
                            accept="text/csv"
                            description="Please select product upload csv! Download the example if you need help."/>
        </SheetFormContainer>
    );
}

export default ImportForm