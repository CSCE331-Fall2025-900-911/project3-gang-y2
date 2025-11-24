import React, { createContext, useContext, useEffect, useState } from "react";
const TtsSettingsContext = createContext(null);
const STORAGE_KEY = "ttsEnabled";
export function TtsSettingsProvider({ children }) {
  const [ttsEnabled, setTtsEnabled] = useState(true);
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "false") setTtsEnabled(false);
  }, []);
  const toggleTts = () => {
    setTtsEnabled((oldValue) => {
      const newValue = !oldValue;
      window.localStorage.setItem(STORAGE_KEY, String(newValue));
      return newValue;
    });
  };
  return (
    <TtsSettingsContext.Provider value={{ ttsEnabled, toggleTts }}>
      {children}
    </TtsSettingsContext.Provider>
  );
}
export function useTtsSettings() {
  const contextValue = useContext(TtsSettingsContext);
  if (!contextValue) throw new Error("useTtsSettings must be used within TtsSettingsProvider");
  return contextValue;
}
