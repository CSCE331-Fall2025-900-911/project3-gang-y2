import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./Login.jsx";
import Kiosk from "./Kiosk.jsx";
import Cashier from "./Cashier.jsx";
import ManagerDashboard from "./ManagerDash.jsx";
import EmployeesView from "./EmployeesView.jsx";
import InventoryView from "./InventoryView.jsx";
import Reports from "./Reports.jsx";
import XReport from "./XReport.jsx";
import ZReport from "./ZReport.jsx";
import ProdChart from "./ProdChart.jsx";
import SalesReport from "./SalesReport.jsx";
import MenuItemView from "./MenuItemView.jsx";
import "./index.css";
import FocusSpeechAnnouncer from "./FocusSpeechAnnouncer.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <FocusSpeechAnnouncer />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kiosk" element={<Kiosk />} />
        <Route path="/cashier" element={<Cashier />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/employees" element={<EmployeesView />} />
        <Route path="/inventory" element={<InventoryView />} />
        <Route path="/reports" element={<Reports />} /> 
        <Route path="/XReport" element={<XReport />} />
        <Route path="/ZReport" element={<ZReport />} />
        <Route path="/ProdChart" element={<ProdChart />} />
        <Route path="/SalesReport" element={<SalesReport />} />
        <Route path="/menu-items" element={<MenuItemView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
