import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SalesReport.css";
import Navbar from "./Navbar"

function SalesReport() {
  const [report, setReport] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");     

  const fetchReport = () => {
    if (!fromDate || !toDate) return;
    fetch(`/api/reports/salesReport?fromDate=${fromDate}&toDate=${toDate}`)
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch((err) => console.error("Error fetching sales report:", err));
  };

  return (
    <div className="sales-report-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/manager">Back to Manager Menu</Link></li>
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/menu-items">Menu Items</Link></li>
            <li id="current-item"><Link to="/reports">Reports</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2>Sales Report</h2>

        <div className="date-filters">
          <label>
            From: <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label>
            To: <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
          <button onClick={fetchReport}>Generate Report</button>
        </div>

        <div className="sales-report-results box">
          <table className = "sales-report-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {report.length > 0 ? (
                report.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.itemname ?? row.itemName}</td>
                    <td>{row.salescount ?? row.salesCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default SalesReport;