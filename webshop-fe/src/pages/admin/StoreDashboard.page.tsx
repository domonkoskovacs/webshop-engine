import React from 'react';
import StoreForm from "../../components/admin/store/StoreForm.component";
import DashboardPageContainer from "../../components/admin/shared/DashboardPageContainer.component";

const StoreDashboard: React.FC = () => {
    return (
        <DashboardPageContainer>
            <StoreForm/>
        </DashboardPageContainer>
    );
};

export default StoreDashboard;
