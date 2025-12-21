import { useCreateTextStore } from "../../../store/CreateTextStore";

export const TextEditorSection = () => {
    const rawText = useCreateTextStore(s => s.rawText);
    const setRawText = useCreateTextStore(s => s.setRawText);
    const split = useCreateTextStore(s => s.splitIntoSentences);
    const sentences = useCreateTextStore(s => s.draft.sentences);
    const isSplit = useCreateTextStore(s => s.isSplit);
    const updateSentenceText = useCreateTextStore(s => s.updateSentenceText);

    return (
        <section className="create-section">
            <h2>Text</h2>

            {!isSplit && (
                <>
                    <textarea
                        placeholder="Paste your text here."
                        rows={10}
                        value={rawText}
                        onChange={e => setRawText(e.target.value)}
                    />

                    <button
                        type="button"
                        className="secondary"
                        onClick={split}
                        disabled={!rawText.trim()}
                    >
                        Split into sentences
                    </button>
                </>
            )}

            {isSplit && (
                <div className="sentence-editor-list">
                    {sentences.map((s, i) => (
                        <div key={s.id} className="sentence-editor-row">
                            <span className="sentence-index">
                                {i + 1}
                            </span>

                            <input
                                value={s.text}
                                onChange={e =>
                                    updateSentenceText(s.id, e.target.value)
                                }
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};