import { useCreateTextStore } from "../../../store/CreateTextStore";
import { Level, Topic } from "../../../entity/TextEnums";

export const TextMetaSection = () => {
    const title = useCreateTextStore(s => s.draft.title);
    const level = useCreateTextStore(s => s.draft.level);
    const topic = useCreateTextStore(s => s.draft.topic);
    const setMeta = useCreateTextStore(s => s.setMeta);

    return (
        <section className="create-section">
            <h2>Text info</h2>

            <input
                placeholder="Title"
                value={title}
                onChange={e =>
                    setMeta({ title: e.target.value })
                }
            />

            <div className="row">
                <select
                    value={level}
                    onChange={e =>
                        setMeta({ level: e.target.value as Level })
                    }
                >
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                </select>

                <select
                    value={topic}
                    onChange={e =>
                        setMeta({ topic: e.target.value as Topic })
                    }
                >
                    <option value="Technology">Technology</option>
                    <option value="Society">Society</option>
                    <option value="Culture">Culture</option>
                </select>
            </div>
        </section>
    );
};