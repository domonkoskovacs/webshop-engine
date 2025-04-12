import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {unexpectedErrorToast, useToast} from "../../../hooks/UseToast";
import React from "react";
import {ApiError} from "../../../shared/ApiError";
import {ResultEntryReasonCodeEnum} from "../../../shared/api";
import {FileInputField} from "../../ui/fields/InputField";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {downloadSampleCSV, fileToBase64, FileToBase64Error} from "../../../lib/file.utils";
import {useImportProducts} from "../../../hooks/product/useImportProducts";

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
    const {mutateAsync: importProducts, isPending} = useImportProducts();
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const base64Csv = await fileToBase64(data.csv);
            await importProducts(base64Csv);
            toast({
                description: "Products imported successfully.",
            })
            setIsOpen(false)
        } catch (error) {
            if (error instanceof FileToBase64Error) {
                form.setError("csv", {
                    type: "manual",
                    message: error.message,
                }, {shouldFocus: true});
            } else if (error instanceof ApiError && error.error) {
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
            submitButtonText={isPending ? "Importing..." : "Import"}
            submitButtonDisabled={isPending}
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            <FileInputField form={form} name="csv" label="Csv file"
                            accept="text/csv"
                            description={<>Please select product upload csv! <button className="underline"
                                                                                     onClick={() => downloadSampleCSV()}>Download
                                the example</button> if you need help.</>}/>
        </SheetFormContainer>
    );
}

export default ImportForm