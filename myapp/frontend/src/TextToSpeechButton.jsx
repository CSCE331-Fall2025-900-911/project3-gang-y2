import React from "react";
import { useTextToSpeech } from "./hooks/useTextToSpeech";
import { useTtsSettings } from "./TtsSettingsContext.jsx";
import { useTranslation } from "./i18n/TranslationContext.jsx";
import "./TextToSpeechButton.css";
function TextToSpeechButton({ text, label, className = "", rate, pitch }) {
  const { ttsEnabled } = useTtsSettings();
  const { language, translate } = useTranslation();
  const langCode = language === "es" ? "es-ES" : "en-US";
  const { canSpeak, isTalking, startTalking, stopTalking } = useTextToSpeech({ rate, pitch, lang: langCode });
  if (!canSpeak) return null;
  const hasText = Boolean(text && text.trim());
  const buttonLabel = label || translate("tts.button.read");
  const handleClick = () => {
    if (!hasText || !ttsEnabled) return;
    if (isTalking) {
      stopTalking();
      return;
    }
    startTalking(text);
  };
  return (
    <button
      type="button"
      className={`tts-button ${isTalking ? "tts-button--active" : ""} ${className}`}
      onClick={handleClick}
      aria-pressed={isTalking}
      aria-label={buttonLabel}
      disabled={!hasText || !ttsEnabled}
    >
      <span aria-hidden="true">{isTalking ? "⏹" : "🔊"}</span>
      {isTalking ? translate("tts.button.stop") : translate("tts.button.read")}
    </button>
  );
}
export default TextToSpeechButton;
