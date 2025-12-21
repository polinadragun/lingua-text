import { TextEntity } from "../../entity/TextEntity";
import { Lang } from "../../entity/TextEnums";

class MockTextStore {
    private texts: TextEntity[] = [];

    add(text: TextEntity) {
        this.texts.push(text);
    }

    getAll() {
        return this.texts;
    }

    getByLanguage(lang: Lang) {
        return this.texts.filter(t => t.language === lang);
    }

    getByAuthor(email: string) {
        return this.texts.filter(t => t.author === email);
    }
}

export const mockTextStore = new MockTextStore();
