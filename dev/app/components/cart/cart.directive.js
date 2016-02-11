import {
  calculateTotalPrice
} from '../../utils';
export function CartDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/cart/cart.html',
    scope: {},
    controller: CartController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class CartController {

  constructor(cartService, $log, $scope, $http, $window) {
    'ngInject';
    this.$log = $log;
    this.cartService = cartService;
    this.$scope = $scope;
    this.$http = $http;
    const purchaseAPI = 'http://trainco.axial-client.com/api/carts/save';
    this.cartItemList = cartService.getCartItems() || [];
    this.cartTotalPrice = calculateTotalPrice(this.cartItemList);

    $scope.$on('cartUpdated', (event, data) => {
      this.cartItemList = cartService.getCartItems() || [];
      this.cartTotalPrice = calculateTotalPrice(this.cartItemList);
    });

    this.removeItemFromCart = (itemId) => {
      cartService.removeItem(itemId);
      this.cartItemList = this.cartService.getCartItems() || [];
      this.cartTotalPrice = calculateTotalPrice(this.cartItemList);
    };

    /**
     * Handle key input
     * @param  {object} e the event
     * ng-keydown='searchInput.handleInput($event)'
     */
    this.handleLocInput = (e, cartItem, qty) => {
      if (e.keyCode === 13) {
        cartService.addItem(cartItem);
        this.cartItemList = cartService.getCartItems() || [];
        this.cartTotalPrice = calculateTotalPrice(this.cartItemList);
      }
    }

    this.doPurchase = () => {
      this.cartItemList = this.cartService.getCartItems() || [];
      this.$log.debug(this.cartItemList)
      let cartDataArr = [];
      this.cartItemList.forEach((item, index, array) => {
        let id = item.id;
        let quantity = item.quantity;
        cartDataArr.push({Id: id, quantity: quantity})
        this.$log.debug(cartDataArr)
        window.localStorage.setItem('cartDataArr', JSON.stringify(cartDataArr)); // eslint-disable-line

      });

      this.$http({
        method: 'POST',
        url: purchaseAPI,
        data: JSON.stringify(cartDataArr),
        contentType: "application/json"
      }).then(_success()).catch(_error());

      function _success(response) {
        let redirectGuid = response.cartGuid;
        window.location.href = '/register/?cart=' + response.cartGuid;
      }

      function _error(err) {
        this.$log.debug(err)
      }

    }



    this.cartImages = {
      initial: '/assets/images/icon-cart-tab.png',
      final: '/assets/images/icon-cart-close-arrow.png',
      current: '/assets/images/icon-cart-tab.png'
    };
    this.swapHere = function() {
      if (this.cartImages.current === this.cartImages.final) {
        this.cartImages.current = this.cartImages.initial
      } else if (this.cartImages.current === this.cartImages.initial) {
        this.cartImages.current = this.cartImages.final
      };
    };
  }
}
