import { API_BASE_URL } from "../../config";
import { AuthCredentials } from "../../entity/AuthCredentials";
import { AuthSession } from "../../entity/AuthSession";
import { AuthService } from "./AuthService";
import { mockSessionStore } from "../mock/MockSessionStore";

function mapUser(data: {
    id?: string;
    email?: string;
    level?: string;
}): AuthSession["user"] {
    return {
        email: String(data?.email ?? ""),
        level: String(data?.level ?? "A1"),
    };
}

function mapSession(data: { user?: Record<string, unknown> }): AuthSession {
    return {
        user: mapUser((data?.user ?? {}) as { email?: string; level?: string }),
        token: null,
    };
}

async function parseError(res: Response, fallback: string): Promise<string> {
    const text = await res.text();
    return text || fallback;
}

const defaultFetch: RequestInit = {
    credentials: "include",
};

export class AuthServiceApiImpl implements AuthService {
    async login(credentials: AuthCredentials): Promise<AuthSession> {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            ...defaultFetch,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: credentials.email.trim().toLowerCase(),
                password: credentials.password,
            }),
        });

        if (!res.ok) {
            throw new Error(await parseError(res, `Login failed (${res.status})`));
        }

        const session = mapSession(await res.json());
        mockSessionStore.set(session);
        return session;
    }

    async register(credentials: AuthCredentials): Promise<AuthSession> {
        const res = await fetch(`${API_BASE_URL}/auth/register`, {
            ...defaultFetch,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: credentials.email.trim().toLowerCase(),
                password: credentials.password,
            }),
        });

        if (!res.ok) {
            throw new Error(await parseError(res, `Register failed (${res.status})`));
        }

        const session = mapSession(await res.json());
        mockSessionStore.set(session);
        return session;
    }

    async logout(): Promise<void> {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            ...defaultFetch,
            method: "POST",
        }).catch(() => undefined);
        mockSessionStore.clear();
    }

    async getSession(): Promise<AuthSession | null> {
        let res = await fetch(`${API_BASE_URL}/auth/session`, {
            ...defaultFetch,
            cache: "no-store",
        });

        if (res.status === 401) {
            const refreshed = await fetch(`${API_BASE_URL}/auth/refresh`, {
                ...defaultFetch,
                method: "POST",
            });
            if (!refreshed.ok) {
                mockSessionStore.clear();
                return null;
            }
            res = await fetch(`${API_BASE_URL}/auth/session`, {
                ...defaultFetch,
                cache: "no-store",
            });
        }

        if (!res.ok) {
            mockSessionStore.clear();
            return null;
        }

        const session = mapSession(await res.json());
        mockSessionStore.set(session);
        return session;
    }
}
