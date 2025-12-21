import { useEffect, useRef } from "react";
import { WordInfo } from "../../types/text";

interface Props {
    word: WordInfo;
    pos: { top: number; left: number };
    onClose: () => void;
}

export const WordPopover = ({ word, pos, onClose }: Props) => {
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
            <h4>{word.word}</h4>
            <p className="transcription">{word.transcription}</p>
            <p className="translation">{word.translation}</p>
            <p className="example">{word.example}</p>
        </div>
    );
};
