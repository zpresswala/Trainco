(function() {
  'use strict';

  angular
    .module('train.components')
    .directive('shoppingCart', shoppingCart);

  /** @ngInject */
  function shoppingCart() {
    var directive = {
      restrict: 'E',
      templateUrl: '/assets/js/ngapp/components/cart/cart.html',
      scope: {},
      controller: 'CartController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

})();
