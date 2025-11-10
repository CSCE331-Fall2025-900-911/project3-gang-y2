import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Reports.css";

function Reports() {

  const navigate = useNavigate();

  return (
    <div className="reports-page">

        <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/manager">Back to Manager Menu</Link></li>
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/menu-items">Menu Items</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </div>
      </nav>

      <div className="reports">
        <h2>Generate Reports</h2>
            <button className="report-button" onClick={() => navigate("/XReport")}>
            X Report
            </button>
            <button className="report-button" onClick={() => navigate("/")}>
            Z Report
            </button>
            <button className="report-button" onClick={() => navigate("/")}>
            Sales Report
            </button>
            <button className="report-button" onClick={() => navigate("/")}>
            Product Usage Chart
            </button>
            <button className="back-button" onClick={() => navigate("/manager")}>
            ← Back to Manager Dashboard
            </button>
      </div>
    </div>
  );
}

export default Reports;
