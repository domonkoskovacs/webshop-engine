import React from 'react';
import NewPasswordForm from "../../components/storefront/forms/NewPasswordForm.component";
import PageContainer from "../../components/shared/PageContainer.component";

const NewPassword: React.FC = () => {
    return (
        <PageContainer className="p-4">
            <NewPasswordForm/>
        </PageContainer>
    );
};

export default NewPassword;
