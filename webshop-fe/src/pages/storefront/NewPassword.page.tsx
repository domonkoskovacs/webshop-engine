import React from 'react';
import NewPasswordForm from "../../components/storefront/forms/NewPasswordForm.component";
import StorefrontPageContainer from "../../components/storefront/shared/DashboardPageContainer.component";

const NewPassword: React.FC = () => {
    return (
        <StorefrontPageContainer>
            <NewPasswordForm/>
        </StorefrontPageContainer>
    );
};

export default NewPassword;
