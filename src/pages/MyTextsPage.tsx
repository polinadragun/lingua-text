import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useProfileStore } from "../store/ProfileStore";
import { fetchCatalog, type CatalogTextItem } from "../api/textsApi";

export const MyTextsPage = () => {
    const [tab, setTab] = useState<"created" | "favorite">("created");
    const navigate = useNavigate();

    const user = useAuthStore(s => s.user);
    const progress = useProfileStore(s => s.progress);
    const loadProfile = useProfileStore(s => s.loadProfile);

    const [createdTexts, setCreatedTexts] = useState<CatalogTextItem[]>([]);
    const [favoriteTexts, setFavoriteTexts] = useState<CatalogTextItem[]>([]);
    const [loadingCreated, setLoadingCreated] = useState(false);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    useEffect(() => {
        if (!user?.email) {
            setCreatedTexts([]);
            return;
        }

        let cancelled = false;
        setLoadingCreated(true);

        fetchCatalog({ authorEmail: user.email, limit: 200, page: 1 })
            .then((res) => {
                if (cancelled) return;
                setCreatedTexts(
                    res.items.map((t) => ({
                        id: t.id,
                        slug: t.slug,
                        title: t.title,
                        description: t.description,
                        level: t.level,
                        topic: t.topic,
                        length: t.length,
                        language: t.language,
                        authorEmail: t.authorEmail,
                    }))
                );
            })
            .catch(() => {
                if (!cancelled) setCreatedTexts([]);
            })
            .finally(() => {
                if (!cancelled) setLoadingCreated(false);
            });

        return () => {
            cancelled = true;
        };
    }, [user?.email]);

    useEffect(() => {
        if (tab !== "favorite" || !progress?.favorites?.length) {
            if (tab !== "favorite") return;
            setFavoriteTexts([]);
            return;
        }

        let cancelled = false;

        fetchCatalog({ limit: 200, page: 1 })
            .then((res) => {
                if (cancelled) return;
                const fav = new Set(progress.favorites);
                setFavoriteTexts(
                    res.items
                        .filter((t) => fav.has(t.slug))
                        .map((t) => ({
                            id: t.id,
                            slug: t.slug,
                            title: t.title,
                            description: t.description,
                            level: t.level,
                            topic: t.topic,
                            length: t.length,
                            language: t.language,
                            authorEmail: t.authorEmail,
                        }))
                );
            })
            .catch(() => {
                if (!cancelled) setFavoriteTexts([]);
            });

        return () => {
            cancelled = true;
        };
    }, [tab, progress]);

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
                        {loadingCreated && (
                            <p style={{ opacity: 0.6 }}>Loading…</p>
                        )}
                        {!loadingCreated && createdTexts.length === 0 ? (
                            <p style={{ opacity: 0.6 }}>
                                You haven’t created any texts yet.
                            </p>
                        ) : (
                            !loadingCreated && (
                                <div className="cards">
                                    {createdTexts.map(t => (
                                        <div
                                            key={t.id}
                                            className="card"
                                            onClick={() => navigate(`/text/${t.slug}`)}
                                        >
                                            <h3>{t.title}</h3>
                                            <p>{t.level} · {t.topic}</p>
                                        </div>
                                    ))}
                                </div>
                            )
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
                    <>
                        {favoriteTexts.length === 0 ? (
                            <p style={{ opacity: 0.6 }}>No favorites yet.</p>
                        ) : (
                            <div className="cards">
                                {favoriteTexts.map(t => (
                                    <div
                                        key={t.id}
                                        className="card"
                                        onClick={() => navigate(`/text/${t.slug}`)}
                                    >
                                        <h3>{t.title}</h3>
                                        <p>{t.level} · {t.topic}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
