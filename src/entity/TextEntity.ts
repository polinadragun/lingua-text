import { Level, Topic, Lang} from "./TextEnums";

export interface Sentence {
    id: string;
    text: string;
    start: number;
    end: number;
}

export interface WordCard {
    word: string;
    translation: string;
    transcription?: string;
    example?: string;
}

export interface TextEntity {
    id: string;
    title: string;
    level: Level;
    topic: Topic;
    language: Lang;
    author: string;

    sentences: Sentence[];
    words: WordCard[];
}
