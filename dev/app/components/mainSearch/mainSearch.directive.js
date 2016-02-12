(function() {
  'use strict';

  angular
    .module('train')
    .directive('mainSearch', mainSearch);

  /** @ngInject */
  function mainSearch() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/mainSearch/mainSearch.html',
      scope: {},
      controller: MainSearchController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function MainSearchController($state, cities) {
      var vm = this;
      vm.cities = cities.getCities();


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

        localStorage.setItem('location', vm.courseSearch.location);
        localStorage.setItem('topicParam1', vm.topicParam1);
        localStorage.setItem('topicParam2', vm.topicParam2);
        localStorage.setItem('topicParam3', vm.topicParam3);
        localStorage.setItem('topicParam4', vm.topicParam4);
        localStorage.setItem('minDateRange', minDateRange);
        localStorage.setItem('maxDateRange', maxDateRange);
        $state.go('results');
      }
    }
  }

})();
