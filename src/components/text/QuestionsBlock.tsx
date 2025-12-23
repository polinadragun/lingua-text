import { useState } from "react";

const questions = [
    { q: "What advantages does city life offer?", a: "Many opportunities and access to technology." },
    { q: "Why can it be exhausting?", a: "Because of the fast pace and pressure." },
    { q: "What becomes valuable?", a: "Moments of silence and rest." }
];

export const QuestionsBlock = () => {
    const [open, setOpen] = useState<boolean[]>(() => questions.map(() => false));

    return (
        <div className="questions">
            <h2>Comprehension Questions</h2>

            {questions.map((item, i) => {
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
