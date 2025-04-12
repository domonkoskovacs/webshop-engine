import React from "react";
import {AuthProvider} from "./AuthContext";
import {GenderProvider} from "./GenderContext";
import {UserProvider} from "./UserContext";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({children}) => {
    return (
        <AuthProvider>
            <GenderProvider>
                <UserProvider>
                    {children}
                </UserProvider>
            </GenderProvider>
        </AuthProvider>
    );
};

export default Providers;
