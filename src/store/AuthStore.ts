import { create } from "zustand";
import { AuthCredentials } from "../entity/AuthCredentials";
import { User } from "../entity/User";
import { ServiceRegistry } from "../service/ServiceRegistry";

interface AuthState {
    isAuth: boolean;
    user: User | null;
    loading: boolean;

    login: (credentials: AuthCredentials) => Promise<boolean>;
    register: (credentials: AuthCredentials) => Promise<boolean>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
    isAuth: false,
    user: null,
    /** Start true so the app waits for restoreSession before rendering protected routes / profile. */
    loading: true,

    login: async (credentials) => {
        set({ loading: true });

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
            set({ loading: false });
            return false;
        }
    },

    register: async (credentials) => {
        set({ loading: true });

        try {
            const session =
                await ServiceRegistry.authService.register(credentials);

            set({
                isAuth: true,
                user: session.user,
                loading: false,
            });

            return true;
        } catch {
            set({ loading: false });
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
            });
        } else {
            set({
                isAuth: false,
                user: null,
                loading: false,
            });
        }
    },
}));
