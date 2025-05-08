import React from 'react';
import ForgotPasswordForm from "../../components/storefront/forms/ForgotPasswordForm.component";
import PageContainer from "../../components/shared/PageContainer.component";

const ForgotPassword: React.FC = () => {
    return (
        <PageContainer className="p-4">
            <ForgotPasswordForm/>
        </PageContainer>
    );
};

export default ForgotPassword;
