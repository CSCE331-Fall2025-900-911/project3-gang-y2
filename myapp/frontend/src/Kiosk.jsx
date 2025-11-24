import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Kiosk.css";
import Navbar from "./Navbar";
import { ZoomProvider } from "./ZoomContext";
import TextToSpeechButton from "./TextToSpeechButton.jsx";
import { getOrderSpeech } from "./utils/speechHelpers.js";
import { useTextToSpeech } from "./hooks/useTextToSpeech.js";
import { useTtsSettings } from "./TtsSettingsContext.jsx";
import { useTranslation } from "./i18n/TranslationContext.jsx";

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
  const { language, translate } = useTranslation();
  const langCode = language === "es" ? "es-ES" : "en-US";
  const { canSpeak: canSpeakSelection, startTalking: saySelection } = useTextToSpeech({ rate: 1, lang: langCode });
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
      const fieldKey = name === "iceLevel" ? "mod.field.ice" : name === "sugarLevel" ? "mod.field.sugar" : "mod.field.topping";
      const valueKey = name === "iceLevel" ? `mod.ice.${value}` : name === "sugarLevel" ? `mod.sugar.${value}` : `mod.topping.${value}`;
      const fieldText = translate(fieldKey, {});
      const valueText = translate(valueKey, {});
      saySelection(translate("tts.setModifier", { field: fieldText, value: valueText }));
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
      const ice = translate(`mod.ice.${modifiedItem.modifiers.iceLevel}`);
      const sugar = translate(`mod.sugar.${modifiedItem.modifiers.sugarLevel}`);
      const topping = translate(`mod.topping.${modifiedItem.modifiers.topping}`);
      saySelection(
        translate("order.added", {
          name: modifiedItem.name,
          price,
          ice,
          sugar,
          topping,
        })
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
    const orderDescription = getOrderSpeech(currentOrder, subtotal, translate);
    return `${translate("tts.intro.kiosk")} ${orderDescription}`;
  }, [currentOrder, subtotal, translate]);

  const menuButtonLabel = useCallback(
    (item) => {
      const numericPrice = parseFloat(item.price);
      const priceText = Number.isFinite(numericPrice) ? numericPrice.toFixed(2) : item.price;
      return translate("tts.menuButton", { name: item.name, price: priceText });
    },
    [translate]
  );

  const orderLineLabel = useCallback(
    (item, index) => {
      const ice = translate(`mod.ice.${item.modifiers.iceLevel}`);
      const sugar = translate(`mod.sugar.${item.modifiers.sugarLevel}`);
      const topping = translate(`mod.topping.${item.modifiers.topping}`);
      const priceText = item.price;
      return translate("tts.orderLine", {
        num: index + 1,
        name: item.name,
        price: priceText,
        ice,
        sugar,
        topping,
      });
    },
    [translate]
  );

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
            <h2>{translate("order.title")}</h2>
            <div className="tts-stack">
              <p className="tts-helper">{translate("tts.helper.kiosk")}</p>
              <TextToSpeechButton
                text={kioskSpeechText}
                label={translate("tts.helper.kiosk")}
              />
            </div>
            {currentOrder.length === 0 ? ( <p>{translate("order.empty")}</p>) : 
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
                        {translate("order.list.ice")}:     {translate(`mod.ice.${item.modifiers.iceLevel}`)}<br/>
                        {translate("order.list.sugar")}:   {translate(`mod.sugar.${item.modifiers.sugarLevel}`)}<br/>
                        {translate("order.list.topping")}: {translate(`mod.topping.${item.modifiers.topping}`)}<br/>
                    </small>
                    <br/>
                </li>))}
            </ul>

            )}
        </div>
        <div className="subtotal-container">
          <strong>{translate("order.subtotal")} : </strong>${subtotal}
        </div>
        <div className="order-button-container">
            <button
              className="order-button"
              onClick={() => placeOrder()}
              data-tts={translate("order.place")}
              aria-label={translate("order.place")}
            >
              {translate("order.place")}
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
