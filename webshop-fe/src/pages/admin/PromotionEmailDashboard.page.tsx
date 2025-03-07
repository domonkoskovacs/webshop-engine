import React from 'react';
import {useEmail} from "../../hooks/UseEmail";
import {ColumnDef} from "@tanstack/react-table";
import {ProductResponse, PromotionEmailRequestDayOfWeekEnum} from "../../shared/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/ui/DropdownMenu";
import {Button} from "../../components/ui/Button";
import {MoreHorizontal} from "lucide-react";
import {useUser} from "../../hooks/UseUser";
import {DataTable} from "../../components/ui/DataTable";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/Sheet";
import EmailForm from "../../components/admin/email/EmailForm.component";

const PromotionEmailDashboard: React.FC = () => {
    const {emails, deleteEmail, testEmail} = useEmail();
    const {user} = useUser();
    const [isFormOpen, setIsFormOpen] = React.useState(false);

    const columns: ColumnDef<ProductResponse>[] = [
        {
            accessorKey: "name",
            header: "Name",
            enableHiding: false,
        },
        {
            accessorKey: "text",
            header: "Text",
        },
        {
            accessorKey: "subject",
            header: "Subject",
        },
        {
            accessorKey: "imageUrl",
            header: "ImageUrl",
        },
        {
            id: "dayOfWeek",
            accessorKey: "dayOfWeek",
            header: "Day of week",
            cell: ({row}) => {
                const days = row.getValue("dayOfWeek") as PromotionEmailRequestDayOfWeekEnum[];
                return days.map((day: string) => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase())
                    .join(", ");
            },
        },
        {
            accessorKey: "hour",
            header: "Hour",
        },
        {
            accessorKey: "minute",
            header: "Minute",
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
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
                                <DropdownMenuItem onClick={() => testEmail(id, user.email!)}>
                                    Test
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteEmail(id)}>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            enableHiding: false,
        },
    ]

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="my-2 flex w-full justify-between">
                <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <SheetTrigger asChild>
                        <Button>New</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <EmailForm setIsOpen={setIsFormOpen}/>
                    </SheetContent>
                </Sheet>
            </div>
            <div className="w-full">
                <DataTable key={emails.length} columns={columns} data={emails} enableSelect={false}/>
            </div>
        </div>
    );
};

export default PromotionEmailDashboard;
