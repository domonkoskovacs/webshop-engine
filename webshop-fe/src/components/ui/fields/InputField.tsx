import React, {useCallback} from "react";

import {FieldValues, Path, PathValue, UseFormReturn} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../form";
import {Input} from "../input";

interface TextInputFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label?: string;
    placeholder: string;
    description?: string | React.ReactNode;
    type?: string
    autoComplete?: string;
}

interface NumberInputFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    placeholder: string;
    min?: number;
    max?: number;
    description?: string;
}

interface FileInputFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    accept: string;
    description?: string | React.ReactNode;
}

const TextInputField = <T extends FieldValues>({
                                                   form,
                                                   name,
                                                   label,
                                                   placeholder,
                                                   description,
                                                   type,
                                                   autoComplete,
                                               }: TextInputFieldProps<T>) => (
    <FormField
        control={form.control}
        name={name}
        render={({field}) => (
            <FormItem>
                {label && <FormLabel>{label}</FormLabel>}
                <FormControl>
                    <Input type={type} placeholder={placeholder} {...field} autoComplete={autoComplete}/>
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />)

const NumberInputField = <T extends FieldValues>({
                                                     form,
                                                     name,
                                                     label,
                                                     placeholder,
                                                     min = 0,
                                                     max,
                                                     description,
                                                 }: NumberInputFieldProps<T>) => (<FormField
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
)

const FileInputField = <T extends FieldValues>({
                                                   form,
                                                   name,
                                                   label,
                                                   accept,
                                                   description,
                                               }: FileInputFieldProps<T>) => (<FormField
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
                                form.setValue(name, file as PathValue<T, Path<T>>, {shouldValidate: true});
                            }
                        }}
                    />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage/>
            </FormItem>
        )}
    />
)

export interface FileListInputFieldProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    name: Path<T>;
    label: string;
    accept: string;
    maxFiles?: number;
    children: (files: Array<File | string>, removeFile: (index: number) => void) => React.ReactNode;
}

const FileListInputField = <T extends FieldValues>({
                                                       form,
                                                       name,
                                                       label,
                                                       accept,
                                                       maxFiles = 5,
                                                       children,
                                                   }: FileListInputFieldProps<T>) => {
    const removeFile = useCallback(
        (index: number) => {
            const currentFiles = (form.getValues(name) as Array<File | string>) || [];
            const updatedFiles = currentFiles.filter((_, i) => i !== index);
            form.setValue(name, updatedFiles as PathValue<T, Path<T>>, {shouldValidate: true});
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
                                                    form.setValue(name, [...files, file] as PathValue<T, Path<T>>, {shouldValidate: true});
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
