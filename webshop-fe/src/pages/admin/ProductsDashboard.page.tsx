import React from 'react';
import {DataTable} from "../../components/ui/DataTable";
import {ColumnDef} from "@tanstack/react-table";
import {ProductResponse} from "../../shared/api";
import {useProductPagination} from "../../hooks/UseProduct";
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

const ProductsDashboard: React.FC = () => {
    const {products, filters, setPage, nextPage, prevPage, totalPages} = useProductPagination()
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

    const itemNoFilter = (
        <Input
            placeholder="Search for Item No..."
            className="max-w-sm"
        />
    )

    return (
        <div className="flex flex-col items-center justify-center">

            <div className="my-2 flex w-full justify-between">
                <div className="flex gap-2 rounded-md border">
                    <Button variant="ghost">
                        <Import className="h-4 w-4  mr-2"/> Import
                    </Button>
                    <Button variant="ghost">
                        <ArrowRightFromLine className="h-4 w-4 mr-2"/> Export
                    </Button>
                </div>

                <Button>
                    New
                </Button>
            </div>

            <div className="w-full">
                <DataTable columns={columns} data={products} customFilter={itemNoFilter}/>
            </div>
            <PaginationComponent className="my-2" currentPage={filters.page ?? 0}
                                 totalPages={totalPages}
                                 onPageChange={setPage}
                                 onNext={nextPage}
                                 onPrev={prevPage}/>


        </div>
    );
};

export default ProductsDashboard;
