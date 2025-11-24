import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import WeatherWidget from "./WeatherWidget";
import { useZoom } from "./ZoomContext";
import { ZoomProvider } from "./ZoomContext";
import Navbar from "./Navbar";

function App() {
  // const updateZoom = useZoom();
  return (

    <ZoomProvider>
    <div className="homepage">
      <Navbar /> 
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
