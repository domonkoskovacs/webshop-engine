import React, { ReactNode } from 'react';
import Sidebar from "./Sidebar.component";

interface LayoutProps {
    children: ReactNode;
}

const AdminDashboardLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 p-4 bg-background">
                {children}
            </main>
        </div>
    );
};

export default AdminDashboardLayout;
