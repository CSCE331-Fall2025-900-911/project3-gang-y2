import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MenuBoard.css";
import Navbar from "./Navbar";
import { ZoomProvider } from "./ZoomContext";

function MenuBoard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Menu fetch error:", err));
  }, []);

  return (
    <ZoomProvider>
    <div className="menuboard-page">
      <Navbar />

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
    </ZoomProvider>
  );
}

export default MenuBoard;
