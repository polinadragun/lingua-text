import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCatalogStore } from "../store/CatalogStore";
import { useProfileStore } from "../store/ProfileStore";
import { useCatalogSettingsStore } from "../store/CatalogSettingsStore";
import { useLanguageStore } from "../store/LanguageStore";

export const GroupPage = () => {
    const { type, value } = useParams();
    const navigate = useNavigate();

    const texts = useCatalogStore(s => s.texts);
    const load = useCatalogStore(s => s.load);
    const lang = useLanguageStore((s) => s.lang);
    const progress = useProfileStore((s) => s.progress);
    const loadProfile = useProfileStore((s) => s.loadProfile);
    const levelFiltered = useCatalogSettingsStore((s) => s.levelFiltered);
    const userLevel = progress?.level;

    useEffect(() => {
        void load(lang);
    }, [load, lang]);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    const filtered = texts
        .filter((t) => t[type as keyof typeof t] === value)
        .filter((t) => (!levelFiltered || !userLevel ? true : t.level === userLevel));

    return (
        <div className="page">
            <div className="glass group-container">
                <h1 className="group-title">
                    {type}: <span>{value}</span>
                </h1>

                {filtered.length === 0 ? (
                    <p>No texts found</p>
                ) : (
                    <div className="cards">
                        {filtered.map(t => (
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
            </div>
        </div>
    );
};
