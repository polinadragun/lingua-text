export interface Sentence {
    id: string;
    text: string;
    start: number;
    end: number;
}

export interface WordInfo {
    word: string;
    translation: string;
    transcription: string;
    example: string;
}
