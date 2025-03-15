import React from 'react';
import ForgotPasswordForm from "../../components/storefront/forms/ForgotPasswordForm.component";
import PageContainer from "../../components/storefront/shared/PageContainer.component";

const ForgotPassword: React.FC = () => {
    return (
        <PageContainer>
            <ForgotPasswordForm/>
        </PageContainer>
    );
};

export default ForgotPassword;
