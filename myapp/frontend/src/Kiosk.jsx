import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Kiosk.css";

function Kiosk() {
  // Holds menu items fetched from the backend
  const [menuItems, setMenuItems] = useState([]);

  // Tracks whether the data is still loading
  const [loading, setLoading] = useState(true);

  // Fetch menu items from backend when the component loads
  useEffect(() => {
    fetch("http://localhost:3000/api/menu") // replace with real backend URL
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);   // store the menu data from backend
        setLoading(false);    // hide loading text once data arrives
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setLoading(false);    // still hide loading if there's an error
      });
  }, []); // empty [] means this runs once, when the page first loads

  // Display loading message until data is ready
  if (loading) {
    return <p className="loading">Loading menu...</p>;
  }

  // Render the actual page
  return (
    <div className="kioskpage">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/kiosk">Customer Kiosk</Link></li>
            <li><Link to="/menu">Menu Board</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2 className="menu-title">Select an Item</h2>
        <div className="menu-grid">
          {menuItems.map((item) => (
            <button
              key={item.id} // unique key for React
              className="menu-button"
              onClick={() => alert(`You selected ${item.name}`)}
            >
              {item.name}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Kiosk;
