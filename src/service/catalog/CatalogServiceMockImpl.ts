import { CatalogService } from "./CatalogService";
import { TextPreview } from "../../entity/TextPreview";
import { mockTextStore } from "../mock/MockTextStore";
import { Length } from "../../entity/TextEnums";

export class CatalogServiceMockImpl implements CatalogService {
    async getAll(): Promise<TextPreview[]> {
        await new Promise(r => setTimeout(r, 300));

        return mockTextStore.getAll().map(t => ({
            id: t.id,
            title: t.title,
            level: t.level,
            topic: t.topic,
            language: t.language,
            author: t.author,
            length: t.sentences.length > 6
                ? "Medium"
                : "Short",
        }));
    }
}
