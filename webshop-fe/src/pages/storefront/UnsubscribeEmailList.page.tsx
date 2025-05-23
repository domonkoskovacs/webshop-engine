import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {ApiError} from "@/shared/ApiError.ts";
import {BellOff, CheckCircle, Loader2, XCircle} from "lucide-react";
import {Button} from "../../components/ui/button.tsx";
import {Card, CardContent, CardHeader} from "../../components/ui/card.tsx";
import PageContainer from "../../components/shared/PageContainer.component";
import {useUnsubscribeById} from "@/hooks/user/useUnsubscribeById.ts";
import {AppPaths} from "@/routing/AppPaths.ts";

const UnsubscribeEmailList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {mutateAsync: unsubscribe} = useUnsubscribeById();

    const [message, setMessage] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const id = searchParams.get("id");

        if (!id) {
            setMessage("Invalid unsubscribe link.");
            setStatus("error");
            setTimeout(() => navigate(AppPaths.HOME), 3000);
            return;
        }

        (async () => {
            try {
                await unsubscribe(id);
                setMessage("You have been successfully unsubscribed from our mailing list.");
                setStatus("success");
            } catch (error) {
                if (error instanceof ApiError && error.error) {
                    setMessage("Unsubscribe failed. Please try again.");
                } else {
                    setMessage("Something went wrong. Please try again.");
                }
                setStatus("error");
            }
        })();
    }, [navigate, searchParams, unsubscribe]);

    return (
        <PageContainer className="sm:my-10 p-4">
            <Card className="p-8 max-w-md w-full text-center">
                <CardHeader className="p-0 m-0">
                    <BellOff className="w-12 h-12 text-blue-500 mx-auto mb-4"/>
                    <h2 className="text-2xl font-bold">Unsubscribe from Emails</h2>
                    <p className="mt-2">
                        Please wait while we process your request...
                    </p>
                </CardHeader>
                <CardContent className="p-0 m-0">
                    <div className="mt-6">
                        {status === "loading" && (
                            <div className="flex flex-col items-center">
                                <Loader2 className="w-10 h-10 animate-spin"/>
                                <p className="mt-4">Unsubscribing...</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="flex flex-col items-center">
                                <CheckCircle className="w-10 h-10 text-green-500"/>
                                <p className="mt-4 text-green-700 font-semibold">{message}</p>
                                <Button onClick={() => navigate(AppPaths.HOME)} className="mt-4 px-4 py-2">
                                    Go to Home
                                </Button>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex flex-col items-center">
                                <XCircle className="w-10 h-10 text-red-500"/>
                                <p className="mt-4 text-red-700 font-semibold">{message}</p>
                                <Button onClick={() => navigate(AppPaths.HOME)} className="mt-4 px-4 py-2">
                                    Back to Home
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    );
};

export default UnsubscribeEmailList;
