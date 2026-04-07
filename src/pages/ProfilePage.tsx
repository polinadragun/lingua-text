import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../store/ProfileStore";
import { fetchCatalog } from "../api/textsApi";

export const ProfilePage = () => {
    const navigate = useNavigate();
    const {
        progress,
        loading,
        editing,
        loadProfile,
        toggleEdit,
        updateLevel,
    } = useProfileStore();

    const [level, setLevel] = useState("");
    const [favoriteTexts, setFavoriteTexts] = useState<
        Array<{ id: string; title: string; level: string; topic: string }>
    >([]);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    useEffect(() => {
        if (progress) setLevel(progress.level);
    }, [progress]);

    useEffect(() => {
        if (!progress?.favorites?.length) {
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
                            title: t.title,
                            level: t.level,
                            topic: t.topic,
                        }))
                );
            })
            .catch(() => {
                if (!cancelled) setFavoriteTexts([]);
            });

        return () => {
            cancelled = true;
        };
    }, [progress]);

    if (loading || !progress) {
        return <div className="page glass">Loading profile…</div>;
    }

    return (
        <div className="page glass profile-page">
            <h1>Your Profile</h1>

            <div className="profile-stats">
                <div className="stat-card">
                    <span className="stat-label">Level</span>

                    {editing ? (
                        <select
                            value={level}
                            onChange={e => setLevel(e.target.value)}
                        >
                            <option>A2</option>
                            <option>B1</option>
                            <option>B2</option>
                            <option>C1</option>
                            <option>C2</option>
                        </select>
                    ) : (
                        <span className="stat-value">{progress.level}</span>
                    )}
                </div>

                <div
                    className="stat-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/profile/texts-read")}
                >
                    <span className="stat-label">Texts read</span>
                    <span className="stat-value">
                        {progress.textsRead.length}
                    </span>
                </div>

                <div
                    className="stat-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/profile/words-learned")}
                >
                    <span className="stat-label">Words learned</span>
                    <span className="stat-value">
                        {progress.learnedWords}
                    </span>
                </div>
            </div>

            <div className="profile-actions">
                {editing ? (
                    <>
                        <button
                            className="btn primary"
                            onClick={() => updateLevel(level)}
                        >
                            Save
                        </button>
                        <button
                            className="btn secondary"
                            onClick={toggleEdit}
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        className="btn secondary"
                        onClick={toggleEdit}
                    >
                        Edit profile
                    </button>
                )}
            </div>

            <h2>Favorite texts</h2>

            {favoriteTexts.length === 0 ? (
                <p>No favorites yet</p>
            ) : (
                <div className="cards">
                    {favoriteTexts.map(t => (
                        <div key={t.id} className="card">
                            <h3>{t.title}</h3>
                            <p>{t.level} · {t.topic}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
