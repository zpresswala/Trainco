import {
  calculateTotalPrice
}
from '../utils';
export class RegisterController {
  constructor($log, searchService, $http, $state, $rootScope, $scope, cartService) {
    'ngInject';
    this.$state = $state;
    this.$log = $log;
    this.cartService = cartService;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$http = $http;

    this.dateRange = {};

    const searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';

    this.cartItemList = this.cartService.getCartItems() || [];
    this.cartTotalPrice = calculateTotalPrice(this.cartItemList);

    // This lovely mess pulls data from localStorage in order to run the
    // search from the off page search component as soon as the page
    // loads.
    // ----------------------------------------------------------
    let location = localStorage.getItem('location');
    let topicParam1 = localStorage.getItem('topicParam1');
    let topicParam2 = localStorage.getItem('topicParam2');
    let topicParam3 = localStorage.getItem('topicParam3');
    let topicParam4 = localStorage.getItem('topicParam4');
    let minDateRange = localStorage.getItem('minDateRange');
    let maxDateRange = localStorage.getItem('maxDateRange');

    this.searchData = $http.get(searchAPI +
        'location=' + location +
        '&topics=' + topicParam1 + ',' + topicParam2 + ',' + topicParam3 + ',' + topicParam4 +
        '&date-start=' + minDateRange + '-01-2016' +
        '&date-end=' + maxDateRange + '-01-2016')
      .then((data) => {
        this.$state.go('results')
        let seminarsData = data.data.seminars;
        this.receiveSeminarData(seminarsData);
        return seminarsData;
      });
    // End of the lovely on-load mess.
    // ----------------------------------------------

    this.addItemToCart = (item, qty) => {
      cartService.addItem(item, qty);
      this.cartItemList = cartService.getCartItems() || [];
      this.cartTotalPrice = calculateTotalPrice(this.cartItemList);
      $rootScope.$broadcast('cartUpdated', this.cartItemList);
    };

    this.removeItemFromCart = (itemId) => {
      cartService.removeItem(itemId);
      this.cartItemList = this.cartService.getCartItems() || [];
      this.cartTotalPrice = calculateTotalPrice(this.cartItemList);
    };

    /**
     * Handle key input
     * @param  {object} e the event
     * @return {method}
     */
    this.handleLocInput = (e) => {
        if (e.keyCode === 13 && this.locSearchFilter.location) {
          $rootScope.$broadcast('location', this.locSearchFilter.location);
          this.doParamSearch();
        }
      }
      // Listens for a broadcast that says 'location'
    this.$scope.$on('location', (event, data) => {
      this.locationParam = data;
    });
    // Listens for a broadcast saying keyword and then
    // runs the doParamSearch function.
    this.$scope.$on('keyword', (event, data) => {
      this.keywordParam = data;
      this.doParamSearch();
    });

    /**
     * Watches the locationAll checkbox and runs on checked.
     * @method function
     * @return {array} returns the array seminarsData containing all locations.
     */
    this.stateChanged = function() {
      if (this.locSearchFilter.locationAll) {
        $rootScope.$broadcast('location', this.locSearchFilter.locationAll);
        this.$http.get(searchAPI + 'location=all')
          .then((data) => {
            this.$state.go('results');
            let seminarsData = data.data.seminars;
            this.receiveSeminarData(seminarsData);
            return seminarsData;
          });
      }
    }
    this.watcherOfThings = function() {
        this.doParamSearch();
      }
      /**
       * Settings for the mileage slider.
       * @type {Object}
       * this.mileRange.value = ng-model.
       */
    this.mileRange = {
      value: 500,
      options: {
        min: 50,
        floor: 50,
        ceil: 1000,
        step: 50
      }
    }

    // Listens for a broadcast saying topic and then
    // runs a search with the updated topics.
    this.$scope.$on('topic', (event, data) => {

      let labelsArray = ['hvac', 'electrical', 'mechanical', 'management']
      labelsArray.forEach((label, index) => {
        if (data[label]) {
          this[`topicParam${index+1}`] = label
        } else {
          this[`topicParam${index+1}`] = undefined
        }
      })
      this.doParamSearch();
    });

    // this.doParamSearch = () => {
    //
    //   let minDateRange = this.dateRange.start || '01';
    //   let maxDateRange = this.dateRange.end || '12';
    //   let radiusParam = this.mileRange.value || '250';
    //   //'keyword=' + keywordParam
    //   this.$http.get(searchAPI +
    //       // 'keyword=' + this.keywordParam +
    //       'location=' + this.locationParam +
    //       '&radius=' + radiusParam +
    //       '&topics=' + this.topicParam1 + ',' + this.topicParam2 + ',' + this.topicParam3 + ',' + this.topicParam4 +
    //       '&date-start=' + minDateRange + '-01-2016' +
    //       '&date-end=' + maxDateRange + '-01-2016')
    //     .then((data) => {
    //       this.$state.go('results');
    //       let seminarsData = data.data.seminars;
    //       this.receiveSeminarData(seminarsData);
    //       return seminarsData;
    //     });
    // }

    this.months = [{
      'val': '01',
      'name': 'January'
    }, {
      'val': '02',
      'name': 'February'
    }, {
      'val': '03',
      'name': 'March'
    }, {
      'val': '04',
      'name': 'April'
    }, {
      'val': '05',
      'name': 'May'
    }, {
      'val': '06',
      'name': 'June'
    }, {
      'val': '07',
      'name': 'July'
    }, {
      'val': '08',
      'name': 'August'
    }, {
      'val': '09',
      'name': 'September'
    }, {
      'val': '10',
      'name': 'October'
    }, {
      'val': '11',
      'name': 'November'
    }, {
      'val': '12',
      'name': 'December'
    }]

  }
  receiveSeminarData(seminarsData) {
    let seminarLocations = [];
    this.seminarLocations = seminarsData;
  }

  doParamSearch() {
    const searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
    let minDateRange = this.dateRange.start || '01';
    let maxDateRange = this.dateRange.end || '12';
    let radiusParam = this.mileRange.value || '250';
    //'keyword=' + keywordParam
    this.$http.get(searchAPI +
        // 'keyword=' + this.keywordParam +
        'location=' + this.locationParam +
        '&radius=' + radiusParam +
        '&topics=' + this.topicParam1 + ',' + this.topicParam2 + ',' + this.topicParam3 + ',' + this.topicParam4 +
        '&date-start=' + minDateRange + '-01-2016' +
        '&date-end=' + maxDateRange + '-01-2016')
      .then((data) => {
        this.$state.go('results');
        let seminarsData = data.data.seminars;
        this.receiveSeminarData(seminarsData);
        return seminarsData;
      });
  }
}
