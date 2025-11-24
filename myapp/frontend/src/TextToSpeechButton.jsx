import React from "react";
import { useTextToSpeech } from "./hooks/useTextToSpeech";
import { useTtsSettings } from "./TtsSettingsContext.jsx";
import "./TextToSpeechButton.css";
function TextToSpeechButton({ text, label = "Read aloud", className = "", rate, pitch }) {
  const { ttsEnabled } = useTtsSettings();
  const { canSpeak, isTalking, startTalking, stopTalking } = useTextToSpeech({ rate, pitch });
  if (!canSpeak) return null;
  const hasText = Boolean(text && text.trim());
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
      aria-label={label}
      disabled={!hasText || !ttsEnabled}
    >
      <span aria-hidden="true">{isTalking ? "⏹" : "🔊"}</span>
      {isTalking ? "Stop" : "Read Aloud"}
    </button>
  );
}
export default TextToSpeechButton;
