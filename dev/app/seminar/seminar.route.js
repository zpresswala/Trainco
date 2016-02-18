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
  function seminarRoutes($stateProvider) {
    $stateProvider
      .state('seminars', {
        templateUrl: 'app/seminar/seminar.html',
        controller: 'SeminarController',
        controllerAs: 'seminar'
      })
  }

})();
