import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {apiService} from "../../shared/ApiService";

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("Verifying your email...");
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        const id = searchParams.get("id");

        if (!id) {
            setMessage("Invalid verification link.");
            setIsError(true);
            setTimeout(() => navigate("/"), 3000);
            return;
        }

        const verifyEmail = async () => {
            try {
                await apiService.verifyEmail({id});
                setMessage("Your email has been successfully verified!");
                setIsError(false);
            } catch (error) {
                setMessage("Verification failed. Please try again.");
                setIsError(true);
            }
        };

        verifyEmail();
    }, [navigate, searchParams]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 rounded">
                {message}
            </div>
        </div>
    );
};

export default VerifyEmail;
