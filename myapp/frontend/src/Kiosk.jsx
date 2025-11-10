import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Kiosk.css";

function Kiosk() {
  // Holds menu items fetched from the backend
  const [menuItems, setMenuItems] = useState([]);

  // Tracks whether the data is still loading
  const [loading, setLoading] = useState(true);

  // currentOrder = ["test item 1", "test item 2"]; // list to keep current order in memory
  const [currentOrder, setCurrentOrder] = useState([]);

  const addToOrder = (item) => {
    setCurrentOrder((prevOrder) => [...prevOrder, item]);
  };


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

      <div className="sidebar-container">
        <div className="sidebar">
            <h2>Order</h2>
            {currentOrder.length === 0 ? ( <p>no items yet</p>) : 
            (<ul>
                {currentOrder.map((item, index) => 
                ( <li key={index}>{item.name}</li>))}
            </ul>
            )}
        </div>
      </div>

      <main className="menu-container">
        <div className="menu-grid">
          {menuItems.map((item) => (
            <button
              key={item.id} // unique key for React
              className="menu-button"
              onClick={() => addToOrder(item)}
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
