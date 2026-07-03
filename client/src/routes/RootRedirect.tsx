import { Navigate } from "react-router";
import { useAuth } from "../hooks/UseAuth";
import PageLoading from "../components/PageLoading";

const RootRedirect = () => {

    const { user, loading } = useAuth();

    if (loading) {
        return <PageLoading />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case "creator":
            return <Navigate to="/create-prediction" replace />;

        case "predictor":
            return <Navigate to="/" replace />;

        default:
            return <Navigate to="/login" replace />;
    }
};

export default RootRedirect;