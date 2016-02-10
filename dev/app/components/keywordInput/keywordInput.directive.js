export function KeywordInputDirective() {
  'ngInject';

  let directive = {
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
}
class KeywordInputController {
    constructor($rootScope) {
      'ngInject';
      this.$rootScope = $rootScope;

      /**
       * Handle key input
       * @param  {object} e the event
       */
    this.handleKWInput = (e) => {
      if (e.keyCode === 13 && this.kwFilter.word) {
        $rootScope.$broadcast('keyword', this.kwFilter.word);
      //  this.doParamSearch();
      }
    }
    }
}
