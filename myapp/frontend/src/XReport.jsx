import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./XReport.css";

function XReport() {

  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch("/api/reports/xreport")
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error("Error fetching sales:", err));
  }, []);

  return (
    <div className="x-report-page">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" style={{textDecoration: "none", color: "inherit", fontWeight: "bold", fontSize: "1.5rem"}}>MatchaBoba POS</Link>          
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
        <h2>X Report (Hourly Sales Breakdown)</h2>
      <div className = "x-report-results box">
        <table className="x-report-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Revenue</th>
              <th>Number of Sales</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((row, idx) => (
              <tr key={idx}>
                <td>{row.hour_bucket}</td>
                <td>${row.total_sales}</td>
                <td>{row.num_sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </main>
    </div>
  );
}

export default XReport;
