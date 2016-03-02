(function() {
  'use strict';

  angular
    .module('train.seminar')
    .controller('SeminarController', SeminarController);
  /** @ngInject */
  function SeminarController($log, courseSearch, cartService, UtilitySvc, $timeout, $document, $window, $rootScope, $scope, MonthSvc, _) {
    var vm = this;

    vm.courseId = {};

    requestSeminarData(courseSearch);

    vm.detailPop = {
      templateUrl: '/app/seminar/seminarPop.html'
    };
    vm.registerSem = function() {
      vm.popoverIsOpen = true;
      popoverIsOpen: true;
    }
    vm.popoverClose = function() {
      vm.popoverIsOpen = false;
    }
    vm.location = {};

    /**
     * adds item to the cart or updates the quantity
     * @method function
     * @param  {object} item the item and its properties
     * @param  {int} qty  how many attendees
     * @return {array}      returns the updated cartItemList
     *
     * @desc
     * The most important thing here is to understand that
     * qty DOES NOT exist on the $scope. it is only an input value
     * that gets passed to the cart service. It does not exist on the location
     *
     */
    vm.addItemToCart = function(item, qty, $event) {
      cartService.addItem(item, qty)

      vm.cartItemList = cartService.getCartItems() || [];
      vm.cartTotalPrice = UtilitySvc.calculateTotalPrice(vm.cartItemList);

      $rootScope.$broadcast('cartUpdated', vm.cartItemList);
      // dirty, but gets the job done. Changes the button text to
      // display added on click.
      $($event.target).val('Added!');

      $timeout = setTimeout(function() {
        // restore the button to add to cart
        $($event.target).val('Add to cart');
      }, 3500);
      // clear the item qty in order to hide button again.
      item.qty = '';
    };

    var today = new Date();
    var thisMonth = today.getMonth();
    var monthNames = MonthSvc.getAbrvMonths();

    // Starts the array at the current month through December
    var startingMonthArray = monthNames.slice(thisMonth);

    function fixEndingArray(endingMonthArray) {
      var first = endingMonthArray[0];
      var num = parseInt(first.name.slice(3))
      var trunc = first.name.slice(0, 3)
      first.name = trunc + (num + 1);

      return endingMonthArray;
    }
    var endingMonthArray = fixEndingArray(monthNames.slice(0, (thisMonth)));

    var combinedMonthsArray = startingMonthArray.concat(endingMonthArray)

    var combinedMonthNames = _.map(combinedMonthsArray, _.property('name'));
    var combinedMonthValues = _.map(combinedMonthsArray, _.property('value'));
    vm.monthsSlider = {
      minValue: 0,
      maxValue: 5,
      options: {
        floor: 0,
        ceil: 11,
        showTicks: true,
        showSelectionBarEnd: true,
        showTicksValues: true,
        stepsArray: combinedMonthNames,
        onEnd: function(modelValue) {
          watchHandles()
        }
      }
    };
    $timeout(function() {
      $scope.$broadcast('rzSliderForceRender');
      $('.tick > span').each(function(index, item) {
        var $item = $(item);
        var html = $item.html();
        var numTest = /^([^\d]+)(\d+)$/;
        var hasYear = numTest.test(html);

        if (hasYear) {
          $item.html(html.replace(numTest, '<span class="monthblock">$1</span><span class="yearblock">$2</span>'));
        }
      })
    }, 300);
    function watchHandles() {
      var mapNum = parseInt(combinedMonthValues[0]);
      var thisYear = (new Date()).getFullYear();
      var minValue = (parseInt(vm.monthsSlider.minValue) + mapNum);
      var maxValue = (parseInt(vm.monthsSlider.maxValue) + mapNum);

      vm.filterMin = minValue + '-' + thisYear;
      if (maxValue > 11) {
        thisYear = thisYear + 1;
        maxValue = maxValue - 11;
      }
      vm.filterMax = maxValue + '-' + thisYear;


      function fixFormat(badDate) {
        var x = badDate.replace(/^(\d+\-)/, '$11-').replace(/\-/g, '/');
        return x;
      }

      vm.isBetween = function(testDate) {
        return function(item) {

          var testDate = item.dateMonthYear;
          var beginDate = vm.filterMin;
          var endDate = vm.filterMax;

          var fixTest = new Date(fixFormat(testDate));
          var fixBegin = new Date(fixFormat(beginDate));
          var fixEnd = new Date(fixFormat(endDate));
          var testMonth = fixTest.getMonth();
          var beginMonth = fixBegin.getMonth();
          var endMonth = fixEnd.getMonth();
          var testYear = fixTest.getFullYear();
          var beginYear = fixBegin.getFullYear();
          var endYear = fixEnd.getFullYear();
          // only chrome makes it past
          if (testYear >= beginYear && testYear <= endYear) {
            if (testYear < endYear) {
              if (testMonth >= beginMonth) {

                return true;
              }
            } else {
              if (testMonth >= beginMonth && testMonth <= endMonth) {

                return true;
              }
            }
          }
          return false;
        }
      }
    }
    watchHandles()
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
