import React, {useEffect, useMemo, useRef, useState} from 'react';
import {ColumnDef} from "@tanstack/react-table";
import {ProductResponse} from "@/shared/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import {Button} from "../../components/ui/button.tsx";
import {ArrowRightFromLine, Import, MoreHorizontal} from "lucide-react";
import PaginationComponent from "../../components/ui/pagination.tsx";
import FilterForm from "../../components/admin/product/FilterForm.component";
import {DataTable} from "../../components/ui/data-table";
import ItemNumberSearch from "../../components/admin/product/ItemNumberSearch.component";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/sheet.tsx";
import ProductForm from "../../components/admin/product/ProductForm.component";
import {Checkbox} from "../../components/ui/checkbox.tsx";
import DiscountForm from "../../components/admin/product/DiscountForm.component";
import ImportForm from "../../components/admin/product/ImportForm.component";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog.tsx';
import ProductCard from "../../components/storefront/product/ProductCard.component";
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageContent from "../../components/shared/PageContent";
import {useDeleteProducts} from "@/hooks/product/useDeleteProducts.ts";
import {toast} from "@/hooks/useToast.ts";
import {handleGenericApiError} from "@/shared/ApiError.ts";
import {useExportProducts} from "@/hooks/product/useExportProducts.ts";
import {downloadCSV} from '@/lib/file.utils';
import {mapFiltersToExportRequest} from "@/lib/product.utils.ts";
import {useProductFilters} from "@/hooks/product/useProductFilters.ts";
import {useProducts} from "@/hooks/product/useProducts.ts";

const ProductsDashboard: React.FC = () => {
    const {
        filters,
        updateFilters,
        resetFilters,
        nextPage,
        prevPage,
        setPage,
    } = useProductFilters();

    const {
        data: productsData,
        isLoading,
        isError,
    } = useProducts(filters);

    const products = useMemo(() => productsData?.content ?? [], [productsData?.content]);
    const totalPages = productsData?.totalPages ?? 0;
    const totalElements = productsData?.totalElements ?? 0;

    const {mutateAsync: exportProducts, isPending: isExporting} = useExportProducts();
    const {mutateAsync: deleteProductsMutation, isPending: isDeleting} = useDeleteProducts();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false);
    const [isImportFormOpen, setIsImportFormOpen] = useState(false);
    const [isProductCardOpen, setIsProductCardOpen] = useState(false);
    const [product, setProduct] = useState<ProductResponse>({});
    const [id, setId] = useState<string | undefined>(undefined);
    const [ids, setIds] = useState<string[]>([]);

    const handleExport = async () => {
        try {
            const exportRequest = mapFiltersToExportRequest(filters);
            const response = await exportProducts(exportRequest);
            if (response.csv) {
                downloadCSV(response.csv, "products.csv");
            }
        } catch (error) {
            handleGenericApiError(error)
        }
    };

    const columns: ColumnDef<ProductResponse>[] = [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "itemNumber",
            header: "Item No",
            enableHiding: false,
        },
        {
            id: "Brand",
            accessorKey: "brand.name",
            header: "Brand",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "gender",
            header: "Gender",
            cell: ({row}) => {
                const gender: string = row.getValue("gender")
                return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
            },
        },
        {
            id: "Category",
            accessorKey: "category.name",
            header: "Category",
        },
        {
            id: "Subcategory",
            accessorKey: "subCategory.name",
            header: "Subcategory",
        },
        {
            accessorKey: "count",
            header: "Stock",
        },
        {
            accessorKey: "price",
            header: () => <div className="text-right">Price</div>,
            cell: ({row}) => {
                const price = parseFloat(row.getValue("price"))
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(price)

                return <div className="text-right font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "discountPercentage",
            header: () => <div className="text-right">Discount</div>,
            cell: ({row}) => {
                const discount = parseFloat(row.getValue("discountPercentage"))
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "percent",
                    minimumFractionDigits: 0,
                }).format(discount / 100)

                return <div className="text-right font-medium">{formatted}</div>
            },
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({table, row}) => {
                const product = row.original
                const selectedRowCount = table.getFilteredSelectedRowModel().rows.length
                const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id ?? '');
                const targetIds = selectedIds.length > 0 ? selectedIds : [product.id ?? ''];

                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {selectedRowCount < 2 && <DropdownMenuItem onClick={() => {
                                    setIsProductCardOpen(true);
                                    setProduct(product)
                                }}>View product</DropdownMenuItem>}
                                {selectedRowCount < 2 && <DropdownMenuItem onClick={() => {
                                    setIsProductFormOpen(true);
                                    setId(product.id);
                                }}>Edit product</DropdownMenuItem>}
                                <DropdownMenuItem onClick={() => {
                                    setIsDiscountFormOpen(true);
                                    setIds(targetIds);
                                }}>
                                    {selectedRowCount > 1 ? "Set discount for selected" : "Set discount"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    disabled={isDeleting}
                                    onClick={async () => {
                                        try {
                                            await deleteProductsMutation(targetIds);
                                            toast.success("Product(s) successfully deleted!");
                                        } catch (error) {
                                            handleGenericApiError(error);
                                        }
                                    }}
                                >
                                    {isDeleting
                                        ? "Deleting..."
                                        : selectedRowCount > 1
                                            ? "Delete selected products"
                                            : "Delete product"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            enableHiding: false,
        },
    ]

    const inputRef = useRef<HTMLInputElement>(null);
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        if (isInputFocused && inputRef.current && !isFilterOpen) {
            inputRef.current.focus();
        }
    }, [inputRef, isFilterOpen, isInputFocused, products]);

    const itemNoFilter = <ItemNumberSearch inputRef={inputRef} setIsInputFocused={setIsInputFocused} filters={filters}
                                           updateFilters={updateFilters}/>

    return (
        <PageContainer layout="start">
            <Dialog open={isProductCardOpen} onOpenChange={setIsProductCardOpen}>
                <DialogContent className="w-1/4 h-auto">
                    <DialogHeader>
                        <DialogTitle>Product View</DialogTitle>
                    </DialogHeader>
                    <ProductCard product={product}/>
                </DialogContent>
            </Dialog>
            <PageHeader className="pt-2 mb-0">
                <Sheet open={isDiscountFormOpen} onOpenChange={setIsDiscountFormOpen}>
                    <SheetTrigger asChild>

                    </SheetTrigger>
                    <SheetContent>
                        <DiscountForm setIsOpen={setIsDiscountFormOpen} productIds={ids}/>
                    </SheetContent>
                </Sheet>
                <div className="flex gap-2 rounded-md border">
                    <Sheet open={isImportFormOpen} onOpenChange={setIsImportFormOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" onClick={() => setIsImportFormOpen(true)}>
                                <Import className="h-4 w-4 mr-2"/> Import
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <ImportForm setIsOpen={setIsImportFormOpen}/>
                        </SheetContent>
                    </Sheet>
                    <Button
                        variant="ghost"
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        <ArrowRightFromLine className="h-4 w-4 mr-2"/>
                        {isExporting ? "Exporting..." : "Export"}
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Sheet open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
                        <SheetTrigger asChild>
                            <Button onClick={() => {
                                setIsProductFormOpen(true);
                                setId(undefined)
                            }}>New</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <ProductForm setIsOpen={setIsProductFormOpen} productId={id}/>
                        </SheetContent>
                    </Sheet>
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button onClick={() => setIsFilterOpen(true)}>Filter</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <FilterForm
                                setIsOpen={setIsFilterOpen}
                                filters={filters}
                                updateFilters={updateFilters}
                                resetFilters={resetFilters}
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </PageHeader>
            <PageContent>
                <DataTable key={products.length} columns={columns} data={products} customElement={itemNoFilter} isLoading={isLoading} isError={isError}
                           totalElements={totalElements}/>
                <PaginationComponent
                    className="my-2"
                    currentPage={filters.page ?? 0}
                    totalPages={totalPages}
                    onPageChange={(page) => setPage(page, totalPages)}
                    onNext={() => nextPage(totalPages)}
                    onPrev={prevPage}
                />
            </PageContent>
        </PageContainer>
    );
};

export default ProductsDashboard;
