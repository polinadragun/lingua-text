import {Level, Topic} from "./TextEnums";

export interface SentenceDraft {
    id: string;
    text: string;
    start?: number;
    end?: number;
}

export interface WordCardDraft {
    word: string;
    translation: string;
    transcription?: string;
    example?: string;
}

export interface TextDraft {
    title: string;
    level: Level;
    topic: Topic;
    sentences: SentenceDraft[];
    audioFile: File | null;
    words: WordCardDraft[];
}