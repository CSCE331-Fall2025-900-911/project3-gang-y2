import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Kiosk.css";

// menuItems = {
//     // call the backend here to get the menu items for the buttons?
// };

function Kiosk() {
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
                <p>testing the page rn</p>
            </main>
        </div>
    );
}

export default Kiosk;
