(function() {
  'use strict';

  angular
    .module('train')
    .directive('footer', footer);

  /** @ngInject */
  function footer() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/footer/footer.html',
      scope: {
      },
      controller: FooterController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function FooterController(searchService, $http, $log, $rootScope) {
      var vm = this;

  }
}

})();
