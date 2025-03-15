import React, {useEffect, useState} from 'react';
import PathBreadcrumb from "../../components/shared/PathBreadcrumb.component";
import {Button} from "../../components/ui/Button";
import {Separator} from "../../components/ui/Separator";
import {Badge} from "../../components/ui/Badge";
import {useLocation, useNavigate} from "react-router-dom";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/Sheet";
import FilterForm from "../../components/storefront/product/FilterForm.component";
import {ProductInfiniteScrollProvider} from "../../contexts/ProductInfiniteScrollContext";
import ProductList from "../../components/storefront/product/ProductList.component";
import {useProductScroll} from "../../hooks/useProductScroll";
import ProductDetails from "../../components/storefront/product/ProductDetails.componenet";
import {useGender} from "../../hooks/useGender";
import PageContainer from "../../components/storefront/shared/PageContainer.component";
import PageHeader from "../../components/storefront/shared/PageHeader";
import PageContent from "../../components/storefront/shared/PageContent";

const Products: React.FC = () => {
    const {gender, setGender} = useGender()
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const {totalElements} = useProductScroll();
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
            navigate(`/products/${gender ?? ""}/${category ?? ""}/${subcategory ?? ""}`.replace(/\/+$/, ""), {replace: true});
        }
    }, [name, id, gender, category, subcategory, navigate]);

    const breadcrumbSegments = [
        {segmentName: "Products", path: "/products"},
        gender && {segmentName: gender, path: `/products/${gender}`},
        category && {segmentName: category, path: `/products/${gender}/${category}`},
        subcategory && {segmentName: subcategory, path: `/products/${gender}/${category}/${subcategory}`},
        name && {segmentName: name, path: `/products/${gender}/${category}/${subcategory}/${name}${id ? `/${id}` : ''}`}
    ].filter((segment): segment is { segmentName: string; path: string } => Boolean(segment));

    return (
        <PageContainer layout="spacious">
            <PageHeader>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex sm:items-center sm:gap-3">
                        <PathBreadcrumb segments={breadcrumbSegments}/>
                        <Separator orientation="vertical" className="h-10"/>
                    </div>
                    <h2 className="flex items-center gap-1">
                        {subcategory ?? category ?? gender ?? ''} <Badge className="text-xs h-6">{totalElements}</Badge>
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
                <ProductInfiniteScrollProvider>
                    {name && id ?
                        <ProductDetails/> :
                        <ProductList/>}
                </ProductInfiniteScrollProvider>
            </PageContent>
        </PageContainer>
    );
};

export default Products;
