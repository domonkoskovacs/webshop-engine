import React, {useEffect, useState} from 'react';
import {DataTable} from "../../components/ui/DataTable";
import {ColumnDef} from "@tanstack/react-table";
import {ProductResponse} from "../../shared/api";
import {useProductPagination} from "../../hooks/UseProductPagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/ui/DropdownMenu";
import {Button} from "../../components/ui/Button";
import {ArrowRightFromLine, Import, MoreHorizontal} from "lucide-react";
import {Input} from "../../components/ui/Input";
import PaginationComponent from "../../components/ui/Pagination";
import FilterForm from "../../components/admin/product/FilterForm.component";

const ProductsDashboard: React.FC = () => {
    const {products, filters, updateFilters, setPage, nextPage, prevPage, totalPages} = useProductPagination()
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const columns: ColumnDef<ProductResponse>[] = [
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
            cell: ({row}) => {
                const product = row.original

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
                                <DropdownMenuItem>View product</DropdownMenuItem>
                                <DropdownMenuItem>Edit product</DropdownMenuItem>
                                <DropdownMenuItem>Set discount</DropdownMenuItem>
                                <DropdownMenuItem>Delete product</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            enableHiding: false,
        },
    ]

    const [searchTerm, setSearchTerm] = useState(filters.itemNumber || "");
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            updateFilters({itemNumber: searchTerm});
        }
    };
    const itemNoFilter = (
        <Input
            placeholder="Search for Item No..."
            className="max-w-sm mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
        />
    );

    return (
        <div className="relative">
            {/* Dashboard */}
            <div
                className={`flex flex-col items-center justify-center transition-opacity duration-300 ${isFilterOpen ? 'opacity-50' : 'opacity-100'}`}>
                <div className="my-2 flex w-full justify-between">
                    <div className="flex gap-2 rounded-md border">
                        <Button variant="ghost">
                            <Import className="h-4 w-4 mr-2"/> Import
                        </Button>
                        <Button variant="ghost">
                            <ArrowRightFromLine className="h-4 w-4 mr-2"/> Export
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button>New</Button>
                        <Button onClick={() => setIsFilterOpen(true)}>Filter</Button>
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

            {isFilterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsFilterOpen(false)}></div>
            )}

            <div
                className={`fixed right-0 top-0 h-full w-80 bg-background shadow-lg z-50 p-4 flex flex-col transform transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <FilterForm setIsOpen={setIsFilterOpen}/>
            </div>
        </div>
    );
};

export default ProductsDashboard;
