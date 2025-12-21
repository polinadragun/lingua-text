import { UserProgress } from "../../entity/UserProgress";

export interface ProfileService {
    getProgress(): Promise<UserProgress>;
    updateProfile(data: Partial<Pick<UserProgress, "level">>): Promise<UserProgress>;
}