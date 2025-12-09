import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Reports.css";
import { useTranslation } from "./i18n/TranslationContext.jsx";

function Reports() {
  const navigate = useNavigate();
  const { translate } = useTranslation();

  return (
    <div className="reports-page">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" style={{textDecoration: "none", color: "inherit", fontWeight: "bold", fontSize: "1.5rem"}}>MatchaBoba POS</Link>          
          <ul className="nav-links">
            <li><Link to="/manager">{translate("nav.managerBack")}</Link></li>
            <li><Link to="/employees">{translate("nav.employees")}</Link></li>
            <li><Link to="/inventory">{translate("nav.inventory")}</Link></li>
            <li><Link to="/menu-items">{translate("nav.menuItems")}</Link></li>
            <li id="current-item"><Link to="/reports">{translate("nav.reports")}</Link></li>
          </ul>
        </div>
      </nav>

      <div className="reports">
        <h2>{translate("reports.title")}</h2>
        <div className="button-list">
          <button className="report-button" onClick={() => navigate("/XReport")}>
            {translate("reports.x")}
          </button>
          <button className="report-button" onClick={() => navigate("/ZReport")}>
            {translate("reports.z")}
          </button>
          <button className="report-button" onClick={() => navigate("/SalesReport")}>
            {translate("reports.sales")}
          </button>
          <button className="report-button" onClick={() => navigate("/ProdChart")}>
            {translate("reports.prod")}
          </button>
        </div>
        <button className="back-button" onClick={() => navigate("/manager")}>
          ← {translate("reports.back")}
        </button>
      </div>
    </div>
  );
}

export default Reports;
