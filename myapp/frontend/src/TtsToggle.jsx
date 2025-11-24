import React from "react";
import { useTtsSettings } from "./TtsSettingsContext.jsx";

function TtsToggle() {
  const { ttsEnabled, toggleTts } = useTtsSettings();

  return (
    <button
      type="button"
      onClick={toggleTts}
      aria-pressed={ttsEnabled}
      aria-label={`Turn text to speech ${ttsEnabled ? "off" : "on"}`}
      style={{
        position: "fixed",
        right: "16px",
        bottom: "16px",
        zIndex: 1200,
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #33661a",
        background: ttsEnabled ? "#4c8c2b" : "#a9a9a9",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      {ttsEnabled ? "TTS On" : "TTS Off"}
    </button>
  );
}

export default TtsToggle;
