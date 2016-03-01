(function() {
  'use strict';

  angular
    .module('train')
    .controller('CartController', CartController);

    /** @ngInject */
    function CartController(cartService, $log, $scope, $http, $window) {
      var vm = this;
      var purchaseAPI = 'http://trainco.axial-client.com/api/carts/save';
      vm.cartItem = {};


      function calculateTotalPrice(itemList) {
        var totalPrice = itemList ? itemList.reduce(function(acc, item) {
          return acc + item.quantity * parseFloat(item.price);
        }, 0) : 0;
        return parseFloat(totalPrice.toFixed(2));
      }

      vm.cartItemList = cartService.getCartItems() || [];
      vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);

      $scope.$on('cartUpdated', function(event, data) {
        vm.cartItemList = cartService.getCartItems() || [];
        vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);
      });

      vm.removeItemFromCart = function(itemId) {
        cartService.removeItem(itemId);
        vm.cartItemList = cartService.getCartItems() || [];
        vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);
      };

      /**
       * Handle key input
       * @param  {object} e the event
       * ng-keydown="searchInput.handleInput($event)"
       */
      vm.handleQuantInput = function(e, cartItem, qty) {
        if (e.keyCode === 13) {
          $log.debug(cartItem.quantity)
          cartService.updateCart(cartItem);
          vm.cartItemList = cartService.getCartItems() || [];
          vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);
        }
      }


      vm.cartImages = {
        initial: '/assets/images/icon-cart-tab.png',
        final: '/assets/images/icon-cart-close-arrow.png',
        current: '/assets/images/icon-cart-tab.png'
      };
      vm.isActive = false;
      vm.swapHere = function() {
          vm.isActive = !vm.isActive;
        if (vm.cartImages.current === vm.cartImages.final) {
          vm.cartImages.current = vm.cartImages.initial
        } else if (vm.cartImages.current === vm.cartImages.initial) {
          vm.cartImages.current = vm.cartImages.final
        };
      };

      vm.doPurchase = function() {
        vm.cartItemList = vm.cartService.getCartItems() || [];
        $log.debug(vm.cartItemList)
        var cartDataArr = [];
        vm.cartItemList.forEach(function(item, index, array) {
          var id = item.id;
          var quantity = item.quantity;
          cartDataArr.push({
            Id: id,
            quantity: quantity
          })
          $log.debug(cartDataArr)
          window.localStorage.setItem('cartDataArr', JSON.stringify(cartDataArr)); // eslint-disable-line

        });

        $http({
          method: 'POST',
          url: purchaseAPI,
          data: JSON.stringify(cartDataArr),
          contentType: 'application/json'
        }).then(_success()).catch(_error());

        function _success(response) {
          var redirectGuid = response.cartGuid;
          $window.location.href = '/register/?cart=' + response.cartGuid;
        }

        function _error(err) {
          $log.debug(err)
        }

      }
    }

})();
