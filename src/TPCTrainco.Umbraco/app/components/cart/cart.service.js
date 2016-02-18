(function() {
  'use strict';

  angular
    .module('train')
    .factory('cartService', cartService);

  /** @ngInject */
  function cartService($log, $window) {

    var service = {
      getCartItems: getCartItems,
      addItem: addItem,
      updateCart: updateCart,
      removeItem: removeItem,
      clearCart: clearCart
    };

    return service;

    function getCartItems() {
      var itemList = window.localStorage.getItem('cartItemList'); // eslint-disable-line
      return itemList && JSON.parse(itemList); // eslint-disable-line
    }

    function getItemById(itemId) {
      var items = getCartItems();
      var foundInCart = false;

      angular.forEach(items, function(item) {
        if (item.id === itemId) {
          foundInCart = item;
        }
      });
      return foundInCart;
    };

    function addItem(item, qty) {
      var id = item.id;
      var itemInCart = getItemById(id);
      $log.debug('1' + itemInCart);
      // var itemInCart = {};
      var itemStr = window.localStorage.getItem('cartItemList'); // eslint-disable-line
      var itemList = itemStr ? JSON.parse(itemStr) : []; // eslint-disable-line
      if (angular.isObject(itemInCart)) {
        var additionalAttendees = parseInt(qty);
        var currentAttendees = parseInt(itemInCart.quantity);
        $log.debug('inCart.quantity: the LS ' + currentAttendees);
        $log.debug('quantityInt: is the additional ' + additionalAttendees);
        var updatedAttendees = currentAttendees += additionalAttendees;
        itemInCart.quantity = updatedAttendees;
        itemList.find(function(itemInCart) {
          itemList['item'] = itemInCart;
          localStorage['cartItemList'] = itemList;
          return itemInCart.quantity = updatedAttendees;
        });
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
          title: item.daysDescription,
          city: item.city,
          state: item.state,
          price: item.price,
          date: item.date,
          quantity: quantity
        });
      }

      localStorage.setItem('cartItemList', JSON.stringify(itemList)); // eslint-disable-line
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
