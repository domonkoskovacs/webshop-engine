import React, {ReactNode} from 'react';
import {SidebarInset, SidebarProvider, SidebarTrigger} from '../components/ui/Sidebar';
import {AppSidebar} from "../components/admin/Sidebar.component";
import {Separator} from "../components/ui/Separator";
import DashboardBreadcrumb from "../components/shared/PathBreadcrumb.component";
import {Bell} from "lucide-react";
import DarkModeToggle from "../components/ui/DarkModeToggle";
import {Badge} from "../components/ui/Badge";
import {useOrder} from "../hooks/UseOrder";
import {useNavigate} from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
}

const AdminDashboardLayout: React.FC<LayoutProps> = ({children}) => {
    const {ordersNeedingAttention} = useOrder();
    const navigate = useNavigate()

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header
                    className="flex shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <SidebarTrigger className="m-2 p-1"/>
                            <Separator orientation="vertical" className="mr-2 h-4"/>
                            <DashboardBreadcrumb/>
                        </div>

                        <div className="flex items-center">
                            <div className="relative cursor-pointer" onClick={() => navigate("/dashboard/orders")}>
                                <Bell className="m-2 p-1"/>
                                {ordersNeedingAttention > 0 && (
                                    <Badge
                                        className="absolute top-0 right-0 flex h-4 w-3 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                        {ordersNeedingAttention}
                                    </Badge>
                                )}
                            </div>
                            <DarkModeToggle className="m-2 p-1"/>
                        </div>
                    </div>
                </header>
                <Separator/>
                <main className="flex-1 px-4">
                    {children}
                </main>
            </SidebarInset>

        </SidebarProvider>
    )
};

export default AdminDashboardLayout;
