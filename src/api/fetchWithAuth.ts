import { API_BASE_URL } from "../config";

/**
 * Fetch with credentials; on 401 tries POST /auth/refresh once then retries (access JWT may have expired).
 */
export async function fetchWithAuthRetry(
    path: string,
    init: RequestInit = {}
): Promise<Response> {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

    const merged: RequestInit = {
        credentials: "include",
        cache: "no-store",
        ...init,
    };

    let res = await fetch(url, merged);

    if (res.status === 401) {
        const refresh = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            cache: "no-store",
        });
        if (refresh.ok) {
            res = await fetch(url, merged);
        }
    }

    return res;
}
