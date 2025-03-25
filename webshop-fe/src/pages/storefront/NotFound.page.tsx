import React from 'react';
import PageContainer from "../../components/shared/PageContainer.component";

const NotFound: React.FC = () => {
    return (
        <PageContainer>
            <h1 className="text-5xl font-bold text-red-600">404</h1>
            <p className="mt-4 text-2xl">Page Not Found</p>
            <p className="mt-2 text-lg">
                The page you're looking for doesn't exist or has been moved.
            </p>
        </PageContainer>
    );
};

export default NotFound;
