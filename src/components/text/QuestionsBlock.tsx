import { useEffect, useState } from "react";

export const QuestionsBlock = ({
    questions,
}: {
    questions?: { q: string; a: string }[];
}) => {
    const list = questions ?? [];
    const [open, setOpen] = useState<boolean[]>(() => list.map(() => false));

    useEffect(() => {
        setOpen(list.map(() => false));
    }, [list]);

    return (
        <div className="questions">
            <h2>Comprehension Questions</h2>

            {list.map((item, i) => {
                const isOpen = open[i] === true;

                return (
                    <div key={i} className="question-card">
                        <button
                            type="button"
                            className="question-button"
                            onClick={() =>
                                setOpen(prev => {
                                    const next = [...prev];
                                    next[i] = !next[i];
                                    return next;
                                })
                            }
                        >
                            <span className="question-text">{item.q}</span>

                            <i
                                className={`fas fa-chevron-down question-icon ${isOpen ? "open" : ""}`}
                            />
                        </button>

                        <div className={`answer-wrapper ${isOpen ? "open" : ""}`}>
                            <div className="answer-row">
                                <div className="answer">
                                    <div className="answer-inner">
                                        {item.a}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                );
            })}
        </div>
    );
};
