import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ZReport.css";

function ZReport() {
  const [report, setReport] = useState(null)

  useEffect(() => {
    fetch("/api/reports/zreport")
      .then((res) => res.json())
      .then((data) => {
        if (data.zReportGenerated){
          alert(data.message);
        } else {
          setReport(data);
        }
      })
      .catch((err) => console.error("Error fetching Z Report:", err));
  }, []);

  return (
    <div className="z-report-page">
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
        <h2>Z Report (End of Day Summary)</h2>

        <table className="z-report-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {report ? (
              <>
                <tr>
                  <td>Date</td>
                  <td>{report.date}</td>
                </tr>
                <tr>
                  <td>Total Revenue</td>
                  <td>${report.totalSales.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Sales Tax (6.25%)</td>
                  <td>${report.salesTax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Subtotal (Net Sales)</td>
                  <td>${report.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Number of Orders</td>
                  <td>{report.numSales}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="2">No Z Report Available (Can only generate once!)</td>
              </tr>
            )}
          </tbody>
        </table>

      </main>
    </div>
  );
}

export default ZReport;