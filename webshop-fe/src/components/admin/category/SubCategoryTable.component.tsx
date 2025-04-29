import {Fragment} from "react";

import {ColumnDef, flexRender, getCoreRowModel, useReactTable,} from "@tanstack/react-table"

import {TableCell, TableRow,} from "@/components/ui/table"
import {SubCategoryResponse} from "@/shared/api";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../../ui/dropdown-menu";
import {Button} from "../../ui/button";
import {MoreHorizontal} from "lucide-react";
import {Badge} from "../../ui/badge";
import {toast} from "@/hooks/useToast.ts";
import {useDeleteSubCategory} from "@/hooks/category/useDeleteSubCategory.ts";
import {handleGenericApiError} from "@/shared/ApiError.ts";

interface SubCategoryTableProps {
    data: SubCategoryResponse[]
}

function SubCategoryRows({data}: SubCategoryTableProps) {
    const {mutateAsync: deleteSubCategory} = useDeleteSubCategory();

    const columns: ColumnDef<SubCategoryResponse>[] = [
        {
            accessorKey: "name",
            cell: ({row}) => {
                const subCategory = row.original
                return (
                    <div>
                        <Badge variant="secondary" className="mr-3">Subcategory</Badge>
                        {subCategory.name}
                    </div>
                )
            }
        },
        {
            id: "actions",
            cell: ({row}) => {
                const subcategory = row.original
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
                                <DropdownMenuItem onClick={async () => {
                                    try {
                                        await deleteSubCategory(subcategory.id ?? "");
                                        toast.success("Subcategory deleted successfully.");
                                    } catch (error) {
                                        handleGenericApiError(error);
                                    }
                                }}>
                                    Delete subcategory
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Fragment>
            {
                table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            }
        </Fragment>

    )
}

export default SubCategoryRows