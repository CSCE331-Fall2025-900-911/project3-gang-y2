import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./Login.jsx";
import Kiosk from "./Kiosk.jsx";
import ManagerDashboard from "./ManagerDash.jsx";
import EmployeesView from "./EmployeesView.jsx";
import Reports from "./Reports.jsx";
import XReport from "./XReport.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kiosk" element={<Kiosk />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/employees" element={<EmployeesView />} />
        <Route path="/reports" element={<Reports />} /> 
        <Route path="/XReport" element={<XReport />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
