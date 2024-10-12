import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogTrigger,} from "src/components/ui/Dialog"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "src/components/ui/Tabs"
import {useSearchParams} from "react-router-dom";
import {AuthType} from "../shared/types";
import LoginForm from "./LoginForm.component";
import RegistrationForm from "./RegistrationForm.component";
import {ScrollArea} from "./ui/ScrollArea";

interface AuthDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const AuthDialogComponent: React.FC<AuthDialogProps> = ({open, setOpen}) => {
    const [authType, setAuthType] = useState<AuthType>('registration');
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const authParam = params.get("auth");
        if (authParam === 'registration') {
            setAuthType("registration");
        } else {
            setAuthType("login");
        }
    }, []);

    const handleTabChange = (authType: AuthType) => {
        setAuthType(authType);
        const params = new URLSearchParams(searchParams.toString());
        params.set("auth", authType);
        setSearchParams(params);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger/>
            <DialogContent>
                <ScrollArea className="max-h-96 m-1">
                    <Tabs defaultValue={authType} className="w-[400px]">
                        <TabsList className="flex content-center bg-background">
                            <TabsTrigger value="registration"
                                         onClick={() => handleTabChange("registration")}>Registration</TabsTrigger>
                            <TabsTrigger value="login"
                                         onClick={() => handleTabChange("login")}>Login</TabsTrigger>
                        </TabsList>
                        <TabsContent value="registration">
                            <RegistrationForm/>
                        </TabsContent>
                        <TabsContent value="login">
                            <LoginForm/>
                        </TabsContent>
                    </Tabs>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default AuthDialogComponent;
