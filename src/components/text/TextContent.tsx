import { useRef, useState } from "react";
import { Sentence, WordInfo } from "../../types/text";
import { WordPopover } from "./WordPopover";

interface Props {
    sentences: Sentence[];
    activeSentenceId: string | null;
    words: Record<string, WordInfo>;
}

export const TextContent = ({
                                sentences,
                                activeSentenceId,
                                words
                            }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [selected, setSelected] = useState<{
        word: WordInfo;
        pos: { top: number; left: number };
    } | null>(null);

    return (
        <div
            ref={containerRef}
            className="text-content"
            style={{ position: "relative" }}
        >
            {sentences.map(sentence => {
                const isActive = sentence.id === activeSentenceId;

                return (
                    <div
                        key={sentence.id}
                        className={`sentence ${isActive ? "active" : ""}`}
                    >
                        {sentence.text.split(" ").map((word, index) => {
                            const cleanWord = word.replace(/[.,]/g, "").toLowerCase();
                            const info = words[cleanWord];

                            return (
                                <span
                                    key={index}
                                    className={`word ${info ? "clickable" : ""}`}
                                    onClick={(e) => {
                                        if (!info || !containerRef.current) return;

                                        const wordRect = e.currentTarget.getBoundingClientRect();
                                        const containerRect =
                                            containerRef.current.getBoundingClientRect();

                                        setSelected({
                                            word: info,
                                            pos: {
                                                top: wordRect.bottom - containerRect.top + 8,
                                                left: wordRect.left - containerRect.left
                                            }
                                        });
                                    }}
                                >
                  {word}{" "}
                </span>
                            );
                        })}
                    </div>
                );
            })}

            {selected && (
                <WordPopover
                    word={selected.word}
                    pos={selected.pos}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
};
