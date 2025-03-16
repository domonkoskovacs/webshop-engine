import React, {useCallback} from "react";

import {UseFormReturn} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../Form";
import {Input} from "../Input";

interface TextInputFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label?: string;
    placeholder: string;
    description?: string | React.ReactNode;
    type?: string
}

interface NumberInputFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label: string;
    placeholder: string;
    min?: number;
    max?: number;
    description?: string;
}

interface FileInputFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label: string;
    accept: string;
    description?: string | React.ReactNode;
}

const TextInputField: React.FC<TextInputFieldProps> = ({form, name, label, placeholder, description, type}) => {
    return <FormField
        control={form.control}
        name={name}
        render={({field}) => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input type={type} placeholder={placeholder} {...field} />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
};

const NumberInputField: React.FC<NumberInputFieldProps> = ({
                                                               form,
                                                               name,
                                                               label,
                                                               placeholder,
                                                               min = 0,
                                                               max,
                                                               description,
                                                           }) => {
    return <FormField
        control={form.control}
        name={name}
        render={({field: {onChange, value, ...rest}}) => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input type="number"
                           placeholder={placeholder}
                           min={min}
                           max={max}
                           value={value ?? ""}
                           onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
                           {...rest} />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
};

const FileInputField: React.FC<FileInputFieldProps> = ({
                                                           form,
                                                           name,
                                                           label,
                                                           accept,
                                                           description,
                                                       }) => {
    return <FormField
        control={form.control}
        name={name}
        render={() => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input
                        type="file"
                        accept={accept}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                form.setValue(name, file, {shouldValidate: true});
                            }
                        }}
                    />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
};

export interface FileListInputFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label: string;
    accept: string;
    maxFiles?: number;
    children: (files: Array<File | string>, removeFile: (index: number) => void) => React.ReactNode;
}

const FileListInputField: React.FC<FileListInputFieldProps> = ({
                                                                   form,
                                                                   name,
                                                                   label,
                                                                   accept,
                                                                   maxFiles = 5,
                                                                   children,
                                                               }) => {
    const removeFile = useCallback(
        (index: number) => {
            const currentFiles = (form.getValues(name) as Array<File | string>) || [];
            const updatedFiles = currentFiles.filter((_, i) => i !== index);
            form.setValue(name, updatedFiles, {shouldValidate: true});
        },
        [form, name]
    );

    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => {
                const files: Array<File | string> = field.value || [];
                return (
                    <FormItem className="flex flex-col gap-2">
                        <FormLabel className="w-full">{label}</FormLabel>
                        <div className="flex flex-wrap gap-2">
                            {children(files, removeFile)}
                            {files.length < maxFiles && (
                                <div className="mt-2">
                                    <FormLabel className="w-full">Add more files</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept={accept}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    form.setValue(name, [...files, file], {shouldValidate: true});
                                                }
                                                e.target.value = "";
                                            }}
                                        />
                                    </FormControl>
                                </div>
                            )}
                        </div>
                        <FormMessage/>
                    </FormItem>
                );
            }}
        />
    );
};

export {TextInputField, NumberInputField, FileInputField, FileListInputField};
