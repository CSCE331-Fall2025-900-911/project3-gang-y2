export function getOrderSpeech(order, subtotal) {
  if (!order || order.length === 0) {
    return "Your order is empty. Choose a drink to start building it.";
  }

  const items = order
    .map((item, index) => {
      const numericPrice = parseFloat(item.price);
      const priceText = Number.isFinite(numericPrice)
        ? `${numericPrice.toFixed(2)} dollars`
        : `${item.price}`;
      const ice = item.modifiers?.iceLevel ?? "medium";
      const sugar = item.modifiers?.sugarLevel ?? "medium";
      const topping = item.modifiers?.topping ?? "none";
      return `Item ${index + 1}: ${item.name}, ${priceText}, ice ${ice}, sugar ${sugar}, topping ${topping}.`;
    })
    .join(" ");

  const total = Number.isFinite(subtotal) ? subtotal.toFixed(2) : subtotal;
  return `You have ${order.length} items. ${items} Subtotal ${total} dollars.`;
}
