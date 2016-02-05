import { calculateTotalPrice } from '../../utils';
export class SeminarDetailController {
  constructor ($log, $stateParams, courseSearch, seminarDetails, cartService, $rootScope) {
    'ngInject';
    this.cartService = cartService;
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.seminarDateDetails = {};

    this.semId = $stateParams.id;
    this.details = courseSearch.getSeminarDetails(this.semId);
    this.seminarDetails = seminarDetails;

    this.resolveDetails(seminarDetails);

    this.addItemToCart = (item, qty) => {
      cartService.addItem(item, qty);
      this.cartItemList = cartService.getCartItems() || [];
      this.cartTotalPrice = calculateTotalPrice(this.cartItemList);
      $rootScope.$broadcast('cartUpdated', this.cartItemList);
    };
  }

  resolveDetails(seminarDetails) {
    this.$log.debug(seminarDetails)
    this.seminarDateDetails = seminarDetails.scheduleDetail.scheduleList;
    return this.seminarDateDetails;
  }
}
