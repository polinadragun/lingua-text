import { API_BASE_URL } from "../../config";
import { TextDraft } from "../../entity/TextDraft";
import { CreateTextService } from "./CreateTextService";
import { mockSessionStore } from "../mock/MockSessionStore";

function mapTopic(topic: string): string {
    const m: Record<string, string> = {
        Society: "society",
        Travel: "travel",
        Technology: "technology",
        Culture: "culture",
        General: "general",
    };
    return m[topic] ?? topic.toLowerCase();
}

function wordKey(w: string): string {
    return w.replace(/[.,!?]/g, "").toLowerCase() || "word";
}

export class CreateTextServiceApiImpl implements CreateTextService {
    async saveDraft(draft: TextDraft): Promise<string> {
        const session = mockSessionStore.get();
        if (!session) throw new Error("Not authenticated");

        const sentences = draft.sentences.map((s, i) => {
            const start = s.start ?? i * 15;
            const end = s.end != null && s.end > start ? s.end : start + 10;
            return {
                orderIndex: i + 1,
                text: s.text,
                start,
                end,
            };
        });

        const res = await fetch(`${API_BASE_URL}/texts`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: draft.title.trim(),
                description: "",
                level: draft.level,
                topic: mapTopic(draft.topic),
                sentences,
                words: draft.words.map((w) => ({
                    key: wordKey(w.word),
                    word: w.word,
                    translation: w.translation,
                    transcription: w.transcription || "—",
                    example: w.example || "—",
                })),
                questions: [],
            }),
        });

        if (!res.ok) {
            const t = await res.text();
            throw new Error(t || `Save failed (${res.status})`);
        }

        const data = (await res.json()) as { slug: string };
        if (!data.slug) throw new Error("Invalid response: missing slug");

        if (draft.audioFile) {
            const fd = new FormData();
            fd.append("file", draft.audioFile);

            const audioRes = await fetch(
                `${API_BASE_URL}/texts/${encodeURIComponent(data.slug)}/audio`,
                {
                    method: "POST",
                    credentials: "include",
                    body: fd,
                }
            );

            if (!audioRes.ok) {
                const t = await audioRes.text();
                throw new Error(
                    t ||
                        `Audio upload failed (${audioRes.status}). Text was saved as "${data.slug}".`
                );
            }
        }

        return data.slug;
    }
}
