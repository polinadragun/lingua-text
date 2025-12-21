import { ProfileService } from "./ProfileService";
import { UserProgress } from "../../entity/UserProgress";
import { mockSessionStore } from "../mock/MockSessionStore";

let mockProgress: UserProgress = {
    level: "B2",
    textsRead: ["1", "3"],
    learnedWords: 124,
    favorites: ["1", "2"],
};

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
}