import {useLocation} from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "../ui/Breadcrumb";
import React from "react";

interface BreadcrumbSegment {
    segmentName: string;
    path: string;
}

interface PathBreadcrumbProps {
    segments?: BreadcrumbSegment[];
}

const PathBreadcrumb: React.FC<PathBreadcrumbProps> = ({segments}) => {
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter((segment) => segment);

    const breadcrumbSegments = segments ?? pathSegments.map((segment, index) => ({
        segmentName: segment,
        path: `/${pathSegments.slice(0, index + 1).join("/")}`
    }));

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;

                    return (
                        <React.Fragment key={segment.path}>
                            {index > 0 && <BreadcrumbSeparator/>}
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{segment.segmentName}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={segment.path}>
                                        {segment.segmentName}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default PathBreadcrumb;