import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {PromotionEmailRequest, PromotionEmailResponse} from "../shared/api";
import {emailService} from "../services/EmailService";

interface EmailContextType {
    emails: PromotionEmailResponse[];
    createEmail: (promotionEmailRequest: PromotionEmailRequest) => Promise<void>;
    deleteEmail: (id: string) => Promise<void>;
    testEmail: (id: string, email: string) => Promise<void>;
}

export const EmailContext = createContext<EmailContextType | undefined>(undefined);

interface EmailProviderProps {
    children: ReactNode;
}

export const EmailProvider: React.FC<EmailProviderProps> = ({children}) => {
    const [emails, setEmails] = useState<PromotionEmailResponse[]>([]);

    const fetchEmails = useCallback(async () => {
        try {
            const data = await emailService.getAll();
            if (data) setEmails(data);
        } catch (error) {
            console.error("Error fetching emails:", error);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await fetchEmails();
        })();
    }, [fetchEmails]);

    const createEmail = async (promotionEmailRequest: PromotionEmailRequest) => {
        try {
            const newEmail = await emailService.create(promotionEmailRequest);
            if (newEmail) setEmails((prev) => [...prev, newEmail]);
        } catch (error) {
            console.error("Error creating email:", error);
        }
    };

    const deleteEmail = async (id: string) => {
        try {
            await emailService.delete(id);
            setEmails((prev) => prev.filter((email) => email.id !== id));
        } catch (error) {
            console.error("Error deleting email:", error);
        }
    };

    const testEmail = async (id: string, email: string) => {
        try {
            await emailService.test(id, email);
        } catch (error) {
            console.error("Error sending test email:", error);
        }
    };

    return (
        <EmailContext.Provider value={{emails, createEmail, deleteEmail, testEmail}}>
            {children}
        </EmailContext.Provider>
    );
};