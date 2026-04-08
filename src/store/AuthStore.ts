import { create } from "zustand";
import { AuthCredentials } from "../entity/AuthCredentials";
import { User } from "../entity/User";
import { ServiceRegistry } from "../service/ServiceRegistry";

interface AuthState {
    isAuth: boolean;
    user: User | null;
    loading: boolean;
    authError: string | null;

    login: (credentials: AuthCredentials) => Promise<boolean>;
    register: (credentials: AuthCredentials) => Promise<boolean>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
    clearAuthError: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
    isAuth: false,
    user: null,
    /** Start true so the app waits for restoreSession before rendering protected routes / profile. */
    loading: true,
    authError: null,

    login: async (credentials) => {
        set({ loading: true, authError: null });

        try {
            const session =
                await ServiceRegistry.authService.login(credentials);

            set({
                isAuth: true,
                user: session.user,
                loading: false,
            });

            return true;
        } catch (e) {
            const message = e instanceof Error ? e.message : "Authentication failed";
            set({ loading: false, authError: message });
            return false;
        }
    },

    register: async (credentials) => {
        set({ loading: true, authError: null });

        try {
            const session =
                await ServiceRegistry.authService.register(credentials);

            set({
                isAuth: true,
                user: session.user,
                loading: false,
            });

            return true;
        } catch (e) {
            const message = e instanceof Error ? e.message : "Registration failed";
            set({ loading: false, authError: message });
            return false;
        }
    },

    logout: async () => {
        await ServiceRegistry.authService.logout();

        set({
            isAuth: false,
            user: null,
        });
    },

    restoreSession: async () => {
        set({ loading: true });

        const session =
            await ServiceRegistry.authService.getSession();

        if (session) {
            set({
                isAuth: true,
                user: session.user,
                loading: false,
                authError: null,
            });
        } else {
            set({
                isAuth: false,
                user: null,
                loading: false,
                authError: null,
            });
        }
    },

    clearAuthError: () => {
        set({ authError: null });
    },
}));
