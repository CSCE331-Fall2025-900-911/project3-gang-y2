import { useEffect } from "react";
import { useTextToSpeech } from "./hooks/useTextToSpeech";
function FocusSpeechAnnouncer({ rate = 1, pitch = 1 }) {
  const { canSpeak, startTalking, stopTalking } = useTextToSpeech({ rate, pitch });
  useEffect(() => {
    if (!canSpeak) return;
    const handleFocus = (event) => {
      const target = event.target;
      if (!target) return;
      const attrText = target.getAttribute?.("data-tts") || target.getAttribute?.("aria-label");
      const textToRead = attrText || target.innerText;
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
  }, [startTalking, stopTalking, canSpeak]);
  return null;
}
export default FocusSpeechAnnouncer;
