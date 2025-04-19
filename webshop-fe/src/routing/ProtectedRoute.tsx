import React from 'react';
import {useAuth} from 'src/hooks/UseAuth';
import Forbidden from "../pages/storefront/Forbidden.page";
import NotFound from "../pages/storefront/NotFound.page";
import StorefrontLayout from "../layouts/Storefront.layout";

interface ProtectedRouteProps {
    children: React.JSX.Element;
    allowedRole: 'ROLE_ADMIN' | 'ROLE_USER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children, allowedRole}) => {
    const {loggedIn, role, loading} = useAuth();

    if (loading) {
        return <div>Loading...</div>; // todo create loader component
    }

    const isAdminRoute = allowedRole === 'ROLE_ADMIN';

    if (!loggedIn || role !== allowedRole) {
        return isAdminRoute ? <StorefrontLayout><NotFound /></StorefrontLayout> : <Forbidden />;
    }

    return children;
};

export default ProtectedRoute;
