import React, {useEffect, useState} from 'react';
import PathBreadcrumb from "../../components/shared/PathBreadcrumb.component";
import {Button} from "../../components/ui/Button";
import {Separator} from "../../components/ui/Separator";
import {Badge} from "../../components/ui/Badge";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/Sheet";
import FilterForm from "../../components/storefront/product/FilterForm.component";
import ProductList from "../../components/storefront/product/ProductList.component";
import {useGender} from "../../hooks/useGender";
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageContent from "../../components/shared/PageContent";
import ProductDetails from "../../components/storefront/product/ProductDetails.componenet";
import {generateProductBreadcrumbSegments, generateProductListUrl, parseFiltersFromUrl} from "../../lib/url.utils";
import {useProductScrollFilters} from "../../hooks/product/useProductScrollFilters";
import {useProductScroll} from "../../hooks/product/useProductScroll";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../components/ui/Select";
import {SORT_OPTIONS} from "../../lib/product.utils";
import {GetAllSortTypeEnum} from "../../shared/api";
import {useCategories} from "../../hooks/category/useCategories";

const Products: React.FC = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const {gender, setGender} = useGender()
    const {
        filters,
        updateFilters,
        resetFilters,
        urlFiltersApplied,
        setUrlFiltersApplied
    } = useProductScrollFilters();
    const {
        totalElements,
    } = useProductScroll(filters);
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const [searchParams, setSearchParams] = useSearchParams();

    const genderPathSegment = pathSegments[1] || null;
    const category = pathSegments[2] || null;
    const subcategory = pathSegments[3] || null;
    const name = pathSegments[4] || null;
    const id = pathSegments[5] || null;

    const { data: categories = [] } = useCategories();
    const matchingCategory = categories.find((c) => c.name === category);
    const subcategories = matchingCategory?.subCategories ?? [];

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
        if (!id && !urlFiltersApplied) {
            const filter = parseFiltersFromUrl(location.pathname, location.search);
            updateFilters(filter);
            setUrlFiltersApplied(true);
        }
    }, [id, location.pathname, location.search, updateFilters, setUrlFiltersApplied, urlFiltersApplied]);

    const breadcrumbSegments = generateProductBreadcrumbSegments({gender, category, subcategory, name, id})

    const handleSortChange = (val: string) => {
        if (!Object.values(GetAllSortTypeEnum).includes(val as GetAllSortTypeEnum)) return;
        updateFilters({...filters, sortType: val as GetAllSortTypeEnum});
        searchParams.set("sortType", val);
        setSearchParams(searchParams);
    };

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
                <div className="flex items-center gap-3">
                    {!category && categories.length > 0 && (
                        <Select
                            onValueChange={(val) =>
                                navigate(generateProductListUrl(gender, val), { replace: true })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.name!}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {!subcategory && subcategories.length > 0 && (
                        <Select
                            onValueChange={(val) =>
                                navigate(generateProductListUrl(gender, category, val), { replace: true })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Choose a subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                                {subcategories.map((sub) => (
                                    <SelectItem key={sub.id} value={sub.name!}>
                                        {sub.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Select
                        key={filters.sortType ?? "default"}
                        value={filters.sortType}
                        onValueChange={handleSortChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by"/>
                        </SelectTrigger>
                        <SelectContent>
                            {SORT_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button>Filter Products</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <FilterForm
                                setIsOpen={setIsFilterOpen}
                                filters={filters}
                                updateFilters={updateFilters}
                                setUrlFiltersApplied={setUrlFiltersApplied}
                                resetFilters={resetFilters}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </PageHeader>
            <PageContent>
                <ProductList
                    filters={filters}
                />
            </PageContent>
        </PageContainer>;
};

export default Products;
