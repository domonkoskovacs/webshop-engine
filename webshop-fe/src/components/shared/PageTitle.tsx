import React from "react";
import { cn } from "@/lib/utils.ts";

export interface PageTitleProps {
    className?: string;
    children: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ className, children }) => {
    return <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>;
};

export default PageTitle;
