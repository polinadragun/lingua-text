import { create } from "zustand";
import { UserProgress } from "../entity/UserProgress";
import { ServiceRegistry } from "../service/ServiceRegistry";

interface ProfileState {
    progress: UserProgress | null;
    loading: boolean;
    editing: boolean;

    loadProfile: () => Promise<void>;
    updateLevel: (level: string) => Promise<void>;
    toggleFavorite: (slug: string) => Promise<void>;
    toggleTextRead: (slug: string) => Promise<void>;
    toggleLearnedWord: (slug: string, key: string) => Promise<void>;
    toggleEdit: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    progress: null,
    loading: false,
    editing: false,

    loadProfile: async () => {
        set({ loading: true });

        try {
            const data = await ServiceRegistry.profileService.getProgress();
            set({
                progress: data,
                loading: false,
            });
        } catch {
            set({
                progress: null,
                loading: false,
            });
        }
    },

    updateLevel: async (level) => {
        set({ loading: true });

        const updated = await ServiceRegistry.profileService.updateProfile({
            level,
        });

        set({
            progress: updated,
            loading: false,
            editing: false,
        });
    },

    toggleFavorite: async (slug) => {
        const updated = await ServiceRegistry.profileService.toggleFavorite(slug);
        set({ progress: updated });
    },

    toggleTextRead: async (slug) => {
        const updated = await ServiceRegistry.profileService.toggleTextRead(slug);
        set({ progress: updated });
    },

    toggleLearnedWord: async (slug, key) => {
        const updated = await ServiceRegistry.profileService.toggleLearnedWord(slug, key);
        set({ progress: updated });
    },

    toggleEdit: () =>
        set(state => ({ editing: !state.editing })),
}));