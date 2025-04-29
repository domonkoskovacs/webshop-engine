import React from "react";
import { cn } from "@/lib/utils.ts";

const headerVariants = {
    default: "flex flex-row justify-between items-center mb-6",
    full: "w-full flex flex-row justify-between items-center mb-6",
    centered: "flex flex-col items-center justify-center mb-6",
};

export interface PageHeaderProps {
    className?: string;
    children: React.ReactNode;
    variant?: keyof typeof headerVariants;
}

const PageHeader: React.FC<PageHeaderProps> = ({
                                                   className,
                                                   children,
                                                   variant = "default",
                                               }) => {
    return <header className={cn(headerVariants[variant], className)}>{children}</header>;
};

export default PageHeader;
