import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

export const ProtectedRoute = () => {
    const isAuth = useAuthStore(state => state.isAuth);

    if (!isAuth) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};