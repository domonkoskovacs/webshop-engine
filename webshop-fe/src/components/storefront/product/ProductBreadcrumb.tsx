import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "src/components/ui/Breadcrumb";
import React from "react";

interface BreadcrumbSegment {
    segment: string;
    path: string;
}

interface ProductBreadcrumbProps {
    segments: BreadcrumbSegment[];
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ segments }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((item, index) => {
                    const isLast = index === segments.length - 1;

                    return (
                        <React.Fragment key={item.path}>
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{item.segment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={item.path}>
                                        {item.segment}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default ProductBreadcrumb;
