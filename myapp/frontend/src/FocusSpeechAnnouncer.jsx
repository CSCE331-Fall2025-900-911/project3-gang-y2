import { useEffect } from "react";
import { useTextToSpeech } from "./hooks/useTextToSpeech";
import { useTtsSettings } from "./TtsSettingsContext.jsx";
import { useTranslation } from "./i18n/TranslationContext.jsx";
function FocusSpeechAnnouncer({ rate = 1, pitch = 1 }) {
  const { ttsEnabled } = useTtsSettings();
  const { language } = useTranslation();
  const langCode = language === "es" ? "es-ES" : "en-US";
  const { canSpeak, startTalking, stopTalking } = useTextToSpeech({ rate, pitch, lang: langCode });
  useEffect(() => {
    if (!canSpeak || !ttsEnabled) return;
    const handleFocus = (event) => {
      const target = event.target;
      if (!target) return;
      const textAttr = target.getAttribute?.("data-tts") || target.getAttribute?.("aria-label");
      const textToRead = textAttr || target.innerText;
      if (!textToRead) return;
      const cleanText = textToRead.replace(/\s+/g, " ").trim();
      if (!cleanText) return;
      startTalking(cleanText);
    };
    const handleBlur = () => stopTalking();
    window.addEventListener("focusin", handleFocus);
    window.addEventListener("focusout", handleBlur);
    return () => {
      window.removeEventListener("focusin", handleFocus);
      window.removeEventListener("focusout", handleBlur);
    };
  }, [startTalking, stopTalking, canSpeak, ttsEnabled]);
  return null;
}
export default FocusSpeechAnnouncer;
