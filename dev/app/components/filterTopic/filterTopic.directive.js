(function() {
  'use strict';

  angular
    .module('train')
    .directive('filterTopic', filterTopic);

  /** @ngInject */
  function filterTopic() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/filterTopic/filterTopic.html',
      scope: {},
      controller: FilterTopicController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function FilterTopicController(searchService, $http, $log, $rootScope) {
      var vm = this;
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
      
    }
  }

})();
