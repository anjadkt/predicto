import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/UseAuth";

const PublicRoute = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/root" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;