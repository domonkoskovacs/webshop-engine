import React from 'react';
import StorefrontPageContainer from "../../components/storefront/shared/DashboardPageContainer.component";

const Forbidden: React.FC = () => {
    return (
        <StorefrontPageContainer>
            <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
            <p className="text-xl mb-6">You don't have permission to access this page.</p>
        </StorefrontPageContainer>
    );
};

export default Forbidden;
