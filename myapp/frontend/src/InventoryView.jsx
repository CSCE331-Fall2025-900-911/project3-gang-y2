import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./InventoryView.css";
import { useTranslation } from "./i18n/TranslationContext.jsx";

function InventoryView() {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, item: "", amount: "", dateNext: "", dateLast: ""});
  const [isEditing, setIsEditing] = useState(false);
  const { translate } = useTranslation();

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
  const handleDelete = async (inventoryitem) => {
    if (!window.confirm(translate("inventory.deleteConfirm"))) return;
    await fetch(`/api/inventory/${inventoryitem}`, { method: "DELETE" });
    setInventory(inventory.filter((item) => item.item !== inventoryitem));
  };

  return (
    <div className="inventory-page">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" style={{textDecoration: "none", color: "inherit", fontWeight: "bold", fontSize: "1.5rem"}}>MatchaBoba POS</Link>
          <ul className="nav-links">
            <li><Link to="/manager">{translate("nav.managerBack")}</Link></li>
            <li><Link to="/employees">{translate("nav.employees")}</Link></li>
            <li id="current-item"><Link to="/inventory">{translate("inventory.title")}</Link></li>
            <li><Link to="/menu-items">{translate("nav.menuItems")}</Link></li>
            <li><Link to="/reports">{translate("nav.reports")}</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2>{translate("inventory.title")}</h2>

        <button className="add-btn" onClick={() => setShowForm(true)}>
          ➕ {translate("inventory.add")}
        </button>

        <table className="inventory-table">
          <thead>
            <tr>
              <th>{translate("inventory.table.item")}</th>
              <th>{translate("inventory.table.amount")}</th>
              <th>{translate("inventory.table.next")}</th>
              <th>{translate("inventory.table.last")}</th>
              <th>{translate("inventory.table.actions")}</th>
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
                  <button className="edit-btn" onClick={() => handleEdit(item)}>✏️ {translate("menu.table.edit")}</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.item)}>🗑 {translate("menu.table.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>{isEditing ? translate("inventory.edit") : translate("inventory.addModal")}</h3>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder={translate("inventory.table.item")}
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={translate("inventory.table.amount")}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={translate("inventory.table.next")}
                  value={formData.dateNext}
                  onChange={(e) => setFormData({ ...formData, dateNext: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder={translate("inventory.table.last")}
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
