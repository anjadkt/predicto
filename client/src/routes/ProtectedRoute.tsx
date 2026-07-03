import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import PageLoading from "../components/PageLoading";
import type { UserRoles } from "../types/auth.types";

const ProtectedRoute = ({ role }: { role: UserRoles }) => {

    const { user, loading } = useAuth();

    if (loading) {
        return <PageLoading />
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