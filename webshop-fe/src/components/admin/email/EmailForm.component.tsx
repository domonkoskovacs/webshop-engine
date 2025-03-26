import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {useToast} from "../../../hooks/UseToast";
import React from "react";
import {useEmail} from "../../../hooks/UseEmail";
import {PromotionEmailRequestDayOfWeekEnum} from "../../../shared/api";
import {NumberInputField, TextInputField} from "../../ui/fields/InputField";
import {TextareaField} from "../../ui/fields/TextareaField";
import {ComboBoxMultipleValueField} from "../../ui/fields/ComboBoxMultipleValueField";
import SheetFormContainer from "../../shared/SheetFormContainer.componenet";
import {mapEnumToOptions} from "../../../lib/options.utils";

export const FormSchema = z.object({
    name: z.string().min(1, {message: "Name is required."}),
    text: z.string().min(1, {message: "Text content is required."}),
    subject: z.string().min(1, {message: "Subject is required."}),
    imageUrl: z.string().url({message: "Invalid image URL format."}),
    dayOfWeek: z.array(z.nativeEnum(PromotionEmailRequestDayOfWeekEnum), {
        message: "Invalid day of the week.",
    }).nonempty({message: "At least one day of the week is required."}),
    hour: z.number().int().min(0, {message: "Hour must be at least 0."}).max(23, {message: "Hour must be at most 23."}),
    minute: z.number().int().min(0, {message: "Minute must be at least 0."}).max(59, {message: "Minute must be at most 59."}),
});

interface ProductFormProps {
    setIsOpen: (open: boolean) => void;
}

const EmailForm: React.FC<ProductFormProps> = ({setIsOpen}) => {
    const {createEmail} = useEmail()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        await createEmail({
            name: data.name,
            text: data.text,
            subject: data.subject,
            imageUrl: data.imageUrl,
            dayOfWeek: data.dayOfWeek,
            hour: data.hour,
            minute: data.minute
        })
        toast({
            description: "Email promotion created successfully.",
        })
        setIsOpen(false)
    }

    return (
        <SheetFormContainer
            title="Create Email"
            form={form}
            formId="createEmailForm"
            onSubmit={onSubmit}
            submitButtonText="Create"
            secondaryButtonClick={() => setIsOpen(false)}
            secondaryButtonText="Back"
        >
            <TextInputField form={form} name={"name"} placeholder={"Name..."} label={"Name"}/>
            <TextareaField form={form} name={"text"} placeholder={"text..."} label={"Text"}/>
            <TextInputField form={form} name={"subject"} placeholder={"Email subject..."} label={"Email subject"}/>
            <TextInputField form={form} name={"imageUrl"} placeholder={"Image url..."} label={"Image url"}/>
            <ComboBoxMultipleValueField form={form} name={"dayOfWeek"}
                                        options={mapEnumToOptions(PromotionEmailRequestDayOfWeekEnum)}
                                        label={"Day of week"}/>
            <NumberInputField form={form} name={"hour"} placeholder={"Hour..."} label={"Hour"}/>
            <NumberInputField form={form} name={"minute"} placeholder={"Minute..."} label={"Minute"}/>
        </SheetFormContainer>
    );
}

export default EmailForm