import React, {useEffect, useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../components/ui/Tabs";
import RegistrationForm from "../../components/storefront/forms/RegistrationForm.component";
import LoginForm from "../../components/storefront/forms/LoginForm.component";
import {ScrollArea} from "../../components/ui/ScrollArea";
import {useSearchParams} from "react-router-dom";

const Authentication: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState<boolean>(true);

    useEffect(() => {
        const type = searchParams.get('type') || 'login';
        setIsLogin(type === "login");
    }, [searchParams]);

    const handleTabChange = (value: string) => {
        setSearchParams({ type: value });
        setIsLogin(value === 'login');
    }

    return (
        <ScrollArea className="h-full p-4">
            <div className="flex flex-col  items-center justify-center h-full p-6">
                <h1>{isLogin ? "Login" : "Registration"}</h1>
                <p>{isLogin ?
                    "Please use your email and password to authenticate yourself." :
                    "Please fill the form with your data to register."}</p>
                <Tabs value={isLogin ? "login" : "registration"} onValueChange={handleTabChange}
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
            </div>
        </ScrollArea>
    );
};

export default Authentication;
