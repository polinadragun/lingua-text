import { CreateTextService } from "./CreateTextService";
import { TextDraft } from "../../entity/TextDraft";
import { mockTextStore } from "../mock/MockTextStore";
import { TextEntity } from "../../entity/TextEntity";
import { mockSessionStore } from "../mock/MockSessionStore";

export class CreateTextServiceMockImpl implements CreateTextService {
    async saveDraft(draft: TextDraft): Promise<void> {
        const session = mockSessionStore.get();
        if (!session) throw new Error("Not authenticated");

        const entity: TextEntity = {
            id: crypto.randomUUID(),
            title: draft.title,
            level: draft.level,
            topic: draft.topic,
            language: "en",
            author: session.user.email,
            sentences: draft.sentences as any,
            words: draft.words,
        };

        mockTextStore.add(entity);
    }
}
