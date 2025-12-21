import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { mockTextStore } from "../service/mock/MockTextStore";

export const MyTextsPage = () => {
    const [tab, setTab] = useState<"created" | "favorite">("created");
    const navigate = useNavigate();

    const user = useAuthStore(s => s.user);

    const createdTexts = useMemo(() => {
        if (!user) return [];
        return mockTextStore.getByAuthor(user.email);
    }, [user]);

    if (!user) {
        return (
            <div className="page">
                <div className="glass" style={{ padding: 32 }}>
                    Not authenticated
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="glass my-texts-page">
                <h1>My texts</h1>

                <div className="segmented">
                    <button
                        className={tab === "created" ? "active" : ""}
                        onClick={() => setTab("created")}
                    >
                        Created
                    </button>
                    <button
                        className={tab === "favorite" ? "active" : ""}
                        onClick={() => setTab("favorite")}
                    >
                        Favorite
                    </button>

                    <div className={`segmented-indicator ${tab}`} />
                </div>

                {tab === "created" && (
                    <>
                        {createdTexts.length === 0 ? (
                            <p style={{ opacity: 0.6 }}>
                                You haven’t created any texts yet.
                            </p>
                        ) : (
                            <div className="cards">
                                {createdTexts.map(t => (
                                    <div
                                        key={t.id}
                                        className="card"
                                        onClick={() => navigate(`/text/${t.id}`)}
                                    >
                                        <h3>{t.title}</h3>
                                        <p>{t.level} · {t.topic}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            className="create-fab"
                            onClick={() => navigate("/create")}
                        >
                            ➕ Create new text
                        </button>
                    </>
                )}

                {tab === "favorite" && (
                    <p style={{ opacity: 0.6 }}>Favorites coming soon…</p>
                )}
            </div>
        </div>
    );
};
