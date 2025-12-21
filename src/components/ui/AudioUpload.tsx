import { useRef, useState } from "react";

interface AudioUploadProps {
    onSelect?: (file: File) => void;
}

export const AudioUpload = ({ onSelect }: AudioUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    return (
        <div className="file-upload">
            <input
                ref={inputRef}
                type="file"
                accept="audio/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setFileName(file.name);
                    onSelect?.(file);
                }}
            />

            <button
                type="button"
                className="file-button"
                onClick={() => inputRef.current?.click()}
            >
                🎵 Upload audio
            </button>

            {fileName && (
                <div className="file-name">
                    {fileName}
                </div>
            )}
        </div>
    );
};