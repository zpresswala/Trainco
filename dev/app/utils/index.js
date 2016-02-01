export function calculateTotalPrice(itemList) {
  const totalPrice = itemList ? itemList.reduce((acc, item) => {
    return acc + item.quantity * parseFloat(item.price);
  }, 0) : 0;
  return parseFloat(totalPrice.toFixed(2));
}
