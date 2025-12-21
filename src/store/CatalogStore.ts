import { create } from "zustand";
import { TextPreview } from "../entity/TextPreview";
import { mockTextStore } from "../service/mock/MockTextStore";
import { texts as demoTexts } from "../data/catalog";
import { useLanguageStore } from "./LanguageStore";

export const useCatalogStore = create<{
    texts: TextPreview[];
    loading: boolean;
    load: () => void;
}>((set) => ({
    texts: [],
    loading: false,

    load: () => {
        set({ loading: true });

        const lang = useLanguageStore.getState().lang;

        const created: TextPreview[] = mockTextStore
            .getByLanguage(lang)
            .map(t => ({
                id: t.id,
                title: t.title,
                level: t.level,
                topic: t.topic,
                language: t.language,
                author: t.author,
                length: t.sentences.length > 6 ? "Medium" : "Short",
            }));

        const demo = demoTexts.filter(t => t.language === lang);

        set({
            texts: [...demo, ...created],
            loading: false,
        });
    },
}));
