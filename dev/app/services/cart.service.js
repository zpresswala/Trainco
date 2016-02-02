export class CartService {
  constructor($log, $http) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
  }

  getCartItems() {
    const itemList = window.localStorage.getItem('cartItemList'); // eslint-disable-line
    return itemList && JSON.parse(itemList); // eslint-disable-line
  }

  addItem(item) {
    const itemStr = window.localStorage.getItem('cartItemList'); // eslint-disable-line
    const itemList = itemStr ? JSON.parse(itemStr) : []; // eslint-disable-line
    const itemInCart = itemList.find((cartItem) => cartItem.id === item.id);

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      itemList.push({
        id: item.id,
        title: item.title,
        city: item.city,
        state: item.state,
        price: item.price,
        quantity: 1
      });
    }

    window.localStorage.setItem('cartItemList', JSON.stringify(itemList)); // eslint-disable-line
  }

  removeItem(itemId) {
    const itemStr = localStorage.getItem('cartItemList');// eslint-disable-line
    const itemList = itemStr ? JSON.parse(itemStr) : [];// eslint-disable-line
    const index = itemList.findIndex((item) => item.id === itemId);
    if (index === -1) {
      return;
    }
    if (itemList[index].quantity > 1) {
      itemList[index].quantity -= 1;
    } else {
      itemList.splice(index, 1);
    }

    localStorage.setItem('cartItemList', JSON.stringify(itemList));// eslint-disable-line
  }

  clearCart() {
    localStorage.removeItem('cartItemList');// eslint-disable-line
  }
}
