import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./EmployeesView.css";
import { useTranslation } from "./i18n/TranslationContext.jsx";

function EmployeesView() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", email: "", username: "", password: "", ismanager: false });
  const [isEditing, setIsEditing] = useState(false);
  const { translate } = useTranslation();

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // Add or Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `/api/employees/${formData.id}`
      : "/api/employees";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowForm(false);
      setIsEditing(false);
      setFormData({ id: null, name: "", email: "", username: "", password: "", ismanager: false });
      // Refresh table
      const data = await (await fetch("/api/employees")).json();
      setEmployees(data);
    }
  };

  // Edit Employee
  const handleEdit = (emp) => {
    setIsEditing(true);
    setFormData({ ...emp, password: "" }); // Don't pre-fill password
    setShowForm(true);
  };

  // Delete Employee
  const handleDelete = async (id) => {
    if (!window.confirm(translate("employees.deleteConfirm"))) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    setEmployees(employees.filter((e) => e.id !== id));
  };

  return (
    <div className="employees-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/manager">{translate("nav.managerBack")}</Link></li>
            <li id="current-item"><Link to="/employees">{translate("employees.title")}</Link></li>
            <li><Link to="/inventory">{translate("nav.inventory")}</Link></li>
            <li><Link to="/menu-items">{translate("nav.menuItems")}</Link></li>
            <li><Link to="/reports">{translate("nav.reports")}</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2>{translate("employees.title")}</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          ➕ {translate("employees.add")}
        </button>

        <table className="employee-table">
          <thead>
            <tr>
              <th>{translate("employees.table.id")}</th>
              <th>{translate("employees.table.name")}</th>
              <th>{translate("employees.table.email")}</th>
              <th>{translate("employees.table.username")}</th>
              <th>{translate("employees.table.role")}</th>
              <th>{translate("employees.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.username}</td>
                <td>{emp.ismanager ? translate("employees.role.manager") : translate("employees.role.cashier")}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(emp)}>✏️ {translate("employees.table.actions")}</button>
                  <button className="delete-btn" onClick={() => handleDelete(emp.id)}>🗑 {translate("employees.table.actions")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>{isEditing ? translate("employees.edit") : translate("employees.addModal")}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={translate("employees.table.name")}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={translate("employees.table.username")}
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={formData.email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={translate("employees.table.role")}
                  value={formData.ismanager}
                  onChange={(e) => setFormData({ ...formData, ismanager: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              
                <div className="modal-buttons">
                  <button type="submit">{isEditing ? translate("menu.table.edit") : translate("employees.add")}</button>
                  <button type="button" onClick={() => setShowForm(false)}>{translate("reports.back")}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default EmployeesView;
