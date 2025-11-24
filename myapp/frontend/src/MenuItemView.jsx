import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./MenuItemView.css";
import TextToSpeechButton from "./TextToSpeechButton.jsx";
import { useTranslation } from "./i18n/TranslationContext.jsx";

function MenuItemView() {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", calories: ""});
  const [isEditing, setIsEditing] = useState(false);
  const { translate } = useTranslation();

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

  const menuSpeechText = useMemo(() => {
    if (menuItems.length === 0) {
      return translate("menu.summary.empty");
    }

    const highlightList = menuItems
      .slice(0, 3)
      .map((item) => `${item.name} ${item.price} dollars`)
      .join(", ");

    const highlight = highlightList ? translate("menu.highlight", { list: highlightList }) : "";

    return translate("menu.summary", {
      count: menuItems.length,
      highlights: highlight,
    });
  }, [menuItems, translate]);

  const rowLabel = useCallback(
    (item) => {
      return translate("menu.row", {
        id: item.itemid,
        name: item.name,
        description: item.description,
        price: item.price,
        calories: item.calories,
      });
    },
    [translate]
  );

  return (
    <div className="menu-item-page">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">MatchaBoba POS</h1>
          <ul className="nav-links">
            <li><Link to="/manager">{translate("nav.managerBack")}</Link></li>
            <li><Link to="/employees">{translate("nav.employees")}</Link></li>
            <li><Link to="/inventory">{translate("nav.inventory")}</Link></li>
            <li id="current-item"><Link to="/menu-items">{translate("nav.menuItems")}</Link></li>
            <li><Link to="/reports">{translate("nav.reports")}</Link></li>
          </ul>
        </div>
      </nav>

      <main className="content">
        <h2>{translate("menu.header")}</h2>
        <div className="menu-tts tts-stack">
          <p className="tts-helper">{translate("menu.read")}</p>
          <TextToSpeechButton
            text={menuSpeechText}
            label={translate("menu.read")}
          />
        </div>

        <button
          className="add-btn"
          onClick={() => setShowForm(true)}
          data-tts={translate("menu.add")}
          aria-label={translate("menu.add")}
        >
          ➕ {translate("menu.add")}
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
              <tr key={item.itemid} tabIndex="0" data-tts={rowLabel(item)}>  
                <td>{item.itemid}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.calories}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(item)}
                    data-tts={`${translate("menu.table.edit")} ${item.name}. Price ${item.price} dollars, calories ${item.calories}.`}
                    aria-label={`${translate("menu.table.edit")} ${item.name}. Price ${item.price} dollars, calories ${item.calories}.`}
                  >
                    ✏️ {translate("menu.table.edit")}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.itemid)}
                    data-tts={`${translate("menu.table.delete")} ${item.name}. Price ${item.price} dollars.`}
                    aria-label={`${translate("menu.table.delete")} ${item.name}. Price ${item.price} dollars.`}
                  >
                    🗑 {translate("menu.table.delete")}
                  </button>
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
