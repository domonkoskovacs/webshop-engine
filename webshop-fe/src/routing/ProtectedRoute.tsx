import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/UseAuth';

interface ProtectedRouteProps {
    children: React.JSX.Element;
    allowedRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
    const { loggedIn, role , loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // todo create loader component
    }

    if (!loggedIn || role !== allowedRole) {
        return <Navigate to="/403" />;
    }

    return children;
};

export default ProtectedRoute;
