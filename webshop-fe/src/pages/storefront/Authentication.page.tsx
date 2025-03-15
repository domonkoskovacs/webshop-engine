import React, {useEffect, useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../../components/ui/Tabs";
import RegistrationForm from "../../components/storefront/forms/RegistrationForm.component";
import LoginForm from "../../components/storefront/forms/LoginForm.component";
import {useSearchParams} from "react-router-dom";
import PageContainer from "../../components/storefront/shared/PageContainer.component";

const Authentication: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState<boolean>(true);

    useEffect(() => {
        const type = searchParams.get('type') || 'login';
        setIsLogin(type === "login");
    }, [searchParams]);

    const handleTabChange = (value: string) => {
        setSearchParams({type: value});
        setIsLogin(value === 'login');
    }

    return (
        <PageContainer layout="centered" className="p-6">
            <Tabs value={isLogin ? "login" : "registration"} onValueChange={handleTabChange}
                  className="w-[90vw] sm:w-[60vw]">
                <TabsList className="flex content-center">
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
        </PageContainer>
    );
};

export default Authentication;
