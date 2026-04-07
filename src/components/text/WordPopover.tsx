import { useEffect, useRef } from "react";
import { WordInfo } from "../../types/text";

interface Props {
    word: WordInfo;
    learned: boolean;
    loading: boolean;
    onToggleLearned: () => void;
    pos: { top: number; left: number };
    onClose: () => void;
}

export const WordPopover = ({ word, learned, loading, onToggleLearned, pos, onClose }: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="word-popover glass"
            style={{
                position: "absolute",
                top: pos.top,
                left: pos.left
            }}
        >
            <div className="popover-arrow" />
            <button
                type="button"
                onClick={onToggleLearned}
                disabled={loading}
                style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                    border: "none",
                    background: "transparent",
                    cursor: loading ? "wait" : "pointer",
                    fontSize: 18,
                }}
                aria-label={learned ? "Remove learned word" : "Add learned word"}
            >
                {learned ? "✓" : "+"}
            </button>
            <h4>{word.word}</h4>
            <p className="transcription">{word.transcription}</p>
            <p className="translation">{word.translation}</p>
            <p className="example">{word.example}</p>
        </div>
    );
};
