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
  const [currentTime, setCurrentTime] = useState(new Date());
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
  const [currentModifiers, setCurrentModifiers] = useState({iceLevel:"high", sugarLevel:"high", toppings:[], quantity:1});

  // sub total for order
  const[subtotal, setSubtotal] = useState(0.0);
  const { language, translate } = useTranslation();
  const langCode = language === "es" ? "es-ES" : "en-US";
  const { canSpeak: canSpeakSelection, startTalking: saySelection } = useTextToSpeech({ rate: 1, lang: langCode });
  const { ttsEnabled } = useTtsSettings();

  // orders table in db? stuff for API
  const [formData, setFormData] = useState({ 
      orderDate: `${currentTime.getFullYear()}-${currentTime.getMonth()+1}-${currentTime.getDate()}`, 
      orderTime: `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`,
      orderCost: parseFloat(subtotal.toFixed(2)),
      customerEmail: null
    });

  const [itemData, setItemData] = useState({
    orderID:null,
    itemID:0,
    size:"medium",
    temperature:"cold",
    iceLevel:"HIGH",
    sugarLevel:"HIGH",
    topping:"NONE",
    itemPrice:0.0
  });

  //email receipt states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");

  function startOrderSubmission() {
    setShowEmailModal(true);
  }

  const openModification = (item) => {
    setCurrentItem(item);
    setCurrentModifiers({size:"medium", iceLevel:"high", sugarLevel:"high", temperature:"cold", toppings:[], quantity:1 }); // default values for each item
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

  const removeFromOrder = (indexToRemove) => {
    setCurrentOrder((prevOrder) => {
      const item = prevOrder[indexToRemove];
      if (!item) return prevOrder;
      setSubtotal((prev) => prev - parseFloat(item.price));
      return prevOrder.filter((_, idx) => idx !== indexToRemove);
    });
  };

  // function to add the pressed item to the order
  const addToOrder = () => {
    const modifiedItem = {
      ...currentItem,
      modifiers: { ...currentModifiers }
    };
    const qtyToAdd = currentModifiers.quantity ?? 1;

    setCurrentOrder((prevOrder) => {
      const index = prevOrder.findIndex(
        (line) =>
          line.itemid === modifiedItem.itemid &&
          line.modifiers.size === modifiedItem.modifiers.size &&
          line.modifiers.temperature === modifiedItem.modifiers.temperature &&
          line.modifiers.iceLevel === modifiedItem.modifiers.iceLevel &&
          line.modifiers.sugarLevel === modifiedItem.modifiers.sugarLevel &&
          JSON.stringify(line.modifiers.toppings) ===
            JSON.stringify(modifiedItem.modifiers.toppings)
      );

      if (index === -1) {
        return [
          ...prevOrder,
          { ...modifiedItem, quantity: qtyToAdd }
        ];
      }

      const updated = [...prevOrder];
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + qtyToAdd
      };
      return updated;
    });

    setSubtotal((prev) => prev + qtyToAdd * parseFloat(modifiedItem.price));
    closeModification();
  };


  // submit order & get payment
  function resetOrder() {
    setCurrentTime;
    setFormData({
      orderDate: `${currentTime.getFullYear()}-${currentTime.getMonth()+1}-${currentTime.getDate()}`, 
      orderTime: `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`, 
      orderCost: 0.0
    });
    // reset order & subtotal
    setCurrentOrder([]);
    setSubtotal(0.0);
  };

  // function prepareItemData() {
  //   map
  // }


  // useEffect(() => {
  //     fetch("/api/orders")
  //       .then((res) => res.json())
  //       .then((data) => setOrders(data))
  //       .catch((err) => console.error("Error fetching orders:", err));
  //   }, []);
  const handleToppingChange = (e) => {
    const { value, checked } = e.target;

    setCurrentModifiers((prev) => {
      let updated;

      if (checked) {
        updated = [...prev.toppings, value];
      } else {
        updated = prev.toppings.filter((t) => t !== value);
      }

      return { ...prev, toppings: updated };
    });
  };


  const handleSubmitWithEmail = (email) => {
    setFormData((prev) => ({
      ...prev,
      customerEmail: email,
      orderCost: subtotal,
    }));
    
    setTimeout(() => handleSubmit(), 50); // ensures state update applies
    
  };

  // Add order to DB
  const handleSubmit = async (e) => {
    
    alert("Present payment");
    
    console.log("submitting: ", formData);
    if (e) e.preventDefault();    const method = "POST";
    const url = `/api/orders/`;
    const itemUrl = `/api/orderitems/`;

    formData.orderCost = subtotal;
    formData.customerEmail = customerEmail || null;

    formData.currentTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

    // create order in table by submitting order metadata and receive orderID
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const newOrder = await res.json(); 
    const newOrderID = newOrder.orderid;
    
    // for each item in the order
    for (let item of currentOrder) {
      for (let i = 0; i < item.quantity; i++) {
        const dbPayload = {
          orderID: newOrderID,
          itemID: item.itemid,
          iceLevel: item.modifiers.iceLevel.toUpperCase(),
          sugarLevel: item.modifiers.sugarLevel.toUpperCase(),
          toppings: item.modifiers.toppings.map((t) => t.toUpperCase()),
          itemPrice: parseFloat(item.price),
          size: item.modifiers.size.toLowerCase(),
          temperature: item.modifiers.temperature.toLowerCase()
        };
        await fetch(itemUrl, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dbPayload)
        });
      }
    }
    if (formData.customerEmail) {
      await fetch("/api/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.customerEmail,
          orderId: newOrderID,
          items: currentOrder,
          subtotal: subtotal
        }),
      });
    }


    if (res.ok) {
      // order was made successfully
      resetOrder();
    }
  };

  // const itemSubmit = async (e) => {
    
  //   e.preventDefault();
  //   const methodItems = "POST";
  //   const urlItems = `/api/orderitems/`;

  //   const resItems = await fetch(urlItems, {
  //     methodItems,
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(itemData),
  //   });

  //   if (resItems.ok) {

  //   }
  // };

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

  const groupedMenu = useMemo(() => {
    const groups = {};
    menuItems.forEach((item) => {
      const cat = item.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [menuItems]);


  const orderLineLabel = useCallback(
    (item, index) => {
      const ice = translate(`mod.ice.${item.modifiers.iceLevel}`);
      const sugar = translate(`mod.sugar.${item.modifiers.sugarLevel}`);
      const topping = item.modifiers.toppings.length > 0
        ? item.modifiers.toppings.map(t => translate(`mod.topping.${t}`)).join(", ")
        : translate("mod.topping.none");
      const priceText = Number.parseFloat(item.price).toFixed(2);
      const size = item.modifiers.size;
      const temperature = item.modifiers.temparature;
      return translate("tts.orderLine", {
        num: index + 1,
        name: item.name,
        price: priceText,
        ice,
        sugar,
        topping,
        size,
        temperature
      });
    },
    [translate]
  );

  const changeQuantity = (index, delta) => {
    setCurrentOrder((prevOrder) => {
      const updated = [...prevOrder];
      const item = updated[index];
      const newQty = item.quantity + delta;

      if (newQty <= 0) {
        setSubtotal((prev) => prev - item.quantity * parseFloat(item.price));
        return updated.filter((_, i) => i !== index);
      }

      updated[index] = { ...item, quantity: newQty };
      setSubtotal((prev) => prev + delta * parseFloat(item.price));
      return updated;
    });
  };

  const removeLine = (indexToRemove) => {
    setCurrentOrder((prevOrder) => {
      const item = prevOrder[indexToRemove];
      if (!item) return prevOrder;
      setSubtotal((prev) => prev - item.quantity * parseFloat(item.price));
      return prevOrder.filter((_, idx) => idx !== indexToRemove);
    });
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

      <div className="category-nav">
          {Object.keys(groupedMenu).map((cat) => (
            <button
              key={cat}
              className="category-nav-button"
              onClick={() => {
                const el = document.getElementById(`section-${cat}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        
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
            {currentOrder.map((item, index) => (
              <li
                key={index}
                tabIndex={0}
                data-tts={orderLineLabel(item, index)}
              >
                <strong>{item.name}</strong>{" "} <button
                  type="button"
                  onClick={() => removeLine(index)}
                  className="zoom-button"
                >X</button>
                <span>({item.modifiers.size})</span>
                <div>
                  <button
                    type="button"
                    onClick={() => changeQuantity(index, -1)}
                    className="qty-button"
                  >-</button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => changeQuantity(index, 1)}
                    className="qty-button"
                  >+</button>
                </div>
                <small>
                  {translate("order.list.ice")}: {translate(`mod.ice.${item.modifiers.iceLevel}`)}<br />
                  {translate("order.list.sugar")}: {translate(`mod.sugar.${item.modifiers.sugarLevel}`)}<br />
                  {translate("order.list.topping")}:{" "}
                  {item.modifiers.toppings.length > 0
                    ? item.modifiers.toppings.map((t) => translate(`mod.topping.${t}`)).join(", ")
                    : translate("mod.topping.none")} <br />
                  {/* {translate("order.list.size")}: {translate(`mod.size.${item.modifiers.size}`)}<br /> */}
                  {translate("order.list.temperature")}: {translate(`mod.temperature.${item.modifiers.temperature.toLowerCase()}`)}<br />
                </small>
              </li>
            ))}
          </ul>
          )}
        </div>        
      </div>
      <div className="subtotal-container">
        <strong>{translate("order.subtotal")} : </strong>${subtotal}
      </div>
      <div className="order-button-container">
          <button
            className="order-button"
            onClick={startOrderSubmission}
            data-tts={translate("order.place")}
            aria-label={translate("order.place")}
          >
            {translate("order.place")}
          </button>
      </div>


      
      <main className="menu-container">

        {Object.keys(groupedMenu).map((category) => (
          <section
            key={category}
            id={`section-${category}`}   // <-- enables scroll-to-section
            className="menu-section"
          >
            <h2 className="menu-category-title">{category}</h2>

            <div className="menu-grid">
              {groupedMenu[category].map((item) => (
                <button
                  key={item.itemid}
                  className="menu-button"
                  onClick={() => openModification(item)}
                  data-tts={menuButtonLabel(item)}
                  aria-label={menuButtonLabel(item)}
                >
                  ${Number.parseFloat(item.price).toFixed(2)} :
                  <strong>{item.name}</strong>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>

      {showEmailModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "320px",
              border: "1px solid black",
              textAlign: "center",
            }}
          >
            <h3>Would you like an email receipt?</h3>

            <input
              type="email"
              placeholder="Enter email for receipt (optional)"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              style={{
                width: "90%",
                margin: "1rem 0",
                padding: "0.5rem",
                fontSize: "1rem",
              }}
            />

            <button
              onClick={() => {
                setShowEmailModal(false);
                handleSubmitWithEmail(customerEmail || null);
              }}
              className="modify-button"
              style={{ marginBottom: "1rem", width: "100%" }}
            >
              Submit with Email
            </button>

            <button
              onClick={() => {
                setShowEmailModal(false);
                handleSubmitWithEmail(null);
              }}
              className="cancel-button"
              style={{ width: "100%" }}
            >
              Skip
            </button>
          </div>
        </div>
      )}

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
            <h3>{translate("modal.customize", { name: currentItem.name })}</h3>

            <div style={{ margin: "1rem 0" }}>
              <label>
                {translate("order.list.ice")}:
                <select
                  name="iceLevel"
                  value={currentModifiers.iceLevel}
                  onChange={changeModifiers}
                  ref={firstOptionRef}
                  aria-label={translate("modal.selectIce")}
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value="none">{translate("mod.ice.none")}</option>
                  <option value="low" data-tts={translate("mod.ice.low")}>{translate("mod.ice.low")}</option>
                  <option value="medium" data-tts={translate("mod.ice.medium")}>{translate("mod.ice.medium")}</option>
                  <option value="high" data-tts={translate("mod.ice.high")}>{translate("mod.ice.high")}</option>
                </select>
              </label>
            </div>

            <div style={{ margin: "1rem 0" }}>
              <label>
                {translate("order.list.sugar")}:
                <select
                  name="sugarLevel"
                  value={currentModifiers.sugarLevel}
                  onChange={changeModifiers}
                  aria-label={translate("modal.selectSugar")}
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value="none">{translate("mod.sugar.none")}</option>
                  <option value="low" data-tts={translate("mod.sugar.low")}>{translate("mod.sugar.low")}</option>
                  <option value="medium" data-tts={translate("mod.sugar.medium")}>{translate("mod.sugar.medium")}</option>
                  <option value="high" data-tts={translate("mod.sugar.high")}>{translate("mod.sugar.high")}</option>
                </select>
              </label>
            </div>

            <div style={{ margin: "1rem 0" }}>
              <label>
                {translate("order.list.size")}:
                <select
                  name="size"
                  value={currentModifiers.size}
                  onChange={changeModifiers}
                  aria-label={translate("order.list.size")}
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value={translate("mod.size.small")}>{translate("mod.size.small")}</option>
                  <option value={translate("mod.size.medium")}>{translate("mod.size.medium")}</option>
                  <option value={translate("mod.size.large")}>{translate("mod.size.large")}</option>
                </select>
              </label>
            </div>

            <div style={{ margin: "1rem 0" }}>
              <label>
                {translate("order.list.temperature")}:
                <select
                  name="temperature"
                  value={currentModifiers.temperature}
                  onChange={changeModifiers}
                  aria-label={translate("order.list.temperature")}
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value={translate("mod.temperature.cold")}>{translate("mod.temperature.cold")}</option>
                  <option value={translate("mod.temperature.hot")}>{translate("mod.temperature.hot")}</option>
                </select>
              </label>
            </div>

            <div style={{ margin: "1rem 0" }}>
              <label>
                {translate("order.list.topping")}:
                <div style={{ margin: "1rem 0" }}>

                  <div style={{ textAlign: "left", marginTop: "0.5rem" }}>
                    {[
                      "pearl",
                      "mini_pearl",
                      "crystal_boba",
                      "pudding",
                      "aloe_vera",
                      "red_bean",
                      "herb_jelly",
                      "aiyu_jelly",
                      "lychee_jelly",
                      "crema",
                      "ice_cream"
                    ].map((t) => (
                      <div key={t}>
                        <label>
                          <input
                            type="checkbox"
                            name="toppings"
                            value={t}
                            checked={currentModifiers.toppings?.includes(t)}
                            onChange={handleToppingChange}
                          />
                          {translate(`mod.topping.${t}`)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </label>
            </div>

            <div style={{ margin: "1rem 0" }}>
              <label>
                {translate("order.list.quantity")}
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem"
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setCurrentModifiers((prev) => ({
                      ...prev,
                      quantity: Math.max(1, prev.quantity - 1)
                    }))
                  }
                  className="qty-button"
                  aria-label={translate("modal.decreaseQuantity")}
                >-</button>
                <span>{currentModifiers.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentModifiers((prev) => ({
                      ...prev,
                      quantity: prev.quantity + 1
                    }))
                  }
                  className="qty-button"
                  aria-label={translate("modal.increaseQuantity")}
                >+</button>
              </div>
            </div>

            <button onClick={addToOrder} className="modify-button" data-tts={translate("modal.add")}>
              {translate("modal.add")}
            </button>
            <button onClick={closeModification} className="cancel-button" data-tts={translate("modal.cancel")}>
              {translate("modal.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
    </ZoomProvider>
  );
}

export default Kiosk;
