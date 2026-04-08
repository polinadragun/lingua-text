import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import {AuthCredentials} from "../entity/AuthCredentials";

export const AuthPage = () => {
    const MIN_PASSWORD_LENGTH = 8;
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    const navigate = useNavigate();

    const login = useAuthStore(state => state.login);
    const register = useAuthStore(state => state.register);
    const loading = useAuthStore(state => state.loading);
    const authError = useAuthStore(state => state.authError);
    const clearAuthError = useAuthStore(state => state.clearAuthError);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        clearAuthError();

        if (mode === "register" && password.length < MIN_PASSWORD_LENGTH) {
            setFormError(`Password must contain at least ${MIN_PASSWORD_LENGTH} characters`);
            return;
        }

        if (mode === "register" && password !== confirmPassword) {
            setFormError("Passwords do not match");
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
                        onChange={e => {
                            setEmail(e.target.value);
                            if (formError) {
                                setFormError(null);
                            }
                            if (authError) {
                                clearAuthError();
                            }
                        }}
                        required
                    />

                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                            if (formError) {
                                setFormError(null);
                            }
                            if (authError) {
                                clearAuthError();
                            }
                        }}
                        required
                    />

                    {mode === "register" && (
                        <>
                            <p className="auth-password-rules">
                                Password rules: at least {MIN_PASSWORD_LENGTH} characters.
                            </p>
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={e => {
                                    setConfirmPassword(e.target.value);
                                    if (formError) {
                                        setFormError(null);
                                    }
                                    if (authError) {
                                        clearAuthError();
                                    }
                                }}
                                required
                            />
                        </>
                    )}

                    {(formError || authError) && (
                        <div className="auth-error" role="alert">
                            {formError ?? authError}
                        </div>
                    )}

                    <button className="auth-button" type="submit" disabled={loading}>
                        {mode === "login" ? "Sign in" : "Sign up"}
                    </button>
                </form>

                <div className="auth-switch">
                    {mode === "login" ? (
                        <>
                            Don’t have an account?
                            <button
                                type="button"
                                onClick={() => {
                                    setMode("register");
                                    setFormError(null);
                                    clearAuthError();
                                }}
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?
                            <button
                                type="button"
                                onClick={() => {
                                    setMode("login");
                                    setFormError(null);
                                    clearAuthError();
                                }}
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