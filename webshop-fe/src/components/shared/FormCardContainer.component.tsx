import {z} from "zod";
import {UseFormReturn} from "react-hook-form";

import React from "react";
import {Card, CardContent, CardFooter, CardHeader} from "../ui/card.tsx";
import {Separator} from "../ui/separator.tsx";
import {Form} from "../ui/form.tsx";
import {Button} from "../ui/button.tsx";
import {Badge} from "../ui/badge.tsx";
import {cn} from "@/lib/utils.ts";

interface FormCardContainerProps<T extends z.ZodTypeAny> {
    title: string;
    description?: string;
    form: UseFormReturn<z.infer<T>>;
    formId: string;
    onSubmit: (data: z.infer<T>) => Promise<void>;
    submitButtonText: string;
    submitButtonDisabled?: boolean;
    singleColumn?: boolean;
    profileChangesNeeded?: boolean
    className?: string
    children: React.ReactNode;
}

const FormCardContainer = <T extends z.ZodTypeAny>({
                                                              title,
                                                              description,
                                                              form,
                                                              formId,
                                                              onSubmit,
                                                              submitButtonText,
                                                              submitButtonDisabled = false,
                                                              singleColumn = false,
                                                              profileChangesNeeded = false,
                                                              className,
                                                              children
                                                          }: FormCardContainerProps<T>) => {
    return (
        <Card className={cn(
            "my-4 relative",
            className
        )}>
            {profileChangesNeeded && (
                <Badge
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-ping">
                </Badge>
            )}
            <CardHeader>
                <h1 className="font-bold">{title}</h1>
                {description && <p className="text-sm text-gray-600">{description}</p>}
            </CardHeader>
            <Separator/>
            <CardContent className="flex flex-col justify-center">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} id={formId} className={`w-full space-y-6 grid ${
                        singleColumn ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 gap-6"
                    }`}>
                        {children}
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="p-0 border-t">
                <Button className="w-full rounded-t-none" type="submit" form={formId} disabled={submitButtonDisabled}>
                    {submitButtonText}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default FormCardContainer;
