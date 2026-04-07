import { TextDraft } from "../../entity/TextDraft";

export interface CreateTextService {
    saveDraft(draft: TextDraft): Promise<string>;
}