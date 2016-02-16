(function() {
  'use strict';

  angular
    .module('train')
    .factory('cartService', cartService);

  /** @ngInject */
  function cartService($log) {

    var service = {
      loadItems: loadItems,
      getCartItems: getCartItems,
      addItem: addItem,
      updateCart: updateCart,
      removeItem: removeItem,
      clearCart: clearCart
    };

    return service;
    // TODO: Merge objects that are common on add to cart.
    function loadItems() {
      var items = localStorage != null ? localStorage['cartItemList'] : null;
      if (items != null && JSON != null) {
        try {
          var items = JSON.parse(items); //eslint-disable-line
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.id != null && item.title != null && item.price != null && item.quantity != null) {
              item = new cartItem(item.id, item.name, item.price, item.quantity);
              this.items.push(item);
            }
          }
        } catch (err) {
          // ignore errors while loading...
        }
      }
    }

    function getCartItems() {
      var itemList = window.localStorage.getItem('cartItemList'); // eslint-disable-line
      return itemList && JSON.parse(itemList); // eslint-disable-line
    }

    function addItem(item, qty) {

      var itemStr = window.localStorage.getItem('cartItemList'); // eslint-disable-line
      var itemList = itemStr ? JSON.parse(itemStr) : []; // eslint-disable-line
      $log.debug(itemList)
      var itemInCart = itemList.forEach(function(item, index) {
        return itemInCart;
      });

      if (itemInCart) {

        itemInCart.quantity = qty;
      } else {
        itemList.push({
          id: item.id,
          title: item.daysDescription,
          city: item.city,
          state: item.state,
          price: item.price,
          date: item.date,
          quantity: qty
        });
      }

      window.localStorage.setItem('cartItemList', JSON.stringify(itemList)); // eslint-disable-line
    }

    function updateCart(item, qty) {
      var itemStr = window.localStorage.getItem('cartItemList'); // eslint-disable-line
      var itemList = itemStr ? JSON.parse(itemStr) : []; // eslint-disable-line
      var itemInCart = itemList.find(function(cartItem) {
        return cartItem.id === item.id;
      });

      if (itemInCart) {
        itemInCart.quantity = item.quantity;
      } else {
        itemList.push({
          id: item.id,
          title: item.title,
          city: item.city,
          state: item.state,
          price: item.price,
          date: item.date,
          quantity: quantity
        });
      }

      window.localStorage.setItem('cartItemList', JSON.stringify(itemList)); // eslint-disable-line
    }

    function removeItem(itemId) {
      var itemStr = localStorage.getItem('cartItemList'); // eslint-disable-line
      var itemList = itemStr ? JSON.parse(itemStr) : []; // eslint-disable-line
      var index = itemList.findIndex(function(item) {
        return item.id === itemId;
      });
      if (index === -1) {
        return;
      }
      if (itemList.quantity > 1) {
        itemList[index].quantity -= 1;
      } else {
        itemList.splice(index, 1);
      }

      localStorage.setItem('cartItemList', JSON.stringify(itemList)); // eslint-disable-line
    }

    function clearCart() {
      localStorage.removeItem('cartItemList'); // eslint-disable-line
    }
  }
})();
