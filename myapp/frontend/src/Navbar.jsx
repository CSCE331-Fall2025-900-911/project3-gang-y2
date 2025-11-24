import React from "react";
import { Link } from "react-router-dom";
import { useZoom } from "./ZoomContext";
// import "./App.css";

export default function Navbar() {
    const { updateZoom } = useZoom();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <h1 className="logo">MatchaBoba POS</h1>
                <ul className="nav-links">
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/kiosk">Customer Kiosk</Link></li>
                    <li><Link to="/menu">Menu Board</Link></li>
                </ul>
                <div className="zoom-controls">
                    Zoom: 
                    <button onClick={() => updateZoom(1)}>100%</button>
                    <button onClick={() => updateZoom(1.25)}>125%</button>
                    <button onClick={() => updateZoom(1.5)}>150%</button>
                </div>
            </div>
            
        </nav>
    );
}
