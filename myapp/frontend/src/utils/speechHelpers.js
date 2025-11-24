export function getOrderSpeech(order, subtotal, translate) {
  if (!order || order.length === 0) {
    return translate ? translate("order.emptySpeech") : "Your order is empty. Choose a drink to start building it.";
  }

  const itemText = (key, val) => {
    if (!translate) return val;
    return translate(key) || val;
  };

  const items = order
    .map((item, index) => {
      const numericPrice = parseFloat(item.price);
      const priceText = Number.isFinite(numericPrice)
        ? `${numericPrice.toFixed(2)} dollars`
        : `${item.price}`;
      const ice = itemText(`mod.ice.${item.modifiers?.iceLevel ?? "medium"}`, item.modifiers?.iceLevel ?? "medium");
      const sugar = itemText(`mod.sugar.${item.modifiers?.sugarLevel ?? "medium"}`, item.modifiers?.sugarLevel ?? "medium");
      const topping = itemText(`mod.topping.${item.modifiers?.topping ?? "none"}`, item.modifiers?.topping ?? "none");
      if (!translate) {
        return `Item ${index + 1}: ${item.name}, ${priceText}, ice ${ice}, sugar ${sugar}, topping ${topping}.`;
      }
      return translate("order.itemLine", {
        num: index + 1,
        name: item.name,
        price: priceText,
        ice,
        sugar,
        topping,
      });
    })
    .join(" ");

  const total = Number.isFinite(subtotal) ? subtotal.toFixed(2) : subtotal;
  if (!translate) return `You have ${order.length} items. ${items} Subtotal ${total} dollars.`;
  return translate("order.summary", { count: order.length, items, total });
}
