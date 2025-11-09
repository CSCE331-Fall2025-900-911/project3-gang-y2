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

export default Kiosk;
