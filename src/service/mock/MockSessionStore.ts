import { AuthSession } from "../../entity/AuthSession";

/**
 * In-memory session mirror for UI / author email in API helpers.
 * Auth tokens live in httpOnly cookies, not here.
 */
class MockSessionStore {
    private session: AuthSession | null = null;

    get(): AuthSession | null {
        return this.session;
    }

    set(session: AuthSession) {
        this.session = session;
    }

    clear() {
        this.session = null;
    }
}

export const mockSessionStore = new MockSessionStore();
