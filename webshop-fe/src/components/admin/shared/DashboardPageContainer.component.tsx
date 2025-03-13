import React from "react";
import {cn} from "../../../lib/utils";

interface DashboardPageContainerProps {
    className?: string
    children: React.ReactNode;
}

const DashboardPageContainer: React.FC<DashboardPageContainerProps> = ({className, children}) => {
    return (
        <div className={cn(
            "h-full w-full flex flex-col items-center justify-center",
            className
        )}>
            {children}
        </div>
    );
};

export default DashboardPageContainer;
