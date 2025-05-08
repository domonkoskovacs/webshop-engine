import React from 'react';
import PageContainer from "../../components/shared/PageContainer.component";
import {Button} from "@/components/ui/button.tsx";
import {AppPaths} from "@/routing/AppPaths.ts";
import {useNavigate} from "react-router-dom";

const Forbidden: React.FC = () => {
    const navigate = useNavigate();

    return (
        <PageContainer className="h-full p-4">
            <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
            <p className="text-xl mb-6">You don't have permission to access this page.</p>
            <Button onClick={() => navigate(AppPaths.HOME)}>
                Go to Homepage
            </Button>
        </PageContainer>
    );
};

export default Forbidden;
