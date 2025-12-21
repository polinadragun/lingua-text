import { AuthService } from "./AuthService";
import { AuthCredentials } from "../../entity/AuthCredentials";
import { AuthSession } from "../../entity/AuthSession";
import { mockSessionStore } from "../mock/MockSessionStore";

export class AuthServiceMockImpl implements AuthService {

    async login({ email }: AuthCredentials): Promise<AuthSession> {
        const session: AuthSession = {
            user: { email, level: "B2" },
            token: "mock-token",
        };

        mockSessionStore.set(session);
        return session;
    }

    async logout() {
        mockSessionStore.clear();
    }


    async register(credentials: AuthCredentials): Promise<AuthSession> {
        return this.login(credentials);
    }

    async getSession(): Promise<AuthSession | null> {
        return mockSessionStore.get();
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}