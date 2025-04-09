import React from 'react';
import {ColumnDef} from "@tanstack/react-table";
import {OrderResponse} from "../../shared/api";
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
import PageContainer from "../../components/shared/PageContainer.component";
import {getNextAdminStatuses} from "../../lib/order.utils";
import {useOrdersPagination} from "../../hooks/order/useOrdersPagination";
import {handleGenericApiError} from "../../shared/ApiError";
import {useChangeOrderStatus} from "../../hooks/order/useChangeOrderStatus";

const OrdersDashboard: React.FC = () => {
    const {mutateAsync: changeStatus, isPending} = useChangeOrderStatus();
    const {
        orders,
        filters,
        totalPages,
        nextPage,
        prevPage,
        setPage,
        totalElements,
        isLoading,
        isError,
    } = useOrdersPagination();
    const [isExportFormOpen, setIsExportFormOpen] = React.useState(false);
    const [isFilterFormOpen, setIsFilterFormOpen] = React.useState(false);

    const columns: ColumnDef<OrderResponse>[] = [
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
                const currentStatus = row.original.status;
                const allowedStatuses = getNextAdminStatuses(currentStatus!);

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
                                {allowedStatuses.length > 0 ? (
                                    allowedStatuses.map(status => (
                                        <DropdownMenuItem
                                            disabled={isPending}
                                            key={status}
                                            onClick={async () => {
                                                try {
                                                    await changeStatus({id, status});
                                                } catch (error) {
                                                    handleGenericApiError(error);
                                                }
                                            }}
                                        >
                                            {status}
                                        </DropdownMenuItem>
                                    ))
                                ) : (
                                    <DropdownMenuItem disabled>
                                        No operations available
                                    </DropdownMenuItem>
                                )}
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
        <PageContainer layout="start">
            <DataTable key={orders.length} columns={columns} data={orders} enableSelect={false}
                       enableDefaultFilter={true} defaultFilterColumn={"status"} customElement={actionButtons}
                       totalElements={totalElements} isError={isError} isLoading={isLoading}/>
            <PaginationComponent
                className="my-2"
                currentPage={filters.page ?? 0}
                totalPages={totalPages}
                onPageChange={setPage}
                onNext={nextPage}
                onPrev={prevPage}
            />
        </PageContainer>
    );
};

export default OrdersDashboard;
