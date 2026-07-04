import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/UseAuth";
import SiteLoading from "../components/SiteLoading";
import type { UserRoles } from "../types/auth.types";

const ProtectedRoute = ({ role }: { role: UserRoles }) => {

    const { user, loading } = useAuth();

    if (loading) {
        return <SiteLoading />
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/root" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;