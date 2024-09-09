import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold text-red-600">404</h1>
            <p className="mt-4 text-2xl text-gray-700">Page Not Found</p>
            <p className="mt-2 text-lg text-gray-500">
                The page you're looking for doesn't exist or has been moved.
            </p>
        </div>
    );
};

export default NotFound;
