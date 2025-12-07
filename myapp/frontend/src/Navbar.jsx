import React from "react";
import { Link } from "react-router-dom";
import { useZoom } from "./ZoomContext";
import { useTranslation } from "./i18n/TranslationContext.jsx";

export default function Navbar() {
  const { updateZoom } = useZoom();
  const { translate } = useTranslation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="logo">MatchaBoba POS</h1>
        <ul className="nav-links">
          <li><Link to="/login">{translate("nav.login")}</Link></li>
          <li><Link to="/kiosk">{translate("nav.kiosk")}</Link></li>
          <li><Link to="/menuboard">{translate("nav.menuBoard")}</Link></li>
        </ul>
        <div className="zoom-controls">
          Zoom: 
          <button className = "zoom-button" onClick={() => updateZoom(1)}>100%</button>
          <button className = "zoom-button" onClick={() => updateZoom(1.25)}>125%</button>
          <button className = "zoom-button" onClick={() => updateZoom(1.5)}>150%</button>
        </div>
      </div>
    </nav>
  );
}
