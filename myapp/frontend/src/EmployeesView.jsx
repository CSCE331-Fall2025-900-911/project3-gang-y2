import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./EmployeesView.css";

function EmployeesView() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", role: "", wage: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // Add or Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:3000/api/employees/${formData.id}`
      : "http://localhost:3000/api/employees";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowForm(false);
      setIsEditing(false);
      setFormData({ id: null, name: "", role: "", wage: "" });
      // Refresh table
      const data = await (await fetch("http://localhost:3000/api/employees")).json();
      setEmployees(data);
    }
  };

  // Edit Employee
  const handleEdit = (emp) => {
    setIsEditing(true);
    setFormData(emp);
    setShowForm(true);
  };

  // Delete Employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    await fetch(`http://localhost:3000/api/employees/${id}`, { method: "DELETE" });
    setEmployees(employees.filter((e) => e.id !== id));
  };

  return (
    <div className="employees-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/manager">Back to Manager Menu</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/menu-items">Menu Items</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2>Employee Management</h2>

        <button className="add-btn" onClick={() => setShowForm(true)}>
          ➕ Add Employee
        </button>

        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Wage ($/hr)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.role}</td>
                <td>{emp.wage}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(emp)}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(emp.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>{isEditing ? "Edit Employee" : "Add Employee"}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Wage"
                  value={formData.wage}
                  onChange={(e) => setFormData({ ...formData, wage: e.target.value })}
                  required
                />

                <div className="modal-buttons">
                  <button type="submit">{isEditing ? "Update" : "Add"}</button>
                  <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
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
