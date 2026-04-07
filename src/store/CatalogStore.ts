import { create } from "zustand";
import { TextPreview } from "../entity/TextPreview";
import { fetchCatalog } from "../api/textsApi";
import type { Level, Topic, Length } from "../entity/TextEnums";

export const useCatalogStore = create<{
    texts: TextPreview[];
    loading: boolean;
    load: (language?: string) => Promise<void>;
}>((set) => ({
    texts: [],
    loading: false,

    load: async (language) => {
        set({ loading: true });
        try {
            const res = await fetchCatalog({ limit: 500, page: 1, language });
            const texts: TextPreview[] = res.items.map((t) => ({
                id: t.id,
                slug: t.slug,
                title: t.title,
                level: t.level as Level,
                topic: t.topic as Topic,
                length: t.length as Length,
                language: (t.language ?? "en") as TextPreview["language"],
            }));
            set({ texts, loading: false });
        } catch {
            set({ texts: [], loading: false });
        }
    },
}));
