import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthCredentials } from "../entity/AuthCredentials";
import { User } from "../entity/User";
import { ServiceRegistry } from "../service/ServiceRegistry";

interface AuthState {
    isAuth: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;

    login: (credentials: AuthCredentials) => Promise<boolean>;
    register: (credentials: AuthCredentials) => Promise<boolean>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuth: false,
            user: null,
            token: null,
            loading: false,

            login: async (credentials) => {
                set({ loading: true });

                try {
                    const session =
                        await ServiceRegistry.authService.login(credentials);

                    set({
                        isAuth: true,
                        user: session.user,
                        token: session.token,
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
                        token: session.token,
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
                    token: null,
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
                        token: session.token,
                        loading: false,
                    });
                } else {
                    set({
                        isAuth: false,
                        user: null,
                        token: null,
                        loading: false,
                    });
                }
            },
        }),
        {
            name: "auth-store",
            partialize: (state) => ({
                isAuth: state.isAuth,
                user: state.user,
                token: state.token,
            }),
        }
    )
);
