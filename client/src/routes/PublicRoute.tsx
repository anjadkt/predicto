import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import PageLoading from "../components/PageLoading";

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (!loading) {
        return <PageLoading />
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;