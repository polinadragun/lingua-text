import { useEffect } from "react";
import Snowfall from "react-snowfall";
import { AppRouter } from "./routes/router";
import { Navbar } from "./components/nav/Navbar";
import { useAuthStore } from "./store/AuthStore";

function App() {
    const restoreSession = useAuthStore(s => s.restoreSession);
    const isAuth = useAuthStore(s => s.isAuth);
    const loading = useAuthStore(s => s.loading);

    useEffect(() => {
        restoreSession();
    }, []);

    if (loading) {
        return (
            <div className="app-background">
                <div className="app-shell">
                    <div className="glass" style={{ padding: 40 }}>
                        Loading…
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-background">
            <Snowfall
                snowflakeCount={100}
                color="rgba(255, 255, 255, 1)"
                speed={[0.4, 1.2]}
                wind={[-0.15, 0.15]}
                radius={[0.6, 2]}
            />

            <div className="app-shell">
                {isAuth && <Navbar />}

                <AppRouter />
            </div>
        </div>
    );
}

export default App;
