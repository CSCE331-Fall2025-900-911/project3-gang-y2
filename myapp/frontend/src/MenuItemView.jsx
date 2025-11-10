import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MenuItemView.css";

function MenuItemView() {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", calories: ""});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setMenuItems(data))
      .catch((err) => console.error("Error fetching menu items:", err));
  }, []);

  // Add or Update Item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `/api/menu/${formData.itemid}`
      : "/api/menu";

    const body = JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        calories: formData.calories,
    });

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    if (res.ok) {
      setShowForm(false);
      setIsEditing(false);
      setFormData({ itemid: null, name: "", description: "", price: "", calories: ""});
      // Refresh table
      const data = await (await fetch("/api/menu")).json();
      setMenuItems(data);
    }
  };

  // Edit Item
  const handleEdit = (item) => {
    setIsEditing(true);
    setFormData(item);
    setShowForm(true);
  };

  // Delete Item
  const handleDelete = async (itemid) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const res = await fetch(`/api/menu/${itemid}`, { method: "DELETE" });
    if (res.ok) {
 
        try {
            const data = await (await fetch("/api/menu")).json();
            setMenuItems(data);
        } 
        catch (err) {
            console.error("Error refreshing menu after delete:", err);
            setMenuItems(menuItems.filter((e) => e.itemid !== itemid)); 
        }
        } 
        else {
            console.error("Failed to delete item from server.");
        }
  };

  return (
    <div className="menu-item-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/manager">Back to Manager Menu</Link></li>
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li id="current-item"><Link to="/menu-items">Menu Items</Link></li>
            <li><Link to="/reports">Reports</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2>Menu Item Management</h2>

        <button className="add-btn" onClick={() => setShowForm(true)}>
          ➕ Add Menu Item
        </button>

        <table className="menu-item-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Calories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.itemid}>  
                <td>{item.itemid}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.calories}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>✏️ Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.itemid)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <h3>{isEditing ? "Edit Menu Item" : "Add Menu Item"}</h3>
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
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Calories"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
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

export default MenuItemView;
