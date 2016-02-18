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
      .state('home', {
        url: '/',
        templateUrl: '/app/main/main.html'
      })
      .state('register', {
        url: '/search-seminars',
        controller: 'RegisterController',
        controllerAs: 'register',
        templateUrl: '/app/register/register.html'
      })
      .state('empty', {
        url: '',
        templateUrl: '/app/register/results/empty.html',
        parent: 'register'
      })
      .state('results', {
        url: '/',
        templateUrl: '/app/register/results/results.html',
        parent: 'register'
      })

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });
  }

})();
