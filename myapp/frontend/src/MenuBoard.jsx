import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MenuBoard.css";

function MenuBoard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/menu")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Menu fetch error:", err));
  }, []);

  return (
    <div className="menuboard-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/kiosk">Customer Kiosk</Link></li>
            <li><Link to="/login">Manager Login</Link></li>
          </ul>
        </div>
      </nav>

      <h2 className="menu-title">Our Menu</h2>

      <div className="menu-grid">
        {items.map((item) => (
          <div key={item.itemid} className="menu-item-box">
            <div className="item-row">
              <span className="item-name">{item.name}</span>
              
              <span className="item-price">${item.price.toFixed(2)}</span>
            </div>
            <p className="item-cal">{item.calories} cal</p>
          </div>
        ))}
      </div>

      {/* New Sections Below */}

      <div className="options-section">
        <h3 className="section-title">Ice Levels</h3>
        <div className="option-list">
          <span>High</span>
          <span>Medium</span>
          <span>Low</span>
          <span>None</span>
        </div>

        <h3 className="section-title">Sugar Levels</h3>
        <div className="option-list">
          <span>High</span>
          <span>Medium</span>
          <span>Low</span>
          <span>None</span>
        </div>

        <h3 className="section-title">Toppings</h3>
        <div className="option-list">
            <span>Pearl</span>
            <span>Mini Pearl</span>
            <span>Crystal Boba</span>
            <span>Pudding</span>
            <span>Aloe Vera</span>
            <span>Red Bean</span>
            <span>Herb Jelly</span>
            <span>Aiyu Jelly</span>
            <span>Lychee Jelly</span>
            <span>Crema</span>
            <span>Ice Cream</span>
        </div>
      </div>

    </div>
  );
}

export default MenuBoard;
