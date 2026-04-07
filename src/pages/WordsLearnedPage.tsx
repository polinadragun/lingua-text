import { useEffect, useRef, useState } from "react";
import { ServiceRegistry } from "../service/ServiceRegistry";
import type { LearnedWordItem } from "../service/profile/ProfileService";

export const WordsLearnedPage = () => {
    const [items, setItems] = useState<LearnedWordItem[]>([]);
    const railRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        ServiceRegistry.profileService
            .getLearnedWords()
            .then((data) => {
                if (!cancelled) setItems(data);
            })
            .catch(() => {
                if (!cancelled) setItems([]);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="page">
            <div className="glass group-container">
                <h1 className="group-title">Words learned</h1>

                {items.length === 0 ? (
                    <p>No learned words yet</p>
                ) : (
                    <div className="words-carousel-wrap">
                        <button
                            type="button"
                            className="carousel-arrow"
                            onClick={() => railRef.current?.scrollBy({ left: -280, behavior: "smooth" })}
                            aria-label="Scroll left"
                        >
                            {"<"}
                        </button>
                        <div ref={railRef} className="words-carousel-rail">
                            {items.map((w) => (
                                <div
                                    key={`${w.textSlug}:${w.key}`}
                                    className="glass word-learned-card"
                                    style={{
                                        minWidth: 220,
                                        padding: 14,
                                        position: "relative",
                                    }}
                                >
                                    <div style={{ fontWeight: 700 }}>{w.word}</div>
                                    <div className="word-learned-extra">
                                        <p style={{ margin: "8px 0 0" }}>{w.translation}</p>
                                        <p style={{ margin: "6px 0 0", opacity: 0.85 }}>
                                            {w.transcription}
                                        </p>
                                        <p style={{ margin: "6px 0 0", fontSize: 13 }}>
                                            {w.example}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="carousel-arrow"
                            onClick={() => railRef.current?.scrollBy({ left: 280, behavior: "smooth" })}
                            aria-label="Scroll right"
                        >
                            {">"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

