import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {ApiError} from "../../shared/ApiError";
import {ResultEntryReasonCodeEnum} from "../../shared/api";
import {CheckCircle, Loader2, MailCheck, XCircle} from "lucide-react";
import {Button} from "../../components/ui/Button";
import {Card, CardContent, CardHeader} from "../../components/ui/Card";
import {toLogin} from "../../lib/url.utils";
import PageContainer from "../../components/shared/PageContainer.component";
import {useVerifyEmail} from "../../hooks/user/useVerifyEmail";

const VerifyEmailConfirmation: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const {mutateAsync: verify} = useVerifyEmail();

    useEffect(() => {
        const id = searchParams.get("id");

        if (!id) {
            setMessage("Invalid verification link.");
            setStatus("error");
            setTimeout(() => navigate("/"), 3000);
            return;
        }

        (async () => {
            try {
                await verify(id);
                setMessage("Your email has been successfully verified!");
                setStatus("success");
            } catch (error) {
                if (error instanceof ApiError && error.error) {
                    const errorMap = new Map(
                        error.error.map(err => [err.reasonCode, true])
                    );

                    if (errorMap.get(ResultEntryReasonCodeEnum.AlreadyVerifiedUser)) {
                        setMessage("Your account is already verified. Please log in.");
                        setStatus("success");
                    } else {
                        setMessage("Verification failed. Please try again.");
                        setStatus("error");
                    }
                } else {
                    setMessage("Something went wrong. Please try again.");
                    setStatus("error");
                }
            }
        })();
    }, [navigate, searchParams, verify]);

    return (
        <PageContainer className="my-10">
            <Card className="p-8 max-w-md w-full text-center">
                <CardHeader className="p-0 m-0">
                    <MailCheck className="w-12 h-12 text-blue-500 mx-auto mb-4"/>
                    <h2 className="text-2xl font-bold">Email Verification</h2>
                    <p className="mt-2">
                        Please wait while we verify your email. This process only takes a moment.
                    </p>
                </CardHeader>
                <CardContent className="p-0 m-0">
                    <div className="mt-6">
                        {status === "loading" && (
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-10 h-10 animate-spin"/>
                                <p className="mt-4">Verifying your email...</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="flex flex-col items-center">
                                <CheckCircle className="w-10 h-10 text-green-500"/>
                                <p className="mt-4 text-green-700 font-semibold">{message}</p>
                                <Button
                                    onClick={() => navigate(toLogin)}
                                    className="mt-4 px-4 py-2"
                                >
                                    Go to Login
                                </Button>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex flex-col items-center">
                                <XCircle className="w-10 h-10 text-red-500"/>
                                <p className="mt-4 text-red-700 font-semibold">{message}</p>
                                <Button
                                    onClick={() => navigate("/verify-email")}
                                    className="mt-4 hover:bg-gray-600 px-4 py-2"
                                >
                                    Resend Verification Email
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    );
};

export default VerifyEmailConfirmation;
