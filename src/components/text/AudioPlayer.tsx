import { useEffect, useRef } from "react";
import { Sentence } from "../../types/text";

interface Props {
    sentences: Sentence[];
    onSentenceChange: (id: string | null) => void;
}

export const AudioPlayer = ({ sentences, onSentenceChange }: Props) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            const current = audio.currentTime;
            const active = sentences.find(
                s => current >= s.start && current < s.end
            );
            onSentenceChange(active ? active.id : null);
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        return () => audio.removeEventListener("timeupdate", onTimeUpdate);
    }, [sentences, onSentenceChange]);

    return (
        <audio
            ref={audioRef}
            controls
            src="/demo-audio.mp3"
            style={{ width: "100%", marginBottom: 20 }}
        />
    );
};
