import { LearnedWordItem, ProfileService } from "./ProfileService";
import { UserProgress } from "../../entity/UserProgress";
import { mockSessionStore } from "../mock/MockSessionStore";

let mockProgress: UserProgress = {
    level: "B2",
    textsRead: ["1", "3"],
    learnedWords: 124,
    favorites: ["1", "2"],
};
const learned: LearnedWordItem[] = [];

export class ProfileServiceMockImpl implements ProfileService {

    async getProgress(): Promise<UserProgress> {
        const session = mockSessionStore.get();
        if (!session) throw new Error("Not authenticated");

        return {
            ...mockProgress,
            level: session.user.level,
        };
    }

    async updateProfile(
        data: Partial<Pick<UserProgress, "level">>
    ): Promise<UserProgress> {

        const session = mockSessionStore.get();
        if (!session) throw new Error("Not authenticated");

        if (data.level) {
            session.user.level = data.level;
            mockProgress.level = data.level;
        }

        return mockProgress;
    }

    async toggleFavorite(slug: string): Promise<UserProgress> {
        const session = mockSessionStore.get();
        if (!session) throw new Error("Not authenticated");

        const set = new Set(mockProgress.favorites);
        if (set.has(slug)) {
            set.delete(slug);
        } else {
            set.add(slug);
        }
        mockProgress = {
            ...mockProgress,
            favorites: Array.from(set),
        };
        return mockProgress;
    }

    async toggleTextRead(slug: string): Promise<UserProgress> {
        const set = new Set(mockProgress.textsRead);
        if (set.has(slug)) set.delete(slug);
        else set.add(slug);
        mockProgress = { ...mockProgress, textsRead: Array.from(set) };
        return mockProgress;
    }

    async toggleLearnedWord(slug: string, key: string): Promise<UserProgress> {
        const idx = learned.findIndex((w) => w.textSlug === slug && w.key === key);
        if (idx >= 0) learned.splice(idx, 1);
        else {
            learned.push({
                textSlug: slug,
                key,
                word: key,
                translation: "",
                transcription: "",
                example: "",
            });
        }
        mockProgress = { ...mockProgress, learnedWords: learned.length };
        return mockProgress;
    }

    async getLearnedWords(): Promise<LearnedWordItem[]> {
        return learned;
    }

    async getLearnedWordKeys(slug: string): Promise<string[]> {
        return learned.filter((w) => w.textSlug === slug).map((w) => w.key);
    }
}