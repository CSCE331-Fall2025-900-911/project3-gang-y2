import React from "react";
import { useTranslation } from "./i18n/TranslationContext.jsx";

function LanguageToggle() {
  const { language, setLanguage, translate } = useTranslation();

  return (
    <div
      style={{
        position: "fixed",
        right: "16px",
        bottom: "70px",
        zIndex: 1200,
        display: "flex",
        gap: "8px",
        background: "#ffffff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "6px 8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: language === "en" ? "2px solid #4c8c2b" : "1px solid #ccc",
          background: language === "en" ? "#e5f2dc" : "#f7f7f7",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {translate("language.english")}
      </button>
      <button
        type="button"
        onClick={() => setLanguage("es")}
        aria-pressed={language === "es"}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: language === "es" ? "2px solid #4c8c2b" : "1px solid #ccc",
          background: language === "es" ? "#e5f2dc" : "#f7f7f7",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {translate("language.spanish")}
      </button>
    </div>
  );
}

export default LanguageToggle;
