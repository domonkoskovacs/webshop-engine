import React, {Fragment, useState} from "react";
import {Input} from "../../ui/Input";
import {Button} from "../../ui/Button";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {CategoryResponse} from "../../../shared/api";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/Table";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../../ui/DropdownMenu";
import {ArrowUpDown, ChevronDown, MoreHorizontal} from "lucide-react";
import UpdateCategoryForm from "./UpdateCategoryForm.component";
import SubCategoryRows from "./SubCategoryTable.component";
import {Sheet, SheetContent, SheetTrigger} from "../../ui/Sheet";
import CategoryForm from "./CategoryForm.component";
import {toast} from "../../../hooks/useToast";
import {useCategories} from "../../../hooks/category/useCategories";
import {useDeleteCategory} from "../../../hooks/category/useDeleteCategory";
import {handleGenericApiError} from "../../../shared/ApiError";

const CategoryTable: React.FC = () => {
    const {data: categories = [], isLoading} = useCategories();
    const {mutateAsync: deleteCategory} = useDeleteCategory();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
    const [editRows, setEditRows] = useState<{ [key: string]: boolean }>({});
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isSubCategoryDialogOpen, setIsSubCategoryDialogOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const toggleOpenRow = (id: string) => {
        setOpenRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const toggleEditRow = (categoryId: string) => {
        setEditRows(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const columns: ColumnDef<CategoryResponse>[] = [
        {
            accessorKey: "name",
            header: ({column}) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Category
                        <ArrowUpDown className="ml-2 h-4 w-4"/>
                    </Button>
                )
            },
            cell: ({row}) => {
                const category = row.original
                return (
                    <div>
                        {editRows[category.id ?? ''] ? (
                            <UpdateCategoryForm id={category.id ?? ''} placeholder={category.name ?? ''}
                                                toggleEdit={() => toggleEditRow(category.id ?? '')}/>
                        ) : (
                            category.name
                        )}
                    </div>
                )
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({row}) => {
                const category = row.original

                return (
                    <div className="text-right">
                        {category.subCategories && category.subCategories.length > 0 &&
                            <Button variant="ghost" className="h-8 w-8 p-0"
                                    onClick={() => toggleOpenRow(category.id ?? '')}>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${
                                        openRows[category.id ?? ''] ? "rotate-180" : "rotate-0"
                                    }`}
                                />
                            </Button>}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                    setSelectedCategoryId(category.id ?? '');
                                    setIsSubCategoryDialogOpen(true);
                                }}>Add subcategory</DropdownMenuItem>
                                {editRows[category.id ?? ''] ? (
                                    <button type="submit"
                                            form={`updateCategoryForm-${category.id}`}>
                                        <DropdownMenuItem>
                                            Save category
                                        </DropdownMenuItem></button>
                                ) : (
                                    <DropdownMenuItem
                                        onClick={() => toggleEditRow(category.id ?? '')}
                                    >
                                        Edit category
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={async () => {
                                    try {
                                        await deleteCategory(category.id ?? '');
                                        toast.success('Category deleted successfully.');
                                    } catch (error) {
                                        handleGenericApiError(error);
                                    }
                                }}>
                                    Delete category
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]

    const table = useReactTable({
        data: categories,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    if (isLoading) return <div>Loading categories...</div>;

    return (
        <div className="w-full">
            <Sheet open={isSubCategoryDialogOpen} onOpenChange={setIsSubCategoryDialogOpen}>
                <SheetTrigger asChild>
                </SheetTrigger>
                <SheetContent>
                    <CategoryForm setIsOpen={setIsSubCategoryDialogOpen} id={selectedCategoryId ?? ''}/>
                </SheetContent>
            </Sheet>

            <div className="flex items-center my-2">
                <Input
                    placeholder="Filter categories..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                />
                <Sheet open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <SheetTrigger asChild>
                        <Button className="ml-4">New</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <CategoryForm setIsOpen={setIsCategoryDialogOpen}/>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="rounded-md border my-2">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
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
                                    {openRows[row.original.id ?? ""] && row.original.subCategories?.length! > 0 && (
                                        <SubCategoryRows data={row.original.subCategories ?? []}/>
                                    )}
                                </Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default CategoryTable;
