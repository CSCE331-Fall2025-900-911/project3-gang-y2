import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./XReport.css";

function XReport() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", role: "", wage: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  return (
    <div className="x-report-page">
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

      <main className="content">
        <h2>X Report (Hourly Sales Breakdown)</h2>

        <table className="x-report-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Sales</th>
              <th>Returns</th>
              <th>Voids</th>
              <th>Discards</th>
              <th>Cash</th>
              <th>Card</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>

      </main>
    </div>
  );
}

export default XReport;
