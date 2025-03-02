import React, {ReactNode} from 'react';
import {SidebarInset, SidebarProvider, SidebarTrigger} from '../components/ui/Sidebar';
import {AppSidebar} from "../components/admin/Sidebar.component";
import {Separator} from "../components/ui/Separator";
import DashboardBreadcrumb from "../components/shared/PathBreadcrumb.component";
import {Bell} from "lucide-react";
import DarkModeToggle from "../components/ui/DarkModeToggle";

interface LayoutProps {
    children: ReactNode;
}

const AdminDashboardLayout: React.FC<LayoutProps> = ({children}) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <header className="flex shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                            <SidebarTrigger className="m-2 p-1"/>
                            <Separator orientation="vertical" className="mr-2 h-4"/>
                            <DashboardBreadcrumb/>
                        </div>

                        <div className="flex items-center">
                            <Bell className="m-2 p-1"/>
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
