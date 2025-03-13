import React from 'react';
import DashboardPageContainer from "../../components/admin/shared/DashboardPageContainer.component";
import {useOrder} from "../../hooks/UseOrder";
import {ColumnDef} from "@tanstack/react-table";
import {OrderStatusRequestOrderStatusEnum, ProductResponse} from "../../shared/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/ui/DropdownMenu";
import {Button} from "../../components/ui/Button";
import {MoreHorizontal} from "lucide-react";
import {DataTable} from "../../components/ui/DataTable";
import PaginationComponent from "../../components/ui/Pagination";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/Sheet";
import ExportForm from "../../components/admin/order/ExportForm.componenet";
import FilterForm from "../../components/admin/order/FilterForm.componenet";

const OrdersDashboard: React.FC = () => {
    const {orders, filters, changeStatus, totalPages, nextPage, prevPage, setPage} = useOrder()
    const [isExportFormOpen, setIsExportFormOpen] = React.useState(false);
    const [isFilterFormOpen, setIsFilterFormOpen] = React.useState(false);

    const columns: ColumnDef<ProductResponse>[] = [
        {
            accessorKey: "status",
            header: "Status",
            enableHiding: false,
        },
        {
            accessorKey: "totalPrice",
            header: () => <div className="text-right">Total price</div>,
            cell: ({row}) => {
                const price = parseFloat(row.getValue("totalPrice"))
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(price)

                return <div className="text-right font-medium">{formatted}</div>
            },
        },
        {
            accessorKey: "orderDate",
            header: "Order Date",
            cell: ({row}) => {
                const rawDate = row.getValue("orderDate") as string;
                const formattedDate = rawDate
                    ? new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    }).format(new Date(rawDate))
                    : "N/A";

                return <div>{formattedDate}</div>;
            },
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone Number",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            id: "actions",
            header: () => <div className="text-right">Change Status</div>,
            cell: ({row}) => {
                const id = row.original.id!

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
                                <DropdownMenuItem
                                    onClick={() => changeStatus(id, OrderStatusRequestOrderStatusEnum.Packaged)}>
                                    Packaged
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => changeStatus(id, OrderStatusRequestOrderStatusEnum.Shipping)}>
                                    Shipping
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            enableHiding: false,
        },
    ]

    const actionButtons = <div className="w-full flex flex-row justify-between gap-2">
        <Sheet open={isExportFormOpen} onOpenChange={setIsExportFormOpen}>
            <SheetTrigger asChild>
                <Button>Export</Button>
            </SheetTrigger>
            <SheetContent>
                <ExportForm setIsOpen={setIsExportFormOpen}/>
            </SheetContent>
        </Sheet>
        <Sheet open={isFilterFormOpen} onOpenChange={setIsFilterFormOpen}>
            <SheetTrigger asChild>
                <Button>Filter</Button>
            </SheetTrigger>
            <SheetContent>
                <FilterForm setIsOpen={setIsFilterFormOpen}/>
            </SheetContent>
        </Sheet>
    </div>

    return (
        <DashboardPageContainer className="justify-start">
            <DataTable key={orders.length} columns={columns} data={orders} enableSelect={false}
                       enableDefaultFilter={true} defaultFilterColumn={"status"} customElement={actionButtons}/>
            <PaginationComponent
                className="my-2"
                currentPage={filters.page ?? 0}
                totalPages={totalPages}
                onPageChange={setPage}
                onNext={nextPage}
                onPrev={prevPage}
            />
        </DashboardPageContainer>
    );
};

export default OrdersDashboard;
