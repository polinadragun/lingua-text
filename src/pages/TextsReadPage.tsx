import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCatalog, type CatalogTextItem } from "../api/textsApi";
import { useProfileStore } from "../store/ProfileStore";

export const TextsReadPage = () => {
    const navigate = useNavigate();
    const progress = useProfileStore((s) => s.progress);
    const loadProfile = useProfileStore((s) => s.loadProfile);
    const [items, setItems] = useState<CatalogTextItem[]>([]);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    useEffect(() => {
        if (!progress?.textsRead?.length) {
            setItems([]);
            return;
        }
        let cancelled = false;
        fetchCatalog({ limit: 500, page: 1 })
            .then((res) => {
                if (cancelled) return;
                const set = new Set(progress.textsRead);
                setItems(res.items.filter((t) => set.has(t.slug)));
            })
            .catch(() => {
                if (!cancelled) setItems([]);
            });
        return () => {
            cancelled = true;
        };
    }, [progress?.textsRead]);

    return (
        <div className="page">
            <div className="glass group-container">
                <h1 className="group-title">Texts read</h1>
                {items.length === 0 ? (
                    <p>No texts read yet</p>
                ) : (
                    <div className="cards">
                        {items.map((t) => (
                            <div
                                key={t.id}
                                className="card"
                                onClick={() => navigate(`/text/${t.slug}`)}
                            >
                                <h3>{t.title}</h3>
                                <p>
                                    {t.level} · {t.topic}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

