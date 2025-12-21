import { create } from "zustand";
import { UserProgress } from "../entity/UserProgress";
import { ServiceRegistry } from "../service/ServiceRegistry";

interface ProfileState {
    progress: UserProgress | null;
    loading: boolean;
    editing: boolean;

    loadProfile: () => Promise<void>;
    updateLevel: (level: string) => Promise<void>;
    toggleEdit: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    progress: null,
    loading: false,
    editing: false,

    loadProfile: async () => {
        set({ loading: true });

        const data = await ServiceRegistry.profileService.getProgress();

        set({
            progress: data,
            loading: false,
        });
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

    toggleEdit: () =>
        set(state => ({ editing: !state.editing })),
}));