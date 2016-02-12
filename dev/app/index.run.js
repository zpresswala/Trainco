(function() {
  'use strict';

  angular
    .module('train')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state, $stateParams) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

  }

})();
