(function() {
  'use strict';

  angular
    .module('train.components')
    .directive('shoppingCart', shoppingCart);

  /** @ngInject */
  function shoppingCart() {
    var directive = {
      restrict: 'E',
      templateUrl: '/app/components/cart/cart.html',
      scope: {},
      controller: 'CartController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

})();
