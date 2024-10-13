import React from 'react';
import { Button } from 'src/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const Forbidden: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
                <p className="text-xl mb-6">You don't have permission to access this page.</p>
                <Button onClick={handleGoBack} variant="ghost">
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default Forbidden;
