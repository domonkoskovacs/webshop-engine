import {UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button.tsx";
import React from "react";
import {DialogDescription, DialogTitle} from "../ui/dialog.tsx";
import {Form} from "../ui/form.tsx";

interface SheetFormContainerProps<T extends z.ZodTypeAny> {
    title: string;
    form: UseFormReturn<z.infer<T>>;
    formId: string;
    onSubmit: (data: z.infer<T>) => Promise<void>;
    submitButtonDisabled?: boolean;
    submitButtonText: string;
    secondaryButtonClick: () => void;
    secondaryButtonText: string;
    description?: string;
    children: React.ReactNode;
}

const SheetFormContainer = <T extends z.ZodTypeAny>({
                                                        title,
                                                        form,
                                                        formId,
                                                        onSubmit,
                                                        submitButtonDisabled = false,
                                                        submitButtonText,
                                                        secondaryButtonClick,
                                                        secondaryButtonText,
                                                        description,
                                                        children
                                                    }: SheetFormContainerProps<T>) => {
    return (
        <div className="flex flex-col h-full p-6">
            <div className="flex justify-between content-center border-b pb-3">
                <DialogTitle className="text-lg font-semibold">
                    {title}
                </DialogTitle>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
                        <div className="flex flex-col p-6 gap-4">
                            {children}
                        </div>
                    </form>
                </Form>
            </div>
            <div className="mt-auto flex flex-row w-full gap-2 pt-3 border-t">
                <Button variant="outline" className="flex-1" onClick={secondaryButtonClick}>
                    {secondaryButtonText}
                </Button>
                <Button type="submit" className="flex-1" form={formId} disabled={submitButtonDisabled}>
                    {submitButtonText}
                </Button>
            </div>
            {description ? (
                <DialogDescription className="sr-only">{description}</DialogDescription>
            ) : (
                <DialogDescription className="sr-only">
                    This dialog contains a form that allows you to enter and submit data.
                </DialogDescription>
            )}
        </div>
    );
};

export default SheetFormContainer;
