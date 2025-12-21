import { useParams, useNavigate } from "react-router-dom";
import { useCatalogStore } from "../store/CatalogStore";

export const GroupPage = () => {
    const { type, value } = useParams();
    const navigate = useNavigate();

    const texts = useCatalogStore(s => s.texts);

    const filtered = texts.filter(t =>
        t[type as keyof typeof t] === value
    );

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
                                onClick={() => navigate(`/text/${t.id}`)}
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