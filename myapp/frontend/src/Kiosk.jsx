import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Kiosk.css";
import Navbar from "./Navbar";
import { ZoomProvider } from "./ZoomContext";
import TextToSpeechButton from "./TextToSpeechButton.jsx";
import { getOrderSpeech } from "./utils/speechHelpers.js";
import { useTextToSpeech } from "./hooks/useTextToSpeech.js";
import { useTtsSettings } from "./TtsSettingsContext.jsx";

function Kiosk() {
  // Holds menu items fetched from the backend
  const [menuItems, setMenuItems] = useState([]);

  // Tracks whether the data is still loading
  const [loading, setLoading] = useState(true);

  // currentOrder holds the list of the items on the current order
  const [currentOrder, setCurrentOrder] = useState([]);

  // currentItem holds the item currently being modified
  const [currentItem, setCurrentItem] = useState(null);
  const firstOptionRef = useRef(null);

  // holds a value for modifiers 
  const [currentModifiers, setCurrentModifiers] = useState([{iceLevel:"medium", sugarLevel:"medium", topping:"none"}]);

  // sub total for order
  const[subtotal, setSubtotal] = useState(0.0);
  const { canSpeak: canSpeakSelection, startTalking: saySelection } = useTextToSpeech({ rate: 1 });
  const { ttsEnabled } = useTtsSettings();

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
    if (canSpeakSelection && ttsEnabled) {
      const labelMap = {
        iceLevel: {
          none: "No ice",
          low: "Low ice",
          medium: "Medium ice",
          high: "High ice",
        },
        sugarLevel: {
          none: "No sugar",
          low: "Low sugar",
          medium: "Medium sugar",
          high: "High sugar",
        },
        topping: {
          none: "No topping",
          pearl: "Pearl",
          mini_pearl: "Mini pearl",
          crystal_boba: "Crystal boba",
          pudding: "Pudding",
          aloe_vera: "Aloe vera",
          red_bean: "Red bean",
          herb_jelly: "Herb jelly",
          aiyu_jelly: "Aiyu jelly",
          lychee_jelly: "Lychee jelly",
          crema: "Crema",
          ice_cream: "Ice cream",
        },
      };
      const spoken = labelMap[name]?.[value] || value;
      saySelection(`Set ${name} to ${spoken}`);
    }
  };

  // function to add the pressed item to the order
  const addToOrder = () => {
    const modifiedItem = {
        ...currentItem, modifiers: {...currentModifiers}, // copies the state of modifiers and adds it to list
    };
    setSubtotal(subtotal + parseFloat(currentItem.price));
    setCurrentOrder((prevOrder) => [...prevOrder, modifiedItem]);
    if (canSpeakSelection && modifiedItem && ttsEnabled) {
      const price = Number.isFinite(parseFloat(modifiedItem.price))
        ? `${parseFloat(modifiedItem.price).toFixed(2)} dollars`
        : modifiedItem.price;
      saySelection(
        `Added ${modifiedItem.name}. ${price}. Ice ${modifiedItem.modifiers.iceLevel}. Sugar ${modifiedItem.modifiers.sugarLevel}. Topping ${modifiedItem.modifiers.topping}.`
      );
    }
    setCurrentItem(null);
  };

  // submit order & get payment
  function placeOrder() {
    alert("Present payment");
  };

  useEffect(() => {
    if (currentItem && firstOptionRef.current) {
      firstOptionRef.current.focus();
    }
  }, [currentItem]);

  const kioskSpeechText = useMemo(() => {
    const orderDescription = getOrderSpeech(currentOrder, subtotal);
    return `Welcome to the MatchaBoba self-service kiosk. Tap a drink to customize ice, sugar, and toppings before adding it to your order. ${orderDescription}`;
  }, [currentOrder, subtotal]);

  const menuButtonLabel = useCallback((item) => {
    const numericPrice = parseFloat(item.price);
    const priceText = Number.isFinite(numericPrice) ? numericPrice.toFixed(2) : item.price;
    return `Drink ${item.name}. ${priceText} dollars. Press enter to customize ice, sugar, and toppings.`;
  }, []);

  const orderLineLabel = useCallback((item, index) => {
    return `Order item ${index + 1}. ${item.name}. Price ${item.price} dollars. Ice ${item.modifiers.iceLevel}, sugar ${item.modifiers.sugarLevel}, topping ${item.modifiers.topping}.`;
  }, []);

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
            <div className="tts-stack">
              <p className="tts-helper">Need it read aloud? Use the speaker.</p>
              <TextToSpeechButton
                text={kioskSpeechText}
                label="Read kiosk instructions and current order"
              />
            </div>
            {currentOrder.length === 0 ? ( <p>no items yet</p>) : 
            (<ul>
                {currentOrder.map((item, index) => 
                ( <li
                    key={index}
                    tabIndex="0"
                    data-tts={orderLineLabel(item, index)}
                  >
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
            <button
              className="order-button"
              onClick={() => placeOrder()}
              data-tts="Place order and present payment."
              aria-label="Place order and present payment."
            >
              Place Order
            </button>
        </div>
      </div>

      <main className="menu-container">
        <div className="menu-grid">
          {menuItems.map((item) => (
            <button
              key={item.id} // unique key for React
              className="menu-button"
              onClick={() => openModification(item)}
              data-tts={menuButtonLabel(item)}
              aria-label={menuButtonLabel(item)}
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
            role="dialog"
            aria-modal="true"
            aria-label={`Customize ${currentItem.name}`}
          >
            <h3>Customize {currentItem.name}</h3>

            <div style={{ margin: "1rem 0" }}>
              <label>
                Ice:
                <select
                  name="iceLevel"
                  value={currentModifiers.iceLevel}
                  onChange={changeModifiers}
                  ref={firstOptionRef}
                  aria-label="Select ice level"
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value="none">None</option>
                  <option value="low" data-tts="Low ice">Low</option>
                  <option value="medium" data-tts="Medium ice">Medium</option>
                  <option value="high" data-tts="High ice">High</option>
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
                  aria-label="Select sugar level"
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value="none">None</option>
                  <option value="low" data-tts="Low sugar">Low</option>
                  <option value="medium" data-tts="Medium sugar">Medium</option>
                  <option value="high" data-tts="High sugar">High</option>
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
                  aria-label="Select topping"
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value="none">None</option>
                  <option value="pearl" data-tts="Pearl">Pearl</option>
                  <option value="mini_pearl" data-tts="Mini pearl">Mini Pearl</option>
                  <option value="crystal_boba" data-tts="Crystal boba">Crystal Boba</option>
                  <option value="pudding" data-tts="Pudding">Pudding</option>
                  <option value="aloe_vera" data-tts="Aloe vera">Aloe Vera</option>
                  <option value="red_bean" data-tts="Red bean">Red Bean</option>
                  <option value="herb_jelly" data-tts="Herb jelly">Herb Jelly</option>
                  <option value="aiyu_jelly" data-tts="Aiyu jelly">Aiyu Jelly</option>
                  <option value="lychee_jelly" data-tts="Lychee jelly">Lychee Jelly</option>
                  <option value="crema" data-tts="Crema topping">Crema</option>
                  <option value="ice_cream" data-tts="Ice cream">Ice Cream</option>
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
