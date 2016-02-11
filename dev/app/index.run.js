export function runBlock($log, $rootScope, $state, $stateParams) {
  'ngInject';
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

}
