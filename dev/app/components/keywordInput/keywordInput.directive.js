(function() {
  'use strict';

  angular
    .module('train')
    .directive('keywordInput', keywordInput);

  /** @ngInject */
  function keywordInput() {
    var directive = {
      restrict: 'E',
      template: [
        '<div class="filter-location">',
        '<label class="sidebar-label">Keyword Search</label>',
        '<input type="search" ng-init="vm.kwFilter = {}" ng-keydown="vm.handleKWInput($event)" ng-model="vm.kwFilter.word" placeholder="Enter Keyword">',
        '</div>'
      ].join(''),
      scope: {},
      controller: KeywordInputController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function KeywordInputController($rootScope) {
      var vm = this;

      /**
       * Handle key input
       * @param  {object} e the event
       */
      vm.handleKWInput = function(e) {
        if (e.keyCode === 13 && vm.kwFilter.word) {
          $rootScope.$broadcast('keyword', vm.kwFilter.word);
          //  this.doParamSearch();
        }
      }
    }
  }

})();
