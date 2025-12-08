import React from "react";
import { Link } from "react-router-dom";
import "./ManagerDash.css";
import { useTranslation } from "./i18n/TranslationContext.jsx";

function ManagerDash() {
  const { translate } = useTranslation();

  return (
    <div className="manager-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/">{"Back to Landing" || translate("nav.managerBack")}</Link></li>
            <li><Link to="/employees">{translate("nav.employees")}</Link></li>
            <li><Link to="/inventory">{translate("nav.inventory")}</Link></li>
            <li><Link to="/menu-items">{translate("nav.menuItems")}</Link></li>
            <li><Link to="/reports">{translate("nav.reports")}</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2 className="manager-title">{translate("manager.title") || "Manager View"}</h2>
        <p className="manager-subtext">{translate("manager.body") || "Use the navigation above to manage store operations."}</p>
      </main>
    </div>
  );
}

export default ManagerDash;
