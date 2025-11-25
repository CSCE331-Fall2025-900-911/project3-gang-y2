import React from "react";
import { useTtsSettings } from "./TtsSettingsContext.jsx";
import { useTranslation } from "./i18n/TranslationContext.jsx";

function TtsToggle() {
  const { ttsEnabled, toggleTts } = useTtsSettings();
  const { translate } = useTranslation();
  const labelState = ttsEnabled ? translate("tts.toggle.off") : translate("tts.toggle.on");
  const shortState = labelState.replace(/tts/gi, "").trim() || (ttsEnabled ? "Off" : "On");

  return (
    <button
      type="button"
      onClick={toggleTts}
      aria-pressed={ttsEnabled}
      aria-label={translate("tts.toggle.aria", { state: shortState })}
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
      {ttsEnabled ? translate("tts.toggle.on") : translate("tts.toggle.off")}
    </button>
  );
}

export default TtsToggle;
