import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ProdChart.css";

function ProdChart() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);

  const fetchData = () => {
    if (!fromDate || !toDate) return;
    fetch(`/api/reports/productUsage?fromDate=${fromDate}&toDate=${toDate}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error fetching product usage:", err));
  };

  return (
    <div className="prod-chart-page">
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
        <h2>Product Usage Chart</h2>

        <div className="date-filters">
          <label>
            From: <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </label>
          <label>
            To: <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </label>
          <button onClick={fetchData}>Generate</button>
        </div>

      <div className = "prod-chart-results box">
        <table className="prod-chart-table">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Quantity Used</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.ingredient}</td>
                  <td>{row.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </main>
    </div>
  );
}

export default ProdChart;
