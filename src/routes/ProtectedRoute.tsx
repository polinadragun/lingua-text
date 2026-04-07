import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

export const ProtectedRoute = () => {
    const isAuth = useAuthStore(state => state.isAuth);
    const loading = useAuthStore(state => state.loading);

    if (loading) {
        return (
            <div className="app-background">
                <div className="glass" style={{ padding: 40 }}>
                    Loading…
                </div>
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};