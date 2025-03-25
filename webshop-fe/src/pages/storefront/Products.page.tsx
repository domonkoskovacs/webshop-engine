import React, {useEffect, useState} from 'react';
import PathBreadcrumb from "../../components/shared/PathBreadcrumb.component";
import {Button} from "../../components/ui/Button";
import {Separator} from "../../components/ui/Separator";
import {Badge} from "../../components/ui/Badge";
import {useLocation, useNavigate} from "react-router-dom";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/Sheet";
import FilterForm from "../../components/storefront/product/FilterForm.component";
import ProductList from "../../components/storefront/product/ProductList.component";
import {useProductScroll} from "../../hooks/useProductScroll";
import {useGender} from "../../hooks/useGender";
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageContent from "../../components/shared/PageContent";
import ProductDetails from "../../components/storefront/product/ProductDetails.componenet";
import {generateProductBreadcrumbSegments, generateProductListUrl, parseFiltersFromUrl} from "../../lib/url.utils";

const Products: React.FC = () => {
    const {gender, setGender} = useGender()
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const {totalElements, updateFilters, urlFiltersApplied, setUrlFiltersApplied} = useProductScroll();
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split("/").filter(Boolean);

    const genderPathSegment = pathSegments[1] || null;
    const category = pathSegments[2] || null;
    const subcategory = pathSegments[3] || null;
    const name = pathSegments[4] || null;
    const id = pathSegments[5] || null;

    useEffect(() => {
        if ((genderPathSegment === "men" || genderPathSegment === "women") && genderPathSegment !== gender) {
            setGender(genderPathSegment);
        }
    }, [genderPathSegment, gender, setGender]);

    useEffect(() => {
        if (name && !id) {
            navigate(generateProductListUrl(gender, category, subcategory), {replace: true});
        }
        if (!genderPathSegment) {
            navigate(generateProductListUrl(gender), {replace: true});
        }
    }, [name, id, gender, category, subcategory, navigate, genderPathSegment]);

    useEffect(() => {
        if (!id) {
            const filter = parseFiltersFromUrl(location.pathname, location.search);
            updateFilters(filter);
            setUrlFiltersApplied(true);
        }
    }, [id, location.pathname, location.search, updateFilters, setUrlFiltersApplied, urlFiltersApplied ]);

    const breadcrumbSegments = generateProductBreadcrumbSegments({gender, category, subcategory, name, id})

    return name && id ?
        <ProductDetails/> :
        <PageContainer layout="spacious" className="self-start">
            <PageHeader>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex sm:items-center sm:gap-3">
                        <PathBreadcrumb segments={breadcrumbSegments}/>
                        <Separator orientation="vertical" className="h-10"/>
                    </div>
                    <h2 className="flex items-center gap-1">
                        {decodeURIComponent(subcategory ?? category ?? gender ?? '')} <Badge
                        className="text-xs h-6">{totalElements}</Badge>
                    </h2>
                </div>
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                        <Button>Filter Products</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <FilterForm setIsOpen={setIsFilterOpen}/>
                    </SheetContent>
                </Sheet>
            </PageHeader>
            <PageContent>
                <ProductList/>
            </PageContent>
        </PageContainer>;
};

export default Products;
