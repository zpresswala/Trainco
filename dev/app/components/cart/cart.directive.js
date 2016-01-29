export function CartDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/cart/cart.html',
    scope: {
    },
    controller: CartController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class CartController {

  constructor() {
    'ngInject';
  }

}
// etItemListQuantity() {
//     let quantity = 0;
//     this.forEach(this.items, (item) => {
//         quantity += item.quantity();
//     });
//     return quantity;
// }
