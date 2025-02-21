import React, {useEffect, useRef, useState} from 'react';
import {ColumnDef} from "@tanstack/react-table";
import {ProductResponse} from "../../shared/api";
import {useProduct} from "../../hooks/UseProductPagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/ui/DropdownMenu";
import {Button} from "../../components/ui/Button";
import {ArrowRightFromLine, Import, MoreHorizontal} from "lucide-react";
import PaginationComponent from "../../components/ui/Pagination";
import FilterForm from "../../components/admin/product/FilterForm.component";
import {DataTable} from "../../components/ui/DataTable";
import ItemNumberSearch from "../../components/admin/product/ItemNumberSearch.component";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/Sheet";
import ProductForm from "../../components/admin/product/ProductForm.component";
import {Checkbox} from "../../components/ui/Checkbox";
import DiscountForm from "../../components/admin/product/DiscountForm.component";
import ImportForm from "../../components/admin/product/ImportForm.component";

const ProductsDashboard: React.FC = () => {
    const {products, filters, setPage, nextPage, prevPage, totalPages, deleteProducts, exportProducts} = useProduct()
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isDiscountFormOpen, setIsDiscountFormOpen] = useState(false);
    const [isImportFormOpen, setIsImportFormOpen] = useState(false);
    const [id, setId] = useState<string | undefined>(undefined);
    const [ids, setIds] = useState<string[]>([]);

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
                                {selectedRowCount < 2 && <DropdownMenuItem>View product</DropdownMenuItem>}
                                {selectedRowCount < 2 && <DropdownMenuItem onClick={() => {
                                    setIsProductFormOpen(true);
                                    setId(product.id);
                                }}>Edit product</DropdownMenuItem>}
                                <DropdownMenuItem onClick={() => {
                                    setIsDiscountFormOpen(true);
                                    if (selectedRowCount > 1) {
                                        setIds(selectedIds)
                                    } else {
                                        setIds([product.id ?? ''])
                                    }
                                }}>
                                    {selectedRowCount > 1 ? "Set discount for selected" : "Set discount"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteProducts(selectedIds)}>
                                    {selectedRowCount > 1 ? "Delete selected products" : "Delete product"}
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

    const itemNoFilter = <ItemNumberSearch inputRef={inputRef} setIsInputFocused={setIsInputFocused}/>


    return (
        <div className="flex flex-col items-center justify-center">
            <div className="my-2 flex w-full justify-between">
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
                    <Button variant="ghost" onClick={() => exportProducts()}>
                        <ArrowRightFromLine className="h-4 w-4 mr-2"/> Export
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
                            <FilterForm setIsOpen={setIsFilterOpen}/>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div className="w-full">
                <DataTable key={products.length} columns={columns} data={products} customFilter={itemNoFilter}/>
            </div>
            <PaginationComponent
                className="my-2"
                currentPage={filters.page ?? 0}
                totalPages={totalPages}
                onPageChange={setPage}
                onNext={nextPage}
                onPrev={prevPage}
            />
        </div>
    );
};

export default ProductsDashboard;
