import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {userService} from "../../services/UserService";

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string>("Verifying your email...");

    useEffect(() => {
        const id = searchParams.get("id");

        if (!id) {
            setMessage("Invalid verification link.");
            setTimeout(() => navigate("/"), 3000);
            return;
        }

        const verifyEmail = async () => {
            try {
                await userService.verifyEmail(id);
                setMessage("Your email has been successfully verified!");
            } catch (error) {
                setMessage("Verification failed. Please try again.");
            }
        };

        verifyEmail();
    }, [navigate, searchParams]);

    return (
        <div>
            {message}
        </div>
    );
};

export default VerifyEmail;
