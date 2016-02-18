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
    .config(seminarRoutes);

  /** @ngInject */
  function seminarRoutes($stateProvider, $locationProvider) {
    $stateProvider
      .state('seminars', {
        url: '/',
        templateUrl: '/app/seminar/seminar.html',
        controller: 'SeminarController',
        controllerAs: 'seminar'

      });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }

})();
