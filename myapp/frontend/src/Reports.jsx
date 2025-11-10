import React from "react";
import { useNavigate } from "react-router-dom";
import "./Reports.css";

function Reports() {

  const navigate = useNavigate();

  return (
    <div className="reports-page">
      <div className="reports">
        <h2>Generate Reports</h2>
            <button className="report-button" onClick={() => navigate("/")}>
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
