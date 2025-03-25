import React from 'react';
import StoreForm from "../../components/admin/store/StoreForm.component";
import PageContainer from "../../components/shared/PageContainer.component";

const StoreDashboard: React.FC = () => {
    return (
        <PageContainer>
            <StoreForm/>
        </PageContainer>
    );
};

export default StoreDashboard;
