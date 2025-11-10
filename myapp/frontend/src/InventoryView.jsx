import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./InventoryView.css";

function InventoryView() {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, item: "", amount: "", dateNext: "", dateLast: ""});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error("Error fetching inventory:", err));
  }, []);

  // Add or Update Item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `/api/inventory/${formData.id}`
      : "/api/inventory";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowForm(false);
      setIsEditing(false);
      setFormData({ id: null, item: "", amount: "", dateNext: "", dateLast: ""});
      // Refresh table
      const data = await (await fetch("/api/inventory")).json();
      setInventory(data);
    }
  };

  // Edit Item
  const handleEdit = (item) => {
    setIsEditing(true);
    setFormData(item);
    setShowForm(true);
  };

  // Delete Item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    await fetch(`/api/item/${id}`, { method: "DELETE" });
    setEmployees(inventory.filter((e) => e.id !== id));
  };

  return (
    <div className="inventory-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/manager">Back to Manager Menu</Link></li>
            <li><Link to="/employees">Employees</Link></li>
            <li id="current-item"><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/menu-items">Menu Items</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2>Inventory Management</h2>

        <button className="add-btn" onClick={() => setShowForm(true)}>
          ➕ Add Inventory
        </button>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount</th>
              <th>Date of Next Shipment</th>
              <th>Date of Last Shipment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.item}>  
                <td>{item.item}</td>
                <td>{item.amount}</td>
                <td>{item.datenext}</td>
                <td>{item.datelast}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>{isEditing ? "Edit Inventory" : "Add Inventory"}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Item"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Date of Next Shipment"
                  value={formData.dateNext}
                  onChange={(e) => setFormData({ ...formData, dateNext: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Date of Last Shipment"
                  value={formData.dateLast}
                  onChange={(e) => setFormData({ ...formData, dateLast: e.target.value })}
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

export default InventoryView;
