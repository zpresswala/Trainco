/**
 * @ngdoc function
 * @name  routerConfig
 * @description
 * main routes configuration for trainco app.
 */

(function() {
  'use strict';

  angular
    .module('train')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $locationProvider) {
    $stateProvider

      .state('register', {
      url: '/search-seminars',
      controller: 'RegisterController',
      controllerAs: 'register',
      templateUrl: '/app/register/register.html'
    }).state('results', {
      url: '/',
      templateUrl: '/app/register/results/results.html',
      parent: 'register'
    })

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }

})();
