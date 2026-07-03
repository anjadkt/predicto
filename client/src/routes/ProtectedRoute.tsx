import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import PageLoading from "../components/PageLoading";

const ProtectedRoute = () => {

    const { user, loading } = useAuth();

    if (loading) {
        return <PageLoading />
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;