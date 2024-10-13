import React from 'react';
import {Dialog, DialogContent, DialogDescription, DialogTitle,} from "src/components/ui/Dialog"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "src/components/ui/Tabs"
import LoginForm from "./LoginForm.component";
import RegistrationForm from "./RegistrationForm.component";
import {ScrollArea} from "../ui/ScrollArea";

interface AuthDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    isLogin: boolean
    setIsLogin: (isLogin: boolean) => void;
}

const AuthDialogComponent: React.FC<AuthDialogProps> = ({open, setOpen, isLogin, setIsLogin}) => {

    const handleTabChange = (value: string) => {
        if (value === "login") {
            setIsLogin(true)
        } else {
            setIsLogin(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <ScrollArea className="max-h-96 m-1">
                    <DialogTitle>{isLogin ? "Login" : "Registration"}</DialogTitle>
                    <DialogDescription>{isLogin ?
                        "Please use your email and password to authenticate yourself." :
                        "Please fill the form with your data to register."}</DialogDescription>
                    <Tabs defaultValue={isLogin ? "login" : "registration"} onValueChange={handleTabChange}
                          className="w-[400px]">
                        <TabsList className="flex content-center bg-background">
                            <TabsTrigger value="registration">Registration</TabsTrigger>
                            <TabsTrigger value="login">Login</TabsTrigger>
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
