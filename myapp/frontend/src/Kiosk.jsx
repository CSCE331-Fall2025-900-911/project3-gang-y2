<<<<<<< HEAD
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
=======
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Kiosk.css";

    const menuItems = [
        'Classic Pearl Milk Black Tea', 'Classic Pearl Milk Green Tea', 'Classic Pearl Milk Oolong Tea', 
        'Honey Pearl Milk Black Tea', 'Honey Pearl Milk Green Tea', 'Honey Pearl Milk Oolong Tea', 
        'Coffee Creama', 'Coffee Milk Tea w/ Coffee Jelly', 'Hokkaido Pearl', 
        'Thai Pearl Milk Tea', 'Taro Pearl Milk Tea', 'Mango Green Milk Tea', 
        'Golden Retriever', 'Coconut Pearl Milk Black Tea', 'Coconut Pearl Milk Green Tea', 
        'Classic Black Tea', 'Classic Green Tea', 'Classic Oolong Tea', 
        'Honey Black Tea', 'Honey Green Tea', 'Honey Oolong Tea'
    ];

    // 
function Kiosk() {

    const onSelectItem = (item) => {
        alert(`You selected: ${item}`);
        // add to cart or something
    };
    const menuList = menuItems.map(item => 
        <button className="menu-button" onClick={() => onSelectItem(item)}>
            {item}
        </button>
    );
    return (
        <div className="kioskpage">
            {/* navigation bar for page top, might be removed from kiosk later */}
            <nav className="navbar">
                <div className="nav-container">
                    <h1 className="logo">MatchaBoba POS</h1>
                    <h2 className="pageTitle">Menu</h2>
                    <ul className="nav-links">
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/kiosk">Customer Kiosk</Link></li>
                        <li><Link to="/menu">Menu Board</Link></li>
                    </ul>
                </div>
            </nav>

            <div className="menu-container">
                <div className="menu-grid">
                    {/* {menuItems.map((item, index) (
                    <button
                        key={index}
                        className="menu-button"
                        onClick={() => onSelectItem(item)}
                    >
                        {item}
                    </button>
                    ))} */}
                    <ul>{menuList}</ul>
                </div>
            </div>
        </div>
    );
};
>>>>>>> 076c18f996c945b7934c35199507860e30b69fa0

export default Kiosk;
