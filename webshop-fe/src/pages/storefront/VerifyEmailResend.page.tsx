import React, {useEffect, useState} from 'react';
import {userService} from "../../services/UserService";
import {Button} from "../../components/ui/Button";
import {ApiError} from "../../shared/ApiError";
import {ResultEntryReasonCodeEnum} from "../../shared/api";
import {useSearchParams} from "react-router-dom";
import PageContainer from "../../components/storefront/shared/PageContainer.component";
import PageHeader from "../../components/storefront/shared/PageHeader";
import PageTitle from "../../components/storefront/shared/PageTitle";
import PageContent from "../../components/storefront/shared/PageContent";

const VerifyEmailResend: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const emailFromQuery = searchParams.get("email");
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }
    }, [searchParams]);

    const handleResend = async () => {
        setLoading(true);
        setMessage(null);

        try {
            await userService.resendVerifyEmail(email);
            setMessage("Verification email sent! Please check your inbox.");
        } catch (error) {
            if (error instanceof ApiError && error.error) {
                const errorMap = new Map(
                    error.error.map(err => [err.reasonCode, true])
                );

                if (errorMap.get(ResultEntryReasonCodeEnum.AlreadyVerifiedUser)) {
                    setMessage("This email is already verified, please use the login page to sign in.");
                }
            } else {
                setMessage("Failed to resend verification email. Try again.");
            }
        }

        setLoading(false);
    };

    return (
        <PageContainer className="p-4 my-20">
            <PageHeader variant="centered">
                <PageTitle>Verify Your Email</PageTitle>
                <p className="mt-2">
                    We’ve sent a verification link to your email. Please check your inbox.
                </p>
            </PageHeader>
            <PageContent className="mt-4 max-w-md">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-md px-3 py-2 w-full"
                />
                <Button
                    onClick={handleResend}
                    disabled={loading || !email}
                    className="disabled:opacity-50 w-full mt-4"
                >
                    {loading ? "Resending..." : "Resend Verification Email"}
                </Button>

                {message && <p className="mt-2 text-sm">{message}</p>}
            </PageContent>
        </PageContainer>
    );
};

export default VerifyEmailResend;
