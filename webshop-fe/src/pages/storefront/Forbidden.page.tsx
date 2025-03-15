import React from 'react';
import PageContainer from "../../components/storefront/shared/PageContainer.component";

const Forbidden: React.FC = () => {
    return (
        <PageContainer>
            <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
            <p className="text-xl mb-6">You don't have permission to access this page.</p>
        </PageContainer>
    );
};

export default Forbidden;
