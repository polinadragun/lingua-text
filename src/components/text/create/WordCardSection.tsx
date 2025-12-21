import { useState } from "react";
import { useCreateTextStore } from "../../../store/CreateTextStore";

export const WordCardsSection = () => {
    const addWord = useCreateTextStore(s => s.addWord);
    const removeWord = useCreateTextStore(s => s.removeWord);
    const words = useCreateTextStore(s => s.draft.words);

    const [form, setForm] = useState({
        word: "",
        translation: "",
        transcription: "",
        example: "",
    });

    const onAdd = () => {
        if (!form.word || !form.translation) return;

        addWord({
            word: form.word.trim(),
            translation: form.translation.trim(),
            transcription: form.transcription.trim() || undefined,
            example: form.example.trim() || undefined,
        });

        setForm({
            word: "",
            translation: "",
            transcription: "",
            example: "",
        });
    };

    return (
        <section className="create-section">
            <h2>Word cards</h2>

            <div className="word-editor">
                <input
                    placeholder="Word"
                    value={form.word}
                    onChange={e => setForm({ ...form, word: e.target.value })}
                />
                <input
                    placeholder="Translation"
                    value={form.translation}
                    onChange={e =>
                        setForm({ ...form, translation: e.target.value })
                    }
                />
                <input
                    placeholder="Transcription"
                    value={form.transcription}
                    onChange={e =>
                        setForm({ ...form, transcription: e.target.value })
                    }
                />
                <input
                    placeholder="Example"
                    value={form.example}
                    onChange={e =>
                        setForm({ ...form, example: e.target.value })
                    }
                />

                <button
                    type="button"
                    className="secondary"
                    onClick={onAdd}
                    disabled={!form.word || !form.translation}
                >
                    Add word
                </button>
            </div>

            {words.length > 0 && (
                <div className="word-preview">
                    {words.map(w => (
                        <div key={w.word} className="word-card-preview">
                            <div className="word-main">
                                <strong>{w.word}</strong>
                                <span>{w.translation}</span>
                            </div>

                            {w.transcription && (
                                <div className="word-meta">
                                    {w.transcription}
                                </div>
                            )}

                            {w.example && (
                                <div className="word-example">
                                    {w.example}
                                </div>
                            )}

                            <button
                                className="remove"
                                onClick={() => removeWord(w.word)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};