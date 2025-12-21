import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCatalogStore } from "../store/CatalogStore";
import {useLanguageStore} from "../store/LanguageStore"

import b1Icon from "../assets/flags/B1.png";
import b2Icon from "../assets/flags/B2.png";

import societyIcon from "../assets/flags/soc.png";
import travelIcon from "../assets/flags/travel.png";

import shortIcon from "../assets/flags/short.png";
import mediumIcon from "../assets/flags/med.png";


export const CatalogPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    

    const { texts, loading, load } = useCatalogStore();
    const lang = useLanguageStore(s => s.lang);
    const visibleTexts = texts.filter(t => t.language === lang);

    useEffect(() => {
        load();
    }, [load]);

    const filtered = visibleTexts.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase())
    );

    const levels = [...new Set(visibleTexts.map(t => t.level))];
    const topics = [...new Set(visibleTexts.map(t => t.topic))];
    const lengths = [...new Set(visibleTexts.map(t => t.length))];

    if (loading) {
        return (
            <div className="page">
                <div className="glass" style={{ padding: 32 }}>
                    Loading visibleTexts…
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="glass" style={{ padding: 32 }}>
                <h1>Text Library</h1>

                <input
                    className="search"
                    placeholder="Search texts..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />

                <FolderGroup
                    title="By Level"
                    items={levels}
                    onClick={v => navigate(`/group/level/${v}`)}
                />

                <FolderGroup
                    title="By Topic"
                    items={topics}
                    onClick={v => navigate(`/group/topic/${v}`)}
                />

                <FolderGroup
                    title="By Length"
                    items={lengths}
                    onClick={v => navigate(`/group/length/${v}`)}
                />

                {query && (
                    <div className="cards" style={{ marginTop: 32 }}>
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

const FOLDER_ICONS: Record<string, string> = {
    b1: b1Icon,
    b2: b2Icon,
    society: societyIcon,
    travel: travelIcon,
    short: shortIcon,
    medium: mediumIcon,
};


const FolderGroup = ({
                         title,
                         items,
                         onClick,
                     }: {
    title: string;
    items: string[];
    onClick: (value: string) => void;
}) => (
    <div className="folder-group">
        <h3>{title}</h3>
        <div className="folder-row">
            {items.map(item => {
                const icon = FOLDER_ICONS[item.toLowerCase()];

                return (
                    <div
                        key={item}
                        className="folder-tile glass"
                        onClick={() => onClick(item)}
                    >
                        <div className="folder-icon">
                            {icon && (
                                <img
                                    src={icon}
                                    alt={item}
                                    className="folder-icon-img"
                                />
                            )}
                        </div>
                        <div className="folder-label">{item}</div>
                    </div>
                );
            })}
        </div>
    </div>
);