import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfileStore } from "../store/ProfileStore";
import { ServiceRegistry } from "../service/ServiceRegistry";
import { AudioPlayer } from "../components/text/AudioPlayer";
import { TextContent } from "../components/text/TextContent";
import { QuestionsBlock } from "../components/text/QuestionsBlock";
import {
    fetchTextBySlug,
    mapDetailToSentencesAndWords,
} from "../api/textsApi";
import type { Sentence, WordInfo } from "../types/text";
import { mockTextStore } from "../service/mock/MockTextStore";
import type { TextEntity } from "../entity/TextEntity";

function mapEntityToWords(entity: TextEntity): Record<string, WordInfo> {
    const out: Record<string, WordInfo> = {};
    for (const w of entity.words) {
        const key = w.word.replace(/[.,]/g, "").toLowerCase();
        out[key] = {
            word: w.word,
            translation: w.translation,
            transcription: w.transcription || "",
            example: w.example || "",
        };
    }
    return out;
}

function mapEntityToSentences(entity: TextEntity): Sentence[] {
    return entity.sentences.map((s) => ({
        id: s.id,
        text: s.text,
        start: s.start ?? 0,
        end: s.end ?? 1,
    }));
}

export const TextPage = () => {
    const { id: slug } = useParams();
    const progress = useProfileStore((s) => s.progress);
    const loadProfile = useProfileStore((s) => s.loadProfile);
    const toggleFavorite = useProfileStore((s) => s.toggleFavorite);
    const toggleTextRead = useProfileStore((s) => s.toggleTextRead);
    const toggleLearnedWord = useProfileStore((s) => s.toggleLearnedWord);
    const [favBusy, setFavBusy] = useState(false);
    const [completeBusy, setCompleteBusy] = useState(false);
    const [wordLoadingKey, setWordLoadingKey] = useState<string | null>(null);
    const [learnedKeys, setLearnedKeys] = useState<Set<string>>(new Set());
    const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [sentences, setSentences] = useState<Sentence[]>([]);
    const [words, setWords] = useState<Record<string, WordInfo>>({});
    const [questionItems, setQuestionItems] = useState<{ q: string; a: string }[]>([]);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    useEffect(() => {
        if (!slug) {
            setError("Missing text");
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);
        setAudioUrl(null);

        fetchTextBySlug(slug)
            .then((detail) => {
                if (cancelled) return;
                setTitle(detail.title);
                setAudioUrl(detail.audioUrl ?? null);
                const mapped = mapDetailToSentencesAndWords(detail);
                setSentences(mapped.sentences);
                setWords(mapped.words);
                setQuestionItems(
                    [...detail.questions]
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((q) => ({ q: q.question, a: q.answer }))
                );
            })
            .catch(() => {
                if (cancelled) return;
                const local = mockTextStore.getAll().find((t) => t.id === slug);
                if (local) {
                    setTitle(local.title);
                    setAudioUrl(null);
                    setSentences(mapEntityToSentences(local));
                    setWords(mapEntityToWords(local));
                    setQuestionItems([]);
                    setError(null);
                } else {
                    setError("Text not found");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [slug]);

    useEffect(() => {
        if (!slug) return;
        let cancelled = false;
        ServiceRegistry.profileService
            .getLearnedWordKeys(slug)
            .then((keys) => {
                if (!cancelled) setLearnedKeys(new Set(keys));
            })
            .catch(() => {
                if (!cancelled) setLearnedKeys(new Set());
            });
        return () => {
            cancelled = true;
        };
    }, [slug, progress?.learnedWords]);

    const isFavorite = Boolean(
        slug && progress?.favorites?.some((s) => s === slug)
    );

    const handleFavourite = async () => {
        if (!slug) return;
        setFavBusy(true);
        try {
            await toggleFavorite(slug);
        } finally {
            setFavBusy(false);
        }
    };

    const handleComplete = async () => {
        if (!slug) return;
        setCompleteBusy(true);
        try {
            await toggleTextRead(slug);
        } finally {
            setCompleteBusy(false);
        }
    };

    const handleToggleWord = async (key: string) => {
        if (!slug) return;
        setWordLoadingKey(key);
        try {
            await toggleLearnedWord(slug, key);
            setLearnedKeys((prev) => {
                const next = new Set(prev);
                if (next.has(key)) next.delete(key);
                else next.add(key);
                return next;
            });
        } finally {
            setWordLoadingKey(null);
        }
    };

    const isCompleted = Boolean(slug && progress?.textsRead?.includes(slug));

    return (
        <div className="page">
            <div className="glass text-page">
                <h1 className="text-title">{loading ? "…" : title || "Text"}</h1>

                {error && <p role="alert">{error}</p>}

                {!loading && !error && (
                    <>
                        <AudioPlayer
                            sentences={sentences}
                            onSentenceChange={setActiveSentenceId}
                            audioSrc={audioUrl}
                        />

                        <div className="text-container glass">
                            <TextContent
                                sentences={sentences}
                                activeSentenceId={activeSentenceId}
                                words={words}
                                learnedKeys={learnedKeys}
                                onToggleWord={handleToggleWord}
                                wordLoadingKey={wordLoadingKey}
                            />
                        </div>

                        <QuestionsBlock questions={questionItems} />

                        <div className="favourite-btn-wrap">
                            <button
                                type="button"
                                className={`favourite-btn ${
                                    isFavorite ? "favourite-btn--active" : ""
                                }`}
                                onClick={() => void handleFavourite()}
                                disabled={favBusy}
                            >
                                Add to favourites
                            </button>
                            <button
                                type="button"
                                className={`favourite-btn ${
                                    isCompleted ? "complete-btn--active" : ""
                                }`}
                                onClick={() => void handleComplete()}
                                disabled={completeBusy}
                            >
                                Complete
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
