import { fetchWithAuthRetry } from "../../api/fetchWithAuth";
import { UserProgress } from "../../entity/UserProgress";
import { LearnedWordItem, ProfileService } from "./ProfileService";

const jsonFetch = (path: string, init?: RequestInit) =>
    fetchWithAuthRetry(path, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

export class ProfileServiceApiImpl implements ProfileService {
    private readSummary = (data: {
        level: string;
        textsRead: string[];
        learnedWords: number;
        favorites: string[];
    }): UserProgress => ({
        level: data.level,
        textsRead: data.textsRead ?? [],
        learnedWords: data.learnedWords ?? 0,
        favorites: data.favorites ?? [],
    });

    async getProgress(): Promise<UserProgress> {
        const res = await jsonFetch("/profile");
        if (!res.ok) {
            const t = await res.text();
            throw new Error(t || `Profile load failed (${res.status})`);
        }

        const data = (await res.json()) as {
            level: string;
            textsRead: string[];
            learnedWords: number;
            favorites: string[];
        };

        return this.readSummary(data);
    }

    async updateProfile(
        data: Partial<Pick<UserProgress, "level">>
    ): Promise<UserProgress> {
        if (!data.level) throw new Error("level is required");

        const res = await jsonFetch("/profile/level", {
            method: "PATCH",
            body: JSON.stringify({
                level: data.level,
            }),
        });

        if (!res.ok) {
            const t = await res.text();
            throw new Error(t || `Update failed (${res.status})`);
        }

        const updated = (await res.json()) as {
            level: string;
            textsRead: string[];
            learnedWords: number;
            favorites: string[];
        };

        return this.readSummary(updated);
    }

    async toggleFavorite(slug: string): Promise<UserProgress> {
        const res = await jsonFetch("/profile/favorites", {
            method: "PATCH",
            body: JSON.stringify({ slug }),
        });

        if (!res.ok) {
            const t = await res.text();
            throw new Error(t || `Favorite toggle failed (${res.status})`);
        }

        const data = (await res.json()) as {
            level: string;
            textsRead: string[];
            learnedWords: number;
            favorites: string[];
        };

        return this.readSummary(data);
    }

    async toggleTextRead(slug: string): Promise<UserProgress> {
        const res = await jsonFetch("/profile/texts-read", {
            method: "PATCH",
            body: JSON.stringify({ slug }),
        });
        if (!res.ok) throw new Error((await res.text()) || "Toggle text read failed");
        return this.readSummary(await res.json());
    }

    async toggleLearnedWord(slug: string, key: string): Promise<UserProgress> {
        const res = await jsonFetch("/profile/learned-words", {
            method: "PATCH",
            body: JSON.stringify({ slug, key }),
        });
        if (!res.ok) throw new Error((await res.text()) || "Toggle learned word failed");
        return this.readSummary(await res.json());
    }

    async getLearnedWords(): Promise<LearnedWordItem[]> {
        const res = await jsonFetch("/profile/learned-words");
        if (!res.ok) throw new Error((await res.text()) || "Load learned words failed");
        return (await res.json()) as LearnedWordItem[];
    }

    async getLearnedWordKeys(slug: string): Promise<string[]> {
        const q = new URLSearchParams({ slug });
        const res = await jsonFetch(`/profile/learned-word-keys?${q.toString()}`);
        if (!res.ok) throw new Error((await res.text()) || "Load learned keys failed");
        return (await res.json()) as string[];
    }
}
