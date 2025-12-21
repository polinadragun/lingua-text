import { useEffect, useMemo, useRef, useState } from "react";
import {Lang} from "../../entity/TextEnums"
import {useLanguageStore } from "../../store/LanguageStore";

import flagEn from "../../assets/flags/en.png";
import flagCh from "../../assets/flags/ch.png";
import flagFr from "../../assets/flags/fr.png";
import flagIt from "../../assets/flags/it.png";
import flagJp from "../../assets/flags/jp.png";

type LangItem = {
    code: Lang;
    label: string;
    icon: string;
};

export const LanguageSwitcher = () => {
    const lang = useLanguageStore((s) => s.lang);
    const setLang = useLanguageStore((s) => s.setLang);

    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const items: LangItem[] = useMemo(
        () => [
            { code: "en", label: "English", icon: flagEn },
            { code: "ch", label: "Deutsch", icon: flagCh },
            { code: "fr", label: "Français", icon: flagFr },
            { code: "it", label: "Español", icon: flagIt },
            { code: "jp", label: "Español", icon: flagJp },
        ],
        []
    );

    const current = items.find((i) => i.code === lang) ?? items[0];

    useEffect(() => {
        const onDown = (e: MouseEvent) => {
            if (!open) return;
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div ref={rootRef} className="lang-switcher">
            <button
                type="button"
                className="lang-current"
                onClick={() => setOpen((v) => !v)}
                aria-label="Change language"
                aria-expanded={open}
            >
                <img className="lang-flag" src={current.icon} alt={current.label} />
            </button>

            {open && (
                <div className="lang-menu glass" role="menu">
                    <div className="lang-menu-arrow" />
                    <div className="lang-menu-title">Language</div>

                    <div className="lang-options">
                        {items.map((it) => {
                            const active = it.code === lang;

                            return (
                                <button
                                    key={it.code}
                                    type="button"
                                    className={`lang-option ${active ? "active" : ""}`}
                                    onClick={() => {
                                        setLang(it.code);
                                        setOpen(false);
                                    }}
                                    role="menuitem"
                                >
                                    <img className="lang-flag" src={it.icon} alt={it.label} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
