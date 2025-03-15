import React from 'react';
import ForgotPasswordForm from "../../components/storefront/forms/ForgotPasswordForm.component";
import StorefrontPageContainer from "../../components/storefront/shared/DashboardPageContainer.component";

const ForgotPassword: React.FC = () => {
    return (
        <StorefrontPageContainer>
            <ForgotPasswordForm/>
        </StorefrontPageContainer>
    );
};

export default ForgotPassword;
