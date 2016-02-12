(function() {
  'use strict';

  angular
    .module('train')
    .controller('RegisterController', RegisterController);

  /** @ngInject */
  function RegisterController($log, searchService, $localStorage, $http, $state, $rootScope, $scope, cartService) {
    var vm = this;
    vm.dateRange = {};
    vm.$storage = $localStorage;
    var searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';

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


    vm.cartItemList = cartService.getCartItems() || [];
    vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);

    // This lovely mess pulls data from localStorage in order to run the
    // search from the off page search component as soon as the page
    // loads.
    // ----------------------------------------------------------
    var location = vm.$storage.get('location');
    var topicParam1 = vm.$storage.get('topicParam1');
    var topicParam2 = vm.$storage.get('topicParam2');
    var topicParam3 = vm.$storage.get('topicParam3');
    var topicParam4 = vm.$storage.get('topicParam4');
    var minDateRange = vm.$storage.get('minDateRange');
    var maxDateRange = vm.$storage.get('maxDateRange');

    vm.searchData = $http.get(searchAPI +
        'location=' + location +
        '&topics=' + topicParam1 + ',' + topicParam2 + ',' + topicParam3 + ',' + topicParam4 +
        '&date-start=' + minDateRange + '-01-2016' +
        '&date-end=' + maxDateRange + '-01-2016')
      .then(function(data) {
        $state.go('results')
        var seminarsData = data.data.seminars;
        vm.receiveSeminarData(seminarsData);
        return seminarsData;
      });
    // End of the lovely on-load mess.
    // ----------------------------------------------

    vm.addItemToCart = function(item, quantity) {
      cartService.addItem(item, qty);
      vm.cartItemList = cartService.getCartItems() || [];
      vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);
      $rootScope.$broadcast('cartUpdated', vm.cartItemList);
    };

    vm.removeItemFromCart = function(itemId) {
      cartService.removeItem(itemId);
      vm.cartItemList = vm.cartService.getCartItems() || [];
      vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);
    };

    /**
     * Handle key input
     * @param  {object} e the event
     * @return {method}
     */
    vm.handleLocInput = function(e) {
      if (e.keyCode === 13 && vm.locSearchFilter.location) {
        $rootScope.$broadcast('location', vm.locSearchFilter.location);
        doParamSearch();
      }
    }
      // Listens for a broadcast that says 'location'
    $scope.$on('location', function(event, data) {
      vm.locationParam = data;
    });
    // Listens for a broadcast saying keyword and then
    // runs the doParamSearch function.
    $scope.$on('keyword', function(event, data) {
      vm.keywordParam = data;
      doKWParamSearch();
    });

    /**
     * Watches the locationAll checkbox and runs on checked.
     * @method function
     * @return {array} returns the array seminarsData containing all locations.
     */
    vm.stateChanged = function() {
      if (vm.locSearchFilter.locationAll) {
        $rootScope.$broadcast('location', vm.locSearchFilter.locationAll);
        $http.get(searchAPI + 'location= ')
          .then(function(data) {
            $state.go('results');
            var seminarsData = data.data.seminars;
            vm.receiveSeminarData(seminarsData);
            return seminarsData;
          });
      }
    }
    vm.watcherOfThings = function() {
      doParamSearch();
    }

    /**
     * Settings for the mileage slider.
     * @type {Object}
     * translate adds the label to the value.
     */
    vm.mileRange = {
      value: 500,
      options: {
        min: 50,
        floor: 50,
        ceil: 1000,
        step: 50,
        translate: function(value) {
          return value + ' mile radius';
        }
      }
    }

    // Listens for a broadcast saying topic and then
    // runs a search with the updated topics.
    $scope.$on('topic', function(event, data) {
      var labelsArray = ['hvac', 'electrical', 'mechanical', 'management'];
      labelsArray.forEach(function(label, index) {
        if (data[label]) {
          this['topicParam' + (index + 1)] = label + ',';
        } else {
          this['topicParam' + (index + 1)] = '';
        }
      });
      $log.debug('asdf')
      doParamSearch();
    });

    vm.months = [{
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

    function receiveSeminarData(seminarsData) {
      var seminarLocations = [];
      vm.seminarLocations = seminarsData;
    }

    function doParamSearch() {
      var searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
      var minDateRange = vm.dateRange.start || '01';
      var maxDateRange = vm.dateRange.end || '12';
      var radiusParam = vm.mileRange.value || '250';
      //'keyword=' + keywordParam
      $http.get(searchAPI +
          // 'keyword=' + this.keywordParam +
          'location=' + vm.locationParam +
          '&radius=' + radiusParam +
          '&topics=' + vm.topicParam1 + vm.topicParam2 + vm.topicParam3 + vm.topicParam4 +
          '&date-start=' + minDateRange + '-01-2016' +
          '&date-end=' + maxDateRange + '-01-2016')
        .then((data) => {
          $state.go('results');
          var seminarsData = data.data.seminars;
          vm.receiveSeminarData(seminarsData);
          return seminarsData;
        });
    }
    function doKWParamSearch() {
      var searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
      var minDateRange = vm.dateRange.start || '01';
      var maxDateRange = vm.dateRange.end || '12';
      var radiusParam = vm.mileRange.value || '250';
      //'keyword=' + keywordParam
      $http.get(searchAPI +
          'keyword=' + vm.keywordParam +
          '&location=' + vm.locationParam +
          '&radius=' + radiusParam +
          '&topics=' + vm.topicParam1  + vm.topicParam2 + vm.topicParam3  + vm.topicParam4 +
          '&date-start=' + minDateRange + '-01-2016' +
          '&date-end=' + maxDateRange + '-01-2016')
        .then((data) => {
          $state.go('results');
          var seminarsData = data.data.seminars;
          vm.receiveSeminarData(seminarsData);
          return seminarsData;
        });
    }

    function clearFilters($state) {
      localStorage.clear();
      vm.doParamSearch();
    }
  }
})();
