import React from 'react';
import StorefrontPageContainer from "../../components/storefront/shared/DashboardPageContainer.component";

const NotFound: React.FC = () => {
    return (
        <StorefrontPageContainer>
            <h1 className="text-5xl font-bold text-red-600">404</h1>
            <p className="mt-4 text-2xl">Page Not Found</p>
            <p className="mt-2 text-lg">
                The page you're looking for doesn't exist or has been moved.
            </p>
        </StorefrontPageContainer>
    );
};

export default NotFound;
