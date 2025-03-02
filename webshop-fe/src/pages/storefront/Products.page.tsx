import React, {useState} from 'react';
import {useProduct} from "../../hooks/UseProduct";
import DashboardBreadcrumb from "../../components/shared/PathBreadcrumb.component";
import {Button} from "../../components/ui/Button";
import {Separator} from "../../components/ui/Separator";
import {Badge} from "../../components/ui/Badge";
import {useLocation} from "react-router-dom";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/Sheet";
import FilterForm from "../../components/storefront/product/FilterForm.component";
import {ProductInfiniteScrollProvider} from "../../contexts/ProductInfiniteScrollContext";
import ProductList from "../../components/storefront/product/ProductList.component";

const Products: React.FC = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const {products, totalElements} = useProduct();
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean);

    const gender = pathSegments[1] || null;
    const category = pathSegments[2] || null;
    const subcategory = pathSegments[3] || null;

    return (
        <div className="flex flex-col h-full w-full justify-start">
            <header className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex sm:items-center sm:gap-3">
                        <DashboardBreadcrumb/>
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
            </header>
            <Separator/>
            <ProductInfiniteScrollProvider>
                <ProductList/>
            </ProductInfiniteScrollProvider>
        </div>
    );
};

export default Products;
