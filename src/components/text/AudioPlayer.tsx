import { useEffect, useRef, useState } from "react";
import { Sentence } from "../../types/text";

interface Props {
    sentences: Sentence[];
    onSentenceChange: (id: string | null) => void;
    /** Public URL from API (object storage). If missing, the demo file is not used. */
    audioSrc?: string | null;
}

export const AudioPlayer = ({
    sentences,
    onSentenceChange,
    audioSrc,
}: Props) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        setLoadError(null);
    }, [audioSrc]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !audioSrc) return;

        const onTimeUpdate = () => {
            const current = audio.currentTime;
            const active = sentences.find(
                s => current >= s.start && current < s.end
            );
            onSentenceChange(active ? active.id : null);
        };

        audio.addEventListener("timeupdate", onTimeUpdate);
        return () => audio.removeEventListener("timeupdate", onTimeUpdate);
    }, [sentences, onSentenceChange, audioSrc]);

    if (!audioSrc) {
        return (
            <p className="audio-missing" style={{ marginBottom: 20 }}>
                No audio for this text.
            </p>
        );
    }

    return (
        <div style={{ marginBottom: 20 }}>
            <audio
                key={audioSrc}
                ref={audioRef}
                controls
                src={audioSrc}
                preload="metadata"
                style={{ width: "100%" }}
                onError={() =>
                    setLoadError(
                        "Could not load this audio URL. Check public read on the object and CORS on the bucket."
                    )
                }
                onLoadedData={() => setLoadError(null)}
            />
            {loadError && (
                <p className="audio-missing" role="alert" style={{ marginTop: 8 }}>
                    {loadError}
                </p>
            )}
        </div>
    );
};
