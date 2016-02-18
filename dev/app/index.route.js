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
  function routerConfig($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html'
      })
      .state('register', {
        url: '/register',
        controller: 'RegisterController',
        controllerAs: 'register',
        templateUrl: 'app/register/register.html'
      })
      .state('empty', {
        url: '/results',
        templateUrl: 'app/register/results/empty.html',
        parent: 'register'
      })
      .state('results', {
        url: '/results',
        templateUrl: 'app/register/results/results.html',
        parent: 'register'
      })
  }

})();
