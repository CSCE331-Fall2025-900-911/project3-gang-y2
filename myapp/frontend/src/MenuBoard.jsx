import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MenuBoard.css";
import Navbar from "./Navbar";
import { ZoomProvider } from "./ZoomContext";
import { useTranslation } from "./i18n/TranslationContext.jsx";


function MenuBoard() {
  const [items, setItems] = useState([]);
  const { translate } = useTranslation();


  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Menu fetch error:", err));
  }, []);

  return (
    <ZoomProvider>
    <div className="menuboard-page">
      <Navbar />

      <h2 className="menu-title">{translate("menuboard.title")}</h2>

      <div className="menu-grid">
        {items.map((item) => (
          <div key={item.itemid} className="menu-item-box">
            <div className="item-row">
              <span className="item-name">{translate(item.name)}</span>
              
              <span className="item-price">${item.price.toFixed(2)}</span>
            </div>
            <p className="item-cal">
              {item.calories} {translate("menuboard.cal")}
            </p>
          </div>
        ))}
      </div>

      {/* New Sections Below */}

      <div className="options-section">
        <h3 className="section-title">{translate("menuboard.ice")}</h3>
        <div className="option-list">
          <span>{translate("mod.ice.high")}</span>
          <span>{translate("mod.ice.medium")}</span>
          <span>{translate("mod.ice.low")}</span>
          <span>{translate("mod.ice.none")}</span>
        </div>

        <h3 className="section-title">{translate("menuboard.sugar")}</h3>
        <div className="option-list">
          <span>{translate("mod.sugar.high")}</span>
          <span>{translate("mod.sugar.medium")}</span>
          <span>{translate("mod.sugar.low")}</span>
          <span>{translate("mod.sugar.none")}</span>
        </div>

        <h3 className="section-title">{translate("menuboard.toppings")}</h3>
        <div className="option-list">
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
            <span key={t}>{translate(`mod.topping.${t}`)}</span>
          ))}
        </div>
      </div>

    </div>
    </ZoomProvider>
  );
}

export default MenuBoard;
