import React from "react";
import { Link } from "react-router-dom";
import "./ManagerDash.css";

function ManagerDash() {
  return (
    <div className="manager-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/">Back to Landing</Link></li>
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/menu-items">Menu Items</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2 className="manager-title">Manager View</h2>
        <p className="manager-subtext">Use the navigation above to manage store operations.</p>
      </main>
    </div>
  );
}

export default ManagerDash;
