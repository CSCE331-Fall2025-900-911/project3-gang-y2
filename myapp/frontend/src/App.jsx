import React from "react";
import { Link } from "react-router-dom";
import "./App.css";
import WeatherWidget from "./WeatherWidget";
import { ZoomProvider } from "./ZoomContext";
import Navbar from "./Navbar";
import { useTranslation } from "./i18n/TranslationContext.jsx";

function App() {
  const { translate } = useTranslation();
  return (

    <ZoomProvider>
    <div className="homepage">
      <Navbar /> 
      <main className="content">
        <h2>{translate("home.title")}</h2>
        <p>{translate("home.body")}</p>
        <br />
        <p>{translate("home.weather")}</p>

        <WeatherWidget/>

      </main>
    </div>
    </ZoomProvider>
  );
}

export default App;
