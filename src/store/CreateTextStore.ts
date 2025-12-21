import { create } from "zustand";
import { SentenceDraft, TextDraft, WordCardDraft } from "../entity/TextDraft";
import { ServiceRegistry } from "../service/ServiceRegistry";

interface CreateTextState {
    draft: TextDraft;
    rawText: string;
    isSplit: boolean;

    saving: boolean;
    saveError: string | null;

    setRawText: (text: string) => void;
    splitIntoSentences: () => void;
    updateSentenceText: (id: string, text: string) => void;
    updateSentenceTiming: (
        id: string,
        timing: { start?: number; end?: number }
    ) => void;

    setMeta: (data: Partial<TextDraft>) => void;

    setAudioFile: (file: File | null) => void;
    autoGenerateTimings: () => void;

    addWord: (word: WordCardDraft) => void;
    removeWord: (word: string) => void;

    validateForSave: () => string | null;
    clearSaveError: () => void;
    save: () => Promise<boolean>;
    reset: () => void;
}

export const useCreateTextStore = create<CreateTextState>((set, get) => ({
    draft: {
        title: "",
        level: "B2",
        topic: "General",
        sentences: [],
        audioFile: null,
        words: [],
    },

    rawText: "",
    isSplit: false,

    saving: false,
    saveError: null,


    setRawText: (text) => set({ rawText: text }),

    splitIntoSentences: () =>
        set(state => {
            const raw = state.rawText.trim();
            if (!raw) return state;

            const parts = raw
                .replace(/\s+/g, " ")
                .split(/(?<=[.!?])\s+/)
                .filter(Boolean);

            return {
                isSplit: true,
                draft: {
                    ...state.draft,
                    sentences: parts.map((text, i) => ({
                        id: `s-${i + 1}`,
                        text,
                    })),
                },
            };
        }),

    updateSentenceText: (id, text) =>
        set(state => ({
            draft: {
                ...state.draft,
                sentences: state.draft.sentences.map(s =>
                    s.id === id ? { ...s, text } : s
                ),
            },
        })),

    updateSentenceTiming: (id, timing) =>
        set(state => ({
            draft: {
                ...state.draft,
                sentences: state.draft.sentences.map(s =>
                    s.id === id ? { ...s, ...timing } : s
                ),
            },
        })),


    setMeta: (data) =>
        set(state => ({
            draft: { ...state.draft, ...data },
        })),


    setAudioFile: (file) =>
        set(state => ({
            draft: { ...state.draft, audioFile: file },
        })),

    autoGenerateTimings: () =>
        set(state => {
            const sentences = state.draft.sentences;
            if (!sentences.length) return state;

            const total = 90;
            const step = total / sentences.length;

            return {
                draft: {
                    ...state.draft,
                    sentences: sentences.map((s, i) => ({
                        ...s,
                        start: +(i * step).toFixed(2),
                        end: +((i + 1) * step).toFixed(2),
                    })),
                },
            };
        }),


    addWord: (word) =>
        set(state => {
            if (state.draft.words.some(w => w.word === word.word)) {
                return state;
            }
            return {
                draft: {
                    ...state.draft,
                    words: [...state.draft.words, word],
                },
            };
        }),

    removeWord: (word) =>
        set(state => ({
            draft: {
                ...state.draft,
                words: state.draft.words.filter(w => w.word !== word),
            },
        })),


    validateForSave: () => {
        const { draft, isSplit } = get();

        if (!draft.title.trim()) return "Please enter a title";
        if (!isSplit) return "Split the text into sentences";
        if (!draft.sentences.length) return "No sentences found";
        if (!draft.audioFile) return "Upload an audio file";

        const badTiming = draft.sentences.find(
            s => s.start == null || s.end == null || s.end <= s.start
        );
        if (badTiming) return "Fill valid timings for all sentences";

        return null;
    },

    clearSaveError: () => set({ saveError: null }),

    save: async () => {
        const error = get().validateForSave();
        set({ saveError: error });

        if (error) return false;

        set({ saving: true });

        await ServiceRegistry.createTextService.saveDraft(get().draft);

        set({ saving: false });
        get().reset();

        return true;
    },

    reset: () =>
        set({
            rawText: "",
            isSplit: false,
            saving: false,
            saveError: null,
            draft: {
                title: "",
                level: "B2",
                topic: "General",
                sentences: [],
                audioFile: null,
                words: [],
            },
        }),
}));