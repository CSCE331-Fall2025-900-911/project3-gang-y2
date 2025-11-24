import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./translations/en.json";
import es from "./translations/es.json";

const TranslationContext = createContext(null);
const LANG_KEY = "lang";
const translations = { en, es };

function getValue(obj, key) {
  if (!obj) return null;
  if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
  return null;
}

export function TranslationProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === "es") setLanguage("es");
  }, []);

  const translate = useMemo(() => {
    return (key, params) => {
      const dict = translations[language] || translations.en;
      const fallback = translations.en;
      const raw = getValue(dict, key) ?? getValue(fallback, key) ?? key;
      if (!params) return raw;
      return Object.keys(params).reduce((acc, name) => acc.replace(new RegExp(`{${name}}`, "g"), params[name]), raw);
    };
  }, [language]);

  const changeLanguage = (next) => {
    const nextLang = next === "es" ? "es" : "en";
    setLanguage(nextLang);
    window.localStorage.setItem(LANG_KEY, nextLang);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: changeLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const value = useContext(TranslationContext);
  if (!value) throw new Error("useTranslation must be used inside TranslationProvider");
  return value;
}
