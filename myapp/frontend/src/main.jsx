import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoutes";

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
import { TtsSettingsProvider } from "./TtsSettingsContext.jsx";
import TtsToggle from "./TtsToggle.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="914823058994-bnhcq5hre73bj2fnt89m0u3bmkqlnvts.apps.googleusercontent.com">
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/kiosk" element={<Kiosk />} />

          {/* Protected: Employees & Managers */}
          <Route 
            path="/cashier" 
            element={
              <ProtectedRoute>
                <Cashier />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected: Managers Only */}
          <Route 
            path="/manager" 
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/employees" 
            element={
              <ProtectedRoute requiredRole="manager">
                <EmployeesView />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/inventory" 
            element={
              <ProtectedRoute requiredRole="manager">
                <InventoryView />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/reports" 
            element={
              <ProtectedRoute requiredRole="manager">
                <Reports />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/XReport" 
            element={
              <ProtectedRoute requiredRole="manager">
                <XReport />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/ZReport" 
            element={
              <ProtectedRoute requiredRole="manager">
                <ZReport />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/ProdChart" 
            element={
              <ProtectedRoute requiredRole="manager">
                <ProdChart />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/SalesReport" 
            element={
              <ProtectedRoute requiredRole="manager">
                <SalesReport />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/menu-items" 
            element={
              <ProtectedRoute requiredRole="manager">
                <MenuItemView />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/kiosk" element={<Kiosk />} />
//         <Route path="/cashier" element={<Cashier />} />
//         <Route path="/manager" element={<ManagerDashboard />} />
//         <Route path="/employees" element={<EmployeesView />} />
//         <Route path="/inventory" element={<InventoryView />} />
//         <Route path="/reports" element={<Reports />} /> 
//         <Route path="/XReport" element={<XReport />} />
//         <Route path="/ZReport" element={<ZReport />} />
//         <Route path="/ProdChart" element={<ProdChart />} />
//         <Route path="/SalesReport" element={<SalesReport />} />
//         <Route path="/menu-items" element={<MenuItemView />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );
