import { AuthSession } from "../../entity/AuthSession";

const KEY = "mock-session";

class MockSessionStore {
    get(): AuthSession | null {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    }

    set(session: AuthSession) {
        localStorage.setItem(KEY, JSON.stringify(session));
    }

    clear() {
        localStorage.removeItem(KEY);
    }
}

export const mockSessionStore = new MockSessionStore();
