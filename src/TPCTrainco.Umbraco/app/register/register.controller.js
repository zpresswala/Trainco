(function(module) {
  'use strict';
  /** @ngInject */
  module.controller('RegisterController', function($log, Pagination, searchService, $localStorage, $http, $rootScope, $scope, cartService, $loading, $timeout, months, $document, $window) {
    var vm = this;
    var searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
    vm.dateRange = {};
    vm.$storage = $localStorage;
    vm.initialDirections = true;

    vm.sbIsCollapsed = false; // mobile sidebar converted into menu.
    var OGFilter = {
      keywordParam: '',
      locParam: '',
      topicParam1: '',
      topicParam2:'' ,
      topicParam3: '',
      topicParam4: '',
      defStart: '',
      defEnd: ''
    }
    activate();

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

    /**
     * pulls data from localStorage in order to run the
     * search from the off page search component as soon as the page loads.
     * @method activate
     */
    function activate() {
      var keywordParam = '';
      if (location === undefined) {
        vm.initialDirections = true;
      }
      var OGFilter = {
        keywordParam: keywordParam,
        locParam: vm.$storage.SearchLocation,
        topicParam1: vm.$storage.SearchTopic1,
        topicParam2: vm.$storage.SearchTopic2,
        topicParam3: vm.$storage.SearchTopic3,
        topicParam4: vm.$storage.SearchTopic4,
        defStart: vm.$storage.SearchDRmin,
        defEnd: vm.$storage.SearchDRmax
      }
    }
    vm.cartItemList = cartService.getCartItems() || [];
    vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);


    /**
     * adds item to the cart or updates the quantity
     * @method function
     * @param  {object} item the item and its properties
     * @param  {int} qty  how many attendees
     * @return {array}      returns the updated cartItemList
     */
    vm.addItemToCart = function(item, qty, $event) {
      cartService.addItem(item, qty)

      vm.cartItemList = cartService.getCartItems() || [];
      vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);

      $rootScope.$broadcast('cartUpdated', vm.cartItemList);

      $($event.target).val('Added!');

      $timeout = setTimeout(function() {
        $($event.target).val('Add to cart');
      }, 3500);
      item.qty = '';
    };

    /**
     * Handle location input
     * @param  {object} e the event
     * @return {method}
     */
    vm.handleLocInput = function(e) {
      vm.locSearchFilter.locationAll = false;

      $timeout = setTimeout(function() {
        $rootScope.$broadcast('location', vm.locSearchFilter.location);
        doParamSearch();
      }, 3000);
    }

    /**
     * Handle kewword input
     * @param  {object} e the event
     */
    vm.handleKWInput = function(e) {
      $timeout = setTimeout(function() {
        doKWParamSearch();
      }, 2500);
    }

    // Listens for a broadcast that says 'location'
    $scope.$on('location', function(event, data) {
      vm.locationParam = data;
      vm.$storage.SearchLocation = data;
    });

    vm.pagination = Pagination.getNew(10);
    /**
     * Watches the locationAll checkbox and runs on checked.
     * @method function
     * @return {array} returns the array seminarsData containing all locations.
     */
    vm.stateChanged = function() {
      if (vm.locSearchFilter.locationAll) {
        vm.locSearchFilter.location = '';
        $rootScope.$broadcast('location', vm.locSearchFilter.locationAll);
        $http.get(searchAPI + 'location= ')
          .then(function(data) {

            vm.hideRadius = true;
            var seminarsData = data.data.seminars;
            vm.receiveSeminarData(seminarsData);
            return seminarsData;
          });
      }
    }
  vm.currentPage = 1;
  $scope.pageSize = 10;
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
          doParamSearch();
        }
      }
    }

    vm.categories = {
      hvac: true,
      electrical: true,
      mechanical: true,
      management: true
    }

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
          vm['topicParam' + (index + 1)] = label;
          vm.courseTopics.categories.all = false
        } else {
          vm.courseTopics.categories.all = ['hvac', 'electrical', 'mechanical', 'management'];
        }
        vm.$storage.SearchTopic1 = vm.topicParam1;
        vm.$storage.SearchTopic2 = vm.topicParam2;
        vm.$storage.SearchTopic3 = vm.topicParam3;
        vm.$storage.SearchTopic4 = vm.topicParam4;
      });
      doParamSearch();
    });
    $scope.$watch('vm.locationParam', function() {
      doParamSearch();
    });

    //vm.months = months.getMonths();
    var today = new Date();
    var thisMonth = today.getMonth();
    var thisYear = today.getFullYear();
    var futureYear = today.getFullYear() + 1;
    var futureMonth = today.getMonth();
    var threeMore = thisMonth + 3;
    var monthNames = months.getMonths() || [];

    vm.startingMonthArray = monthNames.slice(thisMonth);
    vm.yearOfMonths = months.getMonths();
    var defaultStart = vm.startingMonthArray[0].value;
    var defaultEnd = vm.startingMonthArray[3].value
      function checkYear() {
        if (vm.dateRange.start >= vm.dateRange.end) {
          return 2017;
        } else {
          return 2016
        }
      }
    function doParamSearch() {
      $loading.start('courses');
      var keywordParam = vm.$storage.kword || vm.kwFilter.word;
      var radiusParam = vm.mileRange.value || '250';
      var locParam = vm.$storage.SearchLocation || vm.locSearchFilter.location;
      var topicParam1 = vm.$storage.SearchTopic1 || vm.topicParm1;
      var topicParam2 = vm.$storage.SearchTopic2 || vm.topicParm2;
      var topicParam3 = vm.$storage.SearchTopic3 || vm.topicParm3;
      var topicParam4 = vm.$storage.SearchTopic4 || vm.topicParm4;
      var defStart = vm.$storage.SearchDRmin || vm.dateRange.start || defaultStart;
      var defEnd = vm.$storage.SearchDRmax || vm.dateRange.end || defaultEnd;
      vm.initialDirections = false;

      var OGFilter = {
        keywordParam: keywordParam,
        locParam: locParam,
        radiusParam: radiusParam,
        topicParam1: topicParam1,
        topicParam2: topicParam2,
        topicParam3: topicParam3,
        topicParam4: topicParam4,
        defStart: defStart,
        defEnd: defEnd,
        endYear: checkYear()
      }
      searchService.performSearch(OGFilter).then(function(data) {
        var seminarsData = data.seminars;
        receiveSeminarData(seminarsData);
        return seminarsData;
      });
    }

    function doKWParamSearch() {
      var searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
      var minDateRange = vm.dateRange.start || '01';
      var maxDateRange = vm.dateRange.end || '12';
      var radiusParam = vm.mileRange.value || '250';
      var keywordParam = vm.kwFilter.word;
      vm.initialDirections = false;

      function checkYear() {
        if (vm.dateRange.start >= vm.dateRange.end) {
          return 2017;
        } else {
          return 2016
        }
      }

      $http.get(searchAPI +
          'keyword=' + keywordParam +
          '&location=' + '' +
          '&radius=' + radiusParam +
          '&topics=' + vm.topicParam1 + vm.topicParam2 + vm.topicParam3 + vm.topicParam4 +
          '&date-start=' + minDateRange + '-01-2016' +
          '&date-end=' + maxDateRange + '-01-' + checkYear(), {
            cache: true
          })
        .then(function(data) {

          var seminarsData = data.data.seminars;
          receiveSeminarData(seminarsData);
          return seminarsData;
        });
    }

    vm.clearFilters = function() {
      localStorage.clear();
      vm.courseTopics.categories = [];
      vm.locSearchFilter.locationAll = [];
      $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
      vm.initialDirections = true;

    }
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];

    // $loading spinner options
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
  })
}(angular.module('train.register')));
