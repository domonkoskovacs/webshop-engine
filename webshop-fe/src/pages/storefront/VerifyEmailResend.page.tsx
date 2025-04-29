import React from 'react';
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageTitle from "../../components/shared/PageTitle";
import PageContent from "../../components/shared/PageContent";
import ResendVerificationEmailForm from '@/components/storefront/forms/ResendVerificationForm';

const VerifyEmailResend: React.FC = () => {

    return (
        <PageContainer className="p-4">
            <PageHeader variant="centered">
                <PageTitle>Verify Your Email</PageTitle>
                <p className="mt-2">
                    We’ve sent a verification link to your email. Please check your inbox.
                </p>
            </PageHeader>
            <PageContent className="max-w-md">
                <ResendVerificationEmailForm/>
            </PageContent>
        </PageContainer>
    );
};

export default VerifyEmailResend;
