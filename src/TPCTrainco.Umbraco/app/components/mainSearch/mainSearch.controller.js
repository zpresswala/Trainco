(function() {
  'use strict';

  angular
    .module('train')
    .controller('MainSearchController', MainSearchController);

  /** @ngInject */
  function MainSearchController($location, cities, months, $localStorage, $scope) {
    var vm = this;
    vm.$storage = $localStorage;

    vm.cities = cities.getCities();

    vm.createFunction = function(input) {
      // format the option and return it
      return {
        value: vm.cities.length,
        label: input
      };
    };

    vm.classTopics = {};
    //Range slider with ticks and values
    vm.sliderValues = {
      minValue: 1,
      maxValue: 8,
      options: {
        floor: 0,
        ceil: 15,
        showTicks: true,
        showSelectionBarEnd: true,
        showTicksValues: true,
        stepsArray: 'JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEPT,OCT,NOV,DEC,JAN,FEB,MAR'.split(',')
      }
    };
    var today = new Date();
    var thisMonth = today.getMonth();
    var thisYear = today.getFullYear();
    var futureYear = today.getFullYear() + 1;
    var futureMonth = today.getMonth();
    var threeMore = thisMonth + 3;
    var monthNames = months.getMonths() || [];

    vm.startingMonthArray = monthNames.slice(thisMonth);
    vm.yearOfMonths = months.getMonths();
    var defStart = vm.startingMonthArray[0].value;
    var defEnd = vm.startingMonthArray[3].value;

    vm.doParamSearch = function() {
      if (vm.classTopics.hvac === true) {
        vm.topicParam1 = 'hvac'
      }
      if (vm.classTopics.electrical === true) {
        vm.topicParam2 = 'electrical'
      }
      if (vm.classTopics.mechanical === true) {
        vm.topicParam3 = 'mechanical'
      }
      if (vm.classTopics.plant === true) {
        vm.topicParam4 = 'management'
      }
      if (vm.classTopics.all === true) {
        vm.topicParam1 = 'all'
      }
      if (vm.sliderValues.minValue <= 8) {
        var minDateRange = '0' + (vm.sliderValues.minValue + 1);
      }
      if (vm.sliderValues.maxValue <= 8) {
        var maxDateRange = '0' + (vm.sliderValues.maxValue + 1);
      }
      var minDateRange = '0' + (vm.sliderValues.minValue + 1);
      var maxDateRange = vm.sliderValues.maxValue + 1 || '12';
      var theloc = vm.courseSearch.location.trim();
      vm.$storage.SearchLocation = theloc;
      vm.$storage.SearchTopic1 = vm.topicParam1;
      vm.$storage.SearchTopic2 = vm.topicParam2;
      vm.$storage.SearchTopic3 = vm.topicParam3;
      vm.$storage.SearchTopic4 = vm.topicParam4;
      vm.$storage.SearchDRmin = defStart;
      vm.$storage.SearchDRmax = defEnd;

      $location.path('/search-seminars/');
    }
  }
})();
