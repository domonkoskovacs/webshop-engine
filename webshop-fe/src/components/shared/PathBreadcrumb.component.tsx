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
import {generateBreadcrumbSegments} from "../../lib/url.utils";

interface BreadcrumbSegment {
    segmentName: string;
    path: string;
}

interface PathBreadcrumbProps {
    segments?: BreadcrumbSegment[];
}

const PathBreadcrumb: React.FC<PathBreadcrumbProps> = ({segments}) => {
    const location = useLocation();
    const breadcrumbSegments = segments ?? generateBreadcrumbSegments(location.pathname);

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbSegments.map((segment, index) => {
                    const isLast = index === breadcrumbSegments.length - 1;

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