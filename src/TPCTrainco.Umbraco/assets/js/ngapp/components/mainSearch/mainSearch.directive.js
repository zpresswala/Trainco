(function() {
  'use strict';

  angular
    .module('train.components')
    .directive('mainSearch', mainSearch);

  /** @ngInject */
  function mainSearch() {
    var directive = {
      restrict: 'E',
      templateUrl: '/assets/js/ngapp/components/mainSearch/mainSearch.html',
      scope: {},
      controller: 'MainSearchController',
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
}


})();
