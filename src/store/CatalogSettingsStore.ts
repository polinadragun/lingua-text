import { create } from "zustand";
import { persist } from "zustand/middleware";

type CatalogSettingsState = {
    levelFiltered: boolean;
    setLevelFiltered: (v: boolean) => void;
    toggleLevelFiltered: () => void;
};

export const useCatalogSettingsStore = create<CatalogSettingsState>()(
    persist(
        (set) => ({
            levelFiltered: true,
            setLevelFiltered: (v) => set({ levelFiltered: v }),
            toggleLevelFiltered: () =>
                set((s) => ({ levelFiltered: !s.levelFiltered })),
        }),
        { name: "catalog-settings" }
    )
);

