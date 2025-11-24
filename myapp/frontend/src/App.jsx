import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import WeatherWidget from "./WeatherWidget";
import { useZoom } from "./ZoomContext";
import { ZoomProvider } from "./ZoomContext";

function App() {
  const updateZoom = useZoom();
  return (

    <ZoomProvider>
    <div className="homepage">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/kiosk">Customer Kiosk</Link></li>
            <li><Link to="/menu">Menu Board</Link></li>
          </ul>
          <div className="zoom-controls">
            Zoom Level: 
            <button onClick={() => updateZoom(1)}>100%</button>
            <button onClick={() => updateZoom(1.25)}>125%</button>
            <button onClick={() => updateZoom(1.5)}>150%</button>
          </div>
        </div>
        
      </nav>

      <main className="content">
        <h2>Welcome to MatchaBoba POS</h2>
        <p>
          Tap in with us by logging in if you are an employee. Take a look at
          our menu board! Or visit our self-service kiosk to order it yourself.
        </p>
        <br></br>
        <p>Local Weather:</p>

        <WeatherWidget/>

      </main>
    </div>
    </ZoomProvider>
  );
}

export default App;
