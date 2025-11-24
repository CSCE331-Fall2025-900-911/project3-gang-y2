import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Kiosk.css";
import Navbar from "./Navbar";
import { ZoomProvider } from "./ZoomContext";

function Kiosk() {
  // Holds menu items fetched from the backend
  const [menuItems, setMenuItems] = useState([]);

  // Tracks whether the data is still loading
  const [loading, setLoading] = useState(true);

  // currentOrder holds the list of the items on the current order
  const [currentOrder, setCurrentOrder] = useState([]);

  // currentItem holds the item currently being modified
  const [currentItem, setCurrentItem] = useState(null);

  // holds a value for modifiers 
  const [currentModifiers, setCurrentModifiers] = useState([{iceLevel:"medium", sugarLevel:"medium", topping:"none"}]);

  // sub total for order
  const[subtotal, setSubtotal] = useState(0.0);

  const openModification = (item) => {
    setCurrentItem(item);
    setCurrentModifiers({iceLevel:"medium", sugarLevel:"medium", topping:"none"}); // default values for each item
  };

  const closeModification = () => {
    setCurrentItem(null);
  };

  const changeModifiers = (e) => {
    const {name, value} = e.target;
    setCurrentModifiers((prev) => ({...prev, [name]:value }));
  };

  // function to add the pressed item to the order
  const addToOrder = () => {
    const modifiedItem = {
        ...currentItem, modifiers: {...currentModifiers}, // copies the state of modifiers and adds it to list
    };
    setSubtotal(subtotal + parseFloat(currentItem.price));
    setCurrentOrder((prevOrder) => [...prevOrder, modifiedItem]);
    setCurrentItem(null);
  };

  // submit order & get payment
  function placeOrder() {
    alert("Present payment");
  };

  // Fetch menu items from backend when the component loads
  useEffect(() => {
    fetch("/api/menu") // replace with real backend URL
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);   // store the menu data from backend
        setLoading(false);    // hide loading text once data arrives
      })
      .catch((err) => {
        console.error("Error fetching menu:", err);
        setLoading(false);    // still hide loading if there's an error
      });
  }, []); // empty [] means this runs once, when the page first loads

  // Display loading message until data is ready
  if (loading) {
    return <p className="loading">Loading menu...</p>;
  }

  // Render the actual page
  return (
    <ZoomProvider>
    <div className="kioskpage">
      <Navbar />

      <div className="sidebar-container">
        <div className="sidebar">
            <h2>Order</h2>
            {currentOrder.length === 0 ? ( <p>no items yet</p>) : 
            (<ul>
                {currentOrder.map((item, index) => 
                ( <li key={index}>
                    ${item.price} : <strong>{item.name} :</strong>   
                    <small>
                        <br/>
                        Ice:     {item.modifiers.iceLevel}<br/>
                        Sugar:   {item.modifiers.sugarLevel}<br/>
                        Topping: {item.modifiers.topping}<br/>
                    </small>
                    <br/>
                </li>))}
            </ul>

            )}
        </div>
        <div className="subtotal-container">
          <strong>SubTotal : </strong>${subtotal}
        </div>
        <div className="order-button-container">
            <button className="order-button" onClick={() => placeOrder()}>Place Order</button>
        </div>
      </div>

      <main className="menu-container">
        <div className="menu-grid">
          {menuItems.map((item) => (
            <button
              key={item.id} // unique key for React
              className="menu-button"
              onClick={() => openModification(item)}
            >
              ${item.price} : <strong>{item.name}</strong>
            </button>
          ))}
        </div>
      </main>

      {/* Modal for customization */}
      {currentItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid black",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>Customize {currentItem.name}</h3>

            <div style={{ margin: "1rem 0" }}>
              <label>
                Ice:
                <select
                  name="iceLevel"
                  value={currentModifiers.iceLevel}
                  onChange={changeModifiers}
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>

            <div style={{ margin: "1rem 0" }}>
              <label>
                Sugar:
                <select
                  name="sugarLevel"
                  value={currentModifiers.sugarLevel}
                  onChange={changeModifiers}
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>

            <div style={{ margin: "1rem 0" }}>
              <label>
                Topping:
                <select
                  name="topping"
                  value={currentModifiers.topping}
                  onChange={changeModifiers}
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value="none">None</option>
                  <option value="pearl">Pearl</option>
                  <option value="mini_pearl">Mini Pearl</option>
                  <option value="crystal_boba">Crystal Boba</option>
                  <option value="pudding">Pudding</option>
                  <option value="aloe_vera">Aloe Vera</option>
                  <option value="red_bean">Red Bean</option>
                  <option value="herb_jelly">Herb Jelly</option>
                  <option value="aiyu_jelly">Aiyu Jelly</option>
                  <option value="lychee_jelly">Lychee Jelly</option>
                  <option value="crema">Crema</option>
                  <option value="ice_cream">Ice Cream</option>
                </select>
              </label>
            </div>

            <button onClick={addToOrder} className="modify-button">
              Add to Order
            </button>
            <button onClick={closeModification} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
    </ZoomProvider>
  );
}

export default Kiosk;
