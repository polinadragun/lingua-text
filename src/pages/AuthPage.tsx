import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import {AuthCredentials} from "../entity/AuthCredentials";

export const AuthPage = () => {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const login = useAuthStore(state => state.login);
    const register = useAuthStore(state => state.register);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === "register" && password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const credentials: AuthCredentials = {
            email,
            password
        };

        const ok =
            mode === "login"
                ? await login(credentials)
                : await register(credentials);
        if (ok) {
            navigate("/profile");
        } else {
            alert(mode === "login" ? "Invalid credentials" : "Registration failed");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card glass">
                <h1 className="auth-title">
                    {mode === "login" ? "Welcome back" : "Create account"}
                </h1>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    {mode === "register" && (
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}

                    <button className="auth-button" type="submit">
                        {mode === "login" ? "Sign in" : "Sign up"}
                    </button>
                </form>

                <div className="auth-switch">
                    {mode === "login" ? (
                        <>
                            Don’t have an account?
                            <button
                                type="button"
                                onClick={() => setMode("register")}
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?
                            <button
                                type="button"
                                onClick={() => setMode("login")}
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};