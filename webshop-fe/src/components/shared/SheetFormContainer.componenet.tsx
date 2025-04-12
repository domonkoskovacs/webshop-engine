import {UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {Button} from "src/components/ui/Button";
import {Form} from "src/components/ui/Form";
import React from "react";
import {DialogDescription, DialogTitle} from "../ui/Dialog";

interface SheetFormContainerProps<T extends z.ZodType<any, any>> {
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

const SheetFormContainer = <T extends z.ZodType<any, any>>({
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
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
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
            <div className="mt-auto flex gap-2 pt-3 border-t">
                <Button variant="outline" className="w-full" onClick={secondaryButtonClick}>
                    {secondaryButtonText}
                </Button>
                <Button type="submit" className="w-full" form={formId} disabled={submitButtonDisabled}>
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
