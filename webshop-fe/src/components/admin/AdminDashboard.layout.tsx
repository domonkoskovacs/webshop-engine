import React, {ReactNode} from 'react';
import {SidebarInset, SidebarProvider, SidebarTrigger} from '../ui/Sidebar';
import {AppSidebar} from "./Sidebar.component";
import {Separator} from "../ui/Separator";
import DashboardBreadcrumb from "./DashboardBreadcrumb.component";

interface LayoutProps {
    children: ReactNode;
}

const AdminDashboardLayout: React.FC<LayoutProps> = ({children}) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header
                    className="flex shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center">
                        <SidebarTrigger className="m-2 p-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <DashboardBreadcrumb/>
                    </div>
                </header>
                <main className="flex-1 px-4 bg-background">
                    {children}
                </main>
            </SidebarInset>

        </SidebarProvider>
    )
};

export default AdminDashboardLayout;
