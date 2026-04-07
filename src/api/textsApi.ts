import { API_BASE_URL } from "../config";
import type { Sentence, WordInfo } from "../types/text";

export type CatalogTextItem = {
    id: string;
    slug: string;
    title: string;
    description: string;
    level: string;
    topic: string;
    length: string;
    language: string;
    authorEmail?: string | null;
};

export type CatalogResponse = {
    items: Array<{
        id: string;
        slug: string;
        title: string;
        description: string;
        level: string;
        topic: string;
        length: string;
        language: string;
        authorEmail?: string | null;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type TextDetailResponse = {
    id: string;
    slug: string;
    title: string;
    description: string;
    level: string;
    topic: string;
    length: string;
    language: string;
    /** Public HTTPS URL of the audio file (from object storage). Never contains secrets. */
    audioUrl?: string | null;
    authorEmail?: string | null;
    sentences: Array<{
        id: string;
        orderIndex: number;
        text: string;
        start: number;
        end: number;
    }>;
    words: Record<
        string,
        {
            id: string;
            word: string;
            translation: string;
            transcription: string;
            example: string;
        }
    >;
    questions: Array<{
        id: string;
        orderIndex: number;
        question: string;
        answer: string;
    }>;
};

function buildQuery(params: Record<string, string | number | undefined>): string {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v === undefined || v === "") continue;
        search.set(k, String(v));
    }
    const q = search.toString();
    return q ? `?${q}` : "";
}

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        credentials: init?.credentials ?? "include",
        /** Avoid stale GET responses after text/audio updates (browser HTTP cache). */
        cache: init?.cache ?? "no-store",
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(
            `Request failed ${res.status}: ${body || res.statusText}`
        );
    }
    return res.json() as Promise<T>;
}

export async function fetchCatalog(
    params: {
        search?: string;
        level?: string;
        topic?: string;
        length?: string;
        language?: string;
        authorEmail?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    },
    init?: RequestInit
): Promise<CatalogResponse> {
    const q = buildQuery({
        search: params.search,
        level: params.level,
        topic: params.topic,
        length: params.length,
        language: params.language,
        authorEmail: params.authorEmail,
        page: params.page,
        limit: params.limit,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
    });
    return apiJson<CatalogResponse>(`/texts${q}`, init);
}

function pickAudioUrl(raw: Record<string, unknown>): string | null {
    const v = raw.audioUrl ?? raw.audio_url;
    if (v == null || v === "") return null;
    return String(v);
}

export async function fetchTextBySlug(slug: string): Promise<TextDetailResponse> {
    const encoded = encodeURIComponent(slug);
    const raw = (await apiJson<Record<string, unknown>>(
        `/texts/${encoded}`
    )) as unknown as Record<string, unknown>;
    const audioUrl = pickAudioUrl(raw);
    if (process.env.NODE_ENV === "development" && audioUrl) {
        console.debug("[textsApi] GET /texts/:slug audioUrl:", audioUrl);
    }
    return { ...(raw as TextDetailResponse), audioUrl };
}

export function mapDetailToSentencesAndWords(detail: TextDetailResponse): {
    sentences: Sentence[];
    words: Record<string, WordInfo>;
} {
    const sentences: Sentence[] = detail.sentences.map((s) => ({
        id: s.id,
        text: s.text,
        start: s.start,
        end: s.end,
    }));

    const words: Record<string, WordInfo> = {};
    for (const [key, w] of Object.entries(detail.words)) {
        words[key] = {
            word: w.word,
            translation: w.translation,
            transcription: w.transcription,
            example: w.example,
        };
    }

    return { sentences, words };
}
