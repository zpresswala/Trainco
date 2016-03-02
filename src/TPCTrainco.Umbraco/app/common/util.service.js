(function() {
  'use strict';

  angular
    .module('train.common')
    .service('UtilitySvc', UtilitySvc);

  /** @ngInject */
  function UtilitySvc($log) {

    var today = new Date();

    var service = {
      calculateTotalPrice: calculateTotalPrice,
      anyAreTrue: anyAreTrue
    };

    return service;

    /**
     * calculates the price for all the items in the shopping cart.
     * @method calculateTotalPrice
     * @param  {array}            itemList the items in the cart
     * @return {int}                     the price.
     */
    function calculateTotalPrice(itemList) {
      var totalPrice = itemList ? itemList.reduce(function(acc, item) {
        return acc + item.quantity * parseFloat(item.price);
      }, 0) : 0;
      return parseFloat(totalPrice.toFixed(2));
    }

    function anyAreTrue(obj) {
      var labels = ['hvac', 'electrical', 'mechanical', 'management'];
      var output = false;
      labels.every(function (label) {
        if (obj[label]) {
          output = true;
          return false;
        }
        return true;
      });
      return output;
    }
    
  }
})();
