import React from "react";
import { cn } from "../../../lib/utils";

export interface PageContentProps {
    className?: string;
    children: React.ReactNode;
}

const PageContent: React.FC<PageContentProps> = ({ className, children }) => {
    return <main className={cn("w-full", className)}>{children}</main>;
};

export default PageContent;
