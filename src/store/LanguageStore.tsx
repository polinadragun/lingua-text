import { create } from "zustand";
import { Lang } from "../entity/TextEnums";

interface LanguageState {
    lang: Lang;
    setLang: (l: Lang) => void;
}

export const useLanguageStore = create<LanguageState>(set => ({
    lang: "en",
    setLang: (l) => set({ lang: l }),
}));
