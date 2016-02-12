(function() {
  'use strict';

  angular
    .module('train')
    .config(config);

  /** @ngInject */
  function config($logProvider, $httpProvider, $urlRouterProvider) {
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise('/');
  $logProvider.debugEnabled(false);
  $httpProvider.interceptors.push('loadingInterceptor');
  }

})();
