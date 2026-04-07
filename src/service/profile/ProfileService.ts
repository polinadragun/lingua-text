import { UserProgress } from "../../entity/UserProgress";

export type LearnedWordItem = {
    textSlug: string;
    key: string;
    word: string;
    translation: string;
    transcription: string;
    example: string;
};

export interface ProfileService {
    getProgress(): Promise<UserProgress>;
    updateProfile(data: Partial<Pick<UserProgress, "level">>): Promise<UserProgress>;
    toggleFavorite(slug: string): Promise<UserProgress>;
    toggleTextRead(slug: string): Promise<UserProgress>;
    toggleLearnedWord(slug: string, key: string): Promise<UserProgress>;
    getLearnedWords(): Promise<LearnedWordItem[]>;
    getLearnedWordKeys(slug: string): Promise<string[]>;
}