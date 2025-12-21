import { Level, Topic, Length, Lang } from "./TextEnums";

export interface TextPreview {
    id: string;
    title: string;
    level: Level;
    topic: Topic;
    length: Length;
    language: Lang;
    author?: string;
}
