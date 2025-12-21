import { useEffect, useState } from "react";
import { useProfileStore } from "../store/ProfileStore";
import { texts } from "../data/catalog";

export const ProfilePage = () => {
    const {
        progress,
        loading,
        editing,
        loadProfile,
        toggleEdit,
        updateLevel,
    } = useProfileStore();

    const [level, setLevel] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        if (progress) setLevel(progress.level);
    }, [progress]);

    if (loading || !progress) {
        return <div className="page glass">Loading profile…</div>;
    }

    const favoriteTexts = texts.filter(t =>
        progress.favorites.includes(t.id)
    );

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

                <div className="stat-card">
                    <span className="stat-label">Texts read</span>
                    <span className="stat-value">
                        {progress.textsRead.length}
                    </span>
                </div>

                <div className="stat-card">
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