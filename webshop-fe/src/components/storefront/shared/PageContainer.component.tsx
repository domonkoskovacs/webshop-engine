import React from "react";
import {cn} from "../../../lib/utils";

const layoutVariants = {
    default: "h-full w-full flex flex-col items-center justify-center",
    start: "h-full w-full flex flex-col justify-start",
    centered: "h-full w-full flex items-center justify-center",
    padded: "h-full w-full p-6",
    fullScreen: "h-screen w-screen flex flex-col",
    readable: "max-w-4xl w-full text-justify p-6 mx-auto",
    spacious: "w-full mx-10 my-6 h-full flex flex-col justify-start",
};

export interface StorefrontPageContainerProps {
    className?: string;
    children: React.ReactNode;
    layout?: keyof typeof layoutVariants;
}

const PageContainer: React.FC<StorefrontPageContainerProps> = ({
                                                                   className,
                                                                   children,
                                                                   layout = "default"
                                                               }) => {
    return (
        <div className={cn(layoutVariants[layout], className)}>
            {children}
        </div>
    );
};

export default PageContainer;
