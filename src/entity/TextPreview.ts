import { Level, Topic, Length, Lang } from "./TextEnums";

export interface TextPreview {
    id: string;
    /** URL segment for /text/:id (backend slug) */
    slug: string;
    title: string;
    level: Level;
    topic: Topic;
    length: Length;
    language: Lang;
    author?: string;
}
