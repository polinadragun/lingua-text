import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { TextMetaSection } from "../components/text/create/TextMetaSection";
import { TextEditorSection } from "../components/text/create/TextEditorSection";
import { AudioSection } from "../components/text/create/AudioSection";
import { WordCardsSection } from "../components/text/create/WordCardSection";

import { useCreateTextStore } from "../store/CreateTextStore";

export const CreateTextPage = () => {
    const navigate = useNavigate();

    const save = useCreateTextStore(s => s.save);
    const saving = useCreateTextStore(s => s.saving);
    const saveError = useCreateTextStore(s => s.saveError);
    const clearSaveError = useCreateTextStore(s => s.clearSaveError);

    const onSave = async () => {
        const slug = await save();
        if (slug) navigate(`/text/${slug}`);
    };

    useEffect(() => {
        if (!saveError) return;
        const t = setTimeout(clearSaveError, 3000);
        return () => clearTimeout(t);
    }, [saveError, clearSaveError]);

    return (
        <>
            <div className="page glass create-text-page">
                <h1>Create new text</h1>

                <TextMetaSection />
                <TextEditorSection />
                <AudioSection />
                <WordCardsSection />

                <div className="create-actions">
                    <button
                        className="primary"
                        onClick={onSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save text"}
                    </button>
                </div>
            </div>

            {saveError && (
                <div className="save-toast" onClick={clearSaveError}>
                    {saveError}
                </div>
            )}
        </>
    );
};