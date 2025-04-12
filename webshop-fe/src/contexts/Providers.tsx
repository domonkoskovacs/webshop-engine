import React from "react";
import {AuthProvider} from "./AuthContext";
import {GenderProvider} from "./GenderContext";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({children}) => {
    return (
        <AuthProvider>
            <GenderProvider>
                {children}
            </GenderProvider>
        </AuthProvider>
    );
};

export default Providers;
