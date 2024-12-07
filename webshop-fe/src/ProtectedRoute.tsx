import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/UseAuth';

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
    const { loggedIn, role } = useAuth();

    if (!loggedIn || role !== allowedRole) {
        return <Navigate to="/403" />;
    }

    return children;
};

export default ProtectedRoute;
