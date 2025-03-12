import {UseFormReturn} from "react-hook-form";
import {z} from "zod";
import {Button} from "src/components/ui/Button";
import {Form} from "src/components/ui/Form";
import React from "react";

interface SheetFormContainerProps<T extends z.ZodType<any, any>> {
    title: string;
    form: UseFormReturn<z.infer<T>>;
    formId: string;
    onSubmit: (data: z.infer<T>) => Promise<void>;
    submitButtonText: string;
    secondaryButtonClick: () => void;
    secondaryButtonText: string;
    children: React.ReactNode;
}

const SheetFormContainer = <T extends z.ZodType<any, any>>({
                                                               title,
                                                               form,
                                                               formId,
                                                               onSubmit,
                                                               submitButtonText,
                                                               secondaryButtonClick,
                                                               secondaryButtonText,
                                                               children
                                                           }: SheetFormContainerProps<T>) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-lg font-semibold">{title}</h2>
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
                <Button type="submit" className="w-full" form={formId}>
                    {submitButtonText}
                </Button>
            </div>
        </div>
    );
};

export default SheetFormContainer;
