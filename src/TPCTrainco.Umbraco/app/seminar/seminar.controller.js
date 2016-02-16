(function() {
  'use strict';

  angular
    .module('train')
    .controller('SeminarController', SeminarController);

  /** @ngInject */
  function SeminarController($log, courseSearch, cartService, $rootScope, $scope) {
    var vm = this;

    vm.courseId = {};

    requestSeminarData(courseSearch);

  function calculateTotalPrice(itemList) {
    var totalPrice = itemList ? itemList.reduce(function (acc, item) {
      return acc + item.quantity * parseFloat(item.price);
    }, 0) : 0;
    return parseFloat(totalPrice.toFixed(2));
  }

    vm.detailPop = {
      templateUrl: 'app/seminar/seminarPop.html',
    };

    vm.location = {};

    vm.addItemToCart = function(item, qty) {
      cartService.addItem(item, qty);
      vm.cartItemList = cartService.getCartItems() || [];
      vm.cartTotalPrice = calculateTotalPrice(vm.cartItemList);
      $rootScope.$broadcast('cartUpdated', vm.cartItemList);
    };

    vm.monthsSlider = {
      minValue: 0, // initial position for left handle
      maxValue: 8, // initial position for right handle
      options: {
        floor: 0, // left most value
        ceil: 15, // right most value
        showTicks: true,
        showSelectionBarEnd: true,
        showTicksValues: true,
        stepsArray: ' ,JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEPT,OCT,NOV,DEC,JAN,'.split(',')
      }
    };

    var minMonthNumber = vm.monthsSlider.minValue + 1;
    var maxMonthNumber = vm.monthsSlider.maxValue + 1;
    //this.monthMin = minMonthNumber;
    var minDateRange = minMonthNumber;
    var minDateParam = minDateRange + '-2016';
    vm.monthMin = vm.monthsSlider.minValue + 1 + '-2016'; //minDateParam
    function activate() {
      var classId = localStorage.getItem('classId');
    }

    function requestSeminarData(courseSearch) {
      var classId = localStorage.getItem('classId');

      return courseSearch.getSeminars(classId).then(function(data) {
        var seminarsData = data.seminars[0];
        receiveSeminarData(seminarsData);
        return seminarsData;
      });
    }

    function receiveSeminarData(seminarsData) {
      vm.seminarLocations = seminarsData.locationSchedules;
      var seminarLocationsArray = vm.seminarLocations;
      seminarLocationsArray.forEach(function(location, index) {
        var dateF = location.dateFilter;
        return dateF;
      });
    }
  }
})();
