(function() {
  'use strict';

  angular
    .module('train')
    .controller('MainSearchController', MainSearchController);

  /** @ngInject */
  function MainSearchController($location, cities, months, $localStorage, $scope, _) {
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
    var today = new Date();
    var thisMonth = today.getMonth();
    var monthNames = months.getAbrvMonths() || [];
    // Starts the array at the current month through December
    var startingMonthArray = monthNames.slice(thisMonth);

    var endingMonthArray = monthNames.splice(0, (thisMonth + 3));

    var combinedMonthsArray = startingMonthArray.concat(endingMonthArray)
    var lengthValue = startingMonthArray.length

    var combinedMonthNames = _.map(combinedMonthsArray, _.property('name'));
    var combinedMonthValues = _.map(combinedMonthsArray, _.property('value'));
    vm.sliderValues = {
      minValue: combinedMonthValues[0],
      maxValue: combinedMonthValues[14],
      options: {
        floor: combinedMonthValues[0],
        ceil: combinedMonthValues[14],
        showTicks: true,
        showSelectionBarEnd: true,
        showTicksValues: true,
        stepsArray: combinedMonthNames
      }
    };


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

      var defStart = vm.sliderValues.minValue;
      var defEnd = vm.sliderValues.maxValue
      var theloc = vm.courseSearch.location.trim();
      vm.$storage.SearchLocation = theloc;
      vm.$storage.SearchTopic1 = vm.topicParam1;
      vm.$storage.SearchTopic2 = vm.topicParam2;
      vm.$storage.SearchTopic3 = vm.topicParam3;
      vm.$storage.SearchTopic4 = vm.topicParam4;
      vm.$storage.SearchDRmin = combinedMonthValues[defStart];
      vm.$storage.SearchDRmax = combinedMonthValues[defEnd];

      window.location.href = '/search-seminars';
    }
  }
})();
