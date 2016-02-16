(function() {
  'use strict';

  angular
    .module('train')
    .controller('RegisterController', RegisterController);

  /** @ngInject */
  function RegisterController($log, searchService, $http, $state, $rootScope, $scope, cartService, $loading) {
    var vm = this;
    vm.dateRange = {};

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

    function receiveSeminarData(seminarsData) {
      var seminarLocations = [];
      vm.seminarLocations = seminarsData;
    }

    vm.options = {
      text: 'Loading...',
      overlay: true, // Display overlay
      spinner: true, // Display spinner
      spinnerOptions: {
        lines: 12, // The number of lines to draw
        length: 7, // The length of each line
        width: 4, // The line thickness
        radius: 10, // The radius of the inner circle
        rotate: 0, // Rotation offset
        corners: 1, // Roundness (0..1)
        color: '#000', // #rgb or #rrggbb
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 2, // Rounds per second
        trail: 100, // Afterglow percentage
        opacity: 1 / 4, // Opacity of the lines
        fps: 20, // Frames per second when using setTimeout()
        zIndex: 2e9, // Use a high z-index by default
        className: 'dw-spinner', // CSS class to assign to the element
        top: 'auto', // Center vertically
        left: 'auto', // Center horizontally
        position: 'relative' // Element position
      }
    }

    vm.cartItemList = cartService.getCartItems() || [];
    vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);

    // This lovely mess pulls data from localStorage in order to run the
    // search from the off page search component as soon as the page
    // loads.
    // ----------------------------------------------------------
    var location = localStorage.getItem('location');
    var topicParam1 = localStorage.getItem('topicParam1');
    var topicParam2 = localStorage.getItem('topicParam2');
    var topicParam3 = localStorage.getItem('topicParam3');
    var topicParam4 = localStorage.getItem('topicParam4');
    var minDateRange = localStorage.getItem('minDateRange');
    var maxDateRange = localStorage.getItem('maxDateRange');

    vm.searchData = $http.get(searchAPI +
        'location=' + location +
        '&topics=' + topicParam1 + ',' + topicParam2 + ',' + topicParam3 + ',' + topicParam4 +
        '&date-start=' + minDateRange + '-01-2016' +
        '&date-end=' + maxDateRange + '-01-2016')
      .then(function(data) {
        $state.go('results')
        var seminarsData = data.data.seminars;
        receiveSeminarData(seminarsData);
        return seminarsData;
      });
    // End of the lovely on-load mess.
    // ----------------------------------------------

    vm.addItemToCart = function(item, qty) {

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

    /**
     * Handle key input
     * @param  {object} e the event
     */
    vm.handleKWInput = function(e) {
        if (e.keyCode === 13 && vm.kwFilter.word) {
          $rootScope.$broadcast('keyword', vm.kwFilter.word);
          //  this.doParamSearch();
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
        },
        onEnd: function(modelValue) {
          doParamSearch()
        }
      }
    }
    vm.courseSearch = searchService;
    vm.categories = {
      hvac: true,
      electrical: true,
      mechanical: true,
      management: true
    }
    vm.courseTopics = {};
    vm.courseTopics.categories = [];

    /**
     * Watches the locationAll checkbox and runs on checked.
     * @method function
     * @return {array} returns the array seminarsData containing all locations.
     */
    vm.stateChanged = function() {
      $log.debug(vm.courseTopics.categories)
      $rootScope.$broadcast('topic', vm.courseTopics.categories);
    }

    // Listens for a broadcast saying topic and then
    // runs a search with the updated topics.
    $scope.$on('topic', function(event, data) {
      var labelsArray = ['hvac', 'electrical', 'mechanical', 'management'];
      labelsArray.forEach(function(label, index) {
        if (data[label]) {
          vm['topicParam' + (index + 1)] = label + ',';
        } else {
          vm['topicParam' + (index + 1)] = '';
        }
      });

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

    function doParamSearch() {
      $loading.start('courses');
      var searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
      var minDateRange = vm.dateRange.start || '01';
      var maxDateRange = vm.dateRange.end || '12';
      var radiusParam = vm.mileRange.value || '250';
      var locParam = vm.locationParam || '';
      //'keyword=' + keywordParam
      $http.get(searchAPI +
          // 'keyword=' + this.keywordParam +
          'location=' + locParam +
          '&radius=' + radiusParam +
          '&topics=' + vm.topicParam1 + vm.topicParam2 + vm.topicParam3 + vm.topicParam4 +
          '&date-start=' + minDateRange + '-01-2016' +
          '&date-end=' + maxDateRange + '-01-2016')
        .then(function(data) {
          $state.go('results');
          var seminarsData = data.data.seminars;
          receiveSeminarData(seminarsData);
          $loading.finish('courses');
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
          '&location=' + '' +
          '&radius=' + radiusParam +
          '&topics=' + vm.topicParam1 + vm.topicParam2 + vm.topicParam3 + vm.topicParam4 +
          '&date-start=' + minDateRange + '-01-2016' +
          '&date-end=' + maxDateRange + '-01-2016')
        .then(function(data) {
          $state.go('results');
          var seminarsData = data.data.seminars;
          receiveSeminarData(seminarsData);
          return seminarsData;
        });
    }

    function clearFilters($state) {
      localStorage.clear();
      vm.doParamSearch();
    }
  }
})();
