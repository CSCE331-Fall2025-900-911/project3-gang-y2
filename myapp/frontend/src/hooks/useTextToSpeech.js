import { useCallback, useEffect, useRef, useState } from "react";
export function useTextToSpeech(baseSettings = {}) {
  const speechRef = useRef(null);
  const [canSpeak, setCanSpeak] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [voiceList, setVoiceList] = useState([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const speechEngine = window.speechSynthesis;
    if (speechEngine && typeof speechEngine.speak === "function") {
      speechRef.current = speechEngine;
      setCanSpeak(true);
      const loadVoices = () => {
        const loaded = speechEngine.getVoices ? speechEngine.getVoices() : [];
        if (loaded && loaded.length > 0) setVoiceList(loaded);
      };
        speechEngine.onvoiceschanged = loadVoices;
        loadVoices();
    }
    return () => {
      if (speechRef.current) speechRef.current.cancel();
    };
  }, []);
  const stopTalking = useCallback(() => {
    if (!speechRef.current) return;
    speechRef.current.cancel();
    setIsTalking(false);
  }, []);
  const startTalking = useCallback(
    (text, settings = {}) => {
      if (!speechRef.current || !text) return;
      stopTalking();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = settings.rate ?? baseSettings.rate ?? 1;
      speech.pitch = settings.pitch ?? baseSettings.pitch ?? 1;
      speech.lang = settings.lang ?? baseSettings.lang ?? "en-US";
      const voices = voiceList.length ? voiceList : speechRef.current.getVoices ? speechRef.current.getVoices() : [];
      const target = (settings.lang || baseSettings.lang || "en-US").toLowerCase();
      const voiceMatch = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(target.slice(0, 2)));
      if (voiceMatch) speech.voice = voiceMatch;
      speech.onend = () => setIsTalking(false);
      speech.onerror = () => setIsTalking(false);
      speechRef.current.speak(speech);
      setIsTalking(true);
    },
    [baseSettings.lang, baseSettings.pitch, baseSettings.rate, stopTalking, voiceList]
  );
  return { canSpeak, isTalking, startTalking, stopTalking };
}
