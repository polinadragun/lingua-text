import { AudioUpload } from "../../ui/AudioUpload";
import {useCreateTextStore} from "../../../store/CreateTextStore";

export const AudioSection = () => {
    const sentences = useCreateTextStore(s => s.draft.sentences);
    const setAudioFile = useCreateTextStore(s => s.setAudioFile);
    const updateTiming = useCreateTextStore(s => s.updateSentenceTiming);
    const autoGenerate = useCreateTextStore(s => s.autoGenerateTimings);

    return (
        <section className="create-section">
            <h2>Audio</h2>

            <AudioUpload onSelect={setAudioFile} />

            <div className="timing-list">
                {sentences.map((s, i) => (
                    <div key={s.id} className="timing-row">
                        <span>Sentence {i + 1}</span>

                        <input
                            type="number"
                            step="0.1"
                            placeholder="start"
                            value={s.start ?? ""}
                            onChange={e =>
                                updateTiming(s.id, {
                                    start: Number(e.target.value),
                                })
                            }
                        />

                        <input
                            type="number"
                            step="0.1"
                            placeholder="end"
                            value={s.end ?? ""}
                            onChange={e =>
                                updateTiming(s.id, {
                                    end: Number(e.target.value),
                                })
                            }
                        />
                    </div>
                ))}
            </div>

            {sentences.length > 0 && (
                <button
                    type="button"
                    className="secondary"
                    onClick={autoGenerate}
                >
                    Auto-generate timings
                </button>
            )}
        </section>
    );
};