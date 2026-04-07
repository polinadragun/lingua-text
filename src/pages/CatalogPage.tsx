import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCatalogStore } from "../store/CatalogStore";
import { fetchCatalog } from "../api/textsApi";
import type { TextPreview } from "../entity/TextPreview";
import type { Level, Topic, Length } from "../entity/TextEnums";
import { useProfileStore } from "../store/ProfileStore";
import { useCatalogSettingsStore } from "../store/CatalogSettingsStore";
import { useLanguageStore } from "../store/LanguageStore";

import b1Icon from "../assets/flags/B1.png";
import b2Icon from "../assets/flags/B2.png";

import societyIcon from "../assets/flags/soc.png";
import travelIcon from "../assets/flags/travel.png";

import shortIcon from "../assets/flags/short.png";
import mediumIcon from "../assets/flags/med.png";

function mapCatalogItemToPreview(t: {
    id: string;
    slug: string;
    title: string;
    level: string;
    topic: string;
    length: string;
    language?: string;
}): TextPreview {
    return {
        id: t.id,
        slug: t.slug,
        title: t.title,
        level: t.level as Level,
        topic: t.topic as Topic,
        length: t.length as Length,
        language: (t.language ?? "en") as TextPreview["language"],
    };
}

export const CatalogPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<TextPreview[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchSeq = useRef(0);

    const { texts, loading, load } = useCatalogStore();
    const lang = useLanguageStore((s) => s.lang);
    const progress = useProfileStore((s) => s.progress);
    const loadProfile = useProfileStore((s) => s.loadProfile);
    const levelFiltered = useCatalogSettingsStore((s) => s.levelFiltered);
    const toggleLevelFiltered = useCatalogSettingsStore(
        (s) => s.toggleLevelFiltered
    );
    const userLevel = progress?.level;

    useEffect(() => {
        void load(lang);
    }, [load, lang]);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    const runSearch = useCallback(async (raw: string, signal?: AbortSignal) => {
        const seq = ++searchSeq.current;
        const trimmed = raw.trim();
        if (!trimmed) {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }
        setSearchLoading(true);
        try {
            const res = await fetchCatalog(
                {
                    search: trimmed,
                    level: levelFiltered ? userLevel : undefined,
                    language: lang,
                    limit: 50,
                    page: 1,
                },
                { signal }
            );
            if (seq !== searchSeq.current) return;
            setSearchResults(res.items.map(mapCatalogItemToPreview));
        } catch {
            if (seq !== searchSeq.current) return;
            setSearchResults([]);
        } finally {
            if (seq === searchSeq.current) {
                setSearchLoading(false);
            }
        }
    }, [levelFiltered, userLevel, lang]);

    useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            searchSeq.current += 1;
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }
        const ac = new AbortController();
        const timer = setTimeout(() => {
            void runSearch(trimmed, ac.signal);
        }, 280);
        return () => {
            clearTimeout(timer);
            ac.abort();
        };
    }, [query, runSearch]);

    const sourceForFolders =
        levelFiltered && userLevel ? texts.filter((t) => t.level === userLevel) : texts;

    const levels = Array.from(new Set(sourceForFolders.map((t) => t.level)));
    const topics = Array.from(new Set(sourceForFolders.map((t) => t.topic)));
    const lengths = Array.from(new Set(sourceForFolders.map((t) => t.length)));

    const showSearchPanel = query.trim().length > 0;

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
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            const ac = new AbortController();
                            void runSearch(query, ac.signal);
                        }
                    }}
                />

                <label
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 12,
                        userSelect: "none",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={levelFiltered}
                        onChange={() => toggleLevelFiltered()}
                    />
                    <span style={{ opacity: 0.9 }}>Level filtered</span>
                </label>

                {!levelFiltered && (
                    <FolderGroup
                        title="By Level"
                        items={levels}
                        onClick={(v) => navigate(`/group/level/${v}`)}
                    />
                )}

                <FolderGroup
                    title="By Topic"
                    items={topics}
                    onClick={(v) => navigate(`/group/topic/${v}`)}
                />

                <FolderGroup
                    title="By Length"
                    items={lengths}
                    onClick={(v) => navigate(`/group/length/${v}`)}
                />

                {showSearchPanel && (
                    <div className="cards" style={{ marginTop: 32 }}>
                        {searchLoading && (
                            <p style={{ margin: 0, opacity: 0.85 }}>Searching…</p>
                        )}
                        {!searchLoading &&
                            searchResults.length === 0 && (
                                <p style={{ margin: 0, opacity: 0.85 }}>
                                    No texts found
                                </p>
                            )}
                        {!searchLoading &&
                            searchResults.map((t) => (
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
            {items.map((item) => {
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
