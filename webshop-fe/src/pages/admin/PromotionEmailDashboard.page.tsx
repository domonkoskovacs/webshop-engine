import React from 'react';
import {ColumnDef} from "@tanstack/react-table";
import {ProductResponse, PromotionEmailRequestDayOfWeekEnum} from "@/shared/api";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import {Button} from "../../components/ui/button.tsx";
import {MoreHorizontal} from "lucide-react";
import {DataTable} from "../../components/ui/data-table";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/sheet.tsx";
import EmailForm from "../../components/admin/email/EmailForm.component";
import PageContainer from "../../components/shared/PageContainer.component";
import {useEmails} from "@/hooks/email/useEmails.ts";
import {useDeleteEmail} from "@/hooks/email/useDeleteEmail.ts";
import {useTestEmail} from "@/hooks/email/useTestEmail.ts";
import {handleGenericApiError} from "@/shared/ApiError.ts";
import {toast} from "@/hooks/useToast.ts";
import {useUser} from "@/hooks/user/useUser.ts";

const PromotionEmailDashboard: React.FC = () => {
    const {data: emails = [], isLoading} = useEmails();
    const {mutateAsync: deleteEmail} = useDeleteEmail();
    const {mutateAsync: testEmail} = useTestEmail();
    const {data: user} = useUser();
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
            header: "Image",
            cell: ({row}) => {
                const url: string = row.getValue("imageUrl");
                return <img
                    src={url}
                    alt={"Promotion email"}
                    className="w-14 h-14 object-cover rounded-md"
                />
            },
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

                const handleTest = async () => {
                    try {
                        await testEmail({id, email: user?.email ?? ''});
                        toast.success("Test email sent successfully!");
                    } catch (error) {
                        handleGenericApiError(error);
                    }
                };

                const handleDelete = async () => {
                    try {
                        await deleteEmail(id);
                        toast.success("Email deleted successfully!");
                    } catch (error) {
                        handleGenericApiError(error);
                    }
                };

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
                                <DropdownMenuItem onClick={handleTest}>
                                    Test
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleDelete}>
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

    const emailForm = <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetTrigger asChild>
            <Button>New</Button>
        </SheetTrigger>
        <SheetContent>
            <EmailForm setIsOpen={setIsFormOpen}/>
        </SheetContent>
    </Sheet>

    return (
        <PageContainer layout="start">
            <DataTable key={emails.length} columns={columns} data={emails} enableSelect={false} isLoading={isLoading}
                       enableDefaultFilter={true} defaultFilterColumn={"name"} customElement={emailForm}/>
        </PageContainer>
    );
};

export default PromotionEmailDashboard;
