import { useState } from "react";
import { sentences, words } from "../data/demoText";
import { AudioPlayer } from "../components/text/AudioPlayer";
import { TextContent } from "../components/text/TextContent";
import { QuestionsBlock } from "../components/text/QuestionsBlock";

export const TextPage = () => {
    const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);

    return (
        <div className="page">
            <div className="glass text-page">
                <h1 className="text-title">Life in a Modern City</h1>

                <AudioPlayer
                    sentences={sentences}
                    onSentenceChange={setActiveSentenceId}
                />

                <div className="text-container glass">
                    <TextContent
                        sentences={sentences}
                        activeSentenceId={activeSentenceId}
                        words={words}
                    />
                </div>

                <QuestionsBlock />
            </div>
        </div>
    );
};
