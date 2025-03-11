import React from 'react';
import StoreForm from "../../components/admin/store/StoreForm.component";

const StoreDashboard: React.FC = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <StoreForm/>
        </div>
    );
};

export default StoreDashboard;
